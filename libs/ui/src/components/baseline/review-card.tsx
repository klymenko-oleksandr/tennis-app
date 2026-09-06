import * as React from "react"
import { cn, PHOTO_PLACEHOLDER_CLASS } from "@/lib/utils"
import { Rating } from "./rating"

export interface ReviewCardProps {
  name: string
  when: string
  rating: string
  text: string
  avatarSrc?: string
  className?: string
}

/**
 * Baseline ReviewCard — avatar + name + timestamp + rating + text.
 * One shared pattern used for both court and coach reviews (the
 * prototypes don't have a separate coach-specific variant).
 */
export function ReviewCard({ name, when, rating, text, avatarSrc, className }: ReviewCardProps) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-3.5", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "size-[34px] flex-none rounded-full",
              PHOTO_PLACEHOLDER_CLASS,
              avatarSrc && "bg-cover bg-center"
            )}
            style={avatarSrc ? { backgroundImage: `url(${avatarSrc})` } : undefined}
          />
          <div>
            <div className="text-[13.5px] font-semibold text-foreground">{name}</div>
            <div className="text-[11.5px] text-neutral-400">{when}</div>
          </div>
        </div>
        <Rating value={rating} size="sm" />
      </div>
      <p className="mt-2.5 text-[13.5px] leading-[1.5] text-neutral-800">{text}</p>
    </div>
  )
}
