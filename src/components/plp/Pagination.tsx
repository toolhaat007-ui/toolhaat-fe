import Link from 'next/link'

interface PaginationProps {
  basePath: string
  page: number
  totalPages: number
}

function pageHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}?page=${page}`
}

/** Compact page list: first, last, current ±1, with `…` gaps. */
function buildPageList(page: number, totalPages: number): (number | '…')[] {
  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1])
  const sorted = [...pages].filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b)
  const withGaps: (number | '…')[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - (sorted[i - 1] as number) > 1) withGaps.push('…')
    withGaps.push(p)
  })
  return withGaps
}

export default function Pagination({ basePath, page, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-8" aria-label="Pagination">
      <Link
        href={pageHref(basePath, page - 1)}
        aria-disabled={page <= 1}
        className={`px-3 py-2 rounded border text-xs font-semibold no-underline transition-colors ${
          page <= 1
            ? 'pointer-events-none border-border-light text-text-subtle'
            : 'border-border-light text-text-muted hover:border-accent hover:text-accent'
        }`}
      >
        ← Prev
      </Link>

      {buildPageList(page, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="px-2 text-xs text-text-subtle">…</span>
        ) : (
          <Link
            key={p}
            href={pageHref(basePath, p)}
            className={`w-8 h-8 flex items-center justify-center rounded text-xs font-semibold no-underline transition-colors ${
              p === page
                ? 'bg-dark text-white'
                : 'border border-border-light text-text-muted hover:border-accent hover:text-accent'
            }`}
          >
            {p}
          </Link>
        ),
      )}

      <Link
        href={pageHref(basePath, page + 1)}
        aria-disabled={page >= totalPages}
        className={`px-3 py-2 rounded border text-xs font-semibold no-underline transition-colors ${
          page >= totalPages
            ? 'pointer-events-none border-border-light text-text-subtle'
            : 'border-border-light text-text-muted hover:border-accent hover:text-accent'
        }`}
      >
        Next →
      </Link>
    </nav>
  )
}
