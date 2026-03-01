"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { VisualizationStep } from "@/lib/visualization/types";
import type { GRUStepData } from "./logic";
import { VIZ_COLORS } from "@/lib/constants";

interface GRUCanvasProps {
  step: VisualizationStep;
}

const GATE_COLORS = {
  update: "#6366f1",
  reset: "#ef4444",
  candidate: "#22c55e",
  output: "#f59e0b",
  none: "#475569",
  all: "#8b5cf6",
};

export function GRUCanvas({ step }: GRUCanvasProps) {
  const data = step.data as GRUStepData;
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 700, height: 380 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDims({
          width: entry.contentRect.width,
          height: Math.max(340, Math.min(400, entry.contentRect.width * 0.5)),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const cx = dims.width / 2;
  const cy = dims.height / 2;

  const isActive = (gate: string) =>
    data.activeGate === gate || data.activeGate === "all";

  const boxW = 80;
  const boxH = 34;

  // Gate positions
  const updateX = cx - 80;
  const resetX = cx + 80;
  const gateY = cy - 30;

  const candidateX = cx;
  const candidateY = cy + 40;

  const outputY = cy + 110;

  return (
    <div ref={containerRef} style={{ minHeight: 340 }}>
      <svg width={dims.width} height={dims.height} className="select-none">
        {/* Hidden state flow line (top) */}
        <line x1={40} y1={30} x2={dims.width - 40} y2={30}
          stroke="#475569" strokeWidth={2} strokeDasharray="8 4" />
        <text x={cx} y={22} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={10}>
          Hidden State Flow
        </text>

        {/* h(t-1) label */}
        <text x={50} y={48} textAnchor="start" className="fill-muted-foreground font-mono" fontSize={9}>
          h(t-1)={data.prevHiddenState.toFixed(2)}
        </text>

        {/* h(t) label */}
        <text x={dims.width - 50} y={48} textAnchor="end" className="fill-muted-foreground font-mono" fontSize={9}>
          h(t)={data.hiddenState.toFixed(3)}
        </text>

        {/* Update Gate */}
        <motion.rect
          x={updateX - boxW / 2} y={gateY - boxH / 2}
          width={boxW} height={boxH} rx={6}
          fill={isActive("update") ? `${GATE_COLORS.update}30` : "#1a1a2e"}
          stroke={isActive("update") ? GATE_COLORS.update : "#334155"}
          strokeWidth={isActive("update") ? 2 : 1}
          animate={{
            stroke: isActive("update") ? GATE_COLORS.update : "#334155",
            fill: isActive("update") ? `${GATE_COLORS.update}30` : "#1a1a2e",
          }}
        />
        <text x={updateX} y={gateY - 4} textAnchor="middle" className="fill-white font-mono" fontSize={10} fontWeight="bold">
          Update z(t)
        </text>
        <text x={updateX} y={gateY + 10} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={8}>
          {data.updateGateValue > 0 ? `sigma=${data.updateGateValue.toFixed(2)}` : "sigma(...)"}
        </text>

        {/* Reset Gate */}
        <motion.rect
          x={resetX - boxW / 2} y={gateY - boxH / 2}
          width={boxW} height={boxH} rx={6}
          fill={isActive("reset") ? `${GATE_COLORS.reset}30` : "#1a1a2e"}
          stroke={isActive("reset") ? GATE_COLORS.reset : "#334155"}
          strokeWidth={isActive("reset") ? 2 : 1}
          animate={{
            stroke: isActive("reset") ? GATE_COLORS.reset : "#334155",
            fill: isActive("reset") ? `${GATE_COLORS.reset}30` : "#1a1a2e",
          }}
        />
        <text x={resetX} y={gateY - 4} textAnchor="middle" className="fill-white font-mono" fontSize={10} fontWeight="bold">
          Reset r(t)
        </text>
        <text x={resetX} y={gateY + 10} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={8}>
          {data.resetGateValue > 0 ? `sigma=${data.resetGateValue.toFixed(2)}` : "sigma(...)"}
        </text>

        {/* Candidate */}
        <motion.rect
          x={candidateX - boxW / 2} y={candidateY - boxH / 2}
          width={boxW} height={boxH} rx={6}
          fill={isActive("candidate") ? `${GATE_COLORS.candidate}30` : "#1a1a2e"}
          stroke={isActive("candidate") ? GATE_COLORS.candidate : "#334155"}
          strokeWidth={isActive("candidate") ? 2 : 1}
          animate={{
            stroke: isActive("candidate") ? GATE_COLORS.candidate : "#334155",
            fill: isActive("candidate") ? `${GATE_COLORS.candidate}30` : "#1a1a2e",
          }}
        />
        <text x={candidateX} y={candidateY - 4} textAnchor="middle" className="fill-white font-mono" fontSize={10} fontWeight="bold">
          h~(t)
        </text>
        <text x={candidateX} y={candidateY + 10} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={8}>
          {data.candidateValue !== 0 ? `tanh=${data.candidateValue.toFixed(3)}` : "tanh(...)"}
        </text>

        {/* Output / final hidden state */}
        <motion.rect
          x={cx - 60} y={outputY - 16}
          width={120} height={32} rx={6}
          fill={isActive("output") || data.activeGate === "all" ? `${GATE_COLORS.output}30` : "#1a1a2e"}
          stroke={isActive("output") || data.activeGate === "all" ? GATE_COLORS.output : "#334155"}
          strokeWidth={isActive("output") || data.activeGate === "all" ? 2 : 1}
        />
        <text x={cx} y={outputY + 4} textAnchor="middle" className="fill-white font-mono" fontSize={10}>
          h(t) = {data.hiddenState.toFixed(3)}
        </text>
        <text x={cx} y={outputY + 18} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={8}>
          (1-z)*h(t-1) + z*h~(t)
        </text>

        {/* Connecting arrows */}
        {/* Reset -> Candidate */}
        <line x1={resetX} y1={gateY + boxH / 2} x2={candidateX + boxW / 4} y2={candidateY - boxH / 2}
          stroke={isActive("reset") || isActive("candidate") ? GATE_COLORS.reset : "#334155"}
          strokeWidth={1.5} strokeDasharray={isActive("candidate") ? undefined : "4 3"} />

        {/* Update -> Output */}
        <line x1={updateX} y1={gateY + boxH / 2} x2={cx - 20} y2={outputY - 16}
          stroke={isActive("update") || isActive("output") ? GATE_COLORS.update : "#334155"}
          strokeWidth={1.5} strokeDasharray={isActive("output") ? undefined : "4 3"} />

        {/* Candidate -> Output */}
        <line x1={candidateX} y1={candidateY + boxH / 2} x2={cx} y2={outputY - 16}
          stroke={isActive("candidate") || isActive("output") ? GATE_COLORS.candidate : "#334155"}
          strokeWidth={1.5} strokeDasharray={isActive("output") ? undefined : "4 3"} />

        {/* Input label */}
        <motion.rect
          x={30} y={gateY + 40}
          width={70} height={26} rx={6}
          fill={`${VIZ_COLORS.neuronInput}20`}
          stroke={VIZ_COLORS.neuronInput}
          strokeWidth={1.5}
        />
        <text x={65} y={gateY + 57} textAnchor="middle" className="fill-white font-mono" fontSize={9}>
          x(t)={data.inputValue.toFixed(1)}
        </text>

        {/* h(t-1) label */}
        <motion.rect
          x={30} y={gateY + 76}
          width={70} height={26} rx={6}
          fill={`${VIZ_COLORS.neuronHidden}20`}
          stroke={VIZ_COLORS.neuronHidden}
          strokeWidth={1.5}
        />
        <text x={65} y={gateY + 93} textAnchor="middle" className="fill-white font-mono" fontSize={9}>
          h(t-1)={data.prevHiddenState.toFixed(1)}
        </text>

        {/* Legend */}
        <g transform={`translate(${dims.width - 140}, ${dims.height - 80})`}>
          {[
            { label: "Update Gate", color: GATE_COLORS.update },
            { label: "Reset Gate", color: GATE_COLORS.reset },
            { label: "Candidate", color: GATE_COLORS.candidate },
          ].map((item, i) => (
            <g key={item.label} transform={`translate(0, ${i * 18})`}>
              <rect x={0} y={0} width={10} height={10} rx={2} fill={item.color} opacity={0.7} />
              <text x={16} y={9} className="fill-muted-foreground font-mono" fontSize={9}>{item.label}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
