import * as React from "react"
import { cn } from "@/lib/utils"

const hints = [
  "Use at least 8 characters",
  "Too short — 8 characters minimum",
  "Decent. A longer passphrase is stronger",
  "Strong password",
]

const segmentColor = ["bg-warning", "bg-[#C87941]", "bg-primary"]

function scoreFor(password: string): 0 | 1 | 2 | 3 {
  if (password.length === 0) return 0
  if (password.length < 8) return 1
  if (password.length < 12) return 2
  return 3
}

/**
 * Baseline PasswordStrengthMeter — the 3-segment bar under the Auth
 * password field. Score is derived from length alone, matching the
 * prototype's `pwScore` logic (not a real strength estimate).
 */
export function PasswordStrengthMeter({
  password,
  className,
}: {
  password: string
  className?: string
}) {
  const score = scoreFor(password)

  return (
    <div className={className}>
      <div className="mt-2.5 flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full",
              i < score ? segmentColor[score - 1] : "bg-neutral-75"
            )}
          />
        ))}
      </div>
      <div className="mt-1.5 text-xs text-neutral-400">{hints[score]}</div>
    </div>
  )
}
