export type Surface = 'CLAY' | 'HARD' | 'GRASS' | 'CARPET';

export interface Court {
  id: string;
  name: string;
  area: string;
  address: string | null;
  surface: Surface;
  indoor: boolean;
  pricePerHour: number;
  description: string | null;
}

export interface Trainer {
  id: string;
  name: string;
  credential: string | null;
  bio: string | null;
  pricePerHour: number;
}

export type BookingStatus = 'CONFIRMED' | 'CANCELLED';

export interface Booking {
  id: string;
  userId: string;
  courtId: string;
  trainerId: string | null;
  date: string;
  startTime: string;
  durationMinutes: number;
  players: number;
  notes: string | null;
  status: BookingStatus;
  court: Court;
  trainer: Trainer | null;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  ntrpLevel: number | null;
}
