"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartChrome, chartColors } from "@/lib/chart-colors";
import type { StatisticsData } from "@/lib/stats/aggregate";

export function CumulativeHistoryChart({
  data,
}: {
  data: StatisticsData["cumulativeHistory"];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={chartChrome.grid} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={{ stroke: chartChrome.grid }}
          tick={{ fill: chartChrome.axis, fontSize: 12 }}
          minTickGap={40}
          interval="preserveStartEnd"
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={{ fill: chartChrome.axis, fontSize: 12 }}
          width={28}
        />
        <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="stepAfter"
          dataKey="countries"
          name="Countries"
          stroke={chartColors.blue}
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="stepAfter"
          dataKey="cities"
          name="Cities"
          stroke={chartColors.orange}
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="stepAfter"
          dataKey="trips"
          name="Trips"
          stroke={chartColors.aqua}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
