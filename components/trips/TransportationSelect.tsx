"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { transportationMeta } from "@/lib/transportation";
import type { TransportationType } from "@prisma/client";

export function TransportationSelect({
  value,
  onChange,
  name,
}: {
  value: TransportationType;
  onChange: (value: TransportationType) => void;
  name?: string;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as TransportationType)} name={name}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(transportationMeta) as TransportationType[]).map((type) => {
          const { label, icon: Icon } = transportationMeta[type];
          return (
            <SelectItem key={type} value={type}>
              <Icon className="size-4" />
              {label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
