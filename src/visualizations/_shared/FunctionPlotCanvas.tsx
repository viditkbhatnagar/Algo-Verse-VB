"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";
import { VIZ_COLORS } from "@/lib/constants";
import type { FunctionPlotPoint } from "@/lib/visualization/types";

interface FunctionPlotCanvasProps {
  functions: {
    name: string;
    points: FunctionPlotPoint[];
    color: string;
    active?: boolean;
  }[];
  currentX?: number;
  xLabel?: string;
  yLabel?: string;
  xRange: [number, number];
  yRange: [number, number];
  annotations?: { x: number; y: number; label: string }[];
  gradientArrow?: { x: number; y: number; dx: number; dy: number };
  className?: string;
}

export function FunctionPlotCanvas({
  functions,
  currentX,
  xLabel,
  yLabel,
  xRange,
  yRange,
  annotations,
  gradientArrow,
  className,
}: FunctionPlotCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 350 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: Math.max(280, Math.min(400, entry.contentRect.width * 0.55)),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerWidth = dimensions.width - padding.left - padding.right;
  const innerHeight = dimensions.height - padding.top - padding.bottom;

  const xScale = d3.scaleLinear().domain(xRange).range([0, innerWidth]);
  const yScale = d3.scaleLinear().domain(yRange).range([innerHeight, 0]);

  const lineGen = d3
    .line<FunctionPlotPoint>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  const xTicks = xScale.ticks(6);
  const yTicks = yScale.ticks(6);

  return (
    <div ref={containerRef} className={className} style={{ minHeight: 280 }}>
      <svg width={dimensions.width} height={dimensions.height} className="select-none">
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Grid */}
          {xTicks.map((t) => (
            <line key={`gx-${t}`} x1={xScale(t)} x2={xScale(t)} y1={0} y2={innerHeight} stroke="#1e293b" strokeWidth={0.5} />
          ))}
          {yTicks.map((t) => (
            <line key={`gy-${t}`} x1={0} x2={innerWidth} y1={yScale(t)} y2={yScale(t)} stroke="#1e293b" strokeWidth={0.5} />
          ))}

          {/* Axes */}
          <line x1={0} x2={innerWidth} y1={innerHeight} y2={innerHeight} stroke="#475569" />
          <line x1={0} x2={0} y1={0} y2={innerHeight} stroke="#475569" />

          {/* Zero lines */}
          {yRange[0] < 0 && yRange[1] > 0 && (
            <line x1={0} x2={innerWidth} y1={yScale(0)} y2={yScale(0)} stroke="#475569" strokeWidth={0.8} />
          )}
          {xRange[0] < 0 && xRange[1] > 0 && (
            <line x1={xScale(0)} x2={xScale(0)} y1={0} y2={innerHeight} stroke="#475569" strokeWidth={0.8} />
          )}

          {/* Tick labels */}
          {xTicks.map((t) => (
            <text key={`xt-${t}`} x={xScale(t)} y={innerHeight + 16} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={9}>{t}</text>
          ))}
          {yTicks.map((t) => (
            <text key={`yt-${t}`} x={-8} y={yScale(t) + 3} textAnchor="end" className="fill-muted-foreground font-mono" fontSize={9}>{t}</text>
          ))}

          {/* Axis labels */}
          {xLabel && (
            <text x={innerWidth / 2} y={innerHeight + 32} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={11}>{xLabel}</text>
          )}
          {yLabel && (
            <text x={-36} y={innerHeight / 2} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={11} transform={`rotate(-90, -36, ${innerHeight / 2})`}>{yLabel}</text>
          )}

          {/* Function curves */}
          {functions.map((fn) => (
            <motion.path
              key={fn.name}
              d={lineGen(fn.points) ?? ""}
              fill="none"
              stroke={fn.color}
              strokeWidth={fn.active ? 2.5 : 1.5}
              opacity={fn.active !== false ? 1 : 0.4}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, opacity: fn.active !== false ? 1 : 0.4 }}
              transition={{ duration: 0.6 }}
            />
          ))}

          {/* Current X indicator */}
          {currentX !== undefined && (
            <>
              <motion.line
                x1={xScale(currentX)}
                x2={xScale(currentX)}
                y1={0}
                y2={innerHeight}
                stroke={VIZ_COLORS.highlighted}
                strokeWidth={1}
                strokeDasharray="4 2"
                initial={false}
                animate={{ x1: xScale(currentX), x2: xScale(currentX) }}
                transition={{ duration: 0.3 }}
              />
              {functions.filter(fn => fn.active !== false).map((fn) => {
                const pt = fn.points.reduce((closest, p) =>
                  Math.abs(p.x - currentX!) < Math.abs(closest.x - currentX!) ? p : closest
                );
                return (
                  <motion.circle
                    key={`dot-${fn.name}`}
                    cx={xScale(pt.x)}
                    cy={yScale(pt.y)}
                    r={5}
                    fill={fn.color}
                    stroke="#fff"
                    strokeWidth={1.5}
                    initial={false}
                    animate={{ cx: xScale(pt.x), cy: yScale(pt.y) }}
                    transition={{ duration: 0.3 }}
                  />
                );
              })}
            </>
          )}

          {/* Gradient arrow */}
          {gradientArrow && (
            <motion.line
              x1={xScale(gradientArrow.x)}
              y1={yScale(gradientArrow.y)}
              x2={xScale(gradientArrow.x + gradientArrow.dx)}
              y2={yScale(gradientArrow.y + gradientArrow.dy)}
              stroke={VIZ_COLORS.gradient}
              strokeWidth={2}
              markerEnd="url(#grad-arrow)"
              initial={false}
              animate={{
                x1: xScale(gradientArrow.x),
                y1: yScale(gradientArrow.y),
                x2: xScale(gradientArrow.x + gradientArrow.dx),
                y2: yScale(gradientArrow.y + gradientArrow.dy),
              }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Annotations */}
          {annotations?.map((ann, i) => (
            <g key={`ann-${i}`}>
              <circle cx={xScale(ann.x)} cy={yScale(ann.y)} r={3} fill={VIZ_COLORS.highlighted} />
              <text x={xScale(ann.x) + 6} y={yScale(ann.y) - 6} className="fill-cyan-400 font-mono" fontSize={9}>
                {ann.label}
              </text>
            </g>
          ))}

          {/* Legend */}
          {functions.length > 1 && (
            <g transform={`translate(${innerWidth - 100}, 10)`}>
              {functions.map((fn, i) => (
                <g key={fn.name} transform={`translate(0, ${i * 16})`}>
                  <line x1={0} x2={16} y1={0} y2={0} stroke={fn.color} strokeWidth={2} />
                  <text x={20} y={3} className="fill-muted-foreground font-mono" fontSize={9}>{fn.name}</text>
                </g>
              ))}
            </g>
          )}

          <defs>
            <marker id="grad-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={VIZ_COLORS.gradient} />
            </marker>
          </defs>
        </g>
      </svg>
    </div>
  );
}
