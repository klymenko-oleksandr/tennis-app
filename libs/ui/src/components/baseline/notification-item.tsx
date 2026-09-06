import * as React from "react"
import { cn } from "@/lib/utils"

export interface NotificationItemProps {
  /** A single glyph, e.g. "✓" or "★" — the prototype uses literal
   * characters here rather than icon components. */
  icon: string
  iconBg: string
  iconColor: string
  title: string
  body: string
  when: string
  unread?: boolean
  className?: string
}

/**
 * Baseline NotificationItem — icon-in-rounded-square + title/body/
 * timestamp + unread dot. The tint comes from the card background
 * (white when unread, off-white when read), not the icon square.
 */
export function NotificationItem({
  icon,
  iconBg,
  iconColor,
  title,
  body,
  when,
  unread,
  className,
}: NotificationItemProps) {
  return (
    <div
      className={cn(
        "flex gap-[13px] rounded-2xl border border-border p-3.5",
        unread ? "bg-card" : "bg-muted/30",
        className
      )}
    >
      <div
        style={{ background: iconBg, color: iconColor }}
        className="flex size-[38px] flex-none items-center justify-center rounded-[11px] text-base"
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="text-sm font-semibold text-foreground">{title}</div>
          {unread && <span className="mt-1.5 size-2 flex-none rounded-full bg-primary" />}
        </div>
        <div className="mt-0.5 text-[13px] text-neutral-700">{body}</div>
        <div className="mt-1 text-xs text-neutral-400">{when}</div>
      </div>
    </div>
  )
}
