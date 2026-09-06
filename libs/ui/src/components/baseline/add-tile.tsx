import * as React from "react"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AddTileProps {
  label: string
  onClick?: () => void
  variant?: "tile" | "bar"
  className?: string
}

/**
 * Baseline AddTile — the dashed-border "add" affordance in admin grids
 * (Admin.dc.html): a square tile with icon + label (courts grid), or a
 * full-width bar with a text-only "+ label" (coaches list).
 */
export function AddTile({ label, onClick, variant = "tile", className }: AddTileProps) {
  if (variant === "bar") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "w-full rounded-2xl border-[1.5px] border-dashed border-neutral-150 px-[18px] py-[18px] text-sm font-semibold text-neutral-400",
          className
        )}
      >
        + {label}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex min-h-[220px] flex-col items-center justify-center gap-2.5 rounded-2xl border-[1.5px] border-dashed border-neutral-150 text-neutral-400",
        className
      )}
    >
      <Plus className="size-[26px]" />
      <span className="text-sm font-semibold">{label}</span>
    </button>
  )
}
