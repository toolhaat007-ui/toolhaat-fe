import { api } from './client'

export interface CreateOrderPayload {
  paymentMethod: 'razorpay' | 'net_banking' | 'neft' | 'credit' | 'cod' | 'cheque'
  shippingAddress: {
    name: string
    phone: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    pincode: string
    country?: string
  }
  billingAddress?: CreateOrderPayload['shippingAddress']
  requestGstInvoice?: boolean
  buyerGstin?: string
  notes?: string
}

export async function createOrder(cartId: string, payload: CreateOrderPayload) {
  return api.post(`/orders/from-cart/${cartId}`, payload)
}

export async function getMyOrders(page = 1, limit = 10) {
  return api.get(`/orders?page=${page}&limit=${limit}`)
}

export async function getOrderById(id: string) {
  return api.get(`/orders/${id}`)
}

export async function cancelOrder(id: string, reason: string) {
  return api.patch(`/orders/${id}/cancel`, { reason })
}
