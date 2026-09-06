import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description: string
  ctaLabel?: string
  onCta?: () => void
  className?: string
}

/**
 * Baseline EmptyState — covers both prototype shapes: a plain icon +
 * text (Rally favourites) and a boxed heading + body + CTA (Desktop
 * saved). Pass `icon` alone for the first shape, `title` + `ctaLabel`
 * for the second — the component doesn't force one look, since the
 * prototypes genuinely differ (bordered card vs. bare centered text).
 */
export function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  onCta,
  className,
}: EmptyStateProps) {
  const boxed = Boolean(title)

  return (
    <div
      className={cn(
        "text-center",
        boxed
          ? "rounded-xl border border-border bg-card p-14"
          : "px-5 py-[60px] text-neutral-400",
        className
      )}
    >
      {icon && <div className="flex justify-center text-neutral-200">{icon}</div>}
      {title && (
        <div className="mt-1 text-base font-semibold text-foreground">{title}</div>
      )}
      <div className={cn(boxed ? "mt-1 text-[13.5px] text-neutral-400" : "mt-3 text-sm")}>
        {description}
      </div>
      {ctaLabel && (
        <Button onClick={onCta} className="mt-4.5">
          {ctaLabel}
        </Button>
      )}
    </div>
  )
}
