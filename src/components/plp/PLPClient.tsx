'use client'
import { useState, useMemo } from 'react'
import type { Product, FilterState } from '@/types'
import FilterSidebar from './FilterSidebar'
import PLPToolbar from './PLPToolbar'
import ProductCard from '@/components/product/ProductCard'
import ProductListItem from '@/components/product/ProductListItem'

interface PLPClientProps {
  products: Product[]
  categorySlug?: string
  initialCategory?: string
  initialSubcategory?: string
  subcategories?: { slug: string; name: string }[]
  /** True total across all pages (products is just the current page's 100). */
  totalCount?: number
}

const DEFAULT_FILTERS: FilterState = {
  category: 'all',
  subcategory: 'all',
  priceRange: [0, 25000],
  rating: 0,
  brand: 'all',
  inStock: false,
  tags: [],
}

export default function PLPClient({ products, categorySlug, initialCategory, initialSubcategory, subcategories, totalCount }: PLPClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    category: initialCategory || 'all',
    subcategory: initialSubcategory || 'all',
  })
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filtersOpen, setFiltersOpen] = useState(true)

  const updateFilters = (partial: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...partial }))
  }

  const filtered = useMemo(() => {
    let result = products
      .filter(p => filters.subcategory === 'all' || p.subcategorySlug === filters.subcategory)
      .filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])
      .filter(p => filters.brand === 'all' || p.brandSlug === filters.brand)
      .filter(p => !filters.inStock || p.inStock)

    switch (sortBy) {
      case 'price_asc': result = result.sort((a, b) => a.price - b.price); break
      case 'price_desc': result = result.sort((a, b) => b.price - a.price); break
      case 'discount': result = result.sort((a, b) => (1 - b.price / b.mrp) - (1 - a.price / a.mrp)); break
    }

    return result
  }, [products, filters, sortBy])

  const activeFilterCount = [
    filters.subcategory !== 'all',
    filters.brand !== 'all',
    filters.inStock,
    filters.priceRange[1] < 25000,
  ].filter(Boolean).length

  return (
    <div className="flex gap-5 items-start">
      {/* Sidebar — hidden on mobile */}
      {filtersOpen && (
        <div className="hidden md:block">
          <FilterSidebar
            filters={filters}
            onFilterChange={updateFilters}
            categorySlug={categorySlug}
            subcategories={subcategories}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <PLPToolbar
          count={activeFilterCount > 0 || !totalCount ? filtered.length : totalCount}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewChange={setViewMode}
          filtersOpen={filtersOpen}
          onToggleFilters={() => setFiltersOpen(f => !f)}
        />

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex gap-2 flex-wrap mb-3">
            {filters.subcategory !== 'all' && (
              <button onClick={() => updateFilters({ subcategory: 'all' })} className="bg-accent text-dark text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer border-none">
                {filters.subcategory} ×
              </button>
            )}
            {filters.brand !== 'all' && (
              <button onClick={() => updateFilters({ brand: 'all' })} className="bg-dark text-white text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer border-none">
                {filters.brand} ×
              </button>
            )}
            {filters.inStock && (
              <button onClick={() => updateFilters({ inStock: false })} className="bg-dark text-white text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer border-none">
                In Stock ×
              </button>
            )}
          </div>
        )}

        {/* Product grid / list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <div className="text-5xl mb-4">🔍</div>
            <div className="font-heading font-bold text-xl text-text-base mb-2">No products match your filters</div>
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="bg-accent text-dark border-none px-5 py-2.5 rounded-th font-bold cursor-pointer text-sm mt-2 hover:bg-accent-dark transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map(p => <ProductListItem key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
