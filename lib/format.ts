import { format } from "date-fns";

export function formatDateRange(start: Date, end: Date): string {
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const sameMonth = sameYear && start.getUTCMonth() === end.getUTCMonth();
  const sameDay = sameMonth && start.getUTCDate() === end.getUTCDate();

  const startFmt = formatUTC(start, sameYear ? "MMM d" : "MMM d, yyyy");
  const endFmt = formatUTC(end, "MMM d, yyyy");

  if (sameDay) return formatUTC(start, "MMM d, yyyy");
  return `${startFmt} – ${endFmt}`;
}

function formatUTC(date: Date, pattern: string): string {
  // Trip dates are stored as UTC-midnight @db.Date values; format using UTC
  // fields so the displayed date never shifts a day off in local timezones.
  const utcAsLocal = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );
  return format(utcAsLocal, pattern);
}

export function formatDuration(days: number): string {
  return days === 1 ? "1 day" : `${days} days`;
}

export { formatUTC };
