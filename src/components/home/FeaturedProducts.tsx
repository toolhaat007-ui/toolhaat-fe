import Link from 'next/link'
import { getProductsServer } from '@/lib/api/products'
import ProductCard from '@/components/product/ProductCard'

export default async function FeaturedProducts() {
  const apiResult = await getProductsServer({ featured: true, limit: 8 })
  const products = apiResult?.items ?? []
  if (products.length === 0) return null

  return (
    <section className="bg-white py-10 px-6">
      <div className="max-w-site mx-auto">
        <div className="flex justify-between items-baseline mb-5">
          <h2 className="font-heading font-extrabold text-2xl text-text-base">Featured Products</h2>
          <Link href="/search" className="text-accent font-semibold text-sm no-underline hover:underline">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
