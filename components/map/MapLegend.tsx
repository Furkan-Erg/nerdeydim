export function MapLegend() {
  return (
    <div className="absolute bottom-20 left-4 z-[1000] flex flex-col gap-1.5 rounded-md border bg-card/95 px-3 py-2 text-xs shadow-sm backdrop-blur md:bottom-4">
      <div className="flex items-center gap-2">
        <span className="size-2.5 rounded-sm" style={{ background: "#14b8a6" }} />
        Visited
      </div>
      <div className="flex items-center gap-2">
        <span className="size-2.5 rounded-sm" style={{ background: "#e2e5e9" }} />
        Not visited
      </div>
      <div className="flex items-center gap-2">
        <span className="size-2.5 rounded-full bg-primary" />
        City
      </div>
    </div>
  );
}
