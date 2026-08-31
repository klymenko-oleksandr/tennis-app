import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { apiRequest } from '../lib/api-client';
import type { PartnerInvites, PartnerMatchStatus } from '../lib/types';

function statusVariant(status: PartnerMatchStatus) {
  if (status === 'ACCEPTED') return 'secondary' as const;
  if (status === 'DECLINED') return 'outline' as const;
  return 'default' as const;
}

export function InvitesPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: invites, isLoading } = useQuery({
    queryKey: ['partners', 'invites'],
    queryFn: () => apiRequest<PartnerInvites>('/partners/invites'),
  });

  const respond = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACCEPTED' | 'DECLINED' }) =>
      apiRequest(`/partners/invites/${id}`, { method: 'PATCH', body: { status } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partners', 'invites'] }),
  });

  if (isLoading) return <p className="text-muted-foreground">{t('common.loading')}</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">{t('invites.receivedTitle')}</h1>
        {!invites?.received.length && (
          <p className="text-muted-foreground">{t('invites.receivedEmpty')}</p>
        )}
        {invites?.received.map((invite) => (
          <Card key={invite.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <span>{invite.fromUser.displayName ?? t('partners.anonymous')}</span>
                <Badge variant={statusVariant(invite.status)}>{t(`invites.status.${invite.status}`)}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">
                {invite.booking
                  ? `${invite.booking.court.name} · ${invite.booking.date.slice(0, 10)} · ${invite.booking.startTime}`
                  : t('invites.noBooking')}
              </span>
              {invite.status === 'PENDING' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={respond.isPending}
                    onClick={() => respond.mutate({ id: invite.id, status: 'DECLINED' })}
                  >
                    {t('invites.decline')}
                  </Button>
                  <Button
                    size="sm"
                    disabled={respond.isPending}
                    onClick={() => respond.mutate({ id: invite.id, status: 'ACCEPTED' })}
                  >
                    {t('invites.accept')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">{t('invites.sentTitle')}</h1>
        {!invites?.sent.length && <p className="text-muted-foreground">{t('invites.sentEmpty')}</p>}
        {invites?.sent.map((invite) => (
          <Card key={invite.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <span>{invite.toUser.displayName ?? t('partners.anonymous')}</span>
                <Badge variant={statusVariant(invite.status)}>{t(`invites.status.${invite.status}`)}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-sm text-muted-foreground">
                {invite.booking
                  ? `${invite.booking.court.name} · ${invite.booking.date.slice(0, 10)} · ${invite.booking.startTime}`
                  : t('invites.noBooking')}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
