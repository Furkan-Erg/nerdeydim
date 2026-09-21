"use client";

import "leaflet/dist/leaflet.css";
import "@/components/map/world-map.css";
import { useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

const pickerIcon = L.divIcon({
  html: '<div class="city-marker-pin"></div>',
  className: "city-marker-icon",
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MiniLocationPicker({
  lat,
  lng,
  onPick,
}: {
  lat: number;
  lng: number;
  onPick: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<[number, number]>([lat, lng]);

  return (
    <div className="h-48 w-full overflow-hidden rounded-md border">
      <MapContainer
        center={position}
        zoom={3}
        className="h-full w-full"
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} icon={pickerIcon} />
        <ClickHandler
          onPick={(newLat, newLng) => {
            setPosition([newLat, newLng]);
            onPick(newLat, newLng);
          }}
        />
      </MapContainer>
    </div>
  );
}
