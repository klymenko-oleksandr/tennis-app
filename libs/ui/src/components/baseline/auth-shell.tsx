import * as React from "react"
import { cn } from "@/lib/utils"
import { Kicker } from "./kicker"

export interface AuthStat {
  value: string
  label: string
}

export interface AuthShellProps {
  headline: string
  subhead: string
  stats: AuthStat[]
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

/**
 * Baseline AuthShell — the split-screen layout wrapping every Auth
 * step: a dark decorative brand panel (headline, subhead, a 3-stat
 * row pinned to the bottom) and a form panel that renders whatever
 * step content is passed as `children`. The prototype also has a
 * diagonal stripe texture behind the panel; skipped here since the
 * extraction didn't capture its exact colours and the plain dark
 * panel + ring outlines already reads correctly — revisit if the
 * texture matters once this ships on a real Auth screen.
 */
export function AuthShell({ headline, subhead, stats, children, footer, className }: AuthShellProps) {
  return (
    <div className={cn("flex min-h-screen flex-wrap bg-background", className)}>
      {/* Brand panel */}
      <div className="flex-1 basis-105 bg-sidebar p-11 text-sidebar-foreground">
        <div className="flex flex-col gap-1.5">
          <div className="font-mono text-sm font-bold text-neutral-25 uppercase tracking-mono-wider">Baseline</div>
          <Kicker tone="onDark">Tennis in Kyiv</Kicker>
        </div>

        <div className="mt-auto flex h-full flex-col justify-end">
          <div className="text-2xl font-semibold text-white">{headline}</div>
          <div className="mt-2 max-w-sm text-sm text-sidebar-foreground">{subhead}</div>
          <div className="mt-7 flex gap-7">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="mt-0.5 text-xs text-sidebar-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Form panel */}
      <div className="flex flex-1 basis-130 flex-col px-11 pt-9 pb-11">
        <div className="mx-auto flex w-full max-w-110 flex-1 flex-col justify-center">
          {children}
        </div>
        {footer && (
          <div className="mx-auto mt-6 w-full max-w-110 text-center text-xs text-neutral-400">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
