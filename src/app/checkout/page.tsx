import type { Metadata } from 'next'
import Breadcrumb from '@/components/layout/Breadcrumb'
import CheckoutClient from '@/components/checkout/CheckoutClient'

export const metadata: Metadata = {
  title: 'Checkout | ToolHaat',
  description: 'Complete your B2B order on ToolHaat. Secure checkout with GST invoice.',
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
      <CheckoutClient />
    </>
  )
}
