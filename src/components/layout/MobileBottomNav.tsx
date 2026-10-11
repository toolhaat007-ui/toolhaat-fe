'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'

const NAV_ITEMS = [
  {
    label: 'Home',
    href: '/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: 'Shop',
    href: '/search',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    label: 'Cart',
    href: '/cart',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    badge: true,
  },
  {
    label: 'RFQ',
    href: '/rfq',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: 'Account',
    href: '/account',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const cartCount = useCartStore(s => s.getItemCount())

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark border-t border-mid z-50 flex pb-safe-bottom">
      {NAV_ITEMS.map(item => {
        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex-1 flex flex-col items-center gap-1 py-2.5 px-1 relative no-underline transition-colors
              ${isActive ? 'text-accent' : 'text-text-subtle'}
            `}
          >
            {item.icon}
            <span className="text-[10px] font-semibold font-sans">{item.label}</span>
            {item.badge && cartCount > 0 && (
              <span className="absolute top-1.5 right-3.5 bg-error text-white rounded-full w-4 h-4 text-[9px] font-bold flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
            {isActive && (
              <div className="absolute bottom-0 left-[20%] right-[20%] h-0.5 bg-accent rounded-t" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
