import type { Metadata } from 'next'

const SITE_URL = 'https://www.toolhaat.com'
const SITE_NAME = 'ToolHaat'
const SITE_DESCRIPTION = "India's B2B marketplace for industrial tools, agricultural equipment, pumps, food processing tools, cleaning supplies and office essentials. Bulk pricing, GST invoices, 24-hour dispatch."

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ToolHaat — India\'s B2B Industrial Marketplace | Bulk Pricing, GST Invoices',
    template: '%s | ToolHaat',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'b2b industrial tools india',
    'buy tools online bulk',
    'industrial marketplace india',
    'agricultural tools wholesale',
    'pumps bulk pricing',
    'office supplies wholesale india',
    'gst invoice tools',
    'cleaning equipment bulk',
    'food processing equipment india',
  ],
  authors: [{ name: 'ToolHaat' }],
  creator: 'ToolHaat',
  publisher: 'ToolHaat Pvt Ltd',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'ToolHaat — India\'s B2B Industrial Marketplace',
    description: SITE_DESCRIPTION,
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'ToolHaat - Powering Your Business Growth' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolHaat — India\'s B2B Industrial Marketplace',
    description: SITE_DESCRIPTION,
    images: ['/og-default.png'],
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export function buildCategoryMetadata(title: string, description: string, slug: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${slug}`,
      images: [{ url: `/og/${slug}.png`, width: 1200, height: 630, alt: title }],
    },
    alternates: { canonical: `${SITE_URL}/${slug}` },
  }
}

export function buildProductMetadata(title: string, description: string, categorySlug: string, slug: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/p/${categorySlug}/${slug}`,
      type: 'website',
    },
    alternates: { canonical: `${SITE_URL}/p/${categorySlug}/${slug}` },
  }
}
