import Link from 'next/link'
import { getCategoryTreeServer } from '@/lib/api/categories'
import { getProductsServer } from '@/lib/api/products'

const THEMES = [
  { bg: 'linear-gradient(135deg, #1a2e35, #22404e)' },
  { bg: 'linear-gradient(135deg, #7c2d12, #c2410c)' },
  { bg: 'linear-gradient(135deg, #164e63, #0e7490)' },
  { bg: 'linear-gradient(135deg, #4c1d95, #7e22ce)' },
]

const CATEGORY_TAGLINES: Record<string, { headline: string; sub: string }> = {
  'office-supplies': {
    headline: 'Stock Up on Office Essentials',
    sub: 'Pens, paper, files & more — bulk pricing on every order',
  },
  'cleaning-items': {
    headline: 'Clean Smarter, Save More',
    sub: 'Housekeeping supplies for offices, factories & facilities',
  },
}

interface BannerTarget {
  href: string
  name: string
}

async function pickImage(categorySlug: string): Promise<string | null> {
  const featuredResult = await getProductsServer({ category: categorySlug, limit: 1, featured: true } as any)
  const result = featuredResult?.items?.length
    ? featuredResult
    : await getProductsServer({ category: categorySlug, limit: 1 } as any)
  return result?.items?.[0]?.images?.[0] ?? null
}

export default async function PromoBannerStrip() {
  const categories = await getCategoryTreeServer()
  if (categories.length === 0) return null

  // One banner per category, plus one for each category's top subcategory
  // (by product count) — real data, no invented content.
  const targets: (BannerTarget & { headline: string; sub: string })[] = []
  for (const cat of categories) {
    const copy = CATEGORY_TAGLINES[cat.slug] ?? { headline: cat.name, sub: 'Bulk pricing, GST invoices, fast delivery' }
    targets.push({ href: `/${cat.slug}`, name: cat.name, ...copy })

    const topSub = [...(cat.children ?? [])].sort((a, b) => (b.productCount ?? 0) - (a.productCount ?? 0))[0]
    if (topSub) {
      targets.push({
        href: `/${cat.slug}/${topSub.slug}`,
        name: topSub.name,
        headline: topSub.name,
        sub: `Bulk pricing on ${topSub.name.toLowerCase()} — GST invoiced, fast dispatch`,
      })
    }
  }

  const banners = await Promise.all(
    targets.slice(0, 4).map(async (t, i) => ({
      ...t,
      image: await pickImage(t.href.split('/').pop()!),
      theme: THEMES[i % THEMES.length],
    })),
  )

  return (
    <section className="w-full px-6 pt-8 pb-6">
      <div className="flex gap-3.5 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-1">
        {banners.map(b => (
          <Link
            key={b.href}
            href={b.href}
            className="relative flex-shrink-0 w-[92%] sm:w-[85%] md:w-[44%] lg:w-[45%] md:max-w-[620px] h-48 md:h-80 rounded-2xl overflow-hidden no-underline snap-start group"
            style={{ background: b.theme.bg }}
          >
            <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-center max-w-[65%]">
              <h3 className="font-heading font-black text-base md:text-2xl text-white leading-tight mb-1.5 md:mb-2.5">
                {b.headline}
              </h3>
              <p className="text-white/70 text-[11px] md:text-sm mb-4 md:mb-5 leading-relaxed line-clamp-3">
                {b.sub}
              </p>
              <span
                className="inline-block w-fit bg-white text-dark font-heading font-extrabold text-xs md:text-sm px-4 md:px-5 py-2 md:py-2.5 rounded-full group-hover:scale-105 transition-transform"
              >
                Shop Now
              </span>
            </div>
            {b.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={b.image}
                alt={b.name}
                className="absolute right-2 md:right-3 bottom-0 w-[50%] md:w-[52%] max-h-[80%] md:max-h-[85%] object-contain drop-shadow-2xl group-hover:scale-105 transition-transform"
              />
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
