'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'
import { getActiveTier } from '@/lib/utils'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  removeItem: (productId: number) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity) => {
        set(state => {
          const existing = state.items.find(i => i.id === product.id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === product.id
                  ? {
                      ...i,
                      quantity: i.quantity + quantity,
                      selectedTier: getActiveTier(i.quantity + quantity, product.bulkPricing),
                    }
                  : i
              ),
            }
          }
          const selectedTier = getActiveTier(quantity, product.bulkPricing)
          return {
            items: [...state.items, { ...product, quantity, selectedTier }],
          }
        })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set(state => ({
          items: state.items.map(i => {
            if (i.id !== productId) return i
            const selectedTier = getActiveTier(quantity, i.bulkPricing)
            return { ...i, quantity, selectedTier }
          }),
        }))
      },

      removeItem: productId => {
        set(state => ({ items: state.items.filter(i => i.id !== productId) }))
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((s, i) => {
          const price = i.bulkPricing[i.selectedTier]?.price ?? i.price
          return s + price * i.quantity
        }, 0),
    }),
    {
      name: 'toolhaat-cart',
    }
  )
)
