import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/layout/Breadcrumb'

export const metadata: Metadata = {
  title: 'Terms & Conditions | ToolHaat',
  description: 'The terms and conditions governing your use of ToolHaat and purchases made through the platform.',
  alternates: { canonical: 'https://www.toolhaat.com/terms-and-conditions' },
}

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: [
      'By accessing or using ToolHaat, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the platform.',
    ],
  },
  {
    title: '2. Eligibility & Account Registration',
    body: [
      'ToolHaat is a B2B marketplace intended for businesses and professional buyers. You must provide accurate information when creating an account, including a valid email and, where applicable, GSTIN for invoicing purposes.',
      'You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.',
    ],
  },
  {
    title: '3. Product Information & Pricing',
    body: [
      'We make reasonable efforts to ensure product descriptions, images, specifications and pricing are accurate. Prices displayed are exclusive of GST unless stated otherwise, and are subject to change without prior notice.',
      'Bulk pricing tiers shown on product pages apply automatically based on order quantity at the time of purchase.',
    ],
  },
  {
    title: '4. Orders & Order Acceptance',
    body: [
      'Placing an order constitutes an offer to purchase. An order is confirmed only once payment is successfully processed (or, for Cash on Delivery, once the order is accepted). ToolHaat reserves the right to cancel any order due to stock unavailability, pricing errors, or suspected fraudulent activity, with a full refund where payment was already made.',
    ],
  },
  {
    title: '5. Payment Terms',
    body: [
      'Payment is due in full at the time of order, through the payment methods offered at checkout — UPI, net banking, credit/debit cards, or Cash on Delivery where available.',
      'ToolHaat does not offer credit, loans, EMI, buy-now-pay-later, or any other financing or lending product. We do not extend deferred payment terms to any customer, and any communication claiming otherwise on ToolHaat\'s behalf should be treated as fraudulent.',
    ],
  },
  {
    title: '6. Shipping & Delivery',
    body: [
      'Delivery timelines shown on product and checkout pages are estimates and may vary based on location and product availability. Free delivery applies to orders above ₹2,000; a delivery charge applies to orders below this threshold, shown at checkout.',
    ],
  },
  {
    title: '7. Cancellations & Returns',
    body: [
      'Order cancellations and product returns are governed by our ',
    ],
    linkAfter: { label: 'Cancellations & Returns Policy', href: '/cancellations-and-returns' },
  },
  {
    title: '8. Limitation of Liability',
    body: [
      'ToolHaat is not liable for indirect, incidental, or consequential damages arising from the use of the platform or products purchased through it, to the extent permitted by applicable law. Our total liability for any claim is limited to the value of the relevant order.',
    ],
  },
  {
    title: '9. Governing Law',
    body: [
      'These Terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the courts where ToolHaat is registered.',
    ],
  },
  {
    title: '10. Changes to These Terms',
    body: [
      'We may update these Terms from time to time. Continued use of ToolHaat after changes are posted constitutes acceptance of the revised Terms.',
    ],
  },
  {
    title: '11. Contact',
    body: [
      'For questions about these Terms, email support@toolhaat.com or reach us via our Contact Us page.',
    ],
  },
]

export default function TermsAndConditionsPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Terms & Conditions' }]} />
      <div className="bg-bg-page min-h-screen py-10 px-6">
        <div className="max-w-[760px] mx-auto">
          <div className="mb-8">
            <h1 className="font-heading font-black text-3xl text-text-base mb-2">Terms &amp; Conditions</h1>
            <p className="text-text-muted text-sm">Last updated: August 2026</p>
          </div>

          <div className="bg-white rounded-th-xl border border-border-light p-6 md:p-8 space-y-7">
            {SECTIONS.map(s => (
              <div key={s.title}>
                <h2 className="font-heading font-bold text-lg text-text-base mb-2.5">{s.title}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="text-sm text-text-muted leading-relaxed mb-2 last:mb-0">
                    {p}
                    {s.linkAfter && i === s.body.length - 1 && (
                      <Link href={s.linkAfter.href} className="text-accent font-semibold no-underline hover:underline">
                        {s.linkAfter.label}
                      </Link>
                    )}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
