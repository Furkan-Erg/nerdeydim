import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TripCard } from "@/components/trips/TripCard";
import type { TripWithCity } from "@/server/queries/trips";

export function CityDetailPanel({
  cityId,
  cityName,
  countryName,
  trips,
}: {
  cityId: string;
  cityName: string;
  countryName: string;
  trips: TripWithCity[];
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {countryName} · {trips.length} {trips.length === 1 ? "trip" : "trips"}
      </p>

      <Button asChild size="sm" className="gap-1.5">
        <Link href={`/trips/new?cityId=${cityId}`}>
          <Plus className="size-4" />
          Add another trip to {cityName}
        </Link>
      </Button>

      <div className="space-y-3">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
}
