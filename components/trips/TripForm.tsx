"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CitySearchCombobox, type CitySummary } from "@/components/city-picker/CitySearchCombobox";
import { RatingInput } from "./RatingInput";
import { TransportationSelect } from "./TransportationSelect";
import type { TransportationType } from "@prisma/client";

export type TripFormAction = (
  prevState: { error: string } | { success: true } | null,
  formData: FormData
) => Promise<{ error: string } | { success: true }>;

export interface TripFormInitialValues {
  city: CitySummary | null;
  startDate: string;
  endDate: string;
  notes: string;
  rating: number;
  transportationType: TransportationType;
}

export function TripForm({
  action,
  submitLabel,
  countries,
  initialValues,
}: {
  action: TripFormAction;
  submitLabel: string;
  countries: { code: string; name: string }[];
  initialValues: TripFormInitialValues;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, null);
  const [city, setCity] = useState<CitySummary | null>(initialValues.city);
  const [rating, setRating] = useState(initialValues.rating);
  const [transportationType, setTransportationType] = useState<TransportationType>(
    initialValues.transportationType
  );

  return (
    <form action={formAction} className="space-y-5">
      {city && <input type="hidden" name="cityId" value={city.id} />}

      <div className="space-y-2">
        <Label>City</Label>
        <CitySearchCombobox value={city} onChange={setCity} countries={countries} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={initialValues.startDate}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End date</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={initialValues.endDate}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Transportation</Label>
        <TransportationSelect
          value={transportationType}
          onChange={setTransportationType}
          name="transportationType"
        />
      </div>

      <div className="space-y-2">
        <Label>Rating</Label>
        <RatingInput value={rating} onChange={setRating} name="rating" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="What did you get up to?"
          defaultValue={initialValues.notes}
        />
      </div>

      {state && "error" in state && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending || !city}>
          {pending ? "Saving..." : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
