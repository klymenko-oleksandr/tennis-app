import { Link, Outlet } from 'react-router';
import { Button } from '../components/ui/button';
import { useAuth } from '../lib/auth-context';
import { signOut } from '../lib/auth-client';

export function Layout() {
  const { session, user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link to="/courts" className="text-lg font-semibold">
            🎾 Tennis App
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/courts">Courts</Link>
            </Button>
            {session && (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/bookings">My bookings</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/profile">{user?.displayName ?? 'Profile'}</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Sign out
                </Button>
              </>
            )}
            {!session && (
              <Button asChild size="sm">
                <Link to="/login">Sign in</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
