import Link from 'next/link'
import Logo from './Logo'
import type { ApiCategory } from '@/lib/api/categories'

export default function Footer({ categories }: { categories: ApiCategory[] }) {
  return (
    <footer className="bg-footer-bg border-t border-footer-bg font-sans">
      <div className="max-w-site mx-auto px-6 pt-10 pb-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Logo size="sm" className="mb-3" />
            <p className="text-text-subtle text-[13px] leading-relaxed max-w-[260px]">
              India&apos;s B2B marketplace for industrial tools, agricultural supplies, cleaning items, pumps and office essentials.
            </p>
            <div className="flex gap-3 mt-4">
              {['Twitter', 'LinkedIn', 'YouTube'].map(s => (
                <div key={s} className="w-8 h-8 bg-mid rounded flex items-center justify-center cursor-pointer hover:bg-mid-2 transition-colors">
                  <span className="text-text-subtle text-[9px] font-bold">{s[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-heading font-bold text-[13px] mb-3 tracking-wide">Categories</h4>
            <ul className="space-y-2">
              {categories.map(c => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} className="text-text-subtle text-[13px] hover:text-accent transition-colors no-underline">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business */}
          <div>
            <h4 className="text-white font-heading font-bold text-[13px] mb-3 tracking-wide">Business</h4>
            <ul className="space-y-2">
              {[
                ['Bulk Pricing', '/rfq'],
                ['GST Invoicing', '/about#gst'],
                ['Request a Quote', '/rfq'],
                ['Brand Partnership', '/contact'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-text-subtle text-[13px] hover:text-accent transition-colors no-underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-heading font-bold text-[13px] mb-3 tracking-wide">Support</h4>
            <ul className="space-y-2">
              {[
                ['About Us', '/about'],
                ['Contact Us', '/contact'],
                ['FAQs', '/faq'],
                ['Cancellations & Returns', '/cancellations-and-returns'],
                ['Track Order', '/track-order'],
                ['Blog', '/blog'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-text-subtle text-[13px] hover:text-accent transition-colors no-underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust strip */}
        <div className="border-t border-mid py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['🚚', 'Free Delivery', 'On orders above ₹2,000'],
            ['📋', 'GST Invoice', 'On every order'],
            ['🔒', 'Secure Payments', '256-bit SSL encryption'],
            ['⭐', 'Verified Products', 'Quality checked catalog'],
          ].map(([icon, title, sub]) => (
            <div key={title} className="flex items-center gap-2.5">
              <span className="text-xl">{icon}</span>
              <div>
                <div className="text-white text-xs font-bold">{title}</div>
                <div className="text-text-subtle text-[11px]">{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-mid pt-4 flex flex-wrap justify-between items-center gap-3 text-[12px] text-text-subtle">
          <span>© 2025 ToolHaat Pvt Ltd &nbsp;·&nbsp; GSTIN: 22AAAAA0000A1Z5</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="hover:text-accent transition-colors no-underline">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-accent transition-colors no-underline">Terms &amp; Conditions</Link>
            <Link href="/cancellations-and-returns" className="hover:text-accent transition-colors no-underline">Cancellations &amp; Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
