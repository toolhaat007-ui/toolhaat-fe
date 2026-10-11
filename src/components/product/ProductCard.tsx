'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/types'
import { calcDiscount, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import Badge, { DiscountBadge } from '@/components/ui/Badge'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product, product.moq)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  const discount = calcDiscount(product.price, product.mrp)

  return (
    <Link
      href={`/p/${product.categorySlug}/${product.slug}`}
      className="bg-white border border-border-light rounded-th-lg overflow-hidden cursor-pointer transition-shadow hover:shadow-card-hover no-underline flex flex-col group"
    >
      {/* Image */}
      <div className="relative bg-bg-page h-36 flex items-center justify-center overflow-hidden">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain relative z-10" />
        ) : (
          <>
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#f0f5f5,#f0f5f5_5px,#e8edf5_5px,#e8edf5_10px)]" />
            <div className="relative z-10 text-center font-mono text-[10px] text-text-subtle p-2">
              {product.categorySlug}<br />product image
            </div>
          </>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge && <Badge label={product.badge} variant="accent" />}
        </div>
        <div className="absolute top-2 right-2">
          <DiscountBadge percent={discount} />
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        {product.brand && (
          <div className="text-[10px] text-text-subtle font-semibold tracking-wide mb-1 uppercase">
            {product.brand}
          </div>
        )}
        <div className="text-[13px] font-semibold text-text-base leading-snug mb-2 line-clamp-2 flex-1">
          {product.name}
        </div>
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="font-heading font-extrabold text-[17px] text-text-base">
            ₹{formatPrice(product.price)}
          </span>
          <span className="text-xs text-text-subtle line-through">
            ₹{formatPrice(product.mrp)}
          </span>
        </div>
        <div className="text-[10px] text-text-muted mb-2.5">
          MOQ: {product.moq} units
        </div>
        <button
          onClick={handleAdd}
          className={`
            w-full border-none rounded py-2.5 text-xs font-bold cursor-pointer transition-all duration-200
            ${added ? 'bg-accent text-dark' : 'bg-dark text-white hover:bg-mid'}
          `}
        >
          {added ? '✓ Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  )
}
