// Shape of the JWT GoTrue issues on sign-in (HS256, GOTRUE_JWT_SECRET).
export interface GoTrueJwtPayload {
  sub: string; // matches auth.users.id — this becomes our public.users.id
  email: string;
  role: string;
  aud: string;
  exp: number;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: unknown;
  };
}
