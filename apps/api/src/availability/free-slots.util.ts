// Pure slot-computation logic, shared by courts and trainers (DR.md backlog
// #10/#11) — no DB access here so it's trivially unit-testable and reusable
// for both resource types.
//
// Slot model per DR.md §5: 55 minutes of actual bookable time, start times
// on a 60-minute cadence (leaves a 5-minute buffer between sessions).

export interface AvailabilityWindow {
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
}

export interface BookedRange {
  startTime: string; // "HH:MM"
  durationMinutes: number;
}

export type SlotStatus = 'available' | 'booked';

export interface TimeSlot {
  time: string; // "HH:MM" — matches libs/ui's SlotPicker `TimeSlot.time`
  status: SlotStatus;
}

const SLOT_DURATION_MINUTES = 55;
const SLOT_CADENCE_MINUTES = 60;

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function toHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Generates every bookable slot start time across the given availability
 * windows, marking each one 'booked' if it overlaps an existing booking.
 * Windows and bookings may be unsorted and may overlap each other; slot
 * start times are deduplicated and returned in chronological order.
 */
export function computeFreeSlots(
  windows: AvailabilityWindow[],
  booked: BookedRange[],
): TimeSlot[] {
  const bookedRanges = booked.map((b) => ({
    start: toMinutes(b.startTime),
    end: toMinutes(b.startTime) + b.durationMinutes,
  }));

  const slotStarts = new Set<number>();
  for (const window of windows) {
    const windowStart = toMinutes(window.startTime);
    const windowEnd = toMinutes(window.endTime);
    for (
      let start = windowStart;
      start + SLOT_DURATION_MINUTES <= windowEnd;
      start += SLOT_CADENCE_MINUTES
    ) {
      slotStarts.add(start);
    }
  }

  return Array.from(slotStarts)
    .sort((a, b) => a - b)
    .map((start) => {
      const end = start + SLOT_DURATION_MINUTES;
      const isBooked = bookedRanges.some((b) => start < b.end && b.start < end);
      return { time: toHHMM(start), status: isBooked ? 'booked' : 'available' };
    });
}
