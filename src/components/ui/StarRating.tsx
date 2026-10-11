import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  reviews?: number
  size?: 'sm' | 'md'
  showCount?: boolean
  className?: string
}

export default function StarRating({ rating, reviews, size = 'sm', showCount = true, className }: StarRatingProps) {
  const starSize = size === 'sm' ? 'text-[11px]' : 'text-sm'

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex gap-px">
        {[1, 2, 3, 4, 5].map(s => (
          <span key={s} className={cn(starSize, s <= Math.round(rating) ? 'text-accent' : 'text-border-light')}>
            ★
          </span>
        ))}
      </div>
      {showCount && reviews !== undefined && (
        <span className="text-[11px] text-text-subtle">({reviews.toLocaleString()})</span>
      )}
    </div>
  )
}
