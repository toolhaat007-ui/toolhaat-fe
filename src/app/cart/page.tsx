import type { Metadata } from 'next'
import Breadcrumb from '@/components/layout/Breadcrumb'
import CartClient from '@/components/cart/CartClient'

export const metadata: Metadata = {
  title: 'Shopping Cart | ToolHaat',
  description: 'Review your cart and proceed to checkout. Bulk pricing, GST invoices and fast delivery.',
  robots: { index: false, follow: false },
}

export default function CartPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Shopping Cart' }]} />
      <CartClient />
    </>
  )
}
