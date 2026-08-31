import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { apiRequest } from '../lib/api-client';
import type { Court } from '../lib/types';

export function CourtsListPage() {
  const { data: courts, isLoading } = useQuery({
    queryKey: ['courts'],
    queryFn: () => apiRequest<Court[]>('/courts', { auth: false }),
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Courts</h1>
      {isLoading && <p className="text-muted-foreground">Loading courts…</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {courts?.map((court) => (
          <Link key={court.id} to={`/courts/${court.id}`}>
            <Card className="h-full transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <span>{court.name}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {court.pricePerHour} ₴/h
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{court.surface}</Badge>
                <span>{court.area}</span>
                {court.indoor && <Badge variant="outline">Indoor</Badge>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
