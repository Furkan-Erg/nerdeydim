"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { AddCustomCityDialog } from "./AddCustomCityDialog";

export interface CitySummary {
  id: string;
  name: string;
  countryCode: string;
  countryName: string;
}

export function CitySearchCombobox({
  value,
  onChange,
  countries,
}: {
  value: CitySummary | null;
  onChange: (city: CitySummary) => void;
  countries: { code: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CitySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [addCityOpen, setAddCityOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/cities/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setResults(data.cities ?? []);
      } catch {
        // ignore aborted/failed requests
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {value ? (
              <span className="flex items-center gap-2 truncate">
                <MapPin className="size-4 shrink-0 text-muted-foreground" />
                {value.name}, {value.countryName}
              </span>
            ) : (
              <span className="text-muted-foreground">Search for a city...</span>
            )}
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search cities..."
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              {loading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              )}
              {!loading && query.trim().length >= 2 && results.length === 0 && (
                <CommandEmpty>No cities found.</CommandEmpty>
              )}
              <CommandGroup>
                {results.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={city.id}
                    onSelect={() => {
                      onChange(city);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "size-4",
                        value?.id === city.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {city.name}, {city.countryName}
                  </CommandItem>
                ))}
              </CommandGroup>
              <div className="border-t p-1">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm font-normal"
                  onClick={() => {
                    setOpen(false);
                    setAddCityOpen(true);
                  }}
                >
                  <Plus className="size-4" />
                  Can&apos;t find your city? Add it manually
                </Button>
              </div>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <AddCustomCityDialog
        open={addCityOpen}
        onOpenChange={setAddCityOpen}
        onCreated={(city) => onChange(city)}
        countries={countries}
      />
    </>
  );
}
