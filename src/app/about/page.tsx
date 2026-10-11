import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { getCategoriesServer } from '@/lib/api/categories'

export const metadata: Metadata = {
  title: "About ToolHaat — India's B2B Industrial Marketplace",
  description: "Learn about ToolHaat's mission to power India's businesses with reliable industrial tools, bulk pricing, GST invoices and fast delivery.",
  alternates: { canonical: 'https://www.toolhaat.com/about' },
}

export default async function AboutPage() {
  const categories = await getCategoriesServer()

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />

      {/* Hero */}
      <div className="py-16 px-6 text-center" style={{ background: 'linear-gradient(135deg, #1a2e35, #22404e)' }}>
        <div className="max-w-2xl mx-auto">
          <h1 className="font-heading font-black text-4xl text-white mb-4">
            Powering India&apos;s Businesses
          </h1>
          <p className="text-text-muted text-lg leading-relaxed">
            ToolHaat is India&apos;s dedicated B2B marketplace for industrial tools, agricultural equipment, pumps, food processing tools and office supplies. We connect manufacturers and distributors directly with business buyers for bulk pricing and fast delivery.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-border-light py-10 px-6">
        <div className="max-w-site mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ['290+', 'Products Listed'],
            [String(categories.length), 'Categories'],
            ['GST', 'Invoiced Orders'],
            ['24hr', 'Dispatch Time'],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="font-heading font-black text-3xl text-accent">{v}</div>
              <div className="text-text-muted text-sm mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="py-14 px-6">
        <div className="max-w-site mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-heading font-black text-2xl text-text-base mb-4">Our Mission</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              Small and medium businesses in India have long struggled with fragmented procurement — multiple vendors, inconsistent pricing, and the hassle of managing GST invoices from dozens of suppliers.
            </p>
            <p className="text-text-muted leading-relaxed">
              ToolHaat brings everything together in one platform. Whether you&apos;re a factory manager buying safety equipment in bulk, a restaurant owner sourcing food processing tools, or an office manager replenishing supplies — ToolHaat gives you one trusted source with verified brands, transparent bulk pricing, and proper GST invoicing.
            </p>
          </div>
          <div className="space-y-3">
            {[
              ['🏭', 'For Industries', 'Safety equipment, industrial tools, MRO supplies with verified quality and bulk pricing.'],
              ['🌾', 'For Agriculture', 'Farm tools, irrigation systems, sprayers and agri-inputs at wholesale prices.'],
              ['🏢', 'For Offices', 'Complete office supply procurement with GST invoices and bulk pricing.'],
              ['🍽️', 'For Food Businesses', 'Commercial kitchen equipment for restaurants, caterers and food processors.'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="flex gap-3 bg-bg-muted rounded-th p-3.5">
                <span className="text-2xl">{icon}</span>
                <div>
                  <div className="font-heading font-bold text-sm text-text-base">{title}</div>
                  <div className="text-xs text-text-muted mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* B2B Features */}
      <div id="gst" className="bg-white py-12 px-6 border-t border-border-light">
        <div className="max-w-site mx-auto">
          <h2 className="font-heading font-black text-2xl text-text-base mb-8 text-center">Built for B2B</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: '📋',
                title: 'GST Invoices on Every Order',
                desc: 'Every purchase generates a proper GST invoice instantly. Claim input tax credit on all eligible purchases.',
                id: 'gst',
              },
              {
                icon: '💳',
                title: 'Flexible Payment Options',
                desc: 'Pay securely via UPI, net banking, cards or cash on delivery — whatever works best for your business.',
                id: 'payments',
              },
              {
                icon: '🔄',
                title: 'Repeat Order Management',
                desc: 'Save your regular order lists and reorder in one click. Set up scheduled replenishment for recurring supplies.',
                id: 'repeat',
              },
              {
                icon: '📊',
                title: 'Tiered Bulk Pricing',
                desc: 'The more you buy, the more you save. Every product has automatic bulk pricing tiers — from MOQ to 500+ units.',
                id: 'pricing',
              },
              {
                icon: '🤝',
                title: 'Dedicated Account Manager',
                desc: 'High-value B2B accounts get a dedicated account manager for custom sourcing, priority support and strategic procurement.',
                id: 'manager',
              },
              {
                icon: '🚚',
                title: 'Pan-India Delivery',
                desc: 'Delivery to all 28 states and 8 UTs. Free shipping on orders above ₹2,000. Expedited delivery available.',
                id: 'delivery',
              },
            ].map(f => (
              <div key={f.id} id={f.id} className="bg-bg-page rounded-th-lg p-5 border border-border-light">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-heading font-bold text-sm text-text-base mb-1.5">{f.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-12 px-6">
        <div className="max-w-site mx-auto">
          <h2 className="font-heading font-black text-2xl text-text-base mb-6 text-center">Categories We Cover</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {categories.map(cat => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="bg-white border border-border-light rounded-th-lg p-4 text-center no-underline hover:border-accent hover:shadow-card-hover transition-all"
              >
                <div className="text-3xl mb-2">{cat.icon || '📦'}</div>
                <div className="font-heading font-bold text-xs text-text-base">{cat.name}</div>
                {cat.productCount ? <div className="text-[10px] text-text-subtle mt-0.5">{cat.productCount}+ SKUs</div> : null}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-14 px-6 text-center" style={{ background: 'linear-gradient(135deg, #1a2e35, #22404e)' }}>
        <h2 className="font-heading font-black text-2xl text-white mb-3">Ready to Get Started?</h2>
        <p className="text-text-muted mb-6 max-w-md mx-auto">Start saving on your business procurement with ToolHaat.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/auth/register" className="bg-accent text-dark no-underline px-7 py-3 rounded-th font-heading font-extrabold text-sm hover:bg-accent-dark transition-colors">
            Create Free Account
          </Link>
          <Link href="/rfq" className="bg-transparent text-white border border-white/20 no-underline px-7 py-3 rounded-th font-semibold text-sm hover:bg-white/5 transition-colors">
            Request a Quote
          </Link>
        </div>
      </div>
    </>
  )
}
