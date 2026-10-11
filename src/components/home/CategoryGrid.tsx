import Link from 'next/link'
import { getCategoryTreeServer } from '@/lib/api/categories'

export default async function CategoryGrid() {
  const categories = await getCategoryTreeServer()
  if (categories.length === 0) return null

  const tiles: { href: string; name: string; icon: string }[] = []
  for (const cat of categories) {
    tiles.push({ href: `/${cat.slug}`, name: cat.name, icon: cat.icon || '📦' })
  }
  // Top 3 subcategories per category (by product count) — real data, spread
  // fairly across both categories rather than one dominating the row.
  for (const cat of categories) {
    const topSubs = [...(cat.children ?? [])]
      .sort((a, b) => (b.productCount ?? 0) - (a.productCount ?? 0))
      .slice(0, 3)
    for (const sub of topSubs) {
      tiles.push({ href: `/${cat.slug}/${sub.slug}`, name: sub.name, icon: sub.icon || '📦' })
    }
  }

  return (
    <section className="w-full px-6 py-8">
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-x-2 gap-y-5">
        {tiles.map(t => (
          <Link
            key={t.href}
            href={t.href}
            className="flex flex-col items-center gap-2 text-center no-underline group"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-bg-page border border-border-light flex items-center justify-center text-3xl md:text-4xl group-hover:bg-accent-light group-hover:border-accent/30 group-hover:scale-105 transition-all duration-300">
              {t.icon}
            </div>
            <div className="text-text-base font-heading font-bold text-[11px] md:text-xs line-clamp-2 leading-tight">
              {t.name}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
