import { EmptyState } from "@/components/shared/EmptyState";
import { TripCard } from "@/components/trips/TripCard";
import { auth } from "@/lib/auth";
import { computeTimeline } from "@/lib/stats/aggregate";
import { getTripsForUser } from "@/server/queries/trips";

export default async function TimelinePage() {
  const session = await auth();
  const trips = await getTripsForUser(session!.user.id);

  if (trips.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <EmptyState
          title="No trips on your timeline yet"
          description="Once you log trips, they'll appear here grouped by year."
        />
      </div>
    );
  }

  const groups = computeTimeline(trips);

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4 pb-24 md:p-8 md:pb-8">
      <div>
        <h1 className="text-2xl font-semibold">Timeline</h1>
        <p className="text-muted-foreground">Every trip, in chronological order.</p>
      </div>

      {groups.map((group) => (
        <div key={group.year} className="relative">
          <div className="sticky top-0 z-10 -mx-4 bg-background/95 px-4 py-2 backdrop-blur md:-mx-8 md:px-8">
            <h2 className="text-xl font-semibold">{group.year}</h2>
            <p className="text-sm text-muted-foreground">
              {group.trips.length} {group.trips.length === 1 ? "trip" : "trips"}
            </p>
          </div>
          <div className="mt-3 space-y-3">
            {group.trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
