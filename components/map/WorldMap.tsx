"use client";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./world-map.css";

import { useEffect, useMemo, useRef } from "react";
import type { Feature, Geometry } from "geojson";
import L, { type Layer, type Map as LeafletMap, type PathOptions } from "leaflet";
import { GeoJSON, MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

export interface CityMarkerData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  countryCode: string;
  tripCount: number;
}

interface CountryProperties {
  ISO_A2: string;
  name: string;
}

const MAP_COLORS = {
  visited: "#14b8a6",
  unvisited: "#e2e5e9",
  border: "#94a3b8",
  hoverBorder: "#334155",
};

function FlyToCity({ city }: { city: CityMarkerData | null }) {
  const map = useMap();
  const lastFlownTo = useRef<string | null>(null);

  useEffect(() => {
    if (!city || lastFlownTo.current === city.id) return;
    lastFlownTo.current = city.id;
    map.flyTo([city.lat, city.lng], Math.max(map.getZoom(), 5), { duration: 0.75 });
  }, [city, map]);

  return null;
}

function cityDivIcon(count: number) {
  return L.divIcon({
    html: `<div class="city-marker-pin">${count > 1 ? count : ""}</div>`,
    className: "city-marker-icon",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

export function WorldMap({
  countriesGeoJson,
  visitedCountryCodes,
  cities,
  selectedCityId,
  onCountryClick,
  onCityClick,
}: {
  countriesGeoJson: GeoJSON.FeatureCollection;
  visitedCountryCodes: Set<string>;
  cities: CityMarkerData[];
  selectedCityId: string | null;
  onCountryClick: (code: string) => void;
  onCityClick: (cityId: string) => void;
}) {
  const mapRef = useRef<LeafletMap | null>(null);
  const selectedCity = cities.find((c) => c.id === selectedCityId) ?? null;

  const countryStyle = useMemo(
    () =>
      (feature?: Feature<Geometry, CountryProperties>): PathOptions => {
        const visited = feature && visitedCountryCodes.has(feature.properties.ISO_A2);
        return {
          fillColor: visited ? MAP_COLORS.visited : MAP_COLORS.unvisited,
          fillOpacity: visited ? 0.75 : 0.55,
          color: MAP_COLORS.border,
          weight: 0.75,
        };
      },
    [visitedCountryCodes]
  );

  function onEachCountry(feature: Feature<Geometry, CountryProperties>, layer: Layer) {
    layer.on({
      click: () => {
        onCountryClick(feature.properties.ISO_A2);
        const path = layer as L.Polygon;
        if (mapRef.current && path.getBounds) {
          mapRef.current.flyToBounds(path.getBounds(), {
            duration: 0.75,
            maxZoom: 5,
            padding: [40, 40],
          });
        }
      },
      mouseover: (e) => {
        const target = e.target as L.Path;
        target.setStyle({ weight: 2, color: MAP_COLORS.hoverBorder });
      },
      mouseout: (e) => {
        const target = e.target as L.Path;
        target.setStyle({ weight: 0.75, color: MAP_COLORS.border });
      },
    });
  }

  return (
    <MapContainer
      center={[20, 10]}
      zoom={2.3}
      minZoom={2}
      worldCopyJump
      className="h-full w-full"
      ref={mapRef}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <GeoJSON
        key={visitedCountryCodes.size}
        data={countriesGeoJson as never}
        style={countryStyle as never}
        onEachFeature={onEachCountry as never}
      />
      <MarkerClusterGroup chunkedLoading maxClusterRadius={40}>
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.lat, city.lng]}
            icon={cityDivIcon(city.tripCount)}
            eventHandlers={{ click: () => onCityClick(city.id) }}
          />
        ))}
      </MarkerClusterGroup>
      <FlyToCity city={selectedCity} />
    </MapContainer>
  );
}
