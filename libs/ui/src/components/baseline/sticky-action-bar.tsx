import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Kicker } from "./kicker"

export interface StickyActionBarProps {
  ctaLabel: string
  onCta?: () => void
  ctaDisabled?: boolean
  /** "From 480 ₴" style price, shown left when no summary row is given. */
  price?: string
  /** Booking-flow variant: a summary line + bold total above the CTA. */
  summaryLabel?: string
  total?: string
  className?: string
}

/**
 * Baseline StickyActionBar — the persistent bottom bar on court detail
 * ("Book a court") and the booking flow ("Continue to payment"). Pass
 * `summaryLabel`/`total` for the booking-flow shape (summary row above
 * the button); pass `price` for the simple price+CTA shape.
 */
export function StickyActionBar({
  ctaLabel,
  onCta,
  ctaDisabled,
  price,
  summaryLabel,
  total,
  className,
}: StickyActionBarProps) {
  const hasSummary = summaryLabel !== undefined || total !== undefined

  return (
    <div
      className={cn(
        "border-t border-border bg-card px-[22px] pt-[13px] pb-6",
        className
      )}
    >
      {hasSummary ? (
        <>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{summaryLabel}</span>
            {total && <span className="text-xl font-bold text-foreground">{total}</span>}
          </div>
          <Button onClick={onCta} disabled={ctaDisabled} className="mt-2.5 w-full" size="lg">
            {ctaLabel}
          </Button>
        </>
      ) : (
        <div className="flex items-center gap-3.5">
          {price && (
            <div>
              <Kicker>From</Kicker>
              <div className="text-lg font-bold text-foreground">{price}</div>
            </div>
          )}
          <Button onClick={onCta} disabled={ctaDisabled} className="flex-1" size="lg">
            {ctaLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
