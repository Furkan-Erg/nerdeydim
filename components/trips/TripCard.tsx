"use client";

import Link from "next/link";
import { useTransition } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateRange, formatDuration } from "@/lib/format";
import { tripDurationDays } from "@/lib/stats/aggregate";
import { transportationMeta } from "@/lib/transportation";
import { deleteTripAction } from "@/server/actions/trips";
import type { TripWithCity } from "@/server/queries/trips";
import { RatingStars } from "./RatingStars";

export function TripCard({ trip }: { trip: TripWithCity }) {
  const [isPending, startTransition] = useTransition();
  const TransportIcon = transportationMeta[trip.transportationType].icon;

  function handleDelete() {
    if (!confirm(`Delete this trip to ${trip.city.name}? This can't be undone.`)) return;
    startTransition(async () => {
      const result = await deleteTripAction(trip.id);
      if ("error" in result) toast.error(result.error);
      else toast.success("Trip deleted");
    });
  }

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border bg-card p-4">
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium">
            {trip.city.isUnspecified ? trip.city.country.name : trip.city.name}
          </h3>
          {!trip.city.isUnspecified && (
            <span className="text-sm text-muted-foreground">{trip.city.country.name}</span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
          <span>·</span>
          <span>{formatDuration(tripDurationDays(trip))}</span>
          <Badge variant="secondary" className="gap-1">
            <TransportIcon className="size-3" />
            {transportationMeta[trip.transportationType].label}
          </Badge>
        </div>
        {trip.rating && <RatingStars rating={trip.rating} />}
        {trip.notes && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{trip.notes}</p>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isPending} className="shrink-0">
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/trips/${trip.id}/edit`}>
              <Pencil className="size-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={handleDelete}>
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
