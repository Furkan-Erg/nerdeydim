import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TripCard } from "@/components/trips/TripCard";
import type { TripWithCity } from "@/server/queries/trips";

export function CountryDetailPanel({
  countryName,
  trips,
  unspecifiedCityId,
}: {
  countryName: string;
  trips: TripWithCity[];
  unspecifiedCityId?: string;
}) {
  const uniqueCities = new Set(trips.map((t) => t.cityId)).size;

  return (
    <div className="space-y-4">
      {trips.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You haven&apos;t logged any trips to {countryName} yet.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          {trips.length} {trips.length === 1 ? "trip" : "trips"} · {uniqueCities}{" "}
          {uniqueCities === 1 ? "city" : "cities"}
        </p>
      )}

      <Button asChild size="sm" className="gap-1.5">
        <Link
          href={
            unspecifiedCityId ? `/trips/new?cityId=${unspecifiedCityId}` : "/trips/new"
          }
        >
          <Plus className="size-4" />
          Add a trip to {countryName}
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
