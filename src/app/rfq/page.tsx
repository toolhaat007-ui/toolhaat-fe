'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { api } from '@/lib/api/client'
import type { ApiCategory } from '@/lib/api/categories'
import { useAuthStore } from '@/store/auth'
import { submitRfq } from '@/lib/api/rfq'

interface FormState {
  companyName: string
  contactName: string
  email: string
  phone: string
  category: string
  productsText: string
  gstin: string
  timeline: string
  notes: string
}

export default function RFQPage() {
  const { user, isAuthenticated } = useAuthStore()
  const authed = isAuthenticated()

  const [form, setForm] = useState<FormState>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    category: '',
    productsText: '',
    gstin: '',
    timeline: 'Within 1 week',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<ApiCategory[]>([])

  useEffect(() => {
    api.get<ApiCategory[]>('/categories').then(setCategories).catch(() => setCategories([]))
  }, [])

  // Pre-fill from auth store when logged in
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        contactName: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        phone: user.phone || prev.phone,
        companyName: user.companyName || prev.companyName,
        gstin: user.gstin || prev.gstin,
      }))
    }
  }, [user])

  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Parse productsText into items array
      const items = form.productsText
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
          // Try to parse "Product Name x500" or "Product Name × 500"
          const match = line.match(/^(.+?)\s*[x×]\s*(\d+)/i)
          if (match) {
            return { productName: match[1].trim(), quantity: parseInt(match[2], 10) }
          }
          return { productName: line, quantity: 1 }
        })

      if (items.length === 0) {
        setError('Please enter at least one product.')
        setIsLoading(false)
        return
      }

      await submitRfq({
        contactName: form.contactName,
        contactEmail: form.email,
        contactPhone: form.phone,
        companyName: form.companyName || undefined,
        gstin: form.gstin || undefined,
        items,
        message: `Category: ${form.category || 'Multiple'}\nTimeline: ${form.timeline}\n${form.notes}`.trim(),
      })

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Failed to submit RFQ. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] bg-bg-page flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="font-heading font-extrabold text-2xl text-text-base mb-2">RFQ Submitted!</h2>
          <p className="text-text-muted mb-2">Our team will reach out within 4 business hours.</p>
          {authed && (
            <p className="text-text-subtle text-sm mb-6">
              Track your RFQ in{' '}
              <Link href="/account" className="text-accent no-underline font-semibold hover:underline">My Account</Link>
            </p>
          )}
          {!authed && <p className="text-text-muted mb-6" />}
          <Link href="/" className="bg-accent text-dark no-underline px-7 py-3 rounded-th font-heading font-extrabold text-sm hover:bg-accent-dark transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Request a Quote' }]} />

      <div className="bg-bg-page min-h-screen py-10 px-6">
        <div className="max-w-[580px] mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-heading font-black text-3xl text-text-base mb-2">Request a Quote</h1>
            <p className="text-text-muted">Get custom pricing for bulk orders. Our team responds within 4 business hours.</p>
          </div>

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              ['⚡', '4hr Response', 'Business hours'],
              ['💰', 'Best Prices', 'Guaranteed'],
              ['📋', 'GST Invoice', 'On every order'],
            ].map(([icon, title, sub]) => (
              <div key={title} className="bg-white border border-border-light rounded-th p-3 text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-xs font-bold text-text-base">{title}</div>
                <div className="text-[10px] text-text-subtle">{sub}</div>
              </div>
            ))}
          </div>

          {/* Auth nudge */}
          {!authed && (
            <div className="bg-accent/10 border border-accent/20 rounded-th p-3.5 mb-5 text-sm text-text-base">
              <span className="font-semibold">💡 Save time:</span>{' '}
              <Link href="/auth/login" className="text-accent font-semibold no-underline hover:underline">Sign in</Link>
              {' '}to auto-fill your business details.
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-th-xl border border-border-light p-6 md:p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {([
                  ['Company Name', 'companyName', 'text', false],
                  ['Contact Name *', 'contactName', 'text', true],
                  ['Email *', 'email', 'email', true],
                  ['Phone *', 'phone', 'tel', true],
                ] as const).map(([label, key, type, required]) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-text-muted block mb-1">{label}</label>
                    <input
                      required={required}
                      type={type}
                      value={form[key]}
                      onChange={set(key)}
                      placeholder={label.replace(' *', '')}
                      className="w-full border border-border-light rounded px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted block mb-1">Category of Interest</label>
                <select
                  value={form.category}
                  onChange={set('category')}
                  className="w-full border border-border-light rounded px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                  <option value="multiple">Multiple Categories</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted block mb-1">
                  Products & Quantities *
                  <span className="text-text-subtle font-normal ml-1">(one per line, e.g. Safety Helmets x500)</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.productsText}
                  onChange={set('productsText')}
                  placeholder={"Safety Helmets x500\nSafety Gloves x1000\nA4 Paper x200"}
                  className="w-full border border-border-light rounded px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-muted block mb-1">GSTIN (optional)</label>
                  <input
                    value={form.gstin}
                    onChange={set('gstin')}
                    placeholder="For GST invoice"
                    className="w-full border border-border-light rounded px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted block mb-1">Delivery Timeline</label>
                  <select
                    value={form.timeline}
                    onChange={set('timeline')}
                    className="w-full border border-border-light rounded px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors"
                  >
                    <option>Within 1 week</option>
                    <option>1–2 weeks</option>
                    <option>1 month</option>
                    <option>Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted block mb-1">Additional Notes</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={set('notes')}
                  placeholder="Delivery location, special requirements, budget range..."
                  className="w-full border border-border-light rounded px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-dark text-white border-none rounded-th py-3.5 font-heading font-extrabold text-[15px] cursor-pointer hover:bg-mid transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting…</>
                  : "Submit RFQ — We'll respond in 4hrs"}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-text-subtle mt-4">
            By submitting, you agree to our{' '}
            <Link href="/privacy-policy" className="text-accent no-underline">Privacy Policy</Link>.
            We never share your data.
          </p>
        </div>
      </div>
    </>
  )
}
