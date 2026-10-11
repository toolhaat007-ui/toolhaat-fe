'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from './Logo'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { useLoginModal } from '@/context/LoginModalContext'
import type { ApiCategory } from '@/lib/api/categories'

export default function Header({ categories }: { categories: ApiCategory[] }) {
  const router = useRouter()
  const cartCount = useCartStore(s => s.getItemCount())
  const { user, isAuthenticated, logout } = useAuthStore()
  const { openLogin } = useLoginModal()
  const authed = isAuthenticated()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [megaMenuCategory, setMegaMenuCategory] = useState<string | null>(null)
  const [navHoverCategory, setNavHoverCategory] = useState<string | null>(null)

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
    router.push('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
      setMobileSearchOpen(false)
    }
  }

  return (
    <>
      {/* ───────────────────────── Mobile header (< md) ───────────────────────── */}
      <header className="md:hidden bg-dark sticky top-0 z-50 shadow-header font-sans">
        <div className="bg-dark px-4 py-2.5 flex items-center gap-2.5">
          <button
            onClick={() => setMenuOpen(m => !m)}
            className="bg-transparent border-none cursor-pointer text-slate-300 p-1 flex-shrink-0"
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
              }
            </svg>
          </button>

          <Logo size="sm" className="flex-1" />

          <div className="flex gap-1">
            <button
              onClick={() => setMobileSearchOpen(s => !s)}
              className="bg-transparent border-none cursor-pointer text-slate-400 p-1.5"
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <Link href="/cart" className="relative p-1.5 text-slate-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-error text-white rounded-full w-4 h-4 text-[9px] font-bold flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {mobileSearchOpen && (
          <div className="bg-mid px-4 py-2.5">
            <form onSubmit={handleSearch} className="flex bg-white rounded overflow-hidden">
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tools, equipment..."
                className="flex-1 border-none outline-none px-3.5 py-2.5 text-sm text-dark"
              />
              <button type="submit" className="bg-accent border-none cursor-pointer px-3.5 text-white flex items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </form>
          </div>
        )}

        {menuOpen && (
          <div className="bg-dark border-t border-mid absolute left-0 right-0 z-50 shadow-xl max-h-[calc(100dvh-56px)] overflow-y-auto">
            <div className="py-2">
              {[
                { label: 'Home', href: '/', icon: '🏠' },
                ...categories.map(c => ({ label: c.name, href: `/${c.slug}`, icon: c.icon || '📦' })),
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 text-slate-300 text-sm font-semibold hover:bg-mid transition-colors no-underline"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            <div className="border-t border-mid py-2">
              {authed ? (
                <>
                  {[['👤', `Hi, ${user?.firstName}`, '/account'], ['📦', 'My Orders', '/account/orders'], ['📋', 'Request Quote', '/rfq']].map(([icon, label, href]) => (
                    <Link key={label} href={href} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-5 py-3 text-slate-400 text-sm font-semibold hover:bg-mid transition-colors no-underline">
                      <span>{icon}</span><span>{label}</span>
                    </Link>
                  ))}
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 text-slate-400 text-sm font-semibold hover:bg-mid transition-colors bg-transparent border-none cursor-pointer">
                    <span>🚪</span><span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setMenuOpen(false); openLogin() }}
                    className="w-full flex items-center gap-3 px-5 py-3 text-slate-400 text-sm font-semibold hover:bg-mid transition-colors bg-transparent border-none cursor-pointer"
                  >
                    <span>👤</span><span>Sign In</span>
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); openLogin() }}
                    className="w-full flex items-center gap-3 px-5 py-3 text-slate-400 text-sm font-semibold hover:bg-mid transition-colors bg-transparent border-none cursor-pointer"
                  >
                    <span>✨</span><span>Register Free</span>
                  </button>
                  <Link href="/rfq" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-5 py-3 text-slate-400 text-sm font-semibold hover:bg-mid transition-colors no-underline">
                    <span>📋</span><span>Request Quote</span>
                  </Link>
                </>
              )}
            </div>
            <div className="px-4 py-3 border-t border-mid">
              <Link href="/rfq" onClick={() => setMenuOpen(false)} className="block w-full bg-accent text-dark text-center font-heading font-extrabold py-3 rounded-th text-sm no-underline">
                Shop Now →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ───────────────────────── Desktop header (>= md) ───────────────────────── */}
      <header className="hidden md:block bg-dark sticky top-0 z-50 shadow-header font-sans">
        {/* Top bar */}
        <div className="bg-footer-bg px-6 py-1.5 flex justify-between items-center text-[11px] text-text-subtle">
          <span>🇮🇳 GST Invoices Available &nbsp;|&nbsp; Free delivery on orders above ₹2,000 &nbsp;|&nbsp; Secure B2B Payments</span>
          <div className="flex gap-2 items-center">
            {authed ? (
              <>
                <span className="text-accent font-semibold">Hi, {user?.firstName}</span>
                <span className="text-mid-2">|</span>
                <Link href="/account" className="text-text-subtle hover:text-accent transition-colors no-underline">My Account</Link>
                <span className="text-mid-2">|</span>
                <Link href="/account/orders" className="text-text-subtle hover:text-accent transition-colors no-underline">Orders</Link>
                <span className="text-mid-2">|</span>
                <button onClick={handleLogout} className="bg-transparent border-none text-text-subtle hover:text-accent transition-colors cursor-pointer text-[11px] p-0">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => openLogin()} className="bg-transparent border-none text-text-subtle hover:text-accent transition-colors cursor-pointer text-[11px] p-0">Sign In</button>
                <span className="text-mid-2">|</span>
                <button onClick={() => openLogin()} className="bg-transparent border-none text-accent font-semibold hover:text-accent-dark transition-colors cursor-pointer text-[11px] p-0">Register Free</button>
                <span className="text-mid-2">|</span>
                <Link href="/track-order" className="text-text-subtle hover:text-accent transition-colors no-underline">Track Order</Link>
              </>
            )}
          </div>
        </div>

        {/* Main header */}
        <div className="px-6 py-3 flex items-center gap-5">
          <Logo size="md" className="flex-shrink-0" />

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 flex max-w-2xl">
            <select className="bg-mid border border-mid text-text-subtle px-3 text-xs rounded-l-[6px] cursor-pointer outline-none whitespace-nowrap">
              <option>All Categories</option>
              {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
            <div className="flex-1 flex bg-white rounded-r-[6px] overflow-hidden">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tools, equipment, supplies..."
                className="flex-1 border-none outline-none px-3.5 py-2.5 text-sm text-dark bg-transparent"
              />
              <button type="submit" className="bg-accent border-none cursor-pointer px-4 text-white flex items-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex gap-1 flex-shrink-0">
            {authed ? (
              <Link href="/account" className="flex flex-col items-center gap-0.5 p-2 rounded-th text-[#a8d0d0] hover:text-accent transition-colors no-underline">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-[10px] tracking-wide">{user?.firstName?.split(' ')[0] || 'Account'}</span>
              </Link>
            ) : (
              <button onClick={() => openLogin()} className="flex flex-col items-center gap-0.5 p-2 rounded-th text-[#a8d0d0] hover:text-accent transition-colors bg-transparent border-none cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-[10px] tracking-wide">Sign In</span>
              </button>
            )}
            <Link href="/rfq" className="flex flex-col items-center gap-0.5 p-2 rounded-th text-[#a8d0d0] hover:text-accent transition-colors no-underline">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span className="text-[10px] tracking-wide">RFQ</span>
            </Link>
            <Link href="/cart" className="relative flex flex-col items-center gap-0.5 bg-accent text-dark p-2 px-3.5 rounded-th font-bold transition-all hover:bg-accent-dark no-underline">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-error text-white rounded-full w-4 h-4 text-[9px] font-bold flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
              <span className="text-[10px] tracking-wide">Cart</span>
            </Link>
          </div>
        </div>

        {/* Nav bar */}
        <nav className="bg-[#1c3540] border-t border-mid">
          <div className="px-6 flex items-center gap-1 max-w-site mx-auto">
            <div className="relative">
              <button
                onClick={() => setMenuOpen(m => !m)}
                className="flex items-center gap-2 bg-accent text-white font-bold text-[13px] px-4 py-2.5 border-none cursor-pointer flex-shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                All Categories
              </button>
              {menuOpen && (
                <div
                  className="absolute top-full left-0 flex bg-white shadow-xl border border-border-light rounded-b-th-lg z-50"
                  onMouseLeave={() => setMegaMenuCategory(null)}
                >
                  {/* Left panel — all categories */}
                  <div className="min-w-[220px] border-r border-border-light">
                    {categories.map(c => (
                      <div
                        key={c.slug}
                        onMouseEnter={() => setMegaMenuCategory(c.slug)}
                        className={`flex items-center justify-between gap-3 border-b border-border-light last:border-0 transition-colors ${
                          megaMenuCategory === c.slug ? 'bg-bg-muted' : ''
                        }`}
                      >
                        <Link
                          href={`/${c.slug}`}
                          onClick={() => setMenuOpen(false)}
                          className="flex-1 flex items-center gap-3 px-4 py-3 text-text-base text-sm font-semibold hover:text-accent transition-colors no-underline"
                        >
                          <span className="text-base">{c.icon || '📦'}</span>
                          <span>{c.name}</span>
                        </Link>
                        {(c.children?.length ?? 0) > 0 && (
                          <span className="text-text-subtle text-xs pr-3">›</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Right panel — subcategories of hovered category (Moglix-style flyout) */}
                  {megaMenuCategory && (() => {
                    const active = categories.find(c => c.slug === megaMenuCategory)
                    if (!active?.children?.length) return null
                    return (
                      <div className="min-w-[240px] p-4">
                        <div className="text-[11px] font-bold text-text-subtle uppercase tracking-wider mb-2">
                          {active.name}
                        </div>
                        <div className="grid grid-cols-1 gap-0.5">
                          {active.children.map(sub => (
                            <Link
                              key={sub.slug}
                              href={`/${active.slug}/${sub.slug}`}
                              onClick={() => setMenuOpen(false)}
                              className="px-2 py-1.5 rounded text-text-muted text-[13px] hover:bg-bg-muted hover:text-accent-dark transition-colors no-underline"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
            <div className="flex gap-0 flex-1">
              {categories.slice(0, 5).map(c => (
                <div
                  key={c.slug}
                  className="relative"
                  onMouseEnter={() => setNavHoverCategory(c.slug)}
                  onMouseLeave={() => setNavHoverCategory(null)}
                >
                  <Link
                    href={`/${c.slug}`}
                    className="text-text-subtle text-[13px] px-3.5 py-2.5 hover:text-accent transition-colors whitespace-nowrap no-underline block"
                  >
                    {c.name}
                  </Link>
                  {navHoverCategory === c.slug && (c.children?.length ?? 0) > 0 && (
                    <div className="absolute top-full left-0 bg-white shadow-xl border border-border-light rounded-b-th-lg z-50 min-w-[200px] py-1.5">
                      {c.children!.map(sub => (
                        <Link
                          key={sub.slug}
                          href={`/${c.slug}/${sub.slug}`}
                          className="block px-3.5 py-2 text-text-muted text-[13px] hover:bg-bg-muted hover:text-accent-dark transition-colors no-underline"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link href="/rfq" className="text-text-subtle text-[13px] px-3.5 py-2.5 hover:text-accent transition-colors whitespace-nowrap no-underline">
                Bulk Deals
              </Link>
            </div>
            <div className="ml-auto">
              <span className="text-[11px] text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full">
                ⚡ Bulk Pricing Active
              </span>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}
