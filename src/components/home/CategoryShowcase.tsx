import Link from 'next/link'
import { getCategoryBySlugServer } from '@/lib/api/categories'
import { getProductsByCategoryServer } from '@/lib/api/products'
import ProductCard from '@/components/product/ProductCard'

interface Props {
  categorySlug: string
}

export default async function CategoryShowcase({ categorySlug }: Props) {
  const category = await getCategoryBySlugServer(categorySlug)
  if (!category) return null

  const subcategories = category.children ?? []
  const highlighted = [...subcategories]
    .sort((a, b) => (b.productCount ?? 0) - (a.productCount ?? 0))
    .slice(0, 4)

  const [highlightTiles, { items: products }] = await Promise.all([
    Promise.all(
      highlighted.map(async sub => {
        const { items } = await getProductsByCategoryServer(sub.slug, 1)
        const pick = items[0]
        return {
          slug: sub.slug,
          name: sub.name,
          icon: sub.icon || '📦',
          image: pick?.images?.[0] ?? null,
        }
      }),
    ),
    getProductsByCategoryServer(categorySlug, 1),
  ])

  const featured = products.slice(0, 8)
  if (featured.length === 0) return null

  return (
    <section className="max-w-site mx-auto px-6 py-8">
      <div className="flex justify-between items-baseline mb-5">
        <h2 className="font-heading font-extrabold text-2xl text-text-base">{category.name}</h2>
        <Link
          href={`/${category.slug}`}
          className="bg-accent-light text-accent-dark font-bold text-xs px-4 py-2 rounded-full no-underline hover:bg-accent/20 transition-colors flex-shrink-0"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-3.5 mb-5">
        {/* Related subcategories */}
        {subcategories.length > 0 && (
          <div className="hidden lg:block bg-bg-page rounded-2xl p-4">
            <div className="font-heading font-bold text-xs text-text-base uppercase tracking-wide mb-3">
              Explore Subcategories
            </div>
            <div className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:gap-1.5">
              {subcategories.slice(0, 8).map(sub => (
                <Link
                  key={sub.slug}
                  href={`/${category.slug}/${sub.slug}`}
                  className="flex items-center gap-1.5 bg-white lg:bg-transparent border lg:border-none border-border-light rounded-full lg:rounded-none px-3 py-1.5 lg:px-0 lg:py-1 text-xs font-semibold text-text-muted no-underline hover:text-accent transition-colors"
                >
                  <span>{sub.icon || '📦'}</span>
                  <span className="line-clamp-1">{sub.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Highlight tiles — 2 up on mobile, 4 up on desktop */}
        {highlightTiles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {highlightTiles.map(t => (
              <Link
                key={t.slug}
                href={`/${category.slug}/${t.slug}`}
                className="bg-accent-light/30 border border-accent/20 rounded-2xl p-4 text-center no-underline hover:shadow-card-hover hover:border-accent/40 transition-all group"
              >
                <div className="w-full h-24 flex items-center justify-center mb-2.5">
                  {t.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.image} alt={t.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                  ) : (
                    <span className="text-4xl">{t.icon}</span>
                  )}
                </div>
                <div className="font-heading font-bold text-xs text-text-base line-clamp-1 mb-0.5">{t.name}</div>
                <div className="text-accent-dark text-[10px] font-bold uppercase tracking-wide">Explore Now</div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Product carousel */}
      <div className="flex gap-3.5 overflow-x-auto hide-scrollbar pb-1">
        {featured.map(p => (
          <div key={p.id} className="flex-shrink-0 w-[42%] sm:w-44 md:w-48">
            <ProductCard product={p as any} />
          </div>
        ))}
      </div>
    </section>
  )
}
