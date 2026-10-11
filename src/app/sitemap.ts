import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.toolhaat.com'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
const SITEMAP_FETCH_TIMEOUT_MS = 5000
const SITEMAP_PRODUCT_LIMIT = 2500

type SitemapEntry = { slug: string; updatedAt?: string; children?: SitemapEntry[] }
type SitemapProductEntry = { slug: string; categorySlug: string; updatedAt?: string }

async function fetchJsonWithTimeout<T>(url: string, tags: string[]): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate: 3600, tags },
    signal: AbortSignal.timeout(SITEMAP_FETCH_TIMEOUT_MS),
  })

  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const json = await res.json()
  // Unwrap NestJS TransformInterceptor envelope: { success, data: ... } → data
  return (json?.data !== undefined ? json.data : json) as T
}

// Fetch active products from the DB with pagination (API max limit = 100)
async function fetchAllProducts(): Promise<SitemapProductEntry[]> {
  try {
    const all: SitemapProductEntry[] = []
    let page = 1
    const limit = 100

    while (all.length < SITEMAP_PRODUCT_LIMIT) {
      const data = await fetchJsonWithTimeout<{ items?: any[]; meta?: { totalPages: number } }>(
        `${API_URL}/products?limit=${limit}&page=${page}&status=active`,
        ['sitemap-products'],
      )
      const items = data.items ?? []
      for (const item of items) {
        const categorySlug = item.categorySlug ?? item.category?.slug ?? ''
        if (item.slug && categorySlug) {
          all.push({ slug: item.slug, categorySlug, updatedAt: item.updatedAt })
        }
      }
      if (page >= (data.meta?.totalPages ?? 1) || items.length === 0) break
      page++
    }

    return all
  } catch {
    return []
  }
}

// Fetch all active categories from the DB
async function fetchAllCategories(): Promise<SitemapEntry[]> {
  try {
    const data = await fetchJsonWithTimeout<any>(
      `${API_URL}/categories?limit=500`,
      ['sitemap-categories'],
    )
    const items = Array.isArray(data) ? data : data.items ?? []
    return items.filter((item: SitemapEntry | null | undefined): item is SitemapEntry => Boolean(item?.slug))
  } catch {
    return []
  }
}

function safeDate(value?: string): Date {
  if (!value) return new Date()
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/rfq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  try {
    const [products, categories] = await Promise.all([
      fetchAllProducts(),
      fetchAllCategories(),
    ])

    const categoryPages: MetadataRoute.Sitemap = categories.flatMap(c => [
      {
        url: `${BASE_URL}/${c.slug}`,
        lastModified: safeDate(c.updatedAt),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      ...(c.children ?? []).map(sub => ({
        url: `${BASE_URL}/${c.slug}/${sub.slug}`,
        lastModified: safeDate(sub.updatedAt),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      })),
    ])

    const productPages: MetadataRoute.Sitemap = products.map(p => ({
      url: `${BASE_URL}/p/${p.categorySlug}/${p.slug}`,
      lastModified: safeDate(p.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...categoryPages, ...productPages]
  } catch {
    return staticPages
  }
}
