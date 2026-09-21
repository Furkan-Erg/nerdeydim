// Validated categorical palette (see dataviz skill references/palette.md).
// Slot order is the CVD-safety mechanism — keep it fixed, never reassign per-chart.
export const chartColors = {
  blue: "#2a78d6",
  orange: "#eb6834",
  aqua: "#1baf7a",
  yellow: "#eda100",
  magenta: "#e87ba4",
  green: "#008300",
  violet: "#4a3aa7",
  red: "#e34948",
} as const;

export const chartChrome = {
  grid: "#e1e0d9",
  axis: "#898781",
  ink: "#52514e",
};
