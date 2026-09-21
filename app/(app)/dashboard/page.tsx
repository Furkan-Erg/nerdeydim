import { Calendar, Globe2, MapPin, Plane, Star, Trophy } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { TripCard } from "@/components/trips/TripCard";
import { auth } from "@/lib/auth";
import { formatDateRange, formatDuration } from "@/lib/format";
import { computeDashboardStats, tripDurationDays } from "@/lib/stats/aggregate";
import { getTripsForUser } from "@/server/queries/trips";

export default async function DashboardPage() {
  const session = await auth();
  const trips = await getTripsForUser(session!.user.id);

  if (trips.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <EmptyState />
      </div>
    );
  }

  const stats = computeDashboardStats(trips);

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 pb-24 md:p-8 md:pb-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">An overview of your travel history.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Countries visited" value={stats.totalCountries} icon={Globe2} />
        <StatCard label="Cities visited" value={stats.totalCities} icon={MapPin} />
        <StatCard label="Total trips" value={stats.totalTrips} icon={Plane} />
        <StatCard label="Days travelled" value={stats.totalDays} icon={Calendar} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Trophy className="size-4" />
            Most visited country
          </div>
          <p className="text-lg font-semibold">
            {stats.mostVisitedCountry?.name ?? "—"}
          </p>
          {stats.mostVisitedCountry && (
            <p className="text-sm text-muted-foreground">
              {stats.mostVisitedCountry.count}{" "}
              {stats.mostVisitedCountry.count === 1 ? "trip" : "trips"}
            </p>
          )}
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Trophy className="size-4" />
            Most visited city
          </div>
          <p className="text-lg font-semibold">{stats.mostVisitedCity?.name ?? "—"}</p>
          {stats.mostVisitedCity && (
            <p className="text-sm text-muted-foreground">
              {stats.mostVisitedCity.count}{" "}
              {stats.mostVisitedCity.count === 1 ? "trip" : "trips"}
            </p>
          )}
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Star className="size-4" />
            Longest trip
          </div>
          {stats.longestTrip && (
            <>
              <p className="text-lg font-semibold">
                {stats.longestTrip.city.isUnspecified
                  ? stats.longestTrip.city.country.name
                  : stats.longestTrip.city.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDuration(tripDurationDays(stats.longestTrip))} ·{" "}
                {formatDateRange(stats.longestTrip.startDate, stats.longestTrip.endDate)}
              </p>
            </>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Recent trips</h2>
        <div className="space-y-3">
          {stats.recentTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </div>
  );
}
