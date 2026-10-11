'use client'
import Link from 'next/link'
import type { FilterState } from '@/types'

interface FilterSidebarProps {
  filters: FilterState
  onFilterChange: (filters: Partial<FilterState>) => void
  categorySlug?: string
  subcategories?: { slug: string; name: string }[]
}

export default function FilterSidebar({ filters, onFilterChange, categorySlug, subcategories = [] }: FilterSidebarProps) {
  const clearAll = () => onFilterChange({
    category: 'all',
    subcategory: 'all',
    priceRange: [0, 25000],
    rating: 0,
    brand: 'all',
    inStock: false,
    tags: [],
  })

  return (
    <aside className="w-[220px] flex-shrink-0">
      <div className="bg-white rounded-th-lg border border-border-light overflow-hidden">
        <div className="px-4 py-3.5 border-b border-border-light flex justify-between items-center">
          <span className="font-heading font-bold text-sm text-text-base">Filters</span>
          <button
            onClick={clearAll}
            className="text-accent text-xs font-semibold bg-transparent border-none cursor-pointer"
          >
            Clear All
          </button>
        </div>

        {/* Subcategories — real links to each subcategory's own page,
            not a client-side filter, so they're crawlable/bookmarkable */}
        {subcategories.length > 0 && categorySlug && (
          <div className="px-4 py-3.5 border-b border-bg-muted">
            <div className="font-bold text-[11px] text-text-base tracking-wider uppercase mb-2.5">
              Subcategory
            </div>
            <Link
              href={`/${categorySlug}`}
              className="block text-[13px] text-text-base font-semibold no-underline mb-2 hover:text-accent"
            >
              All
            </Link>
            {subcategories.map(sub => (
              <Link
                key={sub.slug}
                href={`/${categorySlug}/${sub.slug}`}
                className="block text-[13px] text-text-muted no-underline mb-2 hover:text-accent"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        {/* Price Range */}
        <div className="px-4 py-3.5 border-b border-bg-muted">
          <div className="font-bold text-[11px] text-text-base tracking-wider uppercase mb-2.5">
            Max Price
          </div>
          <input
            type="range"
            min={0}
            max={25000}
            step={500}
            value={filters.priceRange[1]}
            onChange={e => onFilterChange({ priceRange: [0, +e.target.value] })}
            className="w-full accent-[#2ec4b6]"
          />
          <div className="flex justify-between text-xs text-text-muted mt-1.5">
            <span>₹0</span>
            <span className="text-text-base font-semibold">₹{filters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* In Stock */}
        <div className="px-4 py-3.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={e => onFilterChange({ inStock: e.target.checked })}
              className="accent-[#2ec4b6]"
            />
            <span className="text-[13px] text-text-muted font-semibold">In Stock Only</span>
          </label>
        </div>
      </div>

      {/* RFQ sidebar CTA */}
      <div
        className="rounded-th-lg p-5 mt-3 text-center"
        style={{ background: 'linear-gradient(135deg, #1a2e35, #22404e)' }}
      >
        <div className="text-xl mb-2">📋</div>
        <div className="text-white font-heading font-bold text-sm mb-1.5">Need Bulk Order?</div>
        <div className="text-text-subtle text-[11px] mb-3">Get custom pricing for large quantities</div>
        <Link
          href="/rfq"
          className="block bg-accent text-dark rounded w-full py-2 text-xs font-bold no-underline text-center hover:bg-accent-dark transition-colors"
        >
          Request a Quote
        </Link>
      </div>
    </aside>
  )
}
