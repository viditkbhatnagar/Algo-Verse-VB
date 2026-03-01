"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { VisualizationStep } from "@/lib/visualization/types";
import type { LSTMStepData } from "./logic";
import { VIZ_COLORS } from "@/lib/constants";

interface LSTMCanvasProps {
  step: VisualizationStep;
}

const GATE_COLORS = {
  forget: "#ef4444",
  input: "#22c55e",
  "cell-update": "#3b82f6",
  output: "#f59e0b",
  none: "#475569",
  all: "#8b5cf6",
};

export function LSTMCanvas({ step }: LSTMCanvasProps) {
  const data = step.data as LSTMStepData;
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 700, height: 400 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDims({
          width: entry.contentRect.width,
          height: Math.max(350, Math.min(420, entry.contentRect.width * 0.55)),
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

  const gateBoxWidth = 60;
  const gateBoxHeight = 30;

  // Positions for gates
  const forgetX = cx - 120;
  const inputX = cx - 30;
  const cellUpdateX = cx + 30;
  const outputX = cx + 120;
  const gateY = cy + 40;

  // Cell state line
  const cellY = cy - 60;

  return (
    <div ref={containerRef} style={{ minHeight: 350 }}>
      <svg width={dims.width} height={dims.height} className="select-none">
        {/* Cell state highway (top horizontal line) */}
        <motion.line
          x1={40} y1={cellY} x2={dims.width - 40} y2={cellY}
          stroke={isActive("cell-update") || isActive("all") ? VIZ_COLORS.active : "#475569"}
          strokeWidth={3}
          strokeDasharray={isActive("cell-update") ? undefined : "8 4"}
          animate={{ stroke: isActive("cell-update") || data.activeGate === "all" ? VIZ_COLORS.active : "#475569" }}
        />
        <text x={cx} y={cellY - 15} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={11}>
          Cell State C(t)
        </text>

        {/* Previous cell state label */}
        <text x={50} y={cellY - 10} textAnchor="start" className="fill-muted-foreground font-mono" fontSize={9}>
          C(t-1)={data.prevCellState.toFixed(2)}
        </text>

        {/* New cell state label */}
        <text x={dims.width - 50} y={cellY - 10} textAnchor="end" className="fill-muted-foreground font-mono" fontSize={9}>
          C(t)={data.cellState.toFixed(3)}
        </text>

        {/* Forget Gate */}
        <motion.rect
          x={forgetX - gateBoxWidth / 2} y={gateY - gateBoxHeight / 2}
          width={gateBoxWidth} height={gateBoxHeight} rx={6}
          fill={isActive("forget") ? `${GATE_COLORS.forget}30` : "#1a1a2e"}
          stroke={isActive("forget") ? GATE_COLORS.forget : "#334155"}
          strokeWidth={isActive("forget") ? 2 : 1}
          animate={{
            stroke: isActive("forget") ? GATE_COLORS.forget : "#334155",
            fill: isActive("forget") ? `${GATE_COLORS.forget}30` : "#1a1a2e",
          }}
        />
        <text x={forgetX} y={gateY - 2} textAnchor="middle" className="fill-white font-mono" fontSize={9} fontWeight="bold">
          Forget
        </text>
        <text x={forgetX} y={gateY + 10} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={8}>
          {data.forgetGateValue > 0 ? `sigma=${data.forgetGateValue.toFixed(2)}` : "sigma(...)"}
        </text>
        {/* Arrow from forget gate up to cell state */}
        <line x1={forgetX} y1={gateY - gateBoxHeight / 2} x2={forgetX} y2={cellY + 3}
          stroke={isActive("forget") ? GATE_COLORS.forget : "#334155"} strokeWidth={1.5}
          markerEnd="url(#arrowUp)" />

        {/* Input Gate */}
        <motion.rect
          x={inputX - gateBoxWidth / 2} y={gateY - gateBoxHeight / 2}
          width={gateBoxWidth} height={gateBoxHeight} rx={6}
          fill={isActive("input") ? `${GATE_COLORS.input}30` : "#1a1a2e"}
          stroke={isActive("input") ? GATE_COLORS.input : "#334155"}
          strokeWidth={isActive("input") ? 2 : 1}
          animate={{
            stroke: isActive("input") ? GATE_COLORS.input : "#334155",
            fill: isActive("input") ? `${GATE_COLORS.input}30` : "#1a1a2e",
          }}
        />
        <text x={inputX} y={gateY - 2} textAnchor="middle" className="fill-white font-mono" fontSize={9} fontWeight="bold">
          Input
        </text>
        <text x={inputX} y={gateY + 10} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={8}>
          {data.inputGateValue > 0 ? `sigma=${data.inputGateValue.toFixed(2)}` : "sigma(...)"}
        </text>
        <line x1={inputX} y1={gateY - gateBoxHeight / 2} x2={inputX} y2={cellY + 3}
          stroke={isActive("input") ? GATE_COLORS.input : "#334155"} strokeWidth={1.5}
          markerEnd="url(#arrowUp)" />

        {/* Candidate (tanh) */}
        <motion.rect
          x={cellUpdateX - gateBoxWidth / 2} y={gateY - gateBoxHeight / 2}
          width={gateBoxWidth} height={gateBoxHeight} rx={6}
          fill={isActive("cell-update") ? `${GATE_COLORS["cell-update"]}30` : "#1a1a2e"}
          stroke={isActive("cell-update") ? GATE_COLORS["cell-update"] : "#334155"}
          strokeWidth={isActive("cell-update") ? 2 : 1}
          animate={{
            stroke: isActive("cell-update") ? GATE_COLORS["cell-update"] : "#334155",
            fill: isActive("cell-update") ? `${GATE_COLORS["cell-update"]}30` : "#1a1a2e",
          }}
        />
        <text x={cellUpdateX} y={gateY - 2} textAnchor="middle" className="fill-white font-mono" fontSize={9} fontWeight="bold">
          C~
        </text>
        <text x={cellUpdateX} y={gateY + 10} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={8}>
          {data.candidateValue > 0 ? `tanh=${data.candidateValue.toFixed(2)}` : "tanh(...)"}
        </text>
        <line x1={cellUpdateX} y1={gateY - gateBoxHeight / 2} x2={cellUpdateX} y2={cellY + 3}
          stroke={isActive("cell-update") ? GATE_COLORS["cell-update"] : "#334155"} strokeWidth={1.5}
          markerEnd="url(#arrowUp)" />

        {/* Output Gate */}
        <motion.rect
          x={outputX - gateBoxWidth / 2} y={gateY - gateBoxHeight / 2}
          width={gateBoxWidth} height={gateBoxHeight} rx={6}
          fill={isActive("output") ? `${GATE_COLORS.output}30` : "#1a1a2e"}
          stroke={isActive("output") ? GATE_COLORS.output : "#334155"}
          strokeWidth={isActive("output") ? 2 : 1}
          animate={{
            stroke: isActive("output") ? GATE_COLORS.output : "#334155",
            fill: isActive("output") ? `${GATE_COLORS.output}30` : "#1a1a2e",
          }}
        />
        <text x={outputX} y={gateY - 2} textAnchor="middle" className="fill-white font-mono" fontSize={9} fontWeight="bold">
          Output
        </text>
        <text x={outputX} y={gateY + 10} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={8}>
          {data.outputGateValue > 0 ? `sigma=${data.outputGateValue.toFixed(2)}` : "sigma(...)"}
        </text>

        {/* Arrow from output gate to hidden state */}
        <line x1={outputX} y1={gateY + gateBoxHeight / 2} x2={outputX} y2={gateY + 70}
          stroke={isActive("output") ? GATE_COLORS.output : "#334155"} strokeWidth={1.5}
          markerEnd="url(#arrowDown)" />

        {/* Hidden state output */}
        <motion.rect
          x={outputX - 50} y={gateY + 70}
          width={100} height={28} rx={6}
          fill={isActive("output") || data.activeGate === "all" ? `${VIZ_COLORS.neuronOutput}30` : "#1a1a2e"}
          stroke={isActive("output") || data.activeGate === "all" ? VIZ_COLORS.neuronOutput : "#334155"}
          strokeWidth={1.5}
        />
        <text x={outputX} y={gateY + 88} textAnchor="middle" className="fill-white font-mono" fontSize={10}>
          h(t)={data.hiddenState.toFixed(3)}
        </text>

        {/* Input x(t) at bottom left */}
        <motion.rect
          x={30} y={gateY + 30}
          width={80} height={28} rx={6}
          fill={`${VIZ_COLORS.neuronInput}20`}
          stroke={VIZ_COLORS.neuronInput}
          strokeWidth={1.5}
        />
        <text x={70} y={gateY + 48} textAnchor="middle" className="fill-white font-mono" fontSize={10}>
          x(t)={data.inputValue.toFixed(1)}
        </text>

        {/* h(t-1) at bottom */}
        <motion.rect
          x={30} y={gateY + 70}
          width={80} height={28} rx={6}
          fill={`${VIZ_COLORS.neuronHidden}20`}
          stroke={VIZ_COLORS.neuronHidden}
          strokeWidth={1.5}
        />
        <text x={70} y={gateY + 88} textAnchor="middle" className="fill-white font-mono" fontSize={10}>
          h(t-1)={data.prevHiddenState.toFixed(1)}
        </text>

        {/* Connecting lines from inputs to gates */}
        <line x1={110} y1={gateY + 44} x2={forgetX - gateBoxWidth / 2} y2={gateY}
          stroke="#475569" strokeWidth={1} strokeDasharray="4 3" />
        <line x1={110} y1={gateY + 84} x2={forgetX - gateBoxWidth / 2} y2={gateY}
          stroke="#475569" strokeWidth={1} strokeDasharray="4 3" />

        {/* Arrow markers */}
        <defs>
          <marker id="arrowUp" markerWidth="8" markerHeight="6" refX="4" refY="6" orient="auto">
            <polygon points="0 6, 4 0, 8 6" fill="#94a3b8" />
          </marker>
          <marker id="arrowDown" markerWidth="8" markerHeight="6" refX="4" refY="0" orient="auto">
            <polygon points="0 0, 4 6, 8 0" fill="#94a3b8" />
          </marker>
        </defs>

        {/* Legend */}
        <g transform={`translate(${dims.width - 160}, 20)`}>
          {[
            { label: "Forget Gate", color: GATE_COLORS.forget },
            { label: "Input Gate", color: GATE_COLORS.input },
            { label: "Cell Update", color: GATE_COLORS["cell-update"] },
            { label: "Output Gate", color: GATE_COLORS.output },
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
