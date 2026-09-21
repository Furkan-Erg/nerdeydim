import type { TripWithCity } from "@/server/queries/trips";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function tripDurationDays(trip: TripWithCity): number {
  const days = Math.round(
    (trip.endDate.getTime() - trip.startDate.getTime()) / MS_PER_DAY
  );
  return days + 1; // inclusive of both start and end day
}

export function tripYear(trip: TripWithCity): number {
  return trip.startDate.getUTCFullYear();
}

function topByCount<T extends { count: number }>(entries: T[], limit = 5): T[] {
  return [...entries].sort((a, b) => b.count - a.count).slice(0, limit);
}

// ---------- Dashboard ----------

export interface DashboardStats {
  totalCountries: number;
  totalCities: number;
  totalTrips: number;
  totalDays: number;
  mostVisitedCountry: { name: string; code: string; count: number } | null;
  mostVisitedCity: { name: string; countryName: string; count: number } | null;
  longestTrip: TripWithCity | null;
  recentTrips: TripWithCity[];
}

export function computeDashboardStats(trips: TripWithCity[]): DashboardStats {
  if (trips.length === 0) {
    return {
      totalCountries: 0,
      totalCities: 0,
      totalTrips: 0,
      totalDays: 0,
      mostVisitedCountry: null,
      mostVisitedCity: null,
      longestTrip: null,
      recentTrips: [],
    };
  }

  const countryCounts = new Map<string, { name: string; code: string; count: number }>();
  const cityCounts = new Map<string, { name: string; countryName: string; count: number }>();
  let totalDays = 0;
  let longestTrip = trips[0];

  for (const trip of trips) {
    const country = trip.city.country;
    const countryEntry = countryCounts.get(country.code) ?? {
      name: country.name,
      code: country.code,
      count: 0,
    };
    countryEntry.count += 1;
    countryCounts.set(country.code, countryEntry);

    const cityEntry = cityCounts.get(trip.cityId) ?? {
      name: trip.city.name,
      countryName: country.name,
      count: 0,
    };
    cityEntry.count += 1;
    cityCounts.set(trip.cityId, cityEntry);

    totalDays += tripDurationDays(trip);

    if (tripDurationDays(trip) > tripDurationDays(longestTrip)) {
      longestTrip = trip;
    }
  }

  const uniqueCityIds = new Set(trips.map((t) => t.cityId));

  return {
    totalCountries: countryCounts.size,
    totalCities: uniqueCityIds.size,
    totalTrips: trips.length,
    totalDays,
    mostVisitedCountry: topByCount([...countryCounts.values()])[0] ?? null,
    mostVisitedCity: topByCount([...cityCounts.values()])[0] ?? null,
    longestTrip,
    recentTrips: [...trips]
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
      .slice(0, 5),
  };
}

// ---------- Timeline ----------

export interface TimelineYearGroup {
  year: number;
  trips: TripWithCity[];
}

export function computeTimeline(trips: TripWithCity[]): TimelineYearGroup[] {
  const byYear = new Map<number, TripWithCity[]>();
  for (const trip of trips) {
    const year = tripYear(trip);
    const group = byYear.get(year) ?? [];
    group.push(trip);
    byYear.set(year, group);
  }

  return [...byYear.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, yearTrips]) => ({
      year,
      trips: yearTrips.sort((a, b) => b.startDate.getTime() - a.startDate.getTime()),
    }));
}

// ---------- Statistics page ----------

export interface YearlyBucket {
  year: number;
  trips: number;
  countries: number;
  days: number;
}

export interface StatisticsData {
  countriesVisited: number;
  citiesVisited: number;
  yearlyBuckets: YearlyBucket[];
  mostVisitedCountries: { name: string; code: string; count: number }[];
  mostVisitedCities: { name: string; countryName: string; count: number }[];
  longestTrips: TripWithCity[];
  shortestTrips: TripWithCity[];
  cumulativeHistory: { date: string; countries: number; cities: number; trips: number }[];
}

export function computeStatistics(trips: TripWithCity[]): StatisticsData {
  if (trips.length === 0) {
    return {
      countriesVisited: 0,
      citiesVisited: 0,
      yearlyBuckets: [],
      mostVisitedCountries: [],
      mostVisitedCities: [],
      longestTrips: [],
      shortestTrips: [],
      cumulativeHistory: [],
    };
  }

  const countryCounts = new Map<string, { name: string; code: string; count: number }>();
  const cityCounts = new Map<string, { name: string; countryName: string; count: number }>();
  const yearBuckets = new Map<
    number,
    { trips: number; countries: Set<string>; days: number }
  >();

  for (const trip of trips) {
    const country = trip.city.country;

    const countryEntry = countryCounts.get(country.code) ?? {
      name: country.name,
      code: country.code,
      count: 0,
    };
    countryEntry.count += 1;
    countryCounts.set(country.code, countryEntry);

    const cityEntry = cityCounts.get(trip.cityId) ?? {
      name: trip.city.name,
      countryName: country.name,
      count: 0,
    };
    cityEntry.count += 1;
    cityCounts.set(trip.cityId, cityEntry);

    const year = tripYear(trip);
    const bucket = yearBuckets.get(year) ?? {
      trips: 0,
      countries: new Set<string>(),
      days: 0,
    };
    bucket.trips += 1;
    bucket.countries.add(country.code);
    bucket.days += tripDurationDays(trip);
    yearBuckets.set(year, bucket);
  }

  const yearlyBuckets: YearlyBucket[] = [...yearBuckets.entries()]
    .sort(([a], [b]) => a - b)
    .map(([year, bucket]) => ({
      year,
      trips: bucket.trips,
      countries: bucket.countries.size,
      days: bucket.days,
    }));

  const byDuration = [...trips].sort(
    (a, b) => tripDurationDays(b) - tripDurationDays(a)
  );

  // Chronological cumulative history (unique countries/cities/trips over time)
  const chronological = [...trips].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );
  const seenCountries = new Set<string>();
  const seenCities = new Set<string>();
  const cumulativeHistory = chronological.map((trip, index) => {
    seenCountries.add(trip.city.country.code);
    seenCities.add(trip.cityId);
    return {
      date: trip.startDate.toISOString().slice(0, 10),
      countries: seenCountries.size,
      cities: seenCities.size,
      trips: index + 1,
    };
  });

  return {
    countriesVisited: countryCounts.size,
    citiesVisited: cityCounts.size,
    yearlyBuckets,
    mostVisitedCountries: topByCount([...countryCounts.values()], 10),
    mostVisitedCities: topByCount([...cityCounts.values()], 10),
    longestTrips: byDuration.slice(0, 5),
    shortestTrips: byDuration.slice(-5).reverse(),
    cumulativeHistory,
  };
}
