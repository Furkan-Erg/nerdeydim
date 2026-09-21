export function RankedList({
  items,
}: {
  items: { key: string; primary: string; secondary?: string; count: number }[];
}) {
  const max = Math.max(...items.map((i) => i.count), 1);

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No data yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={item.key} className="flex items-center gap-3">
          <span className="w-4 shrink-0 text-sm text-muted-foreground">{index + 1}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate text-sm font-medium">
                {item.primary}
                {item.secondary && (
                  <span className="ml-1.5 text-muted-foreground">{item.secondary}</span>
                )}
              </span>
              <span className="shrink-0 text-sm text-muted-foreground">{item.count}</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
