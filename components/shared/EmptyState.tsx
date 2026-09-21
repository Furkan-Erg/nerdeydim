import Link from "next/link";
import { Plane } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title = "No trips yet",
  description = "Add your first trip to start building your travel map, timeline, and stats.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-accent">
        <Plane className="size-8 text-accent-foreground" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      <Button asChild>
        <Link href="/trips/new">Add your first trip</Link>
      </Button>
    </div>
  );
}
