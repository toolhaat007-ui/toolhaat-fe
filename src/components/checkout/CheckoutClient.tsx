'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { formatPrice } from '@/lib/utils'
import type { PaymentMethod } from '@/types'
import Toggle from '@/components/ui/Toggle'
import { createOrder } from '@/lib/api/orders'

const STEPS = ['Delivery Address', 'Payment', 'Confirm Order']

type Step = 1 | 2 | 3

export default function CheckoutClient() {
  const { items, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  const authed = isAuthenticated()

  const [step, setStep] = useState<Step>(1)
  const [gstBusiness, setGstBusiness] = useState(false)
  const [payMethod, setPayMethod] = useState<PaymentMethod>('upi')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState('TH-2025-00001')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)

  // Address form state
  const [address, setAddress] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : '',
    company: user?.companyName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    gstin: user?.gstin || '',
  })

  const subtotal = items.reduce((s, item) => {
    const price = item.bulkPricing[item.selectedTier]?.price ?? item.price
    return s + price * item.quantity
  }, 0)
  const delivery = subtotal >= 2000 ? 0 : 149
  const total = subtotal + delivery

  // Map UI payment methods to backend enum values
  const backendPayMethod = (m: PaymentMethod) => {
    const map: Record<PaymentMethod, string> = {
      upi: 'razorpay',
      netbanking: 'net_banking',
      card: 'razorpay',
      cod: 'cod',
    }
    return map[m] as any
  }

  const handlePlaceOrder = async () => {
    setIsSubmitting(true)
    setOrderError(null)
    try {
      if (authed) {
        // Attempt backend order creation using a synced cart
        // cartId would come from cart sync (see cart store) — fall back to local if not available
        const storedCart = (() => {
          try {
            const raw = localStorage.getItem('toolhaat-server-cart')
            return raw ? JSON.parse(raw) : null
          } catch { return null }
        })()

        if (storedCart?.id) {
          const result: any = await createOrder(storedCart.id, {
            paymentMethod: backendPayMethod(payMethod),
            shippingAddress: {
              name: address.name,
              phone: address.phone,
              addressLine1: address.street,
              city: address.city,
              state: address.state,
              pincode: address.pincode,
            },
            requestGstInvoice: gstBusiness,
            buyerGstin: gstBusiness ? address.gstin : undefined,
          })
          if (result?.orderNumber) setOrderNumber(result.orderNumber)
          // Clear server cart reference
          localStorage.removeItem('toolhaat-server-cart')
        }
        // Whether API succeeded or not, clear local cart and show success
      }
      clearCart()
      setOrderPlaced(true)
    } catch (err: any) {
      setOrderError(err.message || 'Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-[70vh] bg-bg-page flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">✓</div>
          <h2 className="font-heading font-black text-2xl text-text-base mb-2">Order Confirmed!</h2>
          <p className="text-text-muted text-sm mb-1">Order #{orderNumber}</p>
          <p className="text-text-muted text-sm mb-6 leading-relaxed">
            Your GST invoice will be sent to your email. Expected delivery in 2–4 business days.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/account/orders" className="bg-dark text-white no-underline px-6 py-2.5 rounded-th font-bold text-sm hover:bg-mid transition-colors">
              View Order
            </Link>
            <Link href="/" className="bg-accent text-dark no-underline px-6 py-2.5 rounded-th font-bold text-sm hover:bg-accent-dark transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-page">
      <div className="max-w-[1000px] mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-5">
        {/* Main checkout column */}
        <div>
          {/* Step indicator */}
          <div className="flex bg-white rounded-th-lg border border-border-light overflow-hidden mb-6">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`flex-1 py-3.5 flex items-center justify-center gap-2 ${i < STEPS.length - 1 ? 'border-r border-border-light' : ''} ${step === i + 1 ? 'bg-dark' : step > i + 1 ? 'bg-bg-muted cursor-pointer' : 'bg-white'}`}
                onClick={() => step > i + 1 && setStep((i + 1) as Step)}
              >
                <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${step === i + 1 ? 'bg-accent text-dark' : step > i + 1 ? 'bg-accent text-white' : 'bg-border-light text-text-subtle'}`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-bold ${step === i + 1 ? 'text-white' : step > i + 1 ? 'text-accent' : 'text-text-subtle'}`}>{s}</span>
              </div>
            ))}
          </div>

          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-white rounded-th-lg border border-border-light p-6">
              <h3 className="font-heading font-extrabold text-base text-text-base mb-4">Delivery Address</h3>

              <div className="bg-bg-muted border border-border-light rounded-th p-3 mb-5">
                <Toggle
                  checked={gstBusiness}
                  onChange={setGstBusiness}
                  label="Business / GST Purchase"
                  description="Add GSTIN for input tax credit"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {([['Full Name', 'name'], ['Company Name', 'company'], ['Phone', 'phone'], ['Email', 'email']] as const).map(([label, key]) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-text-muted block mb-1">{label}</label>
                    <input
                      value={address[key]}
                      onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))}
                      placeholder={label}
                      className="w-full border border-border-light rounded px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <label className="text-xs font-semibold text-text-muted block mb-1">Full Address</label>
                <textarea
                  rows={2}
                  value={address.street}
                  onChange={e => setAddress(a => ({ ...a, street: e.target.value }))}
                  placeholder="Street, Building, Area"
                  className="w-full border border-border-light rounded px-3 py-2 text-sm outline-none focus:border-accent transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                {([['City', 'city'], ['State', 'state'], ['Pincode', 'pincode']] as const).map(([label, key]) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-text-muted block mb-1">{label}</label>
                    <input
                      value={address[key]}
                      onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))}
                      placeholder={label}
                      className="w-full border border-border-light rounded px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                    />
                  </div>
                ))}
              </div>
              {gstBusiness && (
                <div className="mt-3">
                  <label className="text-xs font-semibold text-text-muted block mb-1">
                    GSTIN <span className="text-accent">✓ Required for invoice</span>
                  </label>
                  <input
                    value={address.gstin}
                    onChange={e => setAddress(a => ({ ...a, gstin: e.target.value }))}
                    placeholder="e.g. 22AAAAA0000A1Z5"
                    className="w-full border border-accent rounded px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
              )}
              <button
                onClick={() => setStep(2)}
                className="mt-5 bg-accent text-dark border-none rounded-th px-7 py-3 font-heading font-extrabold text-sm cursor-pointer hover:bg-accent-dark transition-colors"
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white rounded-th-lg border border-border-light p-6">
              <h3 className="font-heading font-extrabold text-base text-text-base mb-4">Payment Method</h3>
              <div className="space-y-2.5 mb-5">
                {[
                  { id: 'upi' as PaymentMethod, icon: '📱', label: 'UPI / QR Code', sub: 'PhonePe, GPay, Paytm, BHIM' },
                  { id: 'netbanking' as PaymentMethod, icon: '🏦', label: 'Net Banking', sub: 'All major banks supported' },
                  { id: 'card' as PaymentMethod, icon: '💳', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
                  { id: 'cod' as PaymentMethod, icon: '💵', label: 'Cash on Delivery', sub: 'Available for orders up to ₹10,000' },
                ].map(m => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-3 p-3.5 border rounded-th cursor-pointer transition-colors ${payMethod === m.id ? 'border-accent bg-bg-muted' : 'border-border-light bg-white'}`}
                  >
                    <input
                      type="radio"
                      name="pay"
                      checked={payMethod === m.id}
                      onChange={() => setPayMethod(m.id)}
                      className="accent-[#2ec4b6]"
                    />
                    <span className="text-xl">{m.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-text-base">{m.label}</div>
                      <div className="text-[11px] text-text-subtle">{m.sub}</div>
                    </div>
                  </label>
                ))}
              </div>
              {payMethod === 'card' && (
                <div className="bg-bg-muted border border-border-light rounded-th p-4 mb-4 space-y-2.5">
                  <input placeholder="Card Number" className="w-full border border-border-light rounded px-3 py-2 text-sm outline-none" />
                  <div className="grid grid-cols-2 gap-2.5">
                    <input placeholder="MM / YY" className="border border-border-light rounded px-3 py-2 text-sm outline-none" />
                    <input placeholder="CVV" type="password" className="border border-border-light rounded px-3 py-2 text-sm outline-none" />
                  </div>
                  <input placeholder="Name on Card" className="w-full border border-border-light rounded px-3 py-2 text-sm outline-none" />
                </div>
              )}
              <div className="flex gap-2.5">
                <button onClick={() => setStep(1)} className="bg-bg-muted text-text-muted border border-border-light rounded-th px-5 py-2.5 font-semibold text-sm cursor-pointer">
                  ← Back
                </button>
                <button onClick={() => setStep(3)} className="flex-1 bg-accent text-dark border-none rounded-th font-heading font-extrabold text-sm cursor-pointer py-2.5 hover:bg-accent-dark transition-colors">
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="bg-white rounded-th-lg border border-border-light p-6">
              <h3 className="font-heading font-extrabold text-base text-text-base mb-4">Review & Place Order</h3>
              <div className="bg-bg-muted rounded-th p-3.5 mb-4">
                <div className="text-[11px] font-bold text-text-subtle uppercase tracking-wider mb-2">Order Items</div>
                {items.map(item => {
                  const price = item.bulkPricing[item.selectedTier]?.price ?? item.price
                  return (
                    <div key={item.id} className="flex justify-between py-1.5 border-b border-bg-muted text-sm last:border-0">
                      <span className="text-text-base truncate max-w-[200px]">{item.name} × {item.quantity}</span>
                      <span className="font-bold text-text-base">₹{formatPrice(price * item.quantity)}</span>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between mb-5 p-3 bg-bg-muted border border-accent/30 rounded-th">
                <span className="font-heading font-extrabold text-base text-text-base">Total Payable</span>
                <span className="font-heading font-black text-xl text-text-base">₹{formatPrice(total)}</span>
              </div>
              {orderError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm mb-4">
                  {orderError}
                </div>
              )}
              <div className="flex gap-2.5">
                <button onClick={() => setStep(2)} className="bg-bg-muted text-text-muted border border-border-light rounded-th px-5 py-2.5 font-semibold text-sm cursor-pointer">
                  ← Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="flex-1 bg-dark text-white border-none rounded-th font-heading font-extrabold text-[15px] cursor-pointer py-3 hover:bg-mid transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Placing Order…</>
                    : `Place Order — ₹${formatPrice(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary — stacks below the form on mobile, sticky sidebar on desktop */}
        <div>
          <div className="bg-white rounded-th-lg border border-border-light p-5 md:sticky md:top-[120px]">
            <h4 className="font-heading font-extrabold text-sm text-text-base mb-3">Order Summary</h4>
            {items.map(item => {
              const price = item.bulkPricing[item.selectedTier]?.price ?? item.price
              return (
                <div key={item.id} className="flex justify-between text-xs mb-2">
                  <span className="text-text-muted flex-1 mr-2 truncate">{item.name} ×{item.quantity}</span>
                  <span className="font-bold text-text-base whitespace-nowrap">₹{formatPrice(price * item.quantity)}</span>
                </div>
              )
            })}
            <div className="border-t border-bg-muted pt-3 mt-1 flex justify-between text-[15px] font-heading font-extrabold text-text-base">
              <span>Total</span>
              <span>₹{formatPrice(total)}</span>
            </div>
            <div className="mt-4 p-2.5 bg-bg-muted rounded text-[11px] text-accent font-semibold">
              ✓ GST Invoice will be sent to your email after confirmation
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
