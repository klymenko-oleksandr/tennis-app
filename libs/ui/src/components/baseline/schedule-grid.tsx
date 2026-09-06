import * as React from "react"
import { cn } from "@/lib/utils"
import type { CourtSurface } from "./surface-badge"

export type ScheduleBlockKind = "booking" | "lesson" | "maintenance" | "blocked"

export interface ScheduleBlock {
  /** Start hour, e.g. 9.5 for 09:30. */
  start: number
  /** Duration in hours. */
  duration: number
  kind: ScheduleBlockKind
  title: string
  subtitle?: string
  onClick?: () => void
}

export interface ScheduleRow {
  courtName: string
  surface: CourtSurface
  blocks: ScheduleBlock[]
}

const surfaceDot: Record<CourtSurface, string> = {
  Clay: "bg-court-clay",
  Hard: "bg-court-hard",
  Grass: "bg-court-grass",
  Carpet: "bg-court-carpet",
}

const kindClass: Record<ScheduleBlockKind, string> = {
  booking: "bg-win-bg text-brand-700 border-brand-200",
  lesson: "bg-sidebar text-sidebar-primary-foreground border-sidebar",
  maintenance: "bg-[#F7EBE3] text-[#8A4B24] border-[#E6D0BE]",
  blocked: "bg-muted text-neutral-800 border-neutral-100",
}

/**
 * Baseline ScheduleGrid — the admin schedule view: courts × hours, with
 * absolutely-positioned coloured blocks per booking/lesson/maintenance/
 * block. No shadcn primitive fits this ("genuinely bespoke" per the
 * shadcn handoff notes) — position is computed the same way the
 * prototype does it: percentage offsets within the hour range.
 */
export function ScheduleGrid({
  hours,
  startHour,
  rows,
  className,
}: {
  /** Hour labels for the header, e.g. ['07:00', '08:00', ..., '21:00']. */
  hours: string[]
  /** The numeric hour the grid starts at (matches hours[0]), e.g. 7. */
  startHour: number
  rows: ScheduleRow[]
  className?: string
}) {
  const span = hours.length

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}>
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="flex border-b border-border bg-muted/40">
            <div className="w-[132px] flex-none px-4 py-3 font-mono text-[9px] uppercase tracking-mono text-neutral-400">
              Court
            </div>
            <div className="flex flex-1">
              {hours.map((h) => (
                <div
                  key={h}
                  className="flex-1 border-l border-muted py-3 text-center font-mono text-[10px] text-neutral-700"
                >
                  {h}
                </div>
              ))}
            </div>
          </div>

          {rows.map((row) => (
            <div key={row.courtName} className="flex border-b border-muted">
              <div className="w-[132px] flex-none px-4 py-3.5">
                <div className="text-[13.5px] font-semibold text-foreground">
                  {row.courtName}
                </div>
                <div className="mt-[3px] flex items-center gap-1.5">
                  <span className={cn("size-[7px] rounded-full", surfaceDot[row.surface])} />
                  <span className="text-[11px] text-neutral-400">{row.surface}</span>
                </div>
              </div>
              <div className="relative min-h-[62px] flex-1">
                <div className="absolute inset-0 flex">
                  {hours.map((h) => (
                    <div key={h} className="flex-1 border-l border-muted" />
                  ))}
                </div>
                {row.blocks.map((block, i) => {
                  const left = ((block.start - startHour) / span) * 100
                  const width = (block.duration / span) * 100
                  return (
                    <div
                      key={i}
                      onClick={block.onClick}
                      style={{ left: `${left}%`, width: `${width}%` }}
                      className={cn(
                        "absolute top-1.5 bottom-1.5 flex flex-col justify-center overflow-hidden rounded-lg border px-2.5 py-1.5",
                        block.onClick && "cursor-pointer",
                        kindClass[block.kind]
                      )}
                    >
                      <div className="truncate text-xs font-semibold">{block.title}</div>
                      {block.subtitle && (
                        <div className="truncate text-[10.5px] opacity-75">{block.subtitle}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const legendItems: { kind: ScheduleBlockKind; label: string }[] = [
  { kind: "booking", label: "Booking" },
  { kind: "lesson", label: "Lesson" },
  { kind: "maintenance", label: "Maintenance" },
  { kind: "blocked", label: "Blocked" },
]

const legendSwatch: Record<ScheduleBlockKind, string> = {
  booking: "bg-win-bg border-brand-200",
  lesson: "bg-sidebar border-sidebar",
  maintenance: "bg-[#F7EBE3] border-[#E6D0BE]",
  blocked: "bg-muted border-neutral-100",
}

export function ScheduleLegend({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      {legendItems.map((item) => (
        <div key={item.kind} className="flex items-center gap-1.5">
          <span className={cn("size-[11px] rounded-[3px] border", legendSwatch[item.kind])} />
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
