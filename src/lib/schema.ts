import type { Product, Category } from '@/types'

const SITE_URL = 'https://www.toolhaat.com'

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ToolHaat',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: "India's B2B marketplace for industrial tools and supplies",
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://www.linkedin.com/company/toolhaat',
      'https://twitter.com/toolhaat',
    ],
  }
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ToolHaat',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildProductSchema(product: Product) {
  // Real API products serialize price/mrp as strings (TypeORM decimal columns)
  // and use `bulkTiers` (may be empty), not the mock `bulkPricing` field —
  // fall back to base price/mrp whenever tiers are unavailable.
  const tiers = (product as any).bulkTiers ?? product.bulkPricing ?? []
  const basePrice = Number(product.price) || 0
  const currentPrice = tiers.length > 0 ? Number(tiers[0].price) : basePrice
  const lowPrice = tiers.length > 0 ? Number(tiers[tiers.length - 1].price) : basePrice

  const brandName = typeof product.brand === 'string'
    ? product.brand
    : (product as any).brand?.name || 'ToolHaat'

  const rating = Number((product as any).averageRating ?? product.rating ?? 0)
  const reviews = Number((product as any).reviewCount ?? product.reviews ?? 0)

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice,
      highPrice: currentPrice,
      priceCurrency: 'INR',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/p/${product.categorySlug}/${product.slug}`,
      seller: { '@type': 'Organization', name: 'ToolHaat' },
    },
    ...(reviews > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating,
        reviewCount: reviews,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  }
}

export function buildBreadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.url}`,
    })),
  }
}

export function buildCollectionPageSchema(category: Category) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `${SITE_URL}/${category.slug}`,
    breadcrumb: buildBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: category.name, url: `/${category.slug}` },
    ]),
  }
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}
