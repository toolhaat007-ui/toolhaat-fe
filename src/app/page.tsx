import type { Metadata } from 'next'
import PromoBannerStrip from '@/components/home/PromoBannerStrip'
import CategoryGrid from '@/components/home/CategoryGrid'
import CategoryShowcase from '@/components/home/CategoryShowcase'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import B2BBanner from '@/components/home/B2BBanner'
import { buildBreadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: "ToolHaat — India's B2B Industrial Marketplace | Bulk Pricing, GST Invoices",
  description:
    "India's B2B marketplace for office supplies, cleaning equipment, housekeeping, pantry, safety and stationery essentials. Bulk pricing, GST invoices, 24-hour dispatch.",
  alternates: { canonical: 'https://www.toolhaat.com' },
}

export default function HomePage() {
  const schema = buildBreadcrumbSchema([{ name: 'Home', url: '/' }])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PromoBannerStrip />
      <CategoryGrid />
      <CategoryShowcase categorySlug="office-supplies" />
      <CategoryShowcase categorySlug="cleaning-items" />
      <FeaturedProducts />
      <WhyChooseUs />
      <B2BBanner />
    </>
  )
}
