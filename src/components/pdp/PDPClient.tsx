'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Product } from '@/types'
import { formatPrice, getActiveTier, calcDiscount } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { useLoginModal } from '@/context/LoginModalContext'
import Toggle from '@/components/ui/Toggle'
import QuantityInput from '@/components/ui/QuantityInput'
import { StockBadge } from '@/components/ui/Badge'
import RFQModal from './RFQModal'

export default function PDPClient({ product }: { product: Product }) {
  const router = useRouter()
  const addItem = useCartStore(s => s.addItem)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const { openLogin } = useLoginModal()

  const [qty, setQty] = useState(product.moq)
  const [tab, setTab] = useState<'specs' | 'description' | 'reviews'>('specs')
  const [addedToCart, setAddedToCart] = useState(false)
  const [wishlist, setWishlist] = useState(false)
  const [gstIncluded, setGstIncluded] = useState(false)
  const [rfqOpen, setRfqOpen] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  const images = product.images ?? []
  const hasMultipleImages = images.length > 1

  const activeTier = getActiveTier(qty, product.bulkPricing)
  const currentPrice = product.bulkPricing[activeTier]?.price ?? product.price
  const totalPrice = currentPrice * qty
  const gstAmt = Math.round(totalPrice * product.gst / 100)
  const displayTotal = gstIncluded ? totalPrice + gstAmt : totalPrice

  const handleAddToCart = () => {
    addItem(product, qty)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    if (!isAuthenticated()) {
      openLogin(() => {
        addItem(product, qty)
        router.push('/cart')
      })
      return
    }
    addItem(product, qty)
    router.push('/cart')
  }

  return (
    <div className="max-w-site mx-auto px-4 md:px-6 py-6">
      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Images */}
        <div>
          <div
            className="rounded-th-xl h-80 flex items-center justify-center border border-border-light mb-3 relative overflow-hidden"
            style={{ background: 'repeating-linear-gradient(45deg, #f0f5f5, #f0f5f5 8px, #e8edf5 8px, #e8edf5 16px)' }}
          >
            {images[activeImage] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={images[activeImage]} alt={product.name} className="w-full h-full object-contain relative z-10" />
            ) : (
              <div className="text-center font-mono text-xs text-text-subtle z-10 relative">
                {product.categorySlug}<br />main product image
              </div>
            )}
            {product.badge && (
              <div className="absolute top-3 left-3 bg-accent text-dark text-[11px] font-bold px-2.5 py-1 rounded">
                {product.badge}
              </div>
            )}
            <button
              onClick={() => setWishlist(w => !w)}
              className={`absolute top-3 right-3 rounded-full w-9 h-9 flex items-center justify-center border cursor-pointer transition-colors text-base ${wishlist ? 'bg-red-50 border-red-200' : 'bg-white border-border-light'}`}
              aria-label={wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {wishlist ? '❤️' : '🤍'}
            </button>
          </div>
          {/* Thumbnails — only shown when there's more than one real image */}
          {hasMultipleImages && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-1 h-16 rounded border cursor-pointer overflow-hidden bg-bg-page transition-colors ${i === activeImage ? 'border-2 border-accent' : 'border-border-light'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div>
          <div className="text-[11px] text-text-subtle font-bold tracking-wider mb-1.5 uppercase">
            {product.brand ? `${product.brand} · ` : ''}SKU: {product.sku}
          </div>
          <h1 className="font-heading font-extrabold text-xl text-text-base leading-snug mb-2.5">
            {product.name}
          </h1>

          {/* Stock */}
          <div className="flex items-center gap-3 mb-4">
            <StockBadge inStock={product.inStock} />
          </div>

          {/* Price box */}
          <div className="bg-bg-muted border border-border-light rounded-th-lg p-4 mb-4">
            <div className="flex items-baseline gap-2.5 mb-1.5">
              <span className="font-heading font-black text-3xl text-text-base">
                ₹{formatPrice(currentPrice)}
              </span>
              <span className="text-base text-text-subtle line-through">₹{formatPrice(product.mrp)}</span>
              <span className="bg-accent/10 text-accent text-xs font-bold px-2 py-0.5 rounded">
                -{calcDiscount(currentPrice, product.mrp)}% OFF
              </span>
            </div>
            <Toggle
              checked={gstIncluded}
              onChange={setGstIncluded}
              label={`GST ${product.gst}%`}
              description={gstIncluded ? `+₹${(currentPrice * product.gst / 100).toFixed(0)}/unit` : 'Excl. GST'}
              className="bg-transparent p-0"
            />
          </div>

          {/* Bulk Pricing Tiers */}
          <div className="mb-4">
            <div className="text-xs font-bold text-text-base tracking-wider uppercase mb-2">
              Bulk Pricing Tiers
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {product.bulkPricing.map((tier, i) => (
                <button
                  key={i}
                  onClick={() => setQty(tier.minQty)}
                  className={`rounded text-center py-2.5 px-2 cursor-pointer border transition-all text-xs ${
                    i === activeTier
                      ? 'bg-dark border-dark text-white'
                      : 'bg-bg-muted border-border-light text-text-base hover:border-accent'
                  }`}
                >
                  <div className={`text-[10px] mb-1 font-semibold ${i === activeTier ? 'text-accent' : 'text-text-subtle'}`}>
                    {tier.qty} units
                  </div>
                  <div className={`font-heading font-extrabold text-sm ${i === activeTier ? 'text-white' : 'text-text-base'}`}>
                    ₹{tier.price}
                  </div>
                  {tier.label !== 'Standard' && (
                    <div className="text-[10px] font-bold text-accent">{tier.label}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-3">
            <QuantityInput value={qty} min={product.moq} onChange={setQty} />
          </div>

          {/* Primary purchase actions — Add to Cart and Buy Now, equal weight */}
          <div className="flex gap-2.5 mb-3">
            <button
              onClick={handleAddToCart}
              className={`flex-1 border-none rounded-th font-heading font-extrabold text-[15px] cursor-pointer transition-all py-3.5 ${
                addedToCart ? 'bg-accent text-dark' : 'bg-accent text-dark hover:bg-accent-dark'
              }`}
            >
              {addedToCart ? '✓ Added to Cart!' : `Add to Cart — ₹${formatPrice(displayTotal)}`}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-dark text-white border-none rounded-th font-heading font-extrabold text-[15px] cursor-pointer py-3.5 hover:bg-mid transition-colors"
            >
              Buy Now
            </button>
          </div>

          {/* RFQ — separate funnel for bulk/custom orders, not a third equal-weight button */}
          <button
            onClick={() => setRfqOpen(true)}
            className="w-full flex items-center justify-between gap-3 bg-accent-light/30 border border-accent/30 rounded-th px-4 py-3 mb-4 cursor-pointer hover:bg-accent-light/50 transition-colors text-left"
          >
            <span className="flex items-center gap-2.5">
              <span className="text-lg">📋</span>
              <span>
                <span className="block text-sm font-bold text-text-base">Need a custom bulk quote?</span>
                <span className="block text-xs text-text-muted">Large quantities, negotiated pricing, dedicated support</span>
              </span>
            </span>
            <span className="text-accent-dark font-bold text-sm whitespace-nowrap">Request Quote →</span>
          </button>

          {/* Trust signals */}
          <div className="grid grid-cols-2 gap-2">
            {[
              ['🚚', 'Free Delivery', 'Orders above ₹2,000'],
              ['📋', 'GST Invoice', 'Instant download'],
              ['🔄', 'Easy Returns', '7-day policy'],
              ['⭐', 'Quality Checked', 'Verified listing'],
            ].map(([icon, title, sub]) => (
              <div key={title} className="flex gap-2 bg-bg-muted border border-border-light rounded p-2.5">
                <span className="text-[18px]">{icon}</span>
                <div>
                  <div className="text-xs font-bold text-text-base">{title}</div>
                  <div className="text-[11px] text-text-subtle">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-th-xl border border-border-light mt-6 overflow-hidden">
        <div className="flex border-b border-border-light overflow-x-auto hide-scrollbar">
          {(['specs', 'description', 'reviews'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 sm:px-6 py-3.5 border-none cursor-pointer text-sm font-heading font-bold capitalize transition-colors whitespace-nowrap flex-shrink-0 ${
                tab === t
                  ? 'text-text-base border-b-2 border-accent bg-transparent'
                  : 'text-text-subtle bg-transparent hover:text-text-base'
              }`}
            >
              {t === 'reviews' ? 'Reviews' : t === 'specs' ? 'Specifications' : 'Description'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'specs' && (
            <table className="w-full border-collapse">
              <tbody>
                {product.specs.map(([k, v], i) => (
                  <tr key={k} className={i % 2 === 0 ? 'bg-bg-muted' : 'bg-white'}>
                    <td className="py-2.5 px-4 text-sm text-text-muted font-semibold w-1/3 border-b border-bg-muted">{k}</td>
                    <td className="py-2.5 px-4 text-sm text-text-base border-b border-bg-muted">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'description' && (
            <div>
              <p className="text-sm text-text-base leading-relaxed mb-4">{product.description}</p>
              <div>
                <div className="font-bold text-sm text-text-base mb-2">What&apos;s in the Box</div>
                <ul className="space-y-1.5">
                  {product.inBox.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-text-muted">
                      <span className="text-accent">✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === 'reviews' && (
            <div>
              {product.reviews > 0 ? (
                <div className="flex gap-8 mb-6 p-4 bg-bg-muted rounded-th">
                  <div className="text-center">
                    <div className="font-heading font-black text-5xl text-text-base leading-none">{product.rating}</div>
                    <div className="flex gap-0.5 justify-center mt-1">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={`text-base ${s <= Math.round(product.rating) ? 'text-accent' : 'text-border-light'}`}>★</span>
                      ))}
                    </div>
                    <div className="text-xs text-text-subtle mt-1">{product.reviews} verified reviews</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">⭐</div>
                  <div className="font-heading font-bold text-text-base mb-1">No reviews yet</div>
                  <p className="text-sm text-text-muted">Be the first business to review this product after your order.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {rfqOpen && <RFQModal product={product} qty={qty} onClose={() => setRfqOpen(false)} />}
    </div>
  )
}
