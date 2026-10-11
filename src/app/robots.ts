import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Standard search engine crawlers
        userAgent: '*',
        allow: '/',
        disallow: [
          '/cart',
          '/checkout',
          '/account/',
          '/auth/',
          '/orders/',
          '/api/',
          '/_next/',
        ],
      },
      {
        // Block AI training crawlers from scraping product/content data
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'CCBot',
          'anthropic-ai',
          'Claude-Web',
          'Google-Extended',
          'PerplexityBot',
          'Bytespider',
          'Amazonbot',
        ],
        disallow: '/',
      },
    ],
    sitemap: 'https://www.toolhaat.com/sitemap.xml',
    host: 'https://www.toolhaat.com',
  }
}
