import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Field, FieldGroup, FieldLabel } from '../components/ui/field';
import { Input } from '../components/ui/input';
import { signInWithGoogle, signInWithPassword, signUpWithPassword } from '../lib/auth-client';

export function LoginPage() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        await signUpWithPassword(email, password);
      } else {
        await signInWithPassword(email, password);
      }
      navigate('/courts');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.errorGeneric'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'signin' ? t('auth.signIn') : t('auth.createAccount')}</CardTitle>
          <CardDescription>{t('auth.tagline')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field data-invalid={!!error}>
                <FieldLabel htmlFor="email">{t('auth.email')}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field data-invalid={!!error}>
                <FieldLabel htmlFor="password">{t('auth.password')}</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!error}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </Field>
              <Button type="submit" disabled={isSubmitting}>
                {mode === 'signin' ? t('auth.signInButton') : t('auth.signUpButton')}
              </Button>
              <Button type="button" variant="outline" onClick={() => signInWithGoogle()}>
                {t('auth.continueWithGoogle')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              >
                {mode === 'signin' ? t('auth.noAccount') : t('auth.hasAccount')}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
