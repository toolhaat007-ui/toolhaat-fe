'use client'
import { useState } from 'react'
import type { Product } from '@/types'

interface RFQModalProps {
  product?: Product
  qty?: number
  onClose: () => void
}

export default function RFQModal({ product, qty = 1, onClose }: RFQModalProps) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-th-xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center p-6 pb-0">
          <h3 className="font-heading font-extrabold text-lg text-text-base">Request a Quote</h3>
          <button onClick={onClose} className="bg-transparent border-none cursor-pointer text-lg text-text-subtle hover:text-text-base">✕</button>
        </div>

        {submitted ? (
          <div className="p-6 text-center">
            <div className="text-4xl mb-3">📋</div>
            <h4 className="font-heading font-extrabold text-lg text-text-base mb-2">RFQ Submitted!</h4>
            <p className="text-text-muted text-sm mb-4">Our team will reach out within 4 business hours.</p>
            <button onClick={onClose} className="bg-accent text-dark border-none rounded-th px-6 py-2.5 font-bold cursor-pointer hover:bg-accent-dark transition-colors">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-3">
            {product && (
              <div className="text-sm text-text-muted mb-3 bg-bg-muted p-3 rounded">
                Product: <strong className="text-text-base">{product.name}</strong>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {[['Company Name', 'company'], ['Contact Name', 'name'], ['Email', 'email'], ['Phone', 'phone']].map(([label, name]) => (
                <div key={name}>
                  <label className="text-xs font-semibold text-text-muted block mb-1">{label} *</label>
                  <input
                    required
                    name={name}
                    placeholder={label}
                    className="w-full border border-border-light rounded px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1">Required Quantity</label>
              <input
                type="number"
                defaultValue={qty}
                min={1}
                className="w-full border border-border-light rounded px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1">Additional Requirements</label>
              <textarea
                placeholder="Delivery location, custom specs, timeline..."
                rows={3}
                className="w-full border border-border-light rounded px-3 py-2 text-sm outline-none focus:border-accent transition-colors resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1">GSTIN (optional)</label>
              <input
                placeholder="For GST invoice"
                className="w-full border border-border-light rounded px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-dark text-white border-none rounded-th py-3 font-heading font-extrabold text-[15px] cursor-pointer hover:bg-mid transition-colors mt-2"
            >
              Submit RFQ
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
