import type { Metadata, Viewport } from 'next'
import { Manrope, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import { defaultMetadata } from '@/lib/seo'
import { buildOrganizationSchema, buildWebsiteSchema } from '@/lib/schema'
import { LoginModalProvider } from '@/context/LoginModalContext'
import { getCategoryTreeServer } from '@/lib/api/categories'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = defaultMetadata

export const viewport: Viewport = {
  themeColor: '#1a2e35',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategoryTreeServer()

  return (
    <html lang="en" className={`${manrope.variable} ${plusJakartaSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebsiteSchema()) }}
        />
      </head>
      <body>
        <LoginModalProvider>
          <Header categories={categories} />
          <main className="pb-16 md:pb-0">{children}</main>
          <Footer categories={categories} />
          <MobileBottomNav />
        </LoginModalProvider>
      </body>
    </html>
  )
}
