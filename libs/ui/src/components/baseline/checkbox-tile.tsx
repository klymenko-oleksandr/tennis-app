import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Baseline CheckboxTile — the square check-box used for booking add-ons
 * ("Racket rental", "Ball tube"). Deliberately distinct from the round
 * `Switch` used for "Add a coach" elsewhere on the same screen.
 */
export function CheckboxTile({
  checked,
  onCheckedChange,
  label,
  description,
  className,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
  description?: string
  className?: string
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left",
        className
      )}
    >
      <span
        className={cn(
          "flex size-6 flex-none items-center justify-center rounded-[7px]",
          checked ? "bg-primary" : "border-[1.5px] border-neutral-150 bg-card"
        )}
      >
        {checked && <Check className="size-3.5 text-primary-foreground" strokeWidth={3} />}
      </span>
      <span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {description && (
          <span className="block text-xs text-neutral-400">{description}</span>
        )}
      </span>
    </button>
  )
}
