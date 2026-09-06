import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Baseline Button — shadcn's button with our variant set.
 *
 * Deltas from stock shadcn:
 * · `default` is brand green (#1F8A5B), not near-black
 * · `secondary` is a white card with a 1px border, not a grey fill
 *   (matches every "Save court" / "Reschedule" button in the app)
 * · added `soft` — the tinted brand button used for low-commitment
 *   actions like "Invite" on a player row
 * · `destructive` is the muted loss pair (#F4E6E2 / #B0492E), not a
 *   saturated red fill — cancelling a booking is routine, not alarming
 * · sizes are taller than stock: our CTAs are 44–48px so they hold up
 *   as touch targets in the mobile build
 * · added `loading` — no shadcn/Baseline precedent, added for the
 *   Storybook control set (spinner replaces children, button stays
 *   the same size, pointer events disabled)
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold tracking-[-0.01em] transition-all disabled:pointer-events-none disabled:opacity-45 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-card text-foreground border border-border hover:bg-secondary/60",
        soft: "bg-accent text-accent-foreground border border-brand-200 hover:bg-accent/70",
        ghost: "text-primary hover:bg-accent",
        destructive:
          "bg-loss-bg text-loss hover:bg-loss-bg/70 focus-visible:ring-destructive/30",
        outline:
          "border border-border bg-transparent hover:bg-secondary/60 text-foreground",
      },
      size: {
        sm: "h-9 px-3.5 text-[13px] rounded-[10px]",
        default: "h-11 px-5 text-[14.5px]",
        lg: "h-12 px-6 text-[15px] rounded-[14px]",
        icon: "size-10 rounded-full",
        "icon-sm": "size-8 rounded-full",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
      />
    </svg>
  )
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      data-slot="button"
      data-loading={loading || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="size-4" />
          {children}
        </>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
