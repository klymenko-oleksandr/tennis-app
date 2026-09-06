import * as React from "react"
import { cn } from "@/lib/utils"
import { Kicker } from "./kicker"

export interface RevenueDay {
  label: string
  /** 0–100, percent of the week's peak day. */
  percent: number
}

/**
 * Baseline RevenueChart — the dark "Revenue this week" card with a 7-bar
 * mini chart. Peak day (highest bar) is highlighted brand green; the
 * rest are dark neutral, matching the prototype.
 */
export function RevenueChart({
  total,
  delta,
  data,
  className,
}: {
  total: string
  delta?: string
  data: RevenueDay[]
  className?: string
}) {
  const peakIndex = data.reduce(
    (best, day, i) => (day.percent > data[best].percent ? i : best),
    0
  )

  return (
    <div className={cn("rounded-2xl bg-sidebar p-5", className)}>
      <Kicker tone="onDark">Revenue this week</Kicker>
      <div className="mt-2 text-[29px] font-bold text-white">{total}</div>
      {delta && <div className="text-[12.5px] text-neutral-400">{delta}</div>}
      <div className="mt-4 flex h-11 gap-1">
        {data.map((day, i) => (
          <div key={day.label} className="flex flex-1 flex-col justify-end">
            <div
              style={{ height: `${day.percent}%` }}
              className={cn(
                "w-full rounded-[3px]",
                i === peakIndex ? "bg-primary" : "bg-neutral-900"
              )}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-1">
        {data.map((day) => (
          <span
            key={day.label}
            className="flex-1 text-center font-mono text-[8px] text-neutral-700"
          >
            {day.label}
          </span>
        ))}
      </div>
    </div>
  )
}
