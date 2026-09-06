import * as React from "react"
import { cn, PHOTO_PLACEHOLDER_CLASS } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface PlayerStat {
  label: string
  value: string
}

export interface PlayerCardProps {
  name: string
  area: string
  hand: string
  ntrp: string
  availability?: string
  note?: string
  stats?: PlayerStat[]
  onInvite?: () => void
  onClick?: () => void
  className?: string
}


/**
 * Baseline PlayerCard — the "find a partner" grid card (Desktop players
 * screen): avatar, area/hand, NTRP + availability chips, a short note,
 * a stat row, and an invite CTA.
 */
export function PlayerCard({
  name,
  area,
  hand,
  ntrp,
  availability,
  note,
  stats = [],
  onInvite,
  onClick,
  className,
}: PlayerCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border border-border bg-card p-[22px]",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-center gap-3.5">
        <div className={cn("size-[54px] flex-none rounded-full", PHOTO_PLACEHOLDER_CLASS)} />
        <div className="min-w-0">
          <div className="text-[16.5px] font-semibold text-foreground">{name}</div>
          <div className="mt-0.5 text-[12.5px] text-neutral-400">
            {area} · {hand}
          </div>
        </div>
      </div>

      <div className="mt-3.5 flex gap-[7px]">
        <span className="rounded-lg bg-muted px-2 py-1 font-mono text-[10.5px] text-neutral-800">
          NTRP {ntrp}
        </span>
        {availability && (
          <span className="rounded-lg border border-brand-200 bg-brand-50 px-2 py-1 font-mono text-[10.5px] text-brand-700">
            {availability}
          </span>
        )}
      </div>

      {note && (
        <p className="mt-3.5 text-[13.5px] leading-[1.55] text-neutral-800">{note}</p>
      )}

      {stats.length > 0 && (
        <div className="mt-4 flex gap-[18px] border-t border-muted pt-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-base font-bold text-foreground">{stat.value}</div>
              <div className="mt-px text-[11px] text-neutral-400">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {onInvite && (
        <Button onClick={onInvite} className="mt-4 w-full">
          Invite to play
        </Button>
      )}
    </div>
  )
}
