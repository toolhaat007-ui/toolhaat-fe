import type { Metadata } from 'next'
import Breadcrumb from '@/components/layout/Breadcrumb'

export const metadata: Metadata = {
  title: 'Privacy Policy | ToolHaat',
  description: 'How ToolHaat collects, uses, and protects your personal and business information.',
  alternates: { canonical: 'https://www.toolhaat.com/privacy-policy' },
}

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: [
      'When you create an account, place an order, or contact us, we collect information such as your name, email address, phone number, company name, GSTIN, delivery address, and order history.',
      'We also automatically collect limited technical data — such as browser type, device information, and pages visited — to keep the platform secure and improve performance.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    body: [
      'We use your information to process and deliver orders, generate GST invoices, provide customer support, send order and account updates, and improve our product catalog and services.',
      'We do not use your data to offer, market, or facilitate any credit, loan, EMI, or buy-now-pay-later product — ToolHaat does not provide any such financing services, and your data is never shared with third parties for that purpose.',
    ],
  },
  {
    title: '3. Sharing of Information',
    body: [
      'We share order information only with the parties needed to fulfil it — payment gateways to process transactions, and logistics partners to deliver your order. These partners are contractually required to protect your data and use it solely for that purpose.',
      'We do not sell your personal information to third parties.',
    ],
  },
  {
    title: '4. Cookies',
    body: [
      'ToolHaat uses cookies to keep you signed in, remember your cart, and understand how the site is used so we can improve it. You can control cookies through your browser settings; disabling them may limit some site functionality.',
    ],
  },
  {
    title: '5. Data Security',
    body: [
      'Payments are processed through PCI-DSS compliant gateways — we do not store your full card details on our servers. Account passwords are encrypted, and access to customer data internally is restricted to what\'s needed to serve you.',
    ],
  },
  {
    title: '6. Your Rights',
    body: [
      'You can access, update, or request deletion of your account information at any time from your account settings, or by contacting us directly. We retain order records as required for GST and accounting compliance even after account deletion.',
    ],
  },
  {
    title: '7. Changes to This Policy',
    body: [
      'We may update this policy from time to time to reflect changes in our practices or legal requirements. Material changes will be notified via email or a notice on the site.',
    ],
  },
  {
    title: '8. Contact Us',
    body: [
      'For any questions about this Privacy Policy or how your data is handled, email us at support@toolhaat.com or use our Contact Us page.',
    ],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} />
      <div className="bg-bg-page min-h-screen py-10 px-6">
        <div className="max-w-[760px] mx-auto">
          <div className="mb-8">
            <h1 className="font-heading font-black text-3xl text-text-base mb-2">Privacy Policy</h1>
            <p className="text-text-muted text-sm">Last updated: August 2026</p>
          </div>

          <div className="bg-white rounded-th-xl border border-border-light p-6 md:p-8 space-y-7">
            <p className="text-sm text-text-muted leading-relaxed">
              This Privacy Policy explains how ToolHaat Pvt Ltd (&quot;ToolHaat&quot;, &quot;we&quot;, &quot;us&quot;) collects,
              uses, and protects your information when you use our website and services.
            </p>
            {SECTIONS.map(s => (
              <div key={s.title}>
                <h2 className="font-heading font-bold text-lg text-text-base mb-2.5">{s.title}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="text-sm text-text-muted leading-relaxed mb-2 last:mb-0">{p}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
