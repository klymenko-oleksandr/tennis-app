import { useTranslation } from 'react-i18next';
import { Link, Outlet } from 'react-router';
import { Button } from '../components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import { useAuth } from '../lib/auth-context';
import { signOut } from '../lib/auth-client';

export function Layout() {
  const { session, user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link to="/courts" className="text-lg font-semibold">
            🎾 {t('common.appName')}
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/courts">{t('layout.courts')}</Link>
            </Button>
            {session && (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/bookings">{t('layout.myBookings')}</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/profile">{user?.displayName ?? t('layout.profile')}</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  {t('layout.signOut')}
                </Button>
              </>
            )}
            {!session && (
              <Button asChild size="sm">
                <Link to="/login">{t('layout.signIn')}</Link>
              </Button>
            )}
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
