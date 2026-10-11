import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildCategoryMetadata } from '@/lib/seo'
import { buildCollectionPageSchema, buildBreadcrumbSchema } from '@/lib/schema'
import Breadcrumb from '@/components/layout/Breadcrumb'
import PLPClient from '@/components/plp/PLPClient'
import Pagination from '@/components/plp/Pagination'
import { getProductsByCategoryServer } from '@/lib/api/products'
import { getCategoryBySlugServer } from '@/lib/api/categories'

interface Props {
  params: Promise<{ category: string; subcategory: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  const { getCategoriesServer } = await import('@/lib/api/categories')
  const categories = await getCategoriesServer()
  const params: { category: string; subcategory: string }[] = []
  for (const cat of categories) {
    for (const sub of cat.children ?? []) {
      params.push({ category: cat.slug, subcategory: sub.slug })
    }
  }
  return params
}

async function resolveSubcategory(categorySlug: string, subcategorySlug: string) {
  const apiCategory = await getCategoryBySlugServer(categorySlug)
  if (!apiCategory) return null
  const sub = (apiCategory.children ?? []).find(c => c.slug === subcategorySlug)
  if (!sub) return null
  return { parent: apiCategory, sub }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subcategory } = await params
  const resolved = await resolveSubcategory(category, subcategory)
  if (!resolved) return {}
  const { parent, sub } = resolved
  return buildCategoryMetadata(
    sub.metaTitle ?? `${sub.name} | ${parent.name}`,
    sub.metaDescription ?? '',
    `${category}/${subcategory}`,
  )
}

export default async function SubcategoryPage({ params, searchParams }: Props) {
  const { category: categorySlug, subcategory: subcategorySlug } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const resolved = await resolveSubcategory(categorySlug, subcategorySlug)
  if (!resolved) notFound()
  const { parent, sub } = resolved

  const { items: products, meta } = await getProductsByCategoryServer(subcategorySlug, page)
  const schema = buildCollectionPageSchema({
    slug: `${categorySlug}/${subcategorySlug}`,
    name: sub.name,
    description: sub.description ?? '',
  } as any)
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: parent.name, url: `/${parent.slug}` },
    { name: sub.name, url: `/${parent.slug}/${sub.slug}` },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: parent.name, href: `/${parent.slug}` },
          { label: sub.name },
        ]}
      />

      <div className="bg-white border-b border-border-light py-8 px-6">
        <div className="max-w-site mx-auto">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{sub.icon || '📦'}</div>
            <div>
              <h1 className="font-heading font-black text-2xl text-text-base mb-1">{sub.name}</h1>
              {sub.description && <p className="text-text-muted text-sm max-w-xl">{sub.description}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-site mx-auto px-6 py-6">
        {products.length > 0 ? (
          <>
            <PLPClient products={products as any} categorySlug={subcategorySlug} totalCount={meta.total} />
            <Pagination basePath={`/${parent.slug}/${sub.slug}`} page={meta.page} totalPages={meta.totalPages} />
          </>
        ) : (
          <div className="text-center py-16 text-text-muted">
            <div className="text-5xl mb-4">📦</div>
            <div className="font-heading font-bold text-xl text-text-base mb-2">No products in this subcategory yet</div>
            <p className="text-sm">Check back soon, or browse the full {parent.name} range.</p>
          </div>
        )}
      </div>

      <div className="bg-white border-t border-border-light py-10 px-6">
        <div className="max-w-site mx-auto">
          <h2 className="font-heading font-bold text-xl text-text-base mb-3">
            Buy {sub.name} Online at Wholesale Prices
          </h2>
          <p className="text-text-muted text-sm leading-relaxed max-w-3xl">
            ToolHaat offers {sub.name.toLowerCase()} at bulk B2B prices, with GST invoices and pan-India delivery.
            Order in bulk and save with our tiered pricing system.
            For custom requirements or large quantities, use our{' '}
            <a href="/rfq" className="text-accent font-semibold">RFQ feature</a> to get a dedicated quote from our sales team.
          </p>
        </div>
      </div>
    </>
  )
}
