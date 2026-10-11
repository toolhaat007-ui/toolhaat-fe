import { apiFetch, api, ApiError } from './client'
import type { Product } from '@/types'

export interface ProductsResponse {
  items: Product[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

/** The real backend product shape differs from the mock `Product` type that
 *  every page/component in this app is written against:
 *   - category/subcategory are nested relations, not flat `categorySlug` strings
 *   - price/mrp are strings (TypeORM decimal columns), not numbers
 *   - brand is a nested object (or null), not a plain name string
 *   - rating/review fields are named averageRating/reviewCount
 *   - bulk pricing is `bulkTiers` (possibly empty), not `bulkPricing`
 *  Normalize once at the API boundary so downstream code can keep assuming
 *  the mock shape regardless of where the data actually came from. */
function normalizeProduct<T extends Record<string, any>>(p: T): T {
  if (!p) return p
  // Mock data already matches the target shape — categorySlug is unique to it
  if (p.categorySlug && typeof p.price === 'number') return p

  const categorySlug = p.categorySlug ?? p.category?.slug
  const subcategorySlug = p.subcategorySlug ?? p.subcategory?.slug
  const brandName = typeof p.brand === 'string' ? p.brand : (p.brand?.name ?? '')
  const brandSlug = p.brandSlug ?? p.brand?.slug ?? ''

  const bulkPricing = Array.isArray(p.bulkPricing) ? p.bulkPricing : (p.bulkTiers ?? []).map((t: any) => ({
    qty: t.maxQty ? `${t.minQty}-${t.maxQty}` : `${t.minQty}+`,
    minQty: t.minQty,
    price: Number(t.price),
    label: t.label ?? '',
  }))

  return {
    ...p,
    categorySlug,
    subcategorySlug,
    brand: brandName,
    brandSlug,
    price: Number(p.price),
    mrp: Number(p.mrp),
    gst: Number(p.gst ?? p.gstRate ?? 0),
    rating: Number(p.rating ?? p.averageRating ?? 0),
    reviews: p.reviews ?? p.reviewCount ?? 0,
    bulkPricing,
    inBox: p.inBox ?? [],
    images: p.images ?? [],
    specs: p.specs ?? (p.attributes ?? []).map((a: any) => [a.attributeName, a.attributeValue] as [string, string]),
  }
}

export interface ProductQuery {
  page?: number
  limit?: number
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  featured?: boolean
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

// ─── Server-side (SSG/SSR pages) ─────────────────────────────────────────────

export async function getProductsServer(query: ProductQuery = {}): Promise<ProductsResponse | null> {
  try {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([k, v]) => v != null && params.set(k, String(v)))
    const result = await apiFetch<ProductsResponse>(`/products?${params}`, {
      next: { revalidate: 3600, tags: ['products'] },
    })
    return { ...result, items: (result.items ?? []).map(normalizeProduct) }
  } catch {
    return null
  }
}

export async function getProductBySlugServer(slug: string): Promise<Product | null> {
  try {
    const product = await apiFetch<Product>(`/products/slug/${slug}`, {
      next: { revalidate: 3600, tags: [`product-${slug}`] },
    })
    return normalizeProduct(product)
  } catch {
    return null
  }
}

const CATEGORY_PAGE_SIZE = 100

/** Backend caps `limit` at 100 per request — anything beyond that needs
 *  real pagination, not a bigger limit. Returns the full paginated
 *  response (not just items) so callers can show the true total and
 *  build page navigation instead of only ever seeing the first 100. */
export async function getProductsByCategoryServer(categorySlug: string, page = 1): Promise<ProductsResponse> {
  const result = await getProductsServer({ category: categorySlug, limit: CATEGORY_PAGE_SIZE, page })
  return result ?? { items: [], meta: { total: 0, page: 1, limit: CATEGORY_PAGE_SIZE, totalPages: 0 } }
}

export async function getRelatedProductsServer(productId: string): Promise<Product[]> {
  try {
    const items = await apiFetch<Product[]>(`/products/${productId}/related`, {
      next: { revalidate: 3600 },
    })
    return (items ?? []).map(normalizeProduct)
  } catch {
    return []
  }
}

// ─── Client-side ──────────────────────────────────────────────────────────────

export async function resolveBulkPrice(productId: string, quantity: number) {
  return api.post<{
    unitPrice: number
    tierId: string | null
    tierLabel: string | null
    savingPercent: number
  }>(`/products/${productId}/bulk-price`, { quantity })
}
