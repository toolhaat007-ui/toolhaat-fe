export interface Category {
  slug: string
  name: string
  icon: string
  description: string
  skuCount: string
  subcategories: Subcategory[]
  seoTitle: string
  seoDescription: string
  keywords: string[]
}

export interface Subcategory {
  slug: string
  name: string
  icon: string
  productCount: number
}

export interface BulkTier {
  qty: string
  minQty: number
  price: number
  label: string
}

export interface Product {
  id: number
  slug: string
  name: string
  brand: string
  brandSlug: string
  price: number
  mrp: number
  moq: number
  rating: number
  reviews: number
  badge?: string
  category: string
  categorySlug: string
  subcategory?: string
  subcategorySlug?: string
  sku: string
  gst: number
  inStock: boolean
  specs: [string, string][]
  description: string
  bulkPricing: BulkTier[]
  inBox: string[]
  images: string[]
  tags: string[]
  metaTitle?: string
  metaDescription?: string
}

export interface Brand {
  slug: string
  name: string
  logo?: string
  productCount: number
  categories: string[]
  description: string
  verified: boolean
  established?: string
  origin?: string
}

export interface CartItem extends Product {
  quantity: number
  selectedTier: number
}

export interface FilterState {
  category: string
  subcategory: string
  priceRange: [number, number]
  rating: number
  brand: string
  inStock: boolean
  tags: string[]
}

export interface SortOption {
  value: string
  label: string
}

export interface Address {
  name: string
  company: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  pincode: string
  gstin: string
}

export interface Order {
  id: string
  date: string
  items: number
  total: number
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  hasGstInvoice: boolean
}

export type PaymentMethod = 'upi' | 'netbanking' | 'card' | 'cod'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  readTime: string
  tags: string[]
  image?: string
}
