"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { TrainingCurvePoint } from "@/lib/visualization/types";

interface LossChartCanvasProps {
  history: TrainingCurvePoint[];
  currentEpoch: number;
  curves: { key: string; label: string; color: string }[];
  annotations?: { epoch: number; label: string }[];
  xLabel?: string;
  yLabel?: string;
  className?: string;
}

export function LossChartCanvas({
  history,
  currentEpoch,
  curves,
  annotations,
  xLabel = "Epoch",
  yLabel = "Loss",
  className,
}: LossChartCanvasProps) {
  // Only show data up to currentEpoch for progressive reveal
  const visibleData = useMemo(
    () => history.filter((h) => h.epoch <= currentEpoch),
    [history, currentEpoch]
  );

  return (
    <div className={className} style={{ minHeight: 280 }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={visibleData} margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="epoch"
            stroke="#64748b"
            fontSize={10}
            fontFamily="JetBrains Mono, monospace"
            label={{ value: xLabel, position: "bottom", offset: 10, fill: "#64748b", fontSize: 11 }}
          />
          <YAxis
            stroke="#64748b"
            fontSize={10}
            fontFamily="JetBrains Mono, monospace"
            label={{ value: yLabel, angle: -90, position: "insideLeft", offset: 0, fill: "#64748b", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a2e",
              border: "1px solid #334155",
              borderRadius: "8px",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 11,
            }}
            labelStyle={{ color: "#94a3b8" }}
          />
          <Legend
            wrapperStyle={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 10,
            }}
          />
          {curves.map((curve) => (
            <Line
              key={curve.key}
              type="monotone"
              dataKey={curve.key}
              name={curve.label}
              stroke={curve.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              animationDuration={300}
            />
          ))}
          {annotations?.map((ann) => (
            <ReferenceLine
              key={`ann-${ann.epoch}`}
              x={ann.epoch}
              stroke="#6366f1"
              strokeDasharray="4 2"
              label={{
                value: ann.label,
                position: "top",
                fill: "#94a3b8",
                fontSize: 9,
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
