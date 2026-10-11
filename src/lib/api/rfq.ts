import { api } from './client'

export interface RfqItem {
  productId?: string
  sku?: string
  productName: string
  quantity: number
  targetPrice?: number
  notes?: string
}

export interface CreateRfqPayload {
  contactName: string
  contactEmail: string
  contactPhone: string
  companyName?: string
  gstin?: string
  items: RfqItem[]
  message?: string
  requiredByDate?: string
  deliveryCity?: string
  deliveryPincode?: string
}

export async function submitRfq(payload: CreateRfqPayload) {
  return api.post('/rfq', payload)
}

export async function getMyRfqs() {
  return api.get('/rfq/my')
}
