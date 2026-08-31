import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getStoredSession, onSessionChange, type Session } from './auth-client';
import { apiRequest } from './api-client';
import type { UserProfile } from './types';

interface AuthContextValue {
  session: Session | null;
  user: UserProfile | undefined;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => getStoredSession());
  const queryClient = useQueryClient();

  useEffect(() => {
    return onSessionChange((next) => {
      setSession(next);
      if (!next) {
        queryClient.removeQueries({ queryKey: ['me'] });
      }
    });
  }, [queryClient]);

  // Syncs the local profile row on the backend and fetches it — see DR.md §4.
  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiRequest<UserProfile>('/auth/me'),
    enabled: !!session,
    staleTime: 60_000,
  });

  return (
    <AuthContext.Provider value={{ session, user, isLoading: !!session && isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
