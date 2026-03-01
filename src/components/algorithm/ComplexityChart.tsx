"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ComplexityInfo } from "@/lib/visualization/types";

const complexityRank: Record<string, number> = {
  "O(1)": 1,
  "O(log n)": 2,
  "O(√n)": 3,
  "O(n)": 4,
  "O(n log n)": 5,
  "O(n²)": 6,
  "O(n³)": 7,
  "O(2^n)": 8,
  "O(n!)": 9,
};

function getRank(complexity: string): number {
  return complexityRank[complexity] ?? 5;
}

interface ComplexityChartProps {
  timeComplexity: ComplexityInfo;
  spaceComplexity: ComplexityInfo;
}

export function ComplexityChart({
  timeComplexity,
  spaceComplexity,
}: ComplexityChartProps) {
  const data = [
    {
      name: "Best",
      Time: getRank(timeComplexity.best),
      Space: getRank(spaceComplexity.best),
      timeLabel: timeComplexity.best,
      spaceLabel: spaceComplexity.best,
    },
    {
      name: "Average",
      Time: getRank(timeComplexity.average),
      Space: getRank(spaceComplexity.average),
      timeLabel: timeComplexity.average,
      spaceLabel: spaceComplexity.average,
    },
    {
      name: "Worst",
      Time: getRank(timeComplexity.worst),
      Space: getRank(spaceComplexity.worst),
      timeLabel: timeComplexity.worst,
      spaceLabel: spaceComplexity.worst,
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-3">
        Complexity Analysis
      </h3>

      <div className="rounded-md border border-border bg-surface/50 p-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barGap={4}>
            <XAxis
              dataKey="name"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={{ stroke: "#334155" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              axisLine={{ stroke: "#334155" }}
              tickLine={false}
              domain={[0, 10]}
              ticks={[1, 2, 4, 6, 8]}
              tickFormatter={(v) =>
                ["", "O(1)", "O(log n)", "", "O(n)", "", "O(n²)", "", "O(2^n)"][v] ?? ""
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a2e",
                border: "1px solid #334155",
                borderRadius: "6px",
                fontSize: "12px",
              }}
              formatter={(
                _value: unknown,
                name: unknown,
                entry: unknown
              ) => {
                const n = name as string;
                const e = entry as { payload: Record<string, string> };
                const label = n === "Time" ? e.payload.timeLabel : e.payload.spaceLabel;
                return [label, n];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
            />
            <Bar dataKey="Time" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Space" fill="#22d3ee" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Text summary */}
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <h4 className="font-medium text-foreground mb-2">Time Complexity</h4>
            <div className="space-y-1 text-muted-foreground font-mono text-xs">
              <p>Best: {timeComplexity.best}</p>
              <p>Average: {timeComplexity.average}</p>
              <p>Worst: {timeComplexity.worst}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Space Complexity</h4>
            <div className="space-y-1 text-muted-foreground font-mono text-xs">
              <p>Best: {spaceComplexity.best}</p>
              <p>Average: {spaceComplexity.average}</p>
              <p>Worst: {spaceComplexity.worst}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
