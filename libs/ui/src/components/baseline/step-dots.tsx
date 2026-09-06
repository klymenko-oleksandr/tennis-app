import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Kicker } from "./kicker"

/**
 * Baseline StepDots — the Auth flow progress rail: filled/unfilled dots,
 * a mono "Step X of Y" label (or a custom label for the final step), and
 * an optional Back link.
 */
export function StepDots({
  step,
  totalSteps,
  label,
  onBack,
  className,
}: {
  step: number
  totalSteps: number
  label?: string
  onBack?: () => void
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex gap-[5px]">
        {Array.from({ length: totalSteps }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 w-[22px] rounded-full",
              i < step ? "bg-primary" : "bg-neutral-100"
            )}
          />
        ))}
      </div>
      <Kicker className="tracking-mono-wide">
        {label ?? `Step ${step} of ${totalSteps}`}
      </Kicker>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="ml-auto inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground"
        >
          <ChevronLeft className="size-3.5" />
          Back
        </button>
      )}
    </div>
  )
}
