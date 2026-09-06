import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChoiceChipProps extends React.ComponentProps<"button"> {
  selected?: boolean
}

/**
 * Baseline ChoiceChip — the generic pill-button filter/picker used for
 * surface & indoor filters, NTRP level pickers, date/duration chips.
 * Distinct from SlotChip: this one carries arbitrary labels, not just
 * time slots, and has no booked/unavailable state — just selected/not.
 */
export function ChoiceChip({ selected = false, className, ...props }: ChoiceChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "rounded-[11px] border px-3.5 py-[9px] text-[13px] font-semibold transition-colors",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-neutral-800 hover:bg-secondary/60",
        className
      )}
      {...props}
    />
  )
}
