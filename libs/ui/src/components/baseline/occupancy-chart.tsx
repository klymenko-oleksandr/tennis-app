import * as React from "react"
import { cn } from "@/lib/utils"
import { Kicker } from "./kicker"

export interface OccupancyBar {
  hour: string
  /** Courts booked in that hour. */
  booked: number
}

/**
 * Baseline OccupancyChart — the admin overview hourly occupancy bars.
 * The prototype hand-rolls this with plain flexbox bars (no charting
 * library) — each bar's height is booked/courtCount, colour darkens
 * when fully booked. Matched here rather than pulling in a charting
 * dependency for something this simple.
 */
export function OccupancyChart({
  data,
  courtCount,
  className,
}: {
  data: OccupancyBar[]
  courtCount: number
  className?: string
}) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <Kicker>Occupancy today</Kicker>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-[2px] bg-primary" />
            Booked
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-[2px] bg-neutral-75" />
            Free
          </span>
        </div>
      </div>
      <div className="mt-4 flex h-[168px] gap-[5px]">
        {data.map((bar) => (
          <div key={bar.hour} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full flex-1 items-end rounded-[5px] bg-neutral-75">
              <div
                style={{ height: `${Math.round((bar.booked / courtCount) * 100)}%` }}
                className={cn(
                  "w-full rounded-[5px]",
                  bar.booked >= courtCount ? "bg-brand-700" : "bg-primary"
                )}
              />
            </div>
            <span className="font-mono text-[9px] text-neutral-400">{bar.hour}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
