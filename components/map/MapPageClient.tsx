"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { CityDetailPanel } from "@/components/map/CityDetailPanel";
import { CountryDetailPanel } from "@/components/map/CountryDetailPanel";
import { MapLegend } from "@/components/map/MapLegend";
import { ResponsivePanel } from "@/components/map/ResponsivePanel";
import type { CityMarkerData } from "@/components/map/WorldMap";
import { useMapStore } from "@/lib/store/mapStore";
import type { TripWithCity } from "@/server/queries/trips";

const WorldMap = dynamic(() => import("@/components/map/WorldMap").then((m) => m.WorldMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted/30">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

export function MapPageClient({
  trips,
  unspecifiedCityByCountry,
  countries,
}: {
  trips: TripWithCity[];
  unspecifiedCityByCountry: Record<string, string>;
  countries: { code: string; name: string }[];
}) {
  const [geoJson, setGeoJson] = useState<GeoJSON.FeatureCollection | null>(null);
  const selectedCountryCode = useMapStore((s) => s.selectedCountryCode);
  const selectedCityId = useMapStore((s) => s.selectedCityId);
  const setSelectedCountryCode = useMapStore((s) => s.setSelectedCountryCode);
  const setSelectedCityId = useMapStore((s) => s.setSelectedCityId);
  const clearSelection = useMapStore((s) => s.clearSelection);

  useEffect(() => {
    fetch("/data/countries.geojson")
      .then((res) => res.json())
      .then(setGeoJson);
  }, []);

  const visitedCountryCodes = useMemo(
    () => new Set(trips.map((t) => t.city.countryCode)),
    [trips]
  );

  const cities = useMemo<CityMarkerData[]>(() => {
    const map = new Map<string, CityMarkerData>();
    for (const trip of trips) {
      if (trip.city.isUnspecified) continue;
      const existing = map.get(trip.cityId);
      if (existing) {
        existing.tripCount += 1;
      } else {
        map.set(trip.cityId, {
          id: trip.cityId,
          name: trip.city.name,
          lat: trip.city.lat,
          lng: trip.city.lng,
          countryCode: trip.city.countryCode,
          tripCount: 1,
        });
      }
    }
    return [...map.values()];
  }, [trips]);

  const tripsByCountry = useMemo(() => {
    const map = new Map<string, TripWithCity[]>();
    for (const trip of trips) {
      const list = map.get(trip.city.countryCode) ?? [];
      list.push(trip);
      map.set(trip.city.countryCode, list);
    }
    return map;
  }, [trips]);

  const tripsByCity = useMemo(() => {
    const map = new Map<string, TripWithCity[]>();
    for (const trip of trips) {
      const list = map.get(trip.cityId) ?? [];
      list.push(trip);
      map.set(trip.cityId, list);
    }
    return map;
  }, [trips]);

  const countryNameByCode = useMemo(
    () => Object.fromEntries(countries.map((c) => [c.code, c.name])),
    [countries]
  );

  const selectedCity =
    selectedCityId != null
      ? (cities.find((c) => c.id === selectedCityId) ?? null)
      : null;
  const selectedCountryTrips = selectedCountryCode
    ? (tripsByCountry.get(selectedCountryCode) ?? [])
    : [];
  const selectedCountryName =
    selectedCountryCode &&
    (countryNameByCode[selectedCountryCode] ?? selectedCountryCode);

  return (
    <div className="relative isolate h-full w-full">
      {geoJson ? (
        <WorldMap
          countriesGeoJson={geoJson}
          visitedCountryCodes={visitedCountryCodes}
          cities={cities}
          selectedCityId={selectedCityId}
          onCountryClick={setSelectedCountryCode}
          onCityClick={setSelectedCityId}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted/30">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      <MapLegend />

      <ResponsivePanel
        open={selectedCountryCode != null}
        onOpenChange={(open) => !open && clearSelection()}
        title={selectedCountryName || ""}
      >
        {selectedCountryCode && (
          <CountryDetailPanel
            countryName={selectedCountryName || selectedCountryCode}
            trips={selectedCountryTrips}
            unspecifiedCityId={unspecifiedCityByCountry[selectedCountryCode]}
          />
        )}
      </ResponsivePanel>

      <ResponsivePanel
        open={selectedCityId != null}
        onOpenChange={(open) => !open && clearSelection()}
        title={selectedCity?.name ?? ""}
      >
        {selectedCityId && selectedCity && (
          <CityDetailPanel
            cityId={selectedCityId}
            cityName={selectedCity.name}
            countryName={
              (tripsByCity.get(selectedCityId)?.[0]?.city.country.name) ?? ""
            }
            trips={tripsByCity.get(selectedCityId) ?? []}
          />
        )}
      </ResponsivePanel>
    </div>
  );
}
