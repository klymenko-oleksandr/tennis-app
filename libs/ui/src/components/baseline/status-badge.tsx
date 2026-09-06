import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type BookingStatus =
  | "Confirmed"
  | "Pending"
  | "Checked-in"
  | "No-show"
  | "Cancelled"

/**
 * Baseline StatusBadge — booking status carries meaning (Confirmed / Pending
 * / Checked-in / No-show / Cancelled), so it's defined once here rather than
 * left for call sites to pick colours ad hoc (per the shadcn handoff notes:
 * "don't let Badge drift").
 *
 * Colour choices beyond Confirmed/Cancelled weren't specified in the source
 * design files — Checked-in reads as the completed/solid state, Pending as
 * a caution tint, No-show as the one that needs attention. Worth a design
 * pass once real screens use these.
 */
const statusStyles: Record<BookingStatus, string> = {
  Confirmed: "bg-win-bg text-win",
  "Checked-in": "bg-primary text-primary-foreground",
  Pending: "bg-warning/10 text-warning",
  "No-show": "bg-loss-bg text-loss",
  Cancelled: "bg-muted text-muted-foreground",
}

export function StatusBadge({
  status,
  className,
}: {
  status: BookingStatus
  className?: string
}) {
  return (
    <Badge className={cn(statusStyles[status], "border-transparent", className)}>
      {status}
    </Badge>
  )
}
