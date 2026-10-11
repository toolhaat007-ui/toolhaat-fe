import { api } from './client'

export interface ServerCart {
  id: string
  userId?: string
  sessionId?: string
  couponCode?: string
  couponDiscount?: number
  requestGstInvoice?: boolean
  items: ServerCartItem[]
  summary: {
    subtotal: number
    gstAmount: number
    shippingAmount: number
    discountAmount: number
    couponDiscount: number
    total: number
    isFreeShipping: boolean
  }
}

export interface ServerCartItem {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  mrp: number
  gstRate: number
  product: {
    id: string
    name: string
    slug: string
    sku: string
    primaryImage?: string
    brand?: { name: string }
    category?: { slug: string }
    moq: number
  }
}

// Get or create cart (pass userId or sessionId)
export async function getOrCreateCart(userId?: string, sessionId?: string): Promise<ServerCart> {
  const params = sessionId ? `?sessionId=${sessionId}` : ''
  return api.get<ServerCart>(`/cart${params}`)
}

export async function addToCart(cartId: string, productId: string, quantity: number): Promise<ServerCart> {
  return api.post<ServerCart>(`/cart/${cartId}/items`, { productId, quantity })
}

export async function updateCartItem(cartId: string, itemId: string, quantity: number): Promise<ServerCart> {
  return api.put<ServerCart>(`/cart/${cartId}/items/${itemId}`, { quantity })
}

export async function removeCartItem(cartId: string, itemId: string): Promise<ServerCart> {
  return api.delete<ServerCart>(`/cart/${cartId}/items/${itemId}`)
}

export async function applyCoupon(cartId: string, couponCode: string): Promise<ServerCart> {
  return api.post<ServerCart>(`/cart/${cartId}/coupon`, { couponCode })
}

export async function removeCoupon(cartId: string): Promise<ServerCart> {
  return api.delete<ServerCart>(`/cart/${cartId}/coupon`)
}

export async function mergeGuestCart(sessionId: string): Promise<ServerCart> {
  return api.post<ServerCart>('/cart/merge', { sessionId })
}
