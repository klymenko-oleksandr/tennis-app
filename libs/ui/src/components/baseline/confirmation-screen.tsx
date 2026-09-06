import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface ConfirmationScreenProps {
  heading: string
  subline?: string
  summary?: React.ReactNode
  primaryLabel: string
  onPrimary?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
  className?: string
}

/**
 * Baseline ConfirmationScreen — the success screen shared by booking
 * confirm and Auth's final step: a green check circle that pops in
 * (the prototype's `pop` keyframe, wired to Tailwind as `animate-pop`
 * in styles.css), a heading/subline, an optional summary slot, and
 * stacked primary/secondary CTAs.
 */
export function ConfirmationScreen({
  heading,
  subline,
  summary,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  className,
}: ConfirmationScreenProps) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <div className="flex size-[84px] animate-pop items-center justify-center rounded-full bg-primary">
        <Check className="size-9 text-primary-foreground" strokeWidth={3} />
      </div>
      <div className="mt-5 text-2xl font-semibold text-foreground">{heading}</div>
      {subline && <div className="mt-1.5 text-sm text-neutral-400">{subline}</div>}
      {summary && <div className="mt-6 w-full">{summary}</div>}
      <div className="mt-7 flex w-full flex-col gap-2.5">
        <Button onClick={onPrimary} size="lg">
          {primaryLabel}
        </Button>
        {secondaryLabel && (
          <Button onClick={onSecondary} variant="ghost">
            {secondaryLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
