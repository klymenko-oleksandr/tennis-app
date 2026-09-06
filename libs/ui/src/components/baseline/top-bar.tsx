import * as React from "react"
import { Search, Bell, Download, Plus } from "lucide-react"
import { cn, PHOTO_PLACEHOLDER_CLASS } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface TopBarAppProps {
  variant?: "app"
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  ctaLabel: string
  onCta?: () => void
  hasUnread?: boolean
  onBellClick?: () => void
  avatarSrc?: string
  className?: string
}

export interface TopBarAdminProps {
  variant: "admin"
  title: string
  subtitle?: string
  onExport?: () => void
  ctaLabel: string
  onCta?: () => void
  className?: string
}

/**
 * Baseline TopBar — the 74px sticky header shell, two shapes:
 *
 * · app   — Desktop: search field, primary CTA, notification bell
 *   (unread dot), avatar.
 * · admin — Admin: page title/subtitle, Export button, primary CTA.
 */
export function TopBar(props: TopBarAppProps | TopBarAdminProps) {
  if (props.variant === "admin") {
    const { title, subtitle, onExport, ctaLabel, onCta, className } = props
    return (
      <header
        className={cn(
          "flex h-[74px] items-center justify-between border-b border-border bg-card px-[30px]",
          className
        )}
      >
        <div>
          <div className="text-[17px] font-semibold text-foreground">{title}</div>
          {subtitle && <div className="text-[12.5px] text-neutral-400">{subtitle}</div>}
        </div>
        <div className="flex items-center gap-2.5">
          {onExport && (
            <Button variant="secondary" onClick={onExport}>
              <Download className="size-4" />
              Export
            </Button>
          )}
          <Button onClick={onCta}>
            <Plus className="size-4" />
            {ctaLabel}
          </Button>
        </div>
      </header>
    )
  }

  const {
    searchValue,
    onSearchChange,
    searchPlaceholder = "Search courts, coaches, players…",
    ctaLabel,
    onCta,
    hasUnread,
    onBellClick,
    avatarSrc,
    className,
  } = props

  return (
    <header
      className={cn(
        "flex h-[74px] items-center gap-[18px] border-b border-border bg-card px-[34px]",
        className
      )}
    >
      <div className="flex max-w-[440px] flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5">
        <Search className="size-4 text-neutral-400" />
        <input
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-neutral-400"
        />
      </div>
      <div className="ml-auto flex items-center gap-2.5">
        <Button onClick={onCta}>{ctaLabel}</Button>
        <button
          type="button"
          onClick={onBellClick}
          aria-label="Notifications"
          className="relative flex size-10 items-center justify-center rounded-full border border-border"
        >
          <Bell className="size-4 text-foreground" />
          {hasUnread && (
            <span className="absolute top-2 right-[9px] size-[7px] rounded-full border-[1.5px] border-card bg-primary" />
          )}
        </button>
        <button
          type="button"
          aria-label="Account"
          className={cn(
            "size-10 rounded-full ring-1 ring-border",
            PHOTO_PLACEHOLDER_CLASS,
            avatarSrc && "bg-cover bg-center"
          )}
          style={avatarSrc ? { backgroundImage: `url(${avatarSrc})` } : undefined}
        />
      </div>
    </header>
  )
}
