import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ApiError, apiRequest } from '../lib/api-client';
import type { PublicProfile } from '../lib/types';

function initials(name: string | null) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function PartnersPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const { data: players, isLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: () => apiRequest<PublicProfile[]>('/partners'),
  });

  const sendInvite = useMutation({
    mutationFn: (toUserId: string) => apiRequest('/partners/invites', { method: 'POST', body: { toUserId } }),
    onSuccess: (_data, toUserId) => {
      setInvitedIds((prev) => new Set(prev).add(toUserId));
      queryClient.invalidateQueries({ queryKey: ['partners', 'invites'] });
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : t('partners.errorGeneric'));
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{t('partners.title')}</h1>
      {isLoading && <p className="text-muted-foreground">{t('common.loading')}</p>}
      {!isLoading && !players?.length && (
        <p className="text-muted-foreground">{t('partners.empty')}</p>
      )}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-3">
        {players?.map((player) => (
          <Card key={player.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{initials(player.displayName)}</AvatarFallback>
                </Avatar>
                <span className="flex-1">{player.displayName ?? t('partners.anonymous')}</span>
                {player.ntrpLevel != null && (
                  <span className="text-sm font-normal text-muted-foreground">
                    {t('partners.ntrp', { level: player.ntrpLevel })}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{player.lookingToPlayNote}</p>
              <Button
                size="sm"
                disabled={invitedIds.has(player.id) || sendInvite.isPending}
                onClick={() => {
                  setError(null);
                  sendInvite.mutate(player.id);
                }}
              >
                {invitedIds.has(player.id) ? t('partners.invited') : t('partners.invite')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
