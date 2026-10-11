import { cn } from '@/lib/utils'

interface BadgeProps {
  label: string
  variant?: 'accent' | 'dark' | 'error' | 'blue' | 'success'
  className?: string
}

export default function Badge({ label, variant = 'accent', className }: BadgeProps) {
  const variants = {
    accent: 'bg-accent text-dark',
    dark: 'bg-dark text-white',
    error: 'bg-error text-white',
    blue: 'bg-blue-600 text-white',
    success: 'bg-emerald-600 text-white',
  }

  return (
    <span className={cn('inline-block text-[10px] font-bold px-2 py-0.5 rounded', variants[variant], className)}>
      {label}
    </span>
  )
}

export function DiscountBadge({ percent }: { percent: number }) {
  return (
    <span className="inline-block bg-error text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
      -{percent}%
    </span>
  )
}

export function GstBadge() {
  return (
    <span className="inline-block bg-accent/10 border border-accent/30 text-accent text-[10px] font-bold px-1.5 py-0.5 rounded">
      GST READY
    </span>
  )
}

export function StockBadge({ inStock }: { inStock: boolean }) {
  return (
    <span className={cn('inline-block text-[10px] font-bold px-2 py-0.5 rounded',
      inStock ? 'bg-accent/10 text-accent' : 'bg-error/10 text-error'
    )}>
      {inStock ? 'In Stock' : 'Out of Stock'}
    </span>
  )
}
