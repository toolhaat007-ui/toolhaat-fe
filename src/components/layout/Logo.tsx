import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

export default function Logo({ size = 'md', className }: LogoProps) {
  const badgeSizes = { sm: 'w-8 h-8 text-base', md: 'w-10 h-10 text-lg', lg: 'w-12 h-12 text-xl' }
  const textSizes = { sm: 'text-base', md: 'text-lg', lg: 'text-xl' }

  return (
    <Link href="/" className={cn('flex items-center gap-2.5 no-underline group', className)}>
      <div
        className={cn(
          'rounded-[10px] bg-gradient-to-br from-accent to-accent-dark flex flex-col items-center justify-center flex-shrink-0 gap-0.5',
          '[perspective:120px]',
          badgeSizes[size]
        )}
        style={{ perspective: '120px' }}
      >
        <span
          className="text-white font-black leading-none tracking-tight font-heading animate-dice"
          style={{ fontSize: size === 'sm' ? '14px' : size === 'md' ? '18px' : '22px' }}
        >
          t
        </span>
        <div className="w-1 h-1 bg-white/90 rounded-full animate-dot-bounce" />
      </div>
      <div>
        <div className={cn('text-white font-heading font-extrabold tracking-tight leading-none', textSizes[size])}>
          ToolHaat
        </div>
        <div className="text-accent text-[9px] tracking-[0.1em] uppercase mt-0.5">
          Powering Your Business Growth
        </div>
      </div>
    </Link>
  )
}
