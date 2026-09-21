import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CumulativeHistoryChart } from "@/components/statistics/CumulativeHistoryChart";
import { RankedList } from "@/components/statistics/RankedList";
import { TripDurationList } from "@/components/statistics/TripDurationList";
import { YearlyBarChart } from "@/components/statistics/YearlyBarChart";
import { EmptyState } from "@/components/shared/EmptyState";
import { auth } from "@/lib/auth";
import { chartColors } from "@/lib/chart-colors";
import { computeStatistics } from "@/lib/stats/aggregate";
import { getTripsForUser } from "@/server/queries/trips";

export default async function StatisticsPage() {
  const session = await auth();
  const trips = await getTripsForUser(session!.user.id);

  if (trips.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <EmptyState
          title="No statistics yet"
          description="Log a few trips and your travel analytics will show up here."
        />
      </div>
    );
  }

  const stats = computeStatistics(trips);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 pb-24 md:p-8 md:pb-8">
      <div>
        <h1 className="text-2xl font-semibold">Statistics</h1>
        <p className="text-muted-foreground">
          {stats.countriesVisited} countries · {stats.citiesVisited} cities
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Travel history over time</CardTitle>
        </CardHeader>
        <CardContent>
          <CumulativeHistoryChart data={stats.cumulativeHistory} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Trips per year</CardTitle>
          </CardHeader>
          <CardContent>
            <YearlyBarChart
              data={stats.yearlyBuckets}
              dataKey="trips"
              color={chartColors.blue}
              label="Trips"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Countries per year</CardTitle>
          </CardHeader>
          <CardContent>
            <YearlyBarChart
              data={stats.yearlyBuckets}
              dataKey="countries"
              color={chartColors.aqua}
              label="Countries"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Days travelled per year</CardTitle>
          </CardHeader>
          <CardContent>
            <YearlyBarChart
              data={stats.yearlyBuckets}
              dataKey="days"
              color={chartColors.orange}
              label="Days"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Most visited countries</CardTitle>
          </CardHeader>
          <CardContent>
            <RankedList
              items={stats.mostVisitedCountries.map((c) => ({
                key: c.code,
                primary: c.name,
                count: c.count,
              }))}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most visited cities</CardTitle>
          </CardHeader>
          <CardContent>
            <RankedList
              items={stats.mostVisitedCities.map((c) => ({
                key: `${c.name}-${c.countryName}`,
                primary: c.name,
                secondary: c.countryName,
                count: c.count,
              }))}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Longest trips</CardTitle>
          </CardHeader>
          <CardContent>
            <TripDurationList trips={stats.longestTrips} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Shortest trips</CardTitle>
          </CardHeader>
          <CardContent>
            <TripDurationList trips={stats.shortestTrips} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
