"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartChrome } from "@/lib/chart-colors";
import type { YearlyBucket } from "@/lib/stats/aggregate";

export function YearlyBarChart({
  data,
  dataKey,
  color,
  label,
}: {
  data: YearlyBucket[];
  dataKey: keyof YearlyBucket;
  color: string;
  label: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={chartChrome.grid} />
        <XAxis
          dataKey="year"
          tickLine={false}
          axisLine={{ stroke: chartChrome.grid }}
          tick={{ fill: chartChrome.axis, fontSize: 12 }}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={{ fill: chartChrome.axis, fontSize: 12 }}
          width={28}
        />
        <Tooltip
          cursor={{ fill: chartChrome.grid, opacity: 0.4 }}
          formatter={(value) => [value, label] as [number, string]}
          contentStyle={{ fontSize: 13, borderRadius: 8 }}
        />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
