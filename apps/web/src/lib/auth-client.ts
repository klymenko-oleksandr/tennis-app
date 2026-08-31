// Minimal client for GoTrue's REST API, hand-rolled rather than pulling in
// @supabase/supabase-js — we run bare self-hosted GoTrue (no Kong/PostgREST
// in front of it), so the SDK's assumptions about the full Supabase stack
// don't cleanly apply, and DR.md's project vector (Vector A) favors owning
// this rather than depending on package magic. See DR.md §4.
import { GOTRUE_URL } from './env';

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch seconds
}

const STORAGE_KEY = 'tennis-app.session';
const SESSION_CHANGED_EVENT = 'tennis-app.session-changed';

export function getStoredSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function storeSession(session: Session | null) {
  if (session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  window.dispatchEvent(new CustomEvent(SESSION_CHANGED_EVENT, { detail: session }));
}

export function onSessionChange(callback: (session: Session | null) => void) {
  const handler = (event: Event) => callback((event as CustomEvent<Session | null>).detail);
  window.addEventListener(SESSION_CHANGED_EVENT, handler);
  return () => window.removeEventListener(SESSION_CHANGED_EVENT, handler);
}

interface GoTrueTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

function toSession(response: GoTrueTokenResponse): Session {
  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    expiresAt: Math.floor(Date.now() / 1000) + response.expires_in,
  };
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return body.msg ?? body.error_description ?? body.error ?? response.statusText;
  } catch {
    return response.statusText;
  }
}

export async function signUpWithPassword(email: string, password: string): Promise<Session> {
  const res = await fetch(`${GOTRUE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  const session = toSession(await res.json());
  storeSession(session);
  return session;
}

export async function signInWithPassword(email: string, password: string): Promise<Session> {
  const res = await fetch(`${GOTRUE_URL}/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  const session = toSession(await res.json());
  storeSession(session);
  return session;
}

export function signInWithGoogle() {
  const redirectTo = `${window.location.origin}/auth/callback`;
  window.location.href = `${GOTRUE_URL}/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
}

// GoTrue redirects back to redirect_to with the session in the URL hash
// fragment (#access_token=...&refresh_token=...&expires_in=...).
export function handleOAuthRedirect(): Session | null {
  const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : '';
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  const expiresIn = params.get('expires_in');
  if (!accessToken || !refreshToken || !expiresIn) return null;

  const session: Session = {
    accessToken,
    refreshToken,
    expiresAt: Math.floor(Date.now() / 1000) + Number(expiresIn),
  };
  storeSession(session);
  return session;
}

async function refreshSession(refreshToken: string): Promise<Session> {
  const res = await fetch(`${GOTRUE_URL}/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!res.ok) {
    storeSession(null);
    throw new Error(await parseErrorMessage(res));
  }
  const session = toSession(await res.json());
  storeSession(session);
  return session;
}

// Returns a session with a still-valid access token, refreshing first if
// it's expired or about to expire. Callers (the API client) should use this
// rather than reading storage directly.
export async function getValidSession(): Promise<Session | null> {
  const session = getStoredSession();
  if (!session) return null;

  const expiresInSeconds = session.expiresAt - Math.floor(Date.now() / 1000);
  if (expiresInSeconds > 30) return session;

  try {
    return await refreshSession(session.refreshToken);
  } catch {
    return null;
  }
}

export async function signOut() {
  const session = getStoredSession();
  storeSession(null);
  if (!session) return;
  await fetch(`${GOTRUE_URL}/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.accessToken}` },
  }).catch(() => undefined); // best-effort — local session is already cleared
}
