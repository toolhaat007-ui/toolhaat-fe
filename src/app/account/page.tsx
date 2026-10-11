'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { useAuthStore } from '@/store/auth'
import { getMyOrders } from '@/lib/api/orders'

interface Order {
  id: string
  orderNumber: string
  createdAt: string
  itemCount: number
  totalAmount: number
  status: string
  hasGstInvoice?: boolean
}

const STATUS_COLOR: Record<string, string> = {
  DELIVERED: 'bg-accent/10 text-accent',
  PROCESSING: 'bg-amber-50 text-amber-700',
  CONFIRMED: 'bg-blue-50 text-blue-700',
  PENDING: 'bg-gray-50 text-gray-600',
  CANCELLED: 'bg-red-50 text-red-600',
  SHIPPED: 'bg-purple-50 text-purple-700',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function AccountPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const authed = isAuthenticated()

  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authed) {
      router.push('/auth/login')
      return
    }
    getMyOrders(1, 3)
      .then((res: any) => {
        const items = res?.items ?? res?.orders ?? res ?? []
        setOrders(Array.isArray(items) ? items.slice(0, 3) : [])
      })
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false))
  }, [authed, router])

  if (!authed) return null

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || 'U'
  const displayName = user?.companyName || `${user?.firstName} ${user?.lastName}`

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'My Account' }]} />
      <div className="bg-bg-page min-h-screen py-6 px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">
            {/* Sidebar */}
            <div className="bg-white rounded-th-lg border border-border-light p-5 self-start">
              <div className="text-center mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center mx-auto mb-2.5 font-heading font-black text-xl text-dark">
                  {initials}
                </div>
                <div className="font-heading font-bold text-sm text-text-base">{displayName}</div>
                {user?.gstin && <div className="text-xs text-text-subtle">GSTIN: {user.gstin}</div>}
                <div className="text-xs text-text-subtle mt-0.5">{user?.email}</div>
              </div>
              <div className="space-y-1">
                {[
                  ['📦', 'My Orders', '/account/orders'],
                  ['🔄', 'Repeat Orders', '/account/orders'],
                  ['📋', 'Request Quote', '/rfq'],
                  ['🏠', 'Addresses', '#'],
                  ['👤', 'Account Settings', '#'],
                ].map(([icon, label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="flex items-center gap-2 px-2 py-2.5 text-sm text-text-base font-semibold rounded hover:bg-bg-muted transition-colors no-underline"
                  >
                    <span>{icon}</span><span>{label}</span>
                  </Link>
                ))}
                <button
                  onClick={async () => { await logout(); router.push('/') }}
                  className="w-full flex items-center gap-2 px-2 py-2.5 text-sm text-red-500 font-semibold rounded hover:bg-bg-muted transition-colors bg-transparent border-none cursor-pointer text-left"
                >
                  <span>🚪</span><span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Main content */}
            <div className="space-y-4">
              {/* Account summary */}
              <div className="bg-white rounded-th-lg border border-border-light p-5">
                <h2 className="font-heading font-extrabold text-base text-text-base mb-4">Business Account</h2>
                <div className="grid grid-cols-2 gap-4">
                  {(([
                    ['Name', `${user?.firstName} ${user?.lastName}`],
                    user?.companyName ? ['Company', user.companyName] : null,
                    user?.gstin ? ['GSTIN', user.gstin] : null,
                    user?.creditLimit ? ['Credit Line', `₹${user.creditLimit.toLocaleString('en-IN')}`] : null,
                    user?.paymentTerms ? ['Payment Terms', user.paymentTerms] : null,
                    ['Role', user?.role === 'buyer' ? 'B2B Buyer' : user?.role ?? 'Buyer'],
                  ] as (string[] | null)[]).filter((x): x is string[] => x !== null).map(([k, v]) => (
                    <div key={k} className="bg-bg-muted rounded p-3">
                      <div className="text-[11px] text-text-subtle font-semibold uppercase tracking-wide mb-0.5">{k}</div>
                      <div className="text-sm font-bold text-text-base">{v}</div>
                    </div>
                  ))
                )}
                </div>
              </div>

              {/* Quick actions */}
              <div className="rounded-th-lg p-5" style={{ background: 'linear-gradient(135deg, #1a2e35, #22404e)' }}>
                <div className="text-accent font-heading font-extrabold text-xl mb-1">Your Account</div>
                <div className="text-text-subtle text-xs mb-4">Manage orders, repeat purchases, and quotes</div>
                <Link
                  href="/account/orders"
                  className="bg-accent text-dark no-underline px-5 py-2.5 rounded-th font-bold text-sm inline-block hover:bg-accent-dark transition-colors"
                >
                  View All Orders
                </Link>
              </div>

              {/* Recent orders */}
              <div className="bg-white rounded-th-lg border border-border-light p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-heading font-extrabold text-base text-text-base">Recent Orders</h3>
                  <Link href="/account/orders" className="text-accent text-sm font-semibold no-underline">View All →</Link>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <span className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-3xl mb-2">📦</div>
                    <p className="text-text-muted text-sm">No orders yet.</p>
                    <Link href="/search" className="text-accent text-sm font-semibold no-underline hover:underline mt-2 inline-block">
                      Start Shopping →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map(order => (
                      <div key={order.id} className="flex items-center gap-4 p-3.5 border border-border-light rounded-th">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-heading font-bold text-sm text-text-base">{order.orderNumber}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${STATUS_COLOR[order.status] ?? 'bg-gray-50 text-gray-600'}`}>
                              {order.status}
                            </span>
                            {order.hasGstInvoice && (
                              <span className="bg-accent/10 text-accent text-[10px] font-bold px-1.5 py-0.5 rounded">GST</span>
                            )}
                          </div>
                          <div className="text-xs text-text-muted">{formatDate(order.createdAt)} · {order.itemCount} items</div>
                        </div>
                        <div className="text-right">
                          <div className="font-heading font-extrabold text-base text-text-base">₹{order.totalAmount?.toLocaleString('en-IN')}</div>
                        </div>
                        <div className="flex gap-1.5">
                          <button className="bg-dark text-white border-none rounded px-3 py-1.5 text-xs font-bold cursor-pointer hover:bg-mid transition-colors">
                            Reorder
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
