import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  rightElement?: React.ReactNode
}

export default function Breadcrumb({ items, rightElement }: BreadcrumbProps) {
  return (
    <div className="bg-white border-b border-border-light px-6 py-2.5">
      <div className="max-w-site mx-auto flex items-center justify-between">
        <nav className="flex items-center gap-1.5 text-xs text-text-muted">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-border-light">›</span>}
              {item.href ? (
                <Link href={item.href} className="hover:text-accent transition-colors no-underline">
                  {item.label}
                </Link>
              ) : (
                <span className="text-text-base font-semibold">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
        {rightElement && <div>{rightElement}</div>}
      </div>
    </div>
  )
}
