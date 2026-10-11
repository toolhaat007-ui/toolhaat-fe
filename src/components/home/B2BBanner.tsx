import Link from 'next/link'
import { getCategoriesServer } from '@/lib/api/categories'

export default async function B2BBanner() {
  const categories = await getCategoriesServer()
  return (
    <section className="px-6 py-10 md:py-14">
      <div
        className="max-w-site mx-auto rounded-3xl py-14 px-6 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a2e35, #22404e)' }}
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(46,196,182,0.15) 0%, transparent 70%)' }} />

        <div className="max-w-xl mx-auto relative">
          <h2 className="font-heading font-black text-3xl text-white mb-3">
            Buy in Bulk. Save More.
          </h2>
          <p className="text-text-subtle text-[15px] mb-6 leading-relaxed">
            Get tiered pricing on every order — the more you buy, the more you save. GST invoices and dedicated account support included.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/rfq"
              className="bg-accent text-dark px-8 py-3.5 rounded-th font-heading font-extrabold text-[15px] no-underline hover:bg-accent-dark hover:scale-[1.02] transition-all shadow-lg shadow-accent/20"
            >
              Get a Custom Quote
            </Link>
            <Link
              href="/contact"
              className="bg-transparent text-white border border-white/20 px-8 py-3.5 rounded-th font-semibold text-[15px] no-underline hover:bg-white/5 hover:border-white/40 transition-all"
            >
              Talk to Sales
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-10">
            {[
              ['290+', 'Products Live'],
              [String(categories.length), 'Categories'],
              ['24hr', 'Dispatch Time'],
            ].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="font-heading font-extrabold text-2xl text-accent">{v}</div>
                <div className="text-text-subtle text-xs mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
