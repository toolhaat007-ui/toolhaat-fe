'use client'
import { cn } from '@/lib/utils'

interface ToggleProps {
  checked: boolean
  onChange: (val: boolean) => void
  label?: string
  description?: string
  className?: string
}

export default function Toggle({ checked, onChange, label, description, className }: ToggleProps) {
  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      {(label || description) && (
        <div>
          {label && <div className="text-sm font-bold text-text-base">{label}</div>}
          {description && <div className="text-xs text-text-muted">{description}</div>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1',
          checked ? 'bg-accent' : 'bg-border-light'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  )
}
