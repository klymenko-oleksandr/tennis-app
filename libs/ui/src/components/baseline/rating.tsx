import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Baseline Rating — the star + numeric label recipe used everywhere
 * (court cards, coach cards, review cards, court detail header). Same
 * star icon/colour/proportions across every instance in the prototypes,
 * just the size and gap vary slightly by context.
 */
export function Rating({
  value,
  reviews,
  size = "md",
  className,
}: {
  value: string
  reviews?: number
  size?: "sm" | "md"
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold text-foreground",
        size === "sm" ? "gap-1 text-[12.5px]" : "gap-[3px] text-[13px]",
        className
      )}
    >
      <Star
        className={size === "sm" ? "size-3" : "size-3.5 text-primary"}
        fill="currentColor"
        stroke="none"
      />
      {value}
      {reviews !== undefined && (
        <span className="font-normal text-neutral-400">({reviews})</span>
      )}
    </span>
  )
}
