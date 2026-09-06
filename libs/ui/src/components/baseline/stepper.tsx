import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Baseline Stepper — the quantity −/+ control (booking flow "Players"
 * count). Note the buttons are squared (rounded-lg), not fully round,
 * per the prototype.
 */
export function Stepper({
  value,
  onValueChange,
  min = 1,
  max,
  className,
}: {
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3.5 rounded-[13px] border border-border bg-card px-3 py-[7px]",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onValueChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease"
        className="flex size-[26px] items-center justify-center rounded-lg bg-muted text-lg leading-none text-foreground disabled:opacity-40"
      >
        −
      </button>
      <span className="min-w-[14px] text-center text-base font-semibold text-foreground">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onValueChange(max !== undefined ? Math.min(max, value + 1) : value + 1)}
        disabled={max !== undefined && value >= max}
        aria-label="Increase"
        className="flex size-[26px] items-center justify-center rounded-lg bg-muted text-lg leading-none text-foreground disabled:opacity-40"
      >
        +
      </button>
    </div>
  )
}
