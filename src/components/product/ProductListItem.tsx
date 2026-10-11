'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/types'
import { calcDiscount, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import Badge, { DiscountBadge } from '@/components/ui/Badge'

export default function ProductListItem({ product }: { product: Product }) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product, product.moq)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <Link
      href={`/p/${product.categorySlug}/${product.slug}`}
      className="bg-white border border-border-light rounded-th-lg p-4 flex gap-4 cursor-pointer hover:shadow-card-hover transition-shadow no-underline"
    >
      <div className="w-24 h-24 bg-bg-page rounded flex items-center justify-center flex-shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#f0f5f5,#f0f5f5_5px,#e8edf5_5px,#e8edf5_10px)]" />
        <span className="relative font-mono text-[9px] text-text-subtle text-center">product<br />image</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-text-subtle font-semibold mb-1 uppercase">
          {product.brand ? `${product.brand} · ` : ''}{product.categorySlug}
        </div>
        <div className="text-[15px] font-semibold text-text-base mb-1.5 line-clamp-2">{product.name}</div>
        <div className="text-[11px] text-text-muted">MOQ: {product.moq} units</div>
      </div>
      <div className="flex flex-col items-end gap-2 min-w-[130px] flex-shrink-0">
        {product.badge && <Badge label={product.badge} />}
        <div className="text-right">
          <div className="font-heading font-extrabold text-lg text-text-base">₹{formatPrice(product.price)}</div>
          <div className="text-xs text-text-subtle line-through">₹{formatPrice(product.mrp)}</div>
          <div className="text-xs text-accent font-semibold">-{calcDiscount(product.price, product.mrp)}% off</div>
        </div>
        <button
          onClick={handleAdd}
          className={`
            border-none rounded py-2 px-3.5 text-xs font-bold cursor-pointer whitespace-nowrap transition-all
            ${added ? 'bg-accent text-dark' : 'bg-dark text-white hover:bg-mid'}
          `}
        >
          {added ? '✓ Added' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  )
}
