import Link from "next/link";
import { Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapPageClient } from "@/components/map/MapPageClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAllCountries } from "@/server/queries/countries";
import { getTripsForUser } from "@/server/queries/trips";

export default async function MapPage() {
  const session = await auth();
  const [trips, unspecifiedCities, countries] = await Promise.all([
    getTripsForUser(session!.user.id),
    prisma.city.findMany({
      where: { isUnspecified: true },
      select: { id: true, countryCode: true },
    }),
    getAllCountries(),
  ]);

  const unspecifiedCityByCountry = Object.fromEntries(
    unspecifiedCities.map((c) => [c.countryCode, c.id])
  );

  return (
    <div className="relative h-full w-full">
      <MapPageClient
        trips={trips}
        unspecifiedCityByCountry={unspecifiedCityByCountry}
        countries={countries}
      />

      {trips.length === 0 && (
        <div className="pointer-events-none absolute inset-x-0 top-4 z-[500] flex justify-center px-4">
          <div className="pointer-events-auto flex items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-md">
            <Plane className="size-5 shrink-0 text-primary" />
            <p className="text-sm">
              No trips logged yet — click a country or add your first trip.
            </p>
            <Button asChild size="sm">
              <Link href="/trips/new">Add trip</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
