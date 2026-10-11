import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/layout/Breadcrumb'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | ToolHaat',
  description: 'Answers to common questions about ordering, payment, delivery, bulk pricing, GST invoices and returns on ToolHaat.',
  alternates: { canonical: 'https://www.toolhaat.com/faq' },
}

const FAQ_SECTIONS = [
  {
    title: 'Ordering',
    items: [
      {
        q: 'Do I need an account to place an order?',
        a: 'Yes. Creating a free ToolHaat account lets us generate GST invoices correctly, track your order history, and speed up repeat orders. Sign up takes under a minute with email OTP.',
      },
      {
        q: 'What is MOQ and why do some products have it?',
        a: 'MOQ (Minimum Order Quantity) is the smallest quantity you can order for a given product. Most items on ToolHaat have an MOQ as low as 1 unit; bulk-only items will show a higher MOQ on the product page.',
      },
      {
        q: 'How do bulk pricing tiers work?',
        a: 'Many products offer lower per-unit pricing as your order quantity increases. The applicable tier is shown automatically on the product page and applied at checkout — no coupon code needed.',
      },
      {
        q: 'Can I get a custom quote for a large order?',
        a: 'Yes. Use the "Request a Quote" (RFQ) option on any product page or the RFQ form to describe your requirement — our team responds within 4 business hours with custom pricing.',
      },
    ],
  },
  {
    title: 'Payment',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'UPI (PhonePe, GPay, Paytm, BHIM), net banking, credit/debit cards, and Cash on Delivery (COD) on eligible orders. All payments are processed through secure, PCI-compliant gateways.',
      },
      {
        q: 'Does ToolHaat offer credit, EMI, or "buy now, pay later"?',
        a: 'No. ToolHaat does not currently provide credit lines, loans, EMI, or any buy-now-pay-later financing. All orders must be paid in full using one of the payment methods available at checkout.',
      },
      {
        q: 'Will I get a GST invoice?',
        a: 'Yes — every order automatically generates a GST-compliant invoice, available for download from your account immediately after the order is confirmed.',
      },
    ],
  },
  {
    title: 'Shipping & Delivery',
    items: [
      {
        q: 'Do you deliver across India?',
        a: 'Yes, we deliver pan-India. Delivery timelines depend on your pincode and the product\'s dispatch time, shown on the product page.',
      },
      {
        q: 'Is delivery free?',
        a: 'Delivery is free on orders above ₹2,000. Orders below that threshold may incur a delivery charge shown at checkout before you pay.',
      },
      {
        q: 'How fast do orders dispatch?',
        a: 'Most in-stock orders dispatch within 24 hours of confirmation. You can track dispatch and delivery status from your account\'s order history.',
      },
    ],
  },
  {
    title: 'Returns & Cancellations',
    items: [
      {
        q: 'Can I cancel an order after placing it?',
        a: 'Orders can be cancelled free of charge as long as they haven\'t been dispatched. Once dispatched, cancellation is no longer possible and the standard return process applies instead. See our Cancellations & Returns policy for full details.',
      },
      {
        q: 'What if I receive a damaged or wrong item?',
        a: 'Contact us within 48 hours of delivery with photos of the item — we\'ll arrange a replacement or refund at no extra cost.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'FAQs' }]} />
      <div className="bg-bg-page min-h-screen py-10 px-6">
        <div className="max-w-[760px] mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-heading font-black text-3xl text-text-base mb-2">Frequently Asked Questions</h1>
            <p className="text-text-muted">Everything you need to know about ordering from ToolHaat.</p>
          </div>

          {FAQ_SECTIONS.map(section => (
            <div key={section.title} className="mb-8">
              <h2 className="font-heading font-extrabold text-lg text-text-base mb-3">{section.title}</h2>
              <div className="bg-white rounded-th-lg border border-border-light divide-y divide-border-light overflow-hidden">
                {section.items.map(item => (
                  <details key={item.q} className="group p-4">
                    <summary className="flex justify-between items-center gap-3 cursor-pointer list-none font-semibold text-sm text-text-base">
                      {item.q}
                      <span className="text-accent text-lg group-open:rotate-45 transition-transform flex-shrink-0">+</span>
                    </summary>
                    <p className="text-sm text-text-muted mt-2.5 leading-relaxed">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-white rounded-th-lg border border-border-light p-6 text-center mt-10">
            <div className="font-heading font-bold text-text-base mb-1">Still have questions?</div>
            <p className="text-sm text-text-muted mb-4">Our team is happy to help with anything not covered here.</p>
            <Link href="/contact" className="inline-block bg-dark text-white no-underline px-6 py-2.5 rounded-th font-bold text-sm hover:bg-mid transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
