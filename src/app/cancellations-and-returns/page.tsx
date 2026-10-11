import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/layout/Breadcrumb'

export const metadata: Metadata = {
  title: 'Cancellations & Returns Policy | ToolHaat',
  description: 'ToolHaat\'s policy on order cancellations, product returns, refunds and replacements for B2B orders.',
  alternates: { canonical: 'https://www.toolhaat.com/cancellations-and-returns' },
}

const SECTIONS = [
  {
    title: '1. Order Cancellations',
    body: [
      'You may cancel an order free of charge any time before it has been dispatched. Cancel from your account under "My Orders", or contact our support team with your order number.',
      'Once an order has been dispatched, it can no longer be cancelled — you may instead initiate a return once the item is delivered, subject to the return eligibility below.',
    ],
  },
  {
    title: '2. Return Eligibility',
    body: [
      'Returns are accepted within 7 days of delivery for the following reasons: the item received is damaged, defective, materially different from what was ordered, or missing parts listed on the product page.',
      'To be eligible, items must be unused, in their original packaging, and accompanied by the invoice generated for the order.',
    ],
  },
  {
    title: '3. Non-Returnable Items',
    body: [
      'Certain categories — including custom or made-to-order products, consumables once opened or used, and items explicitly marked "Non-Returnable" on the product page — are not eligible for return except in cases of transit damage or defect.',
    ],
  },
  {
    title: '4. How to Initiate a Return',
    body: [
      'Go to "My Orders" in your account, select the order and item, and choose "Return Item". Include clear photos if the reason is damage or defect. Our team reviews requests within 24–48 hours and arranges pickup where applicable.',
      'You can also reach out via the Contact Us page with your order number and we\'ll guide you through the process.',
    ],
  },
  {
    title: '5. Refunds',
    body: [
      'Once a returned item is received and inspected, refunds are processed to the original payment method within 5–7 business days. For Cash on Delivery orders, refunds are issued via bank transfer or UPI, whichever you provide.',
      'Delivery charges (where applicable) are refunded only when the return is due to a ToolHaat error — damaged, defective, or incorrect item.',
    ],
  },
  {
    title: '6. Replacements',
    body: [
      'For damaged, defective or incorrect items, you may choose a replacement instead of a refund, subject to stock availability. Replacements are dispatched once the original item is picked up or its return is confirmed.',
    ],
  },
]

export default function CancellationsAndReturnsPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cancellations & Returns' }]} />
      <div className="bg-bg-page min-h-screen py-10 px-6">
        <div className="max-w-[760px] mx-auto">
          <div className="mb-8">
            <h1 className="font-heading font-black text-3xl text-text-base mb-2">Cancellations &amp; Returns</h1>
            <p className="text-text-muted text-sm">Last updated: August 2026</p>
          </div>

          <div className="bg-white rounded-th-xl border border-border-light p-6 md:p-8 space-y-7">
            {SECTIONS.map(s => (
              <div key={s.title}>
                <h2 className="font-heading font-bold text-lg text-text-base mb-2.5">{s.title}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="text-sm text-text-muted leading-relaxed mb-2 last:mb-0">{p}</p>
                ))}
              </div>
            ))}

            <div>
              <h2 className="font-heading font-bold text-lg text-text-base mb-2.5">Need help with an order?</h2>
              <p className="text-sm text-text-muted leading-relaxed">
                Reach out via our <Link href="/contact" className="text-accent font-semibold no-underline hover:underline">Contact Us</Link> page,
                email <a href="mailto:support@toolhaat.com" className="text-accent font-semibold no-underline hover:underline">support@toolhaat.com</a>,
                or call us Mon–Sat, 9am–7pm. Have your order number ready for faster resolution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
