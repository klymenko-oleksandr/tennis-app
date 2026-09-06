import * as React from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

export type SlotStatus = "available" | "booked" | "unavailable"

export interface TimeSlot {
  time: string
  status: SlotStatus
}

/**
 * Baseline SlotPicker — the time-slot grid on court detail.
 *
 * There is no shadcn primitive for this, so it composes ToggleGroup
 * (single-select, roving focus and keyboard nav for free) rather than
 * a row of buttons. Three visual states beyond selected:
 *
 * · available   — white card, brand fill when selected
 * · booked      — struck through, non-interactive, still announced to SR
 * · unavailable — muted fill, dimmed (outside opening hours / blocked)
 *
 * Kept as one component rather than exporting a bare chip: a lone chip
 * has no meaning without the single-select group around it.
 */
export function SlotPicker({
  slots,
  value,
  onValueChange,
  className,
}: {
  slots: TimeSlot[]
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onValueChange?.(v)}
      className={cn("grid grid-cols-4 gap-1.5", className)}
    >
      {slots.map((slot) => {
        const disabled = slot.status !== "available"
        return (
          <ToggleGroupItem
            key={slot.time}
            value={slot.time}
            disabled={disabled}
            aria-label={`${slot.time}${
              slot.status === "booked"
                ? ", already booked"
                : slot.status === "unavailable"
                ? ", unavailable"
                : ""
            }`}
            className={cn(
              "h-11 rounded-[10px] border text-[13px] font-semibold transition-all",
              "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary",
              slot.status === "available" &&
                "bg-card text-foreground border-border hover:bg-accent",
              slot.status === "booked" &&
                "bg-transparent text-neutral-300 border-neutral-100 line-through",
              slot.status === "unavailable" &&
                "bg-secondary text-neutral-300 border-transparent opacity-60"
            )}
          >
            {slot.time}
          </ToggleGroupItem>
        )
      })}
    </ToggleGroup>
  )
}
