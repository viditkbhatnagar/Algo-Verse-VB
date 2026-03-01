"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { NeuronData, ConnectionData } from "@/lib/visualization/types";

interface NeuralNetCanvasProps {
  layers: { label: string; type: "input" | "hidden" | "output" | "conv" | "pool" | "attention" }[];
  neurons: NeuronData[];
  connections: ConnectionData[];
  currentLayer?: number;
  dataFlowDirection?: "forward" | "backward";
  showWeights?: boolean;
  showActivations?: boolean;
  compactMode?: boolean;
  className?: string;
}

const LAYER_TYPE_COLORS: Record<string, string> = {
  input: VIZ_COLORS.neuronInput,
  hidden: VIZ_COLORS.neuronHidden,
  output: VIZ_COLORS.neuronOutput,
  conv: "#14b8a6",
  pool: "#f59e0b",
  attention: "#ec4899",
};

function getNeuronColor(neuron: NeuronData, layerType: string): string {
  if (neuron.highlight) {
    return VIZ_COLORS[neuron.highlight as keyof typeof VIZ_COLORS] ?? LAYER_TYPE_COLORS[layerType] ?? VIZ_COLORS.default;
  }
  return LAYER_TYPE_COLORS[layerType] ?? VIZ_COLORS.default;
}

function getConnectionColor(conn: ConnectionData): string {
  if (conn.highlight) {
    return VIZ_COLORS[conn.highlight as keyof typeof VIZ_COLORS] ?? VIZ_COLORS.default;
  }
  if (conn.weight > 0) return VIZ_COLORS.positiveWeight;
  if (conn.weight < 0) return VIZ_COLORS.negativeWeight;
  return VIZ_COLORS.default;
}

