import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  className,
}: {
  rating: number | null;
  className?: string;
}) {
  if (!rating) return null;
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < rating ? "fill-chart-2 text-chart-2" : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}
