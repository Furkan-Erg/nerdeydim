"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingInput({
  value,
  onChange,
  name,
}: {
  value: number;
  onChange: (value: number) => void;
  name?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
      <input type="hidden" name={name} value={value || ""} />
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        return (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHovered(starValue)}
            onClick={() => onChange(value === starValue ? 0 : starValue)}
            className="p-0.5"
            aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                "size-6 transition-colors",
                starValue <= display
                  ? "fill-chart-2 text-chart-2"
                  : "text-muted-foreground/30"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
