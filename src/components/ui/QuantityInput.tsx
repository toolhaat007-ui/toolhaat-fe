'use client'
import { cn } from '@/lib/utils'

interface QuantityInputProps {
  value: number
  min?: number
  onChange: (val: number) => void
  className?: string
}

export default function QuantityInput({ value, min = 1, onChange, className }: QuantityInputProps) {
  return (
    <div className={cn('flex items-center border border-border-light rounded-th overflow-hidden', className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="bg-bg-muted border-none w-9 h-11 cursor-pointer text-lg font-bold text-text-base hover:bg-border-light transition-colors flex items-center justify-center"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        min={min}
        onChange={e => onChange(Math.max(min, parseInt(e.target.value) || min))}
        className="w-14 border-none text-center text-[15px] font-bold text-text-base outline-none bg-white"
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="bg-bg-muted border-none w-9 h-11 cursor-pointer text-lg font-bold text-text-base hover:bg-border-light transition-colors flex items-center justify-center"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}
