import type { Metadata } from 'next'
import Breadcrumb from '@/components/layout/Breadcrumb'
import PLPClient from '@/components/plp/PLPClient'
import { searchProducts } from '@/lib/api/search'
import { getProductsServer } from '@/lib/api/products'

interface Props {
  searchParams: Promise<{
    q?: string; category?: string; brand?: string
    minPrice?: string; maxPrice?: string; sortBy?: string; page?: string
  }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `"${q}" — Search Results | ToolHaat` : 'All Products | ToolHaat',
    description: q
      ? `Search results for "${q}" on ToolHaat. Find the best B2B prices on industrial tools.`
      : 'Browse all products on ToolHaat. Bulk pricing, GST invoices and fast delivery.',
    robots: { index: true, follow: true },
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams
  const { q, category, brand, minPrice, maxPrice, sortBy, page } = sp

  const apiResult = await searchProducts({
    q, category, brand,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sortBy: sortBy || 'relevance',
    page: page ? Number(page) : 1,
    limit: 48,
  })

  let products = apiResult?.items ?? []
  let total = apiResult?.total ?? 0

  // Search (Elasticsearch) can be unavailable — fall back to the plain
  // products API with real data instead of showing an empty page.
  if (!apiResult) {
    const fallback = await getProductsServer({
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      limit: 48,
    })
    const items = fallback?.items ?? []
    products = q
      ? items.filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
      : items
    total = products.length
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: q ? `Search: "${q}"` : 'All Products' },
        ]}
        rightElement={
          <span className="text-xs text-text-muted">{total} products found</span>
        }
      />

      <div className="bg-white border-b border-border-light py-5 px-6">
        <div className="max-w-site mx-auto">
          {q ? (
            <h1 className="font-heading font-bold text-xl text-text-base">
              Search results for: <span className="text-accent">&ldquo;{q}&rdquo;</span>
            </h1>
          ) : (
            <h1 className="font-heading font-bold text-xl text-text-base">All Products</h1>
          )}
        </div>
      </div>

      <div className="max-w-site mx-auto px-6 py-6">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="font-heading font-bold text-xl text-text-base mb-2">
              No results for &ldquo;{q}&rdquo;
            </h2>
            <p className="text-text-muted mb-4">Try a different search term or browse our categories</p>
            <a href="/" className="bg-accent text-dark no-underline px-6 py-2.5 rounded-th font-bold text-sm inline-block hover:bg-accent-dark transition-colors">
              Browse Categories
            </a>
          </div>
        ) : (
          <PLPClient products={products as any} />
        )}
      </div>
    </>
  )
}
