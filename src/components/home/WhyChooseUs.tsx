const REASONS = [
  { icon: '🧾', title: 'Instant GST Invoices', desc: 'Every order comes with a compliant GST invoice, ready for your books.' },
  { icon: '📦', title: 'Tiered Bulk Pricing', desc: 'The more you order, the less you pay per unit — automatically applied at checkout.' },
  { icon: '🚚', title: '24-Hour Dispatch', desc: 'Orders placed before cutoff ship the same day, pan-India delivery.' },
  { icon: '🔒', title: 'Secure B2B Payments', desc: 'UPI, net banking, cards or cash on delivery — your choice.' },
]

export default function WhyChooseUs() {
  return (
    <section className="py-14 px-6 bg-gradient-to-b from-bg-page to-white">
      <div className="max-w-site mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-text-base mb-2">
            Why Businesses Choose ToolHaat
          </h2>
          <p className="text-text-muted text-sm md:text-base max-w-xl mx-auto">
            Built for procurement teams who need reliable supply, not just a checkout button.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {REASONS.map(r => (
            <div
              key={r.title}
              className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-border-light shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-accent-light flex items-center justify-center text-2xl mb-4">
                {r.icon}
              </div>
              <div className="font-heading font-bold text-[15px] text-text-base mb-1.5">{r.title}</div>
              <p className="text-text-muted text-xs leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
