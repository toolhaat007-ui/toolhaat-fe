import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calcDiscount(price: number, mrp: number): number {
  return Math.round((1 - price / mrp) * 100)
}

export function formatPrice(amount: number): string {
  return amount.toLocaleString('en-IN')
}

export function calcGst(price: number, qty: number, gstRate: number): number {
  return Math.round(price * qty * gstRate / 100)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getActiveTier(qty: number, tiers: { minQty: number; price: number }[]): number {
  return tiers.reduce((best, tier, i) => {
    if (qty >= tier.minQty) return i
    return best
  }, 0)
}

export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + '...' : str
}
