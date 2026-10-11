import type { Metadata } from 'next'
import Link from 'next/link'
import { getCategoriesServer } from '@/lib/api/categories'

export const metadata: Metadata = {
  title: 'Page Not Found | ToolHaat',
  robots: { index: false, follow: false },
}

export default async function NotFound() {
  const categories = await getCategoriesServer()

  return (
    <div className="min-h-[70vh] bg-bg-page flex items-center justify-center py-12 px-6">
      <div className="text-center max-w-lg">
        <div className="font-heading font-black text-8xl text-accent mb-4">404</div>
        <h1 className="font-heading font-black text-2xl text-text-base mb-3">Page Not Found</h1>
        <p className="text-text-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist. Try searching for products or browse our categories.
        </p>

        <div className="flex gap-3 justify-center mb-8 flex-wrap">
          <Link href="/" className="bg-dark text-white no-underline px-6 py-2.5 rounded-th font-bold text-sm hover:bg-mid transition-colors">
            Go Home
          </Link>
          <Link href="/search" className="bg-accent text-dark no-underline px-6 py-2.5 rounded-th font-bold text-sm hover:bg-accent-dark transition-colors">
            Browse Products
          </Link>
        </div>

        <div>
          <p className="text-xs text-text-subtle mb-3 uppercase tracking-wider font-semibold">Browse Categories</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {categories.map(c => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="flex items-center gap-1.5 bg-white border border-border-light rounded-full px-3 py-1.5 text-xs font-semibold text-text-muted no-underline hover:border-accent hover:text-accent transition-colors"
              >
                <span>{c.icon || '📦'}</span>
                <span>{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
