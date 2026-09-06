import * as React from "react"
import { cn, PHOTO_PLACEHOLDER_CLASS } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Kicker } from "./kicker"
import { Rating } from "./rating"

export interface CoachSlot {
  day: string
  time: string
}

export interface CoachCardProps {
  name: string
  credential: string
  rating?: string
  reviews?: number
  price: string
  bio?: string
  specialties?: string[]
  slots?: CoachSlot[]
  onBook?: () => void
  onClick?: () => void
  variant?: "compact" | "full"
  className?: string
}

/**
 * Baseline CoachCard / TrainerCard.
 *
 * · full    — Desktop coaches list row: photo, name, credential, bio,
 *   specialty chips, price, next-available slot chips, book CTA.
 * · compact — Rally home rail card: photo, name, credential, rating, price.
 *   No bio/specialties/slots — those aren't in the compact prototype.
 */
export function CoachCard({
  name,
  credential,
  rating,
  reviews,
  price,
  bio,
  specialties = [],
  slots = [],
  onBook,
  onClick,
  variant = "full",
  className,
}: CoachCardProps) {
  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "w-[158px] flex-none rounded-2xl border border-border bg-card p-3.5 text-left",
          className
        )}
      >
        <div className={cn("size-12 rounded-full", PHOTO_PLACEHOLDER_CLASS)} />
        <div className="mt-[11px] text-[14.5px] font-semibold text-foreground">{name}</div>
        <div className="mt-0.5 truncate text-xs text-neutral-400">{credential}</div>
        <div className="mt-2.5 flex items-center justify-between">
          {rating && <Rating value={rating} size="sm" />}
          <span className="text-[12.5px] font-semibold text-foreground">{price}</span>
        </div>
      </button>
    )
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-wrap items-start gap-[22px] rounded-xl border border-border bg-card p-[22px]",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className={cn("size-[84px] flex-none rounded-xl", PHOTO_PLACEHOLDER_CLASS)} />

      <div className="min-w-[320px] flex-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-lg font-semibold text-foreground">{name}</span>
          {rating && <Rating value={rating} reviews={reviews} />}
        </div>
        <div className="mt-1 text-[13px] font-medium text-brand-400">{credential}</div>
        {bio && (
          <p className="mt-2.5 max-w-[560px] text-[13.5px] leading-[1.55] text-neutral-800">
            {bio}
          </p>
        )}
        {specialties.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {specialties.map((sp) => (
              <span
                key={sp}
                className="rounded-lg border border-brand-200 bg-brand-50 px-2.5 py-[5px] text-xs text-brand-700"
              >
                {sp}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="min-w-[190px] flex-1">
        <div className="text-[22px] font-bold text-foreground">{price}</div>
        <div className="text-xs text-neutral-400">per hour</div>
        {slots.length > 0 && (
          <>
            <Kicker className="mt-4">Next available</Kicker>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {slots.map((slot) => (
                <span
                  key={`${slot.day}-${slot.time}`}
                  className="rounded-lg border border-border bg-card px-[9px] py-1.5 text-[11.5px] font-semibold text-foreground"
                >
                  {slot.day} {slot.time}
                </span>
              ))}
            </div>
          </>
        )}
        {onBook && (
          <Button onClick={onBook} className="mt-4 w-full">
            Book a lesson
          </Button>
        )}
      </div>
    </div>
  )
}
