import { formatDateRange, formatDuration } from "@/lib/format";
import { tripDurationDays } from "@/lib/stats/aggregate";
import type { TripWithCity } from "@/server/queries/trips";

export function TripDurationList({ trips }: { trips: TripWithCity[] }) {
  if (trips.length === 0) {
    return <p className="text-sm text-muted-foreground">No data yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {trips.map((trip) => (
        <li key={trip.id} className="flex items-center justify-between gap-3 text-sm">
          <div className="min-w-0">
            <p className="truncate font-medium">
              {trip.city.isUnspecified ? trip.city.country.name : trip.city.name}
            </p>
            <p className="truncate text-muted-foreground">
              {formatDateRange(trip.startDate, trip.endDate)}
            </p>
          </div>
          <span className="shrink-0 text-muted-foreground">
            {formatDuration(tripDurationDays(trip))}
          </span>
        </li>
      ))}
    </ul>
  );
}
