import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Field, FieldGroup, FieldLabel } from '../components/ui/field';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import { ApiError, apiRequest } from '../lib/api-client';
import { useAuth } from '../lib/auth-context';
import type { Booking, Court, Trainer } from '../lib/types';

const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00',
];
const DURATIONS = [60, 90, 120];

function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function CourtDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [date, setDate] = useState(tomorrow());
  const [startTime, setStartTime] = useState<string>();
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [withCoach, setWithCoach] = useState(false);
  const [trainerId, setTrainerId] = useState<string>();
  const [error, setError] = useState<string | null>(null);

  const { data: court } = useQuery({
    queryKey: ['courts', id],
    queryFn: () => apiRequest<Court>(`/courts/${id}`, { auth: false }),
  });
  const { data: trainers } = useQuery({
    queryKey: ['trainers'],
    queryFn: () => apiRequest<Trainer[]>('/trainers', { auth: false }),
    enabled: withCoach,
  });

  const createBooking = useMutation({
    mutationFn: () =>
      apiRequest<Booking>('/bookings', {
        method: 'POST',
        body: {
          courtId: id,
          date,
          startTime,
          durationMinutes,
          trainerId: withCoach ? trainerId : undefined,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'me'] });
      navigate('/bookings');
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : 'Could not create the booking');
    },
  });

  if (!court) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{court.name}</h1>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">{court.surface}</Badge>
          <span>{court.area}</span>
          {court.indoor && <Badge variant="outline">Indoor</Badge>}
          <span className="ml-auto font-medium text-foreground">{court.pricePerHour} ₴/h</span>
        </div>
        {court.description && <p className="mt-3 text-sm text-muted-foreground">{court.description}</p>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book this court</CardTitle>
        </CardHeader>
        <CardContent>
          {!session ? (
            <Button onClick={() => navigate('/login')}>Sign in to book</Button>
          ) : (
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="date">Date</FieldLabel>
                <Input
                  id="date"
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel>Time</FieldLabel>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  value={startTime}
                  onValueChange={(value) => setStartTime(value || undefined)}
                  className="flex-wrap justify-start"
                >
                  {TIME_SLOTS.map((time) => (
                    <ToggleGroupItem key={time} value={time}>
                      {time}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Field>

              <Field>
                <FieldLabel>Duration</FieldLabel>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  value={String(durationMinutes)}
                  onValueChange={(value) => value && setDurationMinutes(Number(value))}
                >
                  {DURATIONS.map((d) => (
                    <ToggleGroupItem key={d} value={String(d)}>
                      {d} min
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Field>

              <Field orientation="horizontal">
                <FieldLabel htmlFor="with-coach">Add a coach</FieldLabel>
                <Switch id="with-coach" checked={withCoach} onCheckedChange={setWithCoach} />
              </Field>

              {withCoach && (
                <Field>
                  <FieldLabel>Coach</FieldLabel>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    value={trainerId}
                    onValueChange={(value) => setTrainerId(value || undefined)}
                    className="flex-wrap justify-start"
                  >
                    {trainers?.map((trainer) => (
                      <ToggleGroupItem key={trainer.id} value={trainer.id}>
                        {trainer.name} · {trainer.pricePerHour} ₴/h
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </Field>
              )}

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <Button
                disabled={!startTime || (withCoach && !trainerId) || createBooking.isPending}
                onClick={() => {
                  setError(null);
                  createBooking.mutate();
                }}
              >
                {createBooking.isPending ? 'Booking…' : 'Book now'}
              </Button>
            </FieldGroup>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
