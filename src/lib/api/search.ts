import { apiFetch, api } from './client'
import type { Product } from '@/types'

export interface SearchQuery {
  q?: string
  category?: string
  brand?: string | string[]
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  attributes?: Record<string, string | string[]>
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

export interface SearchResult {
  items: Product[]
  total: number
  page: number
  totalPages: number
  aggregations?: {
    brands?: { buckets: { key: string; doc_count: number }[] }
    price_stats?: { min: number; max: number; avg: number }
    attributes?: any
  }
}

// Client-side search (from PLPClient / SearchPage)
export async function searchProducts(query: SearchQuery): Promise<SearchResult | null> {
  try {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([k, v]) => {
      if (v == null) return
      if (Array.isArray(v)) v.forEach(val => params.append(k, val))
      else params.set(k, String(v))
    })
    return await api.get<SearchResult>(`/search/products?${params}`)
  } catch {
    return null
  }
}

// Autocomplete suggestions
export async function getSuggestions(q: string, limit = 8): Promise<string[]> {
  try {
    return await api.get<string[]>(`/search/suggest?q=${encodeURIComponent(q)}&limit=${limit}`)
  } catch {
    return []
  }
}
