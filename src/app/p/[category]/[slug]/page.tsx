import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { buildProductMetadata } from '@/lib/seo'
import { buildProductSchema, buildBreadcrumbSchema } from '@/lib/schema'
import Breadcrumb from '@/components/layout/Breadcrumb'
import PDPClient from '@/components/pdp/PDPClient'
import ProductCard from '@/components/product/ProductCard'
import { getProductBySlugServer, getRelatedProductsServer } from '@/lib/api/products'
import { getCategoryBySlugServer } from '@/lib/api/categories'

interface Props {
  params: Promise<{ category: string; slug: string }>
}

export async function generateStaticParams() {
  // Fetch all active products from the DB so new admin-added products
  // get pre-built static pages at deploy time. Paginated — API max limit is 100.
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
  const all: { slug: string; categorySlug: string }[] = []
  let page = 1
  const limit = 100

  try {
    while (true) {
      const res = await fetch(`${API_URL}/products?limit=${limit}&page=${page}&status=active`)
      if (!res.ok) break
      const json = await res.json()
      const data = (json !== null && typeof json === 'object' && 'data' in json) ? json.data : json
      const items: any[] = data?.items ?? []
      for (const p of items) {
        const categorySlug = p.categorySlug ?? p.category?.slug
        if (p.slug && categorySlug) all.push({ slug: p.slug, categorySlug })
      }
      if (page >= (data?.meta?.totalPages ?? 1) || items.length === 0) break
      page++
    }
  } catch {}

  return all.map(p => ({ category: p.categorySlug, slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const product = await getProductBySlugServer(slug)
  if (!product) return {}
  return buildProductMetadata(
    product.metaTitle || product.name,
    product.metaDescription || product.description.slice(0, 160),
    category,
    slug
  )
}

export default async function ProductPage({ params }: Props) {
  const { category: categorySlug, slug } = await params

  const product = await getProductBySlugServer(slug)
  if (!product || product.categorySlug !== categorySlug) notFound()

  const category = await getCategoryBySlugServer(categorySlug)

  const relatedProducts = product.id ? await getRelatedProductsServer(String(product.id)) : []
  const productSchema = buildProductSchema(product)
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: category?.name ?? categorySlug, url: `/${categorySlug}` },
    { name: product.name, url: `/p/${categorySlug}/${slug}` },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: category?.name ?? categorySlug, href: `/${categorySlug}` },
          { label: product.name.length > 40 ? product.name.slice(0, 40) + '...' : product.name },
        ]}
      />

      <PDPClient product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-white border-t border-border-light py-10 px-6">
          <div className="max-w-site mx-auto">
            <div className="flex justify-between items-baseline mb-5">
              <h2 className="font-heading font-bold text-xl text-text-base">Related Products</h2>
              <Link href={`/${categorySlug}`} className="text-accent text-sm font-semibold no-underline hover:underline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}

      {/* Category breadcrumb SEO block */}
      {category && (
        <div className="bg-bg-page border-t border-border-light py-6 px-6">
          <div className="max-w-site mx-auto">
            <p className="text-xs text-text-subtle">
              You are viewing: <Link href={`/${categorySlug}`} className="text-accent no-underline">{category.name}</Link>
              {' '}› {product.name}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