export function NeuralNetCanvas({
  layers,
  neurons,
  connections,
  currentLayer,
  dataFlowDirection,
  showWeights = false,
  showActivations = true,
  compactMode = false,
  className,
}: NeuralNetCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 400 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: Math.max(300, Math.min(450, entry.contentRect.width * 0.55)),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const padding = { top: 30, right: 20, bottom: 30, left: 20 };
  const innerWidth = dimensions.width - padding.left - padding.right;
  const innerHeight = dimensions.height - padding.top - padding.bottom;

  const numLayers = layers.length;
  const layerSpacing = innerWidth / (numLayers + 1);

  // Group neurons by layer
  const neuronsByLayer: NeuronData[][] = layers.map((_, i) =>
    neurons.filter((n) => n.layer === i)
  );

  // Calculate positions for each neuron
  const neuronPositions: Record<string, { x: number; y: number }> = {};
  neuronsByLayer.forEach((layerNeurons, layerIdx) => {
    const x = layerSpacing * (layerIdx + 1);
    const count = layerNeurons.length;
    const maxVisible = compactMode ? 6 : 10;
    const visible = Math.min(count, maxVisible);
    const spacing = Math.min(innerHeight / (visible + 1), 40);
    const startY = (innerHeight - spacing * (visible - 1)) / 2;

    layerNeurons.slice(0, maxVisible).forEach((neuron, idx) => {
      neuronPositions[neuron.id] = {
        x,
        y: startY + idx * spacing,
      };
    });
  });

  const neuronRadius = compactMode ? 10 : 14;

  return (
    <div ref={containerRef} className={className} style={{ minHeight: 300 }}>
      <svg width={dimensions.width} height={dimensions.height} className="select-none">
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Connections */}
          {connections.map((conn, idx) => {
            const src = neuronPositions[conn.source];
            const tgt = neuronPositions[conn.target];
            if (!src || !tgt) return null;

            const color = getConnectionColor(conn);
            const opacity = Math.min(0.8, Math.max(0.15, Math.abs(conn.weight)));
            const strokeWidth = Math.min(2.5, Math.max(0.5, Math.abs(conn.weight) * 2));

            return (
              <motion.line
                key={`conn-${idx}`}
                x1={src.x}
                y1={src.y}
                x2={tgt.x}
                y2={tgt.y}
                stroke={color}
                strokeWidth={strokeWidth}
                opacity={opacity}
                initial={false}
                animate={{ x1: src.x, y1: src.y, x2: tgt.x, y2: tgt.y, stroke: color, opacity }}
                transition={{ duration: 0.3 }}
              />
            );
          })}

          {/* Show weights on connections (optional) */}
          {showWeights && connections.slice(0, 20).map((conn, idx) => {
            const src = neuronPositions[conn.source];
            const tgt = neuronPositions[conn.target];
            if (!src || !tgt) return null;
            const mx = (src.x + tgt.x) / 2;
            const my = (src.y + tgt.y) / 2;
            return (
              <text key={`w-${idx}`} x={mx} y={my - 3} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={7}>
                {conn.weight.toFixed(2)}
              </text>
            );
          })}

          {/* Neurons */}
          {neurons.map((neuron) => {
            const pos = neuronPositions[neuron.id];
            if (!pos) return null;
            const layerType = layers[neuron.layer]?.type ?? "hidden";
            const color = getNeuronColor(neuron, layerType);
            const isActive = currentLayer === neuron.layer;

            return (
              <motion.g key={neuron.id}>
                {/* Glow for active layer */}
                {isActive && (
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={neuronRadius + 4}
                    fill="none"
                    stroke={color}
                    strokeWidth={1.5}
                    opacity={0.4}
                    initial={false}
                    animate={{ cx: pos.x, cy: pos.y }}
                  />
                )}
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={neuronRadius}
                  fill={neuron.isDropped ? "transparent" : color}
                  stroke={neuron.isDropped ? VIZ_COLORS.default : color}
                  strokeWidth={neuron.isDropped ? 1.5 : 0}
                  strokeDasharray={neuron.isDropped ? "3 2" : undefined}
                  opacity={neuron.isDropped ? 0.3 : 0.85}
                  initial={false}
                  animate={{ cx: pos.x, cy: pos.y, fill: neuron.isDropped ? "transparent" : color }}
                  transition={{ duration: 0.3 }}
                />
                {/* Activation value */}
                {showActivations && neuron.value !== undefined && !neuron.isDropped && (
                  <motion.text
                    x={pos.x}
                    y={pos.y + 3.5}
                    textAnchor="middle"
                    className="fill-white font-mono"
                    fontSize={compactMode ? 7 : 9}
                    initial={false}
                    animate={{ x: pos.x, y: pos.y + 3.5 }}
                  >
                    {neuron.value.toFixed(1)}
                  </motion.text>
                )}
                {/* Label below neuron */}
                {neuron.label && (
                  <text x={pos.x} y={pos.y + neuronRadius + 12} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={8}>
                    {neuron.label}
                  </text>
                )}
                {/* Gradient badge */}
                {neuron.gradient !== undefined && dataFlowDirection === "backward" && (
                  <text x={pos.x} y={pos.y - neuronRadius - 4} textAnchor="middle" className="fill-pink-400 font-mono" fontSize={7}>
                    {neuron.gradient.toFixed(3)}
                  </text>
                )}
              </motion.g>
            );
          })}

          {/* Layer labels */}
          {layers.map((layer, idx) => {
            const x = layerSpacing * (idx + 1);
            return (
              <text key={`label-${idx}`} x={x} y={innerHeight + 18} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={10}>
                {layer.label}
              </text>
            );
          })}

          {/* Data flow arrow */}
          {dataFlowDirection && (
            <g>
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill={VIZ_COLORS.highlighted} />
                </marker>
              </defs>
              <line
                x1={dataFlowDirection === "forward" ? 10 : innerWidth - 10}
                y1={-10}
                x2={dataFlowDirection === "forward" ? 60 : innerWidth - 60}
                y2={-10}
                stroke={VIZ_COLORS.highlighted}
                strokeWidth={1.5}
                markerEnd="url(#arrowhead)"
              />
              <text
                x={dataFlowDirection === "forward" ? 35 : innerWidth - 35}
                y={-16}
                textAnchor="middle"
                className="fill-cyan-400 font-mono"
                fontSize={9}
              >
                {dataFlowDirection === "forward" ? "Forward" : "Backward"}
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
