import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { apiRequest } from '../lib/api-client';
import type { Booking } from '../lib/types';

export function BookingsPage() {
  const queryClient = useQueryClient();
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings', 'me'],
    queryFn: () => apiRequest<Booking[]>('/bookings/me'),
  });

  const cancelBooking = useMutation({
    mutationFn: (id: string) => apiRequest(`/bookings/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings', 'me'] }),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">My bookings</h1>
      {!bookings?.length && <p className="text-muted-foreground">No bookings yet — go book a court.</p>}
      <div className="flex flex-col gap-3">
        {bookings?.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <span>{booking.court.name}</span>
                <Badge variant={booking.status === 'CANCELLED' ? 'outline' : 'secondary'}>
                  {booking.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
              <span>
                {booking.date.slice(0, 10)} · {booking.startTime} · {booking.durationMinutes} min
                {booking.trainer && <> · with {booking.trainer.name}</>}
              </span>
              {booking.status === 'CONFIRMED' && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={cancelBooking.isPending}
                  onClick={() => cancelBooking.mutate(booking.id)}
                >
                  Cancel
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
