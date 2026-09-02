import { computeFreeSlots } from './free-slots.util';

describe('computeFreeSlots', () => {
  it('generates hourly-cadence slots across a single window', () => {
    const slots = computeFreeSlots([{ startTime: '09:00', endTime: '11:00' }], []);
    expect(slots.map((s) => s.time)).toEqual(['09:00', '10:00']);
    expect(slots.every((s) => s.status === 'available')).toBe(true);
  });

  it('excludes a start time that would run past the window end', () => {
    // 09:00-10:30 window: 09:00 fits (ends 09:55), a 10:00 start would end
    // at 10:55, past the 10:30 close — only one slot should be offered.
    const slots = computeFreeSlots([{ startTime: '09:00', endTime: '10:30' }], []);
    expect(slots.map((s) => s.time)).toEqual(['09:00']);
  });

  it('marks a slot booked when it overlaps an existing booking', () => {
    const slots = computeFreeSlots(
      [{ startTime: '09:00', endTime: '12:00' }],
      [{ startTime: '10:00', durationMinutes: 60 }],
    );
    expect(slots.find((s) => s.time === '10:00')?.status).toBe('booked');
    expect(slots.find((s) => s.time === '09:00')?.status).toBe('available');
    expect(slots.find((s) => s.time === '11:00')?.status).toBe('available');
  });

  it('marks a slot booked on partial overlap, not just exact match', () => {
    // A 90-minute booking starting 09:30 overlaps both the 09:00 slot
    // (which runs to 09:55) and the 10:00 slot.
    const slots = computeFreeSlots(
      [{ startTime: '09:00', endTime: '12:00' }],
      [{ startTime: '09:30', durationMinutes: 90 }],
    );
    expect(slots.find((s) => s.time === '09:00')?.status).toBe('booked');
    expect(slots.find((s) => s.time === '10:00')?.status).toBe('booked');
    expect(slots.find((s) => s.time === '11:00')?.status).toBe('available');
  });

  it('merges multiple availability windows, each keeping its own cadence offset', () => {
    // Each window generates its own 60-minute cadence from its own start —
    // a 09:00 window and a 09:30 window don't share a grid, so both
    // offsets appear rather than collapsing onto one.
    const slots = computeFreeSlots(
      [
        { startTime: '09:00', endTime: '10:00' },
        { startTime: '09:30', endTime: '11:00' },
      ],
      [],
    );
    expect(slots.map((s) => s.time)).toEqual(['09:00', '09:30']);
  });

  it('dedupes identical slot starts across overlapping windows', () => {
    const slots = computeFreeSlots(
      [
        { startTime: '09:00', endTime: '12:00' },
        { startTime: '09:00', endTime: '10:00' },
      ],
      [],
    );
    expect(slots.map((s) => s.time)).toEqual(['09:00', '10:00', '11:00']);
  });

  it('returns an empty list when there are no availability windows', () => {
    expect(computeFreeSlots([], [{ startTime: '09:00', durationMinutes: 60 }])).toEqual([]);
  });
});
