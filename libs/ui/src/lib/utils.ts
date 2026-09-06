import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * The diagonal-stripe placeholder used for every photo slot across the
 * prototypes (court/coach/player photos, avatars) before a real image
 * loads. One shared constant instead of each composite re-deriving its
 * own stripe size.
 */
export const PHOTO_PLACEHOLDER_CLASS =
  'bg-[repeating-linear-gradient(135deg,var(--color-neutral-50)_0_9px,var(--color-neutral-75)_9px_18px)]';
