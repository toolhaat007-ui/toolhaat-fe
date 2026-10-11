'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import Toggle from '@/components/ui/Toggle'

export default function CartClient() {
  const router = useRouter()
  const { items, updateQuantity, removeItem } = useCartStore()
  const [gstEnabled, setGstEnabled] = useState(false)
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  const subtotal = items.reduce((s, item) => {
    const price = item.bulkPricing[item.selectedTier]?.price ?? item.price
    return s + price * item.quantity
  }, 0)
  const gstAmt = Math.round(subtotal * 0.12)
  const discount = couponApplied ? Math.round(subtotal * 0.05) : 0
  const delivery = subtotal >= 2000 ? 0 : 149
  const total = subtotal - discount + (gstEnabled ? gstAmt : 0) + delivery

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-bg-page">
        <div className="text-center">
          <div className="text-7xl mb-4">🛒</div>
          <h2 className="font-heading font-extrabold text-2xl text-text-base mb-2">Your cart is empty</h2>
          <p className="text-text-muted mb-6">Add products to get started</p>
          <Link href="/search" className="bg-accent text-dark no-underline px-7 py-3 rounded-th font-heading font-extrabold text-sm hover:bg-accent-dark transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-page">
      <div className="max-w-site mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-[1fr_340px] gap-5">
        {/* Cart items */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-heading font-extrabold text-xl text-text-base">Cart ({items.length} items)</h2>
            <Link href="/search" className="text-sm text-text-muted no-underline hover:text-accent">+ Add More</Link>
          </div>

          {/* Repeat orders banner */}
          <div className="rounded-th-lg p-3.5 mb-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #1a2e35, #22404e)' }}>
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🔄</span>
              <div>
                <div className="text-white font-heading font-bold text-[13px]">Save as Repeat Order</div>
                <div className="text-text-muted text-[11px]">Reorder this cart in 1 click next time</div>
              </div>
            </div>
            <button className="bg-accent text-dark border-none rounded py-2 px-3.5 text-xs font-bold cursor-pointer hover:bg-accent-dark transition-colors">
              Save Order List
            </button>
          </div>

          <div className="bg-white rounded-th-lg border border-border-light overflow-hidden">
            {items.map((item, idx) => {
              const tierPrice = item.bulkPricing[item.selectedTier]?.price ?? item.price
              return (
                <div key={item.id} className={`p-4 flex gap-3.5 ${idx < items.length - 1 ? 'border-b border-bg-muted' : ''}`}>
                  <div
                    className="w-20 h-20 rounded flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                    style={{ background: 'repeating-linear-gradient(45deg, #f0f5f5, #f0f5f5 4px, #e8edf5 4px, #e8edf5 8px)' }}
                  >
                    <span className="font-mono text-[8px] text-text-subtle text-center relative">product<br />image</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-text-subtle font-bold uppercase mb-0.5">{item.brand}</div>
                    <Link href={`/p/${item.categorySlug}/${item.slug}`} className="text-sm font-semibold text-text-base leading-snug block mb-1.5 no-underline hover:text-accent line-clamp-2">
                      {item.name}
                    </Link>
                    <div className="text-[11px] text-text-muted mb-2">MOQ: {item.moq} units · GST {item.gst}% applicable</div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {/* Qty control */}
                      <div className="flex items-center border border-border-light rounded overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, Math.max(item.moq, item.quantity - 1))} className="bg-bg-muted border-none w-7.5 h-7.5 text-base font-bold cursor-pointer text-text-base flex items-center justify-center px-2.5 py-1.5">−</button>
                        <span className="px-2.5 text-sm font-bold text-text-base">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="bg-bg-muted border-none w-7.5 h-7.5 text-base font-bold cursor-pointer text-text-base flex items-center justify-center px-2.5 py-1.5">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="bg-transparent border-none text-error text-xs cursor-pointer font-semibold">Remove</button>
                      <button className="bg-transparent border-none text-text-muted text-xs cursor-pointer">Save for Later</button>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-heading font-extrabold text-base text-text-base">₹{formatPrice(tierPrice * item.quantity)}</div>
                    <div className="text-xs text-text-subtle">₹{formatPrice(tierPrice)}/unit</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:sticky md:top-[120px] self-start">
          <div className="bg-white rounded-th-lg border border-border-light p-5">
            <h3 className="font-heading font-extrabold text-base text-text-base mb-4">Order Summary</h3>

            {/* GST toggle */}
            <div className="bg-bg-muted border border-border-light rounded-th p-3 mb-4">
              <Toggle
                checked={gstEnabled}
                onChange={setGstEnabled}
                label="GST Invoice"
                description="Add 12% GST for tax credit"
              />
            </div>

            {/* Coupon */}
            <div className="mb-4">
              <div className="flex gap-1.5">
                <input
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 border border-border-light rounded px-2.5 py-2 text-sm outline-none focus:border-accent"
                />
                <button
                  onClick={() => coupon && setCouponApplied(true)}
                  className={`border-none rounded px-3 py-2 text-xs font-bold cursor-pointer whitespace-nowrap ${couponApplied ? 'bg-accent text-dark' : 'bg-dark text-white'}`}
                >
                  {couponApplied ? '✓ Applied' : 'Apply'}
                </button>
              </div>
              {couponApplied && <div className="text-[11px] text-accent font-semibold mt-1">✓ 5% discount applied (BULK5)</div>}
            </div>

            {/* Price breakdown */}
            <div className="border-t border-bg-muted pt-3.5 space-y-2.5">
              {[
                ['Subtotal', `₹${formatPrice(subtotal)}`, false],
                ...(discount > 0 ? [['Coupon Discount', `-₹${formatPrice(discount)}`, true]] : []),
                ...(gstEnabled ? [['GST (12%)', `₹${formatPrice(gstAmt)}`, false]] : []),
                ['Delivery', delivery === 0 ? 'FREE' : `₹${delivery}`, delivery === 0],
              ].map(([label, val, isGreen]) => (
                <div key={label as string} className="flex justify-between text-sm">
                  <span className="text-text-muted">{label}</span>
                  <span className={`font-semibold ${isGreen ? 'text-accent' : 'text-text-base'}`}>{val}</span>
                </div>
              ))}
              <div className="border-t border-border-light pt-3 flex justify-between">
                <span className="font-heading font-extrabold text-base text-text-base">Total</span>
                <span className="font-heading font-black text-xl text-text-base">₹{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-accent text-dark border-none rounded-th py-3.5 font-heading font-extrabold text-[15px] cursor-pointer hover:bg-accent-dark transition-colors mt-4"
            >
              Proceed to Checkout →
            </button>
            <Link href="/rfq" className="block w-full bg-transparent text-text-muted border border-border-light rounded-th py-2.5 text-center text-sm cursor-pointer mt-2 no-underline hover:border-accent hover:text-accent transition-colors">
              📋 Request a Quote instead
            </Link>

            <div className="mt-4 flex justify-center gap-3 text-[10px] text-text-subtle">
              {['🔒 Secure', '📋 GST Invoice', '🚚 Fast Delivery'].map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
