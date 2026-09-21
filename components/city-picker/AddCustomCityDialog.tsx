"use client";

import dynamic from "next/dynamic";
import { useActionState, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCustomCityAction, type CreateCityResult } from "@/server/actions/cities";
import { CountrySelect } from "./CountrySelect";
import type { CitySummary } from "./CitySearchCombobox";

const MiniLocationPicker = dynamic(() => import("./MiniLocationPicker"), {
  ssr: false,
});

export function AddCustomCityDialog({
  open,
  onOpenChange,
  onCreated,
  countries,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (city: CitySummary) => void;
  countries: { code: string; name: string }[];
}) {
  const [countryCode, setCountryCode] = useState("");
  const [lat, setLat] = useState(20);
  const [lng, setLng] = useState(0);
  const [state, formAction, pending] = useActionState<CreateCityResult | null, FormData>(
    createCustomCityAction,
    null
  );

  useEffect(() => {
    if (state && "success" in state) {
      const country = countries.find((c) => c.code === countryCode);
      onCreated({
        id: state.cityId,
        name: (document.getElementById("custom-city-name") as HTMLInputElement)?.value ?? "",
        countryCode,
        countryName: country?.name ?? "",
      });
      onOpenChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a city</DialogTitle>
          <DialogDescription>
            Can&apos;t find it in search? Add it manually with its location.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-city-name">City name</Label>
            <Input id="custom-city-name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label>Country</Label>
            <CountrySelect
              countries={countries}
              value={countryCode}
              onChange={setCountryCode}
              name="countryCode"
            />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <MiniLocationPicker
              lat={lat}
              lng={lng}
              onPick={(newLat, newLng) => {
                setLat(newLat);
                setLng(newLng);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Click the map to set the location, or enter coordinates directly.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Input
                name="lat"
                type="number"
                step="any"
                min={-90}
                max={90}
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
                aria-label="Latitude"
              />
              <Input
                name="lng"
                type="number"
                step="any"
                min={-180}
                max={180}
                value={lng}
                onChange={(e) => setLng(Number(e.target.value))}
                aria-label="Longitude"
              />
            </div>
          </div>
          {state && "error" in state && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={pending || !countryCode}>
              {pending ? "Adding..." : "Add city"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
