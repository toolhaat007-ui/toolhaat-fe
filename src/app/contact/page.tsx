import type { Metadata } from 'next'
import Breadcrumb from '@/components/layout/Breadcrumb'

export const metadata: Metadata = {
  title: 'Contact Us | ToolHaat',
  description: 'Get in touch with the ToolHaat team. For bulk orders, partnerships, or support.',
  alternates: { canonical: 'https://www.toolhaat.com/contact' },
}

export default function ContactPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]} />
      <div className="bg-bg-page min-h-screen py-10 px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-heading font-black text-3xl text-text-base mb-2">Get in Touch</h1>
            <p className="text-text-muted max-w-md mx-auto">Have a question about bulk orders, partnerships or just need help? We&apos;re here for you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              { icon: '📞', title: 'Call Us', lines: ['+91 98765 43210', 'Mon–Sat, 9am–7pm'] },
              { icon: '📧', title: 'Email Us', lines: ['support@toolhaat.com', 'Response within 4 hours'] },
              { icon: '💬', title: 'WhatsApp', lines: ['+91 87654 32109', 'Quick replies on WhatsApp'] },
            ].map(c => (
              <div key={c.title} className="bg-white border border-border-light rounded-th-lg p-5 text-center">
                <div className="text-3xl mb-3">{c.icon}</div>
                <div className="font-heading font-bold text-sm text-text-base mb-1">{c.title}</div>
                {c.lines.map(l => <div key={l} className="text-sm text-text-muted">{l}</div>)}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-th-xl border border-border-light p-6 md:p-8">
            <h2 className="font-heading font-extrabold text-xl text-text-base mb-5">Send Us a Message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-muted block mb-1">Name *</label>
                  <input required placeholder="Your name" className="w-full border border-border-light rounded px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted block mb-1">Company</label>
                  <input placeholder="Company name" className="w-full border border-border-light rounded px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-muted block mb-1">Email *</label>
                  <input type="email" required placeholder="email@company.com" className="w-full border border-border-light rounded px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted block mb-1">Phone</label>
                  <input type="tel" placeholder="+91 98765 43210" className="w-full border border-border-light rounded px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted block mb-1">Subject *</label>
                <select className="w-full border border-border-light rounded px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors">
                  <option>Bulk Order Enquiry</option>
                  <option>Brand Partnership</option>
                  <option>Technical Support</option>
                  <option>Billing & Invoices</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted block mb-1">Message *</label>
                <textarea required rows={4} placeholder="How can we help?" className="w-full border border-border-light rounded px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors resize-none" />
              </div>
              <button type="submit" className="bg-dark text-white border-none rounded-th px-8 py-3 font-heading font-extrabold text-sm cursor-pointer hover:bg-mid transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
