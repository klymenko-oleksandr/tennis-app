import * as React from "react"
import { Heart } from "lucide-react"
import { cn, PHOTO_PLACEHOLDER_CLASS } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { SurfaceBadge, type CourtSurface } from "./surface-badge"
import { Rating } from "./rating"

export interface CourtCardProps {
  name: string
  surface: CourtSurface
  area: string
  distance?: string
  rating?: string
  reviews?: number
  price: string
  nextSlot?: string
  favourited?: boolean
  onFavoriteToggle?: () => void
  onClick?: () => void
  variant?: "compact" | "full"
  className?: string
}

/**
 * Baseline CourtCard — photo, name, surface + area/distance, rating, price,
 * next-slot label. Two variants matching the prototypes:
 *
 * · compact — the 230px horizontal-scroll rail card (Rally home). No
 *   next-slot line, footer stays on one row.
 * · full    — the explore/dashboard grid card (Desktop). Adds the
 *   next-slot line and a divider above the rating/price footer.
 *
 * For the admin courts-management row, see `CourtCardAdmin` below — a
 * different enough layout (toggle, stats, actions, no rating/favourite)
 * that it isn't worth forcing into this component's prop shape.
 */
export function CourtCard({
  name,
  surface,
  area,
  distance,
  rating,
  reviews,
  price,
  nextSlot,
  favourited = false,
  onFavoriteToggle,
  onClick,
  variant = "full",
  className,
}: CourtCardProps) {
  const compact = variant === "compact"

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex-none cursor-pointer overflow-hidden border border-border bg-card text-left",
        compact ? "w-[230px] rounded-2xl" : "rounded-xl",
        className
      )}
    >
      <div
        className={cn("relative", PHOTO_PLACEHOLDER_CLASS, compact ? "h-[124px]" : "h-[132px]")}
      >
        <div className={cn("absolute left-2.5", compact ? "bottom-2.5" : "top-2.5")}>
          <SurfaceBadge surface={surface} className="bg-white/90" />
        </div>
        {onFavoriteToggle && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onFavoriteToggle()
            }}
            aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
            aria-pressed={favourited}
            className="absolute top-2.5 right-2.5 flex size-[30px] items-center justify-center rounded-full bg-white/90"
          >
            <Heart
              className="size-[15px]"
              stroke="currentColor"
              fill={favourited ? "currentColor" : "none"}
            />
          </button>
        )}
      </div>

      <div className={compact ? "p-3" : "px-4 py-[17px]"}>
        <div className="flex items-center justify-between gap-2">
          <div className="truncate text-[14.5px] font-semibold text-foreground">{name}</div>
          {compact && rating && <Rating value={rating} size="sm" />}
        </div>

        {compact ? (
          <div className="mt-[7px] flex items-center justify-between text-[12.5px] text-muted-foreground">
            <span>
              {area}
              {distance ? ` · ${distance}` : ""}
            </span>
            <span className="font-semibold text-foreground">{price}</span>
          </div>
        ) : (
          <>
            <div className="mt-[3px] text-[12.5px] text-neutral-400">
              {area}
              {distance ? ` · ${distance}` : ""}
            </div>
            {nextSlot && (
              <div className="mt-2 text-xs font-medium text-brand-400">{nextSlot}</div>
            )}
            <div className="mt-[13px] flex items-center justify-between border-t border-muted pt-[13px]">
              {rating && <Rating value={rating} reviews={reviews} />}
              <div className="text-[14.5px] font-bold text-foreground">{price}</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export interface CourtCardAdminProps {
  name: string
  surface: CourtSurface
  indoor?: boolean
  open: boolean
  rate: string
  bookedToday?: number
  utilisation?: string
  onToggleOpen?: (open: boolean) => void
  onEdit?: () => void
  onBlockHours?: () => void
  className?: string
}

/**
 * Baseline CourtCardAdmin — the courts-management grid card (Admin.dc.html):
 * photo with an Open/Maintenance status pill, an active toggle, a 3-column
 * stat row (base rate / booked today / utilisation — the latter two show
 * "—" when the court is inactive, matching the prototype), and two actions.
 */
export function CourtCardAdmin({
  name,
  surface,
  indoor,
  open,
  rate,
  bookedToday,
  utilisation,
  onToggleOpen,
  onEdit,
  onBlockHours,
  className,
}: CourtCardAdminProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
    >
      <div className={cn("relative h-24", PHOTO_PLACEHOLDER_CLASS)}>
        <span
          className={cn(
            "absolute top-2.5 left-2.5 rounded-[7px] px-[9px] py-1 text-[11px] font-semibold whitespace-nowrap",
            open ? "bg-win-bg/95 text-brand-700" : "bg-[#F7EBE3]/95 text-[#8A4B24]"
          )}
        >
          {open ? "Open" : "Maintenance"}
        </span>
      </div>

      <div className="p-4 pt-[15px]">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-[14.5px] font-semibold text-foreground">{name}</div>
            <div className="mt-[3px] flex items-center gap-1.5 text-[11px] text-neutral-400">
              <SurfaceBadge surface={surface} size="sm" className="border-none bg-transparent px-0 py-0" />
              {indoor && <span>· Indoor</span>}
            </div>
          </div>
          {onToggleOpen && (
            <Switch checked={open} onCheckedChange={onToggleOpen} aria-label="Court active" />
          )}
        </div>

        <div className="mt-3.5 grid grid-cols-3 gap-2 border-t border-muted pt-3.5 text-center">
          <div>
            <div className="text-sm font-bold text-foreground">{rate}</div>
            <div className="mt-px text-[10.5px] text-neutral-400">Base rate</div>
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">
              {open ? bookedToday ?? "—" : "—"}
            </div>
            <div className="mt-px text-[10.5px] text-neutral-400">Booked today</div>
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">
              {open ? utilisation ?? "—" : "—"}
            </div>
            <div className="mt-px text-[10.5px] text-neutral-400">Utilisation</div>
          </div>
        </div>

        <div className="mt-3.5 flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 rounded-[10px] border border-border bg-card px-2.5 py-2.5 text-[12.5px] font-semibold text-foreground"
          >
            Edit court
          </button>
          <button
            type="button"
            onClick={onBlockHours}
            className="flex-1 rounded-[10px] border border-border bg-card px-2.5 py-2.5 text-[12.5px] font-semibold text-foreground"
          >
            Block hours
          </button>
        </div>
      </div>
    </div>
  )
}
