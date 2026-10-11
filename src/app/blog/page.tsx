import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/layout/Breadcrumb'

export const metadata: Metadata = {
  title: 'Blog — B2B Buying Guides, Industry News | ToolHaat',
  description: 'Expert buying guides, product comparisons, and industry insights for B2B procurement teams. Agricultural tools, industrial equipment, office supplies and more.',
  alternates: { canonical: 'https://www.toolhaat.com/blog' },
}

const POSTS = [
  {
    slug: 'how-to-choose-submersible-pump-borewell',
    title: 'How to Choose the Right Submersible Pump for Your Borewell',
    excerpt: 'A comprehensive guide covering HP ratings, stage count, borewell diameter and water table depth for selecting the perfect submersible pump.',
    date: '22 May 2025',
    category: 'Pumps',
    readTime: '8 min read',
    tags: ['submersible pump', 'borewell', 'buying guide'],
  },
  {
    slug: 'bulk-buying-office-supplies-save-30-percent',
    title: 'How Bulk Buying Office Supplies Can Save Your Business 30%',
    excerpt: 'Learn how to optimize your office supply procurement strategy with bulk ordering, GST input credits and vendor consolidation.',
    date: '15 May 2025',
    category: 'Office Supplies',
    readTime: '5 min read',
    tags: ['office supplies', 'procurement', 'cost savings'],
  },
  {
    slug: 'drip-irrigation-vs-sprinkler-agriculture-india',
    title: 'Drip Irrigation vs Sprinkler Systems: What Works Best for Indian Farms?',
    excerpt: 'Compare drip and sprinkler irrigation systems across water efficiency, installation cost, and crop types to make the right choice for your farm.',
    date: '8 May 2025',
    category: 'Agricultural Tools',
    readTime: '10 min read',
    tags: ['drip irrigation', 'sprinkler', 'farming india'],
  },
  {
    slug: 'commercial-kitchen-equipment-buying-guide-restaurants',
    title: 'Complete Commercial Kitchen Equipment Buying Guide for Restaurants',
    excerpt: 'Everything you need to know about selecting grinders, slicers, commercial ovens and food processing equipment for your restaurant or catering business.',
    date: '1 May 2025',
    category: 'Food Processing',
    readTime: '12 min read',
    tags: ['commercial kitchen', 'restaurant equipment', 'food processing'],
  },
  {
    slug: 'industrial-cleaning-equipment-factories-india',
    title: '5 Must-Have Industrial Cleaning Equipment for Indian Factories',
    excerpt: 'Floor scrubbers, pressure washers, industrial vacuums and sweepers that every manufacturing facility needs to maintain hygiene and compliance.',
    date: '24 Apr 2025',
    category: 'Cleaning Items',
    readTime: '7 min read',
    tags: ['industrial cleaning', 'factory hygiene', 'cleaning equipment'],
  },
  {
    slug: 'gst-input-tax-credit-business-procurement',
    title: 'How to Maximize GST Input Tax Credit on Your B2B Purchases',
    excerpt: 'A practical guide to claiming maximum GST ITC on your procurement spend — from identifying eligible purchases to filing correctly.',
    date: '17 Apr 2025',
    category: 'Business Tips',
    readTime: '6 min read',
    tags: ['GST', 'ITC', 'tax credit', 'procurement'],
  },
]

export default function BlogPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
      <div className="bg-bg-page min-h-screen py-10 px-6">
        <div className="max-w-site mx-auto">
          <div className="mb-8">
            <h1 className="font-heading font-black text-3xl text-text-base mb-2">B2B Buying Guides & Industry News</h1>
            <p className="text-text-muted max-w-xl">Expert insights on procurement, product selection, and industry best practices for businesses across India.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {POSTS.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-th-lg border border-border-light overflow-hidden hover:shadow-card-hover transition-shadow no-underline group"
              >
                <div
                  className="h-44 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #1a2e35, #22404e)' }}
                >
                  <span className="text-4xl">
                    {post.category === 'Pumps' ? '⚙️' : post.category === 'Agricultural Tools' ? '🌾' : post.category === 'Food Processing' ? '🍳' : post.category === 'Cleaning Items' ? '🧹' : post.category === 'Business Tips' ? '💡' : '📋'}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-accent/10 text-accent text-[10px] font-bold px-2 py-0.5 rounded">{post.category}</span>
                    <span className="text-[10px] text-text-subtle">{post.readTime}</span>
                  </div>
                  <h2 className="font-heading font-bold text-[15px] text-text-base leading-snug mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-xs text-text-muted line-clamp-2 mb-3">{post.excerpt}</p>
                  <div className="text-[10px] text-text-subtle">{post.date}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
