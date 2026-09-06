import * as React from "react"
import { cn } from "@/lib/utils"
import { Kicker } from "./kicker"

export interface StatCardProps {
  label: string
  value: string
  delta?: string
  deltaDirection?: "up" | "down"
  hint?: string
  className?: string
}

/**
 * Baseline StatCard — the KPI tile used in Admin's overview grid and
 * Desktop's dashboard/profile stat grids: mono label, big value with an
 * optional coloured delta, and a hint line.
 */
export function StatCard({
  label,
  value,
  delta,
  deltaDirection = "up",
  hint,
  className,
}: StatCardProps) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card px-5 py-[18px]", className)}>
      <Kicker>{label}</Kicker>
      <div className="mt-[9px] flex items-baseline gap-2">
        <span className="text-[27px] font-bold tracking-[-0.025em] text-foreground">
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              "font-mono text-[11px] font-bold",
              deltaDirection === "up" ? "text-primary" : "text-loss"
            )}
          >
            {delta}
          </span>
        )}
      </div>
      {hint && <div className="mt-1 text-xs text-neutral-400">{hint}</div>}
    </div>
  )
}
