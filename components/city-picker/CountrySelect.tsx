"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CountrySelect({
  countries,
  value,
  onChange,
  name,
}: {
  countries: { code: string; name: string }[];
  value: string;
  onChange: (code: string) => void;
  name?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange} name={name}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        {countries.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
