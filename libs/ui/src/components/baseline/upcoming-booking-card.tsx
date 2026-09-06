import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Kicker } from "./kicker"

export interface UpcomingBookingCardProps {
  court: string
  when: string
  time: string
  detail?: string
  onClick?: () => void
  onAddToCalendar?: () => void
  variant?: "hero" | "compact"
  className?: string
}

/**
 * Baseline UpcomingBookingCard — "Next up" card.
 *
 * · hero    — the dark full-bleed card on Rally home, with two faint
 *   decorative rings in the corner (matches the prototype's ring-decorated
 *   background — purely cosmetic, no data).
 * · compact — the light right-rail card on Desktop's dashboard, with
 *   Details / Add to calendar actions instead of a single click-through.
 */
export function UpcomingBookingCard({
  court,
  when,
  time,
  detail,
  onClick,
  onAddToCalendar,
  variant = "hero",
  className,
}: UpcomingBookingCardProps) {
  if (variant === "compact") {
    return (
      <div className={cn("rounded-xl border border-border bg-card p-[18px]", className)}>
        <Kicker>Next up</Kicker>
        <div className="mt-2 text-[16.5px] font-semibold text-foreground">{court}</div>
        <div className="mt-[3px] text-[13px] text-muted-foreground">
          {when} · {time}
        </div>
        <div className="mt-3.5 flex gap-[7px]">
          <Button onClick={onClick} className="flex-1 bg-foreground text-background hover:bg-foreground/90">
            Details
          </Button>
          <Button variant="secondary" onClick={onAddToCalendar}>
            Add to calendar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl bg-sidebar p-[18px] text-left text-sidebar-foreground",
        className
      )}
    >
      <Kicker tone="onDark">
        Next up · {when}
      </Kicker>
      <div className="mt-1.5 text-[19px] font-semibold text-white">{court}</div>
      <div className="mt-2 flex items-center gap-3.5 text-[13px] text-sidebar-foreground">
        <span>{time}</span>
        {detail && (
          <>
            <span>·</span>
            <span>{detail}</span>
          </>
        )}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[30px] -right-[30px] size-[130px] rounded-full border border-white/[0.08]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1.5 bottom-1.5 size-[90px] rounded-full border border-white/[0.07]"
      />
    </button>
  )
}
