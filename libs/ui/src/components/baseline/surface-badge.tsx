import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type CourtSurface = "Clay" | "Hard" | "Grass" | "Carpet"

const surfaceColor: Record<CourtSurface, string> = {
  Clay: "bg-court-clay",
  Hard: "bg-court-hard",
  Grass: "bg-court-grass",
  Carpet: "bg-court-carpet",
}

/**
 * Baseline SurfaceBadge — the colour dot + label pattern used on every
 * court card. A thin Badge wrapper rather than its own primitive: the
 * only thing it adds over `Badge` is the coloured dot mapped from the
 * court's surface type.
 */
export function SurfaceBadge({
  surface,
  size = "md",
  className,
}: {
  surface: CourtSurface
  size?: "sm" | "md"
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 bg-card font-medium",
        size === "sm" ? "text-[10px]" : "text-[11px]",
        className
      )}
    >
      <span
        className={cn("size-1.5 rounded-full", surfaceColor[surface])}
        aria-hidden="true"
      />
      {surface}
    </Badge>
  )
}
