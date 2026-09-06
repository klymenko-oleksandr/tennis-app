import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Baseline Kicker — the small uppercase Space Mono section label used
 * everywhere ("Next up", "Your season", "Surface", NTRP tags, KPI labels).
 * Not a shadcn primitive — every prototype screen hand-rolls this same
 * recipe (font-mono, wide tracking, uppercase, muted colour), so it's
 * worth one shared component instead of repeating the class string.
 */
export function Kicker({
  children,
  tone = "muted",
  className,
  as: Comp = "div",
}: {
  children: React.ReactNode
  tone?: "muted" | "brand" | "onDark"
  className?: string
  as?: React.ElementType
}) {
  const toneClass = {
    muted: "text-muted-foreground",
    brand: "text-brand-400",
    onDark: "text-brand-300",
  }[tone]

  return (
    <Comp
      data-slot="kicker"
      className={cn(
        "font-mono text-[9.5px] uppercase tracking-mono-wide",
        toneClass,
        className
      )}
    >
      {children}
    </Comp>
  )
}
