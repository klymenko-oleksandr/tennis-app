import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Field, FieldGroup, FieldLabel } from '../components/ui/field';
import { Input } from '../components/ui/input';
import { apiRequest } from '../lib/api-client';
import { useAuth } from '../lib/auth-context';
import type { UserProfile } from '../lib/types';

export function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState('');
  const [ntrpLevel, setNtrpLevel] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName ?? '');
      setNtrpLevel(user.ntrpLevel != null ? String(user.ntrpLevel) : '');
    }
  }, [user]);

  const updateProfile = useMutation({
    mutationFn: () =>
      apiRequest<UserProfile>('/auth/me', {
        method: 'PATCH',
        body: {
          displayName: displayName || null,
          ntrpLevel: ntrpLevel ? Number(ntrpLevel) : null,
        },
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(['me'], updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  if (!user) return <p className="text-muted-foreground">{t('common.loading')}</p>;

  return (
    <div className="mx-auto max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">{t('profile.email')}</FieldLabel>
              <Input id="email" value={user.email} disabled />
            </Field>
            <Field>
              <FieldLabel htmlFor="displayName">{t('profile.displayName')}</FieldLabel>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="ntrp">{t('profile.ntrpLevel')}</FieldLabel>
              <Input
                id="ntrp"
                type="number"
                step="0.5"
                min={1}
                max={7}
                value={ntrpLevel}
                onChange={(e) => setNtrpLevel(e.target.value)}
              />
            </Field>
            <Button disabled={updateProfile.isPending} onClick={() => updateProfile.mutate()}>
              {updateProfile.isPending ? t('profile.saving') : saved ? t('profile.saved') : t('profile.save')}
            </Button>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
