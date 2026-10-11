'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { useAuthStore } from '@/store/auth'
import { getMyOrders, cancelOrder } from '@/lib/api/orders'

interface Order {
  id: string
  orderNumber: string
  createdAt: string
  itemCount: number
  totalAmount: number
  status: string
  hasGstInvoice?: boolean
  paymentStatus?: string
}

const STATUS_COLOR: Record<string, string> = {
  DELIVERED: 'bg-accent/10 text-accent',
  PROCESSING: 'bg-amber-50 text-amber-700',
  CONFIRMED: 'bg-blue-50 text-blue-700',
  PENDING: 'bg-gray-50 text-gray-600',
  CANCELLED: 'bg-red-50 text-red-600',
  SHIPPED: 'bg-purple-50 text-purple-700',
  OUT_FOR_DELIVERY: 'bg-indigo-50 text-indigo-700',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function OrdersPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const authed = isAuthenticated()

  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const fetchOrders = async (p: number) => {
    setIsLoading(true)
    try {
      const res: any = await getMyOrders(p, 10)
      const items: Order[] = res?.items ?? res?.orders ?? (Array.isArray(res) ? res : [])
      if (p === 1) setOrders(items)
      else setOrders(prev => [...prev, ...items])
      setHasMore(items.length === 10)
    } catch {
      // Keep showing existing orders on error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!authed) { router.push('/auth/login'); return }
    fetchOrders(1)
  }, [authed, router])

  const handleCancel = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Cancel order ${orderNumber}?`)) return
    setCancellingId(orderId)
    try {
      await cancelOrder(orderId, 'Cancelled by customer')
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o))
    } catch (err: any) {
      alert(err.message || 'Could not cancel order.')
    } finally {
      setCancellingId(null)
    }
  }

  if (!authed) return null

  const canCancel = (status: string) => ['PENDING', 'CONFIRMED'].includes(status)

  return (
    <>
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'My Account', href: '/account' },
        { label: 'Orders' },
      ]} />
      <div className="bg-bg-page min-h-screen py-6 px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="flex justify-between items-center mb-5">
            <h1 className="font-heading font-extrabold text-2xl text-text-base">My Orders &amp; Repeat Lists</h1>
            <Link href="/search" className="bg-accent text-dark no-underline px-4 py-2 rounded-th font-bold text-sm hover:bg-accent-dark transition-colors">
              + New Order
            </Link>
          </div>

          {isLoading && orders.length === 0 ? (
            <div className="flex justify-center py-16">
              <span className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-th-lg border border-border-light">
              <div className="text-5xl mb-3">📦</div>
              <h2 className="font-heading font-bold text-lg text-text-base mb-2">No orders yet</h2>
              <p className="text-text-muted text-sm mb-4">Start shopping to see your orders here.</p>
              <Link href="/search" className="bg-accent text-dark no-underline px-6 py-2.5 rounded-th font-bold text-sm hover:bg-accent-dark transition-colors">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order.id} className="bg-white border border-border-light rounded-th-lg p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-heading font-bold text-sm text-text-base">{order.orderNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${STATUS_COLOR[order.status] ?? 'bg-gray-50 text-gray-600'}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      {order.hasGstInvoice && (
                        <span className="bg-accent/10 text-accent text-[10px] font-bold px-1.5 py-0.5 rounded">GST INVOICE</span>
                      )}
                    </div>
                    <div className="text-xs text-text-muted">{formatDate(order.createdAt)} · {order.itemCount} items</div>
                  </div>
                  <div className="text-right">
                    <div className="font-heading font-extrabold text-base text-text-base">
                      ₹{order.totalAmount?.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-dark text-white border-none rounded px-3.5 py-2 text-xs font-bold cursor-pointer hover:bg-mid transition-colors">
                      Reorder
                    </button>
                    {order.hasGstInvoice && (
                      <button className="bg-transparent border border-border-light rounded px-3 py-2 text-xs font-semibold cursor-pointer text-text-muted hover:border-accent transition-colors">
                        📋 Invoice
                      </button>
                    )}
                    {canCancel(order.status) && (
                      <button
                        disabled={cancellingId === order.id}
                        onClick={() => handleCancel(order.id, order.orderNumber)}
                        className="bg-transparent border border-red-200 rounded px-3 py-2 text-xs font-semibold cursor-pointer text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {cancellingId === order.id ? '…' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {hasMore && (
                <button
                  onClick={() => { const next = page + 1; setPage(next); fetchOrders(next) }}
                  disabled={isLoading}
                  className="w-full bg-white border border-border-light rounded-th py-3 text-sm font-semibold text-text-muted hover:border-accent hover:text-accent transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? 'Loading…' : 'Load More Orders'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
