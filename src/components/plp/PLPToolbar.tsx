'use client'
import { SORT_OPTIONS } from '@/lib/data/sortOptions'

interface PLPToolbarProps {
  count: number
  sortBy: string
  onSortChange: (val: string) => void
  viewMode: 'grid' | 'list'
  onViewChange: (mode: 'grid' | 'list') => void
  filtersOpen: boolean
  onToggleFilters: () => void
}

export default function PLPToolbar({
  count,
  sortBy,
  onSortChange,
  viewMode,
  onViewChange,
  filtersOpen,
  onToggleFilters,
}: PLPToolbarProps) {
  return (
    <div className="bg-white rounded-th border border-border-light px-4 py-3 flex items-center gap-3 mb-4">
      <button
        onClick={onToggleFilters}
        className="bg-transparent border border-border-light rounded py-1.5 px-2.5 cursor-pointer text-xs text-text-muted flex items-center gap-1.5 hover:border-accent transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        {filtersOpen ? 'Hide' : 'Show'} Filters
      </button>

      <span className="text-sm text-text-muted">
        <strong className="text-text-base">{count}</strong> products
      </span>

      <div className="ml-auto flex items-center gap-2">
        <span className="text-xs text-text-muted">Sort:</span>
        <select
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
          className="border border-border-light rounded px-2 py-1.5 text-xs text-text-base outline-none cursor-pointer"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <button
          onClick={() => onViewChange('grid')}
          className={`border rounded px-2 py-1.5 cursor-pointer text-sm transition-colors ${viewMode === 'grid' ? 'bg-dark border-dark text-white' : 'border-border-light text-text-muted'}`}
          aria-label="Grid view"
        >
          ⊞
        </button>
        <button
          onClick={() => onViewChange('list')}
          className={`border rounded px-2 py-1.5 cursor-pointer text-sm transition-colors ${viewMode === 'list' ? 'bg-dark border-dark text-white' : 'border-border-light text-text-muted'}`}
          aria-label="List view"
        >
          ☰
        </button>
      </div>
    </div>
  )
}
