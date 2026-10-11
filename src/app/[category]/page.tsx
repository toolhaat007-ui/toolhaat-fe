import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildCategoryMetadata } from '@/lib/seo'
import { buildCollectionPageSchema, buildBreadcrumbSchema } from '@/lib/schema'
import Breadcrumb from '@/components/layout/Breadcrumb'
import PLPClient from '@/components/plp/PLPClient'
import Pagination from '@/components/plp/Pagination'
import { getProductsByCategoryServer } from '@/lib/api/products'
import { getCategoriesServer, getCategoryBySlugServer } from '@/lib/api/categories'

interface Props {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  const categories = await getCategoriesServer()
  return categories.map(cat => ({ category: cat.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params
  const apiCat = await getCategoryBySlugServer(slug)
  if (!apiCat) return {}
  return buildCategoryMetadata(apiCat.metaTitle ?? apiCat.name, apiCat.metaDescription ?? '', slug)
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: slug } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const apiCategory = await getCategoryBySlugServer(slug)
  if (!apiCategory) notFound()

  const category = {
    slug: apiCategory.slug,
    name: apiCategory.name,
    icon: apiCategory.icon || '📦',
    description: apiCategory.description || '',
    skuCount: apiCategory.productCount ? `${apiCategory.productCount}+ SKUs` : '',
    subcategories: (apiCategory.children ?? []).map(c => ({
      slug: c.slug,
      name: c.name,
      icon: c.icon || '📦',
      productCount: c.productCount ?? 0,
    })),
  }

  const { items: products, meta } = await getProductsByCategoryServer(slug, page)
  const schema = buildCollectionPageSchema({
    slug: category.slug,
    name: category.name,
    description: category.description,
  } as any)
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: category.name, url: `/${category.slug}` },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: category.name }]} />

      {/* Category Header */}
      <div className="bg-white border-b border-border-light py-8 px-6">
        <div className="max-w-site mx-auto">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{category.icon}</div>
            <div>
              <h1 className="font-heading font-black text-2xl text-text-base mb-1">{category.name}</h1>
              {category.description && <p className="text-text-muted text-sm max-w-xl">{category.description}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* PLP */}
      <div className="max-w-site mx-auto px-6 py-6">
        {products.length > 0 ? (
          <>
            <PLPClient products={products as any} categorySlug={slug} subcategories={category.subcategories} totalCount={meta.total} />
            <Pagination basePath={`/${category.slug}`} page={meta.page} totalPages={meta.totalPages} />
          </>
        ) : (
          <div className="text-center py-16 text-text-muted">
            <div className="text-5xl mb-4">📦</div>
            <div className="font-heading font-bold text-xl text-text-base mb-2">No products in this category yet</div>
            <p className="text-sm">Check back soon, or browse our other categories.</p>
          </div>
        )}
      </div>

      {/* SEO Content block */}
      <div className="bg-white border-t border-border-light py-10 px-6">
        <div className="max-w-site mx-auto">
          <h2 className="font-heading font-bold text-xl text-text-base mb-3">
            Buy {category.name} Online at Wholesale Prices
          </h2>
          <p className="text-text-muted text-sm leading-relaxed max-w-3xl">
            ToolHaat offers {category.name.toLowerCase()} at bulk B2B prices, with GST invoices and pan-India delivery.
            Order in bulk and save with our tiered pricing system.
            For custom requirements or large quantities, use our{' '}
            <a href="/rfq" className="text-accent font-semibold">RFQ feature</a> to get a dedicated quote from our sales team.
          </p>
        </div>
      </div>
    </>
  )
}
