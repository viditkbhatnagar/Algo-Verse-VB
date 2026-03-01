"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";
import { VIZ_COLORS, CLUSTER_COLORS } from "@/lib/constants";
import type { ScatterPoint, DecisionBoundary } from "@/lib/visualization/types";

interface ScatterCanvasProps {
  points: ScatterPoint[];
  centroids?: ScatterPoint[];
  boundaries?: DecisionBoundary[];
  supportVectors?: number[];
  kNearest?: number[];
  queryPoint?: ScatterPoint;
  regressionLine?: { x: number; y: number }[];
  xLabel?: string;
  yLabel?: string;
  xRange?: [number, number];
  yRange?: [number, number];
  className?: string;
}

function getPointColor(label: number | string | undefined): string {
  if (label === undefined) return VIZ_COLORS.default;
  const idx = typeof label === "number" ? label : 0;
  return CLUSTER_COLORS[idx % CLUSTER_COLORS.length];
}

export function ScatterCanvas({
  points,
  centroids,
  boundaries,
  supportVectors,
  kNearest,
  queryPoint,
  regressionLine,
  xLabel,
  yLabel,
  xRange: xRangeProp,
  yRange: yRangeProp,
  className,
}: ScatterCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: Math.max(300, Math.min(450, entry.contentRect.width * 0.65)),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerWidth = dimensions.width - padding.left - padding.right;
  const innerHeight = dimensions.height - padding.top - padding.bottom;

  const allX = points.map((p) => p.x).concat(centroids?.map((c) => c.x) ?? []);
  const allY = points.map((p) => p.y).concat(centroids?.map((c) => c.y) ?? []);
  if (queryPoint) { allX.push(queryPoint.x); allY.push(queryPoint.y); }
  if (regressionLine) { allX.push(...regressionLine.map(p => p.x)); allY.push(...regressionLine.map(p => p.y)); }

  const xMin = xRangeProp?.[0] ?? Math.min(...allX) - 0.5;
  const xMax = xRangeProp?.[1] ?? Math.max(...allX) + 0.5;
  const yMin = yRangeProp?.[0] ?? Math.min(...allY) - 0.5;
  const yMax = yRangeProp?.[1] ?? Math.max(...allY) + 0.5;

  const xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, innerWidth]);
  const yScale = d3.scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]);

  const xTicks = xScale.ticks(6);
  const yTicks = yScale.ticks(6);

  const supportSet = new Set(supportVectors ?? []);
  const kNearestSet = new Set(kNearest ?? []);

  return (
    <div ref={containerRef} className={className} style={{ minHeight: 300 }}>
      <svg width={dimensions.width} height={dimensions.height} className="select-none">
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Grid lines */}
          {xTicks.map((t) => (
            <line key={`gx-${t}`} x1={xScale(t)} x2={xScale(t)} y1={0} y2={innerHeight} stroke="#1e293b" strokeWidth={0.5} />
          ))}
          {yTicks.map((t) => (
            <line key={`gy-${t}`} x1={0} x2={innerWidth} y1={yScale(t)} y2={yScale(t)} stroke="#1e293b" strokeWidth={0.5} />
          ))}

          {/* Axes */}
          <line x1={0} x2={innerWidth} y1={innerHeight} y2={innerHeight} stroke="#475569" strokeWidth={1} />
          <line x1={0} x2={0} y1={0} y2={innerHeight} stroke="#475569" strokeWidth={1} />

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

          {/* Decision boundaries */}
          {boundaries?.map((b, i) => {
            if (b.points.length < 2) return null;
            const lineGen = d3.line<{ x: number; y: number }>().x(d => xScale(d.x)).y(d => yScale(d.y));
            if (b.type === "curve") lineGen.curve(d3.curveBasis);
            return (
              <motion.path
                key={`boundary-${i}`}
                d={lineGen(b.points) ?? ""}
                fill="none"
                stroke={b.color ?? VIZ_COLORS.boundary}
                strokeWidth={2}
                strokeDasharray="6 3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6 }}
              />
            );
          })}

          {/* Regression line */}
          {regressionLine && regressionLine.length >= 2 && (
            <motion.line
              x1={xScale(regressionLine[0].x)}
              y1={yScale(regressionLine[0].y)}
              x2={xScale(regressionLine[regressionLine.length - 1].x)}
              y2={yScale(regressionLine[regressionLine.length - 1].y)}
              stroke={VIZ_COLORS.active}
              strokeWidth={2.5}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
          )}

          {/* KNN circle around query point */}
          {queryPoint && kNearest && kNearest.length > 0 && (() => {
            const maxDist = Math.max(
              ...kNearest.map((idx) => {
                const p = points[idx];
                if (!p) return 0;
                const dx = xScale(p.x) - xScale(queryPoint.x);
                const dy = yScale(p.y) - yScale(queryPoint.y);
                return Math.sqrt(dx * dx + dy * dy);
              })
            );
            return (
              <motion.circle
                cx={xScale(queryPoint.x)}
                cy={yScale(queryPoint.y)}
                r={maxDist + 8}
                fill="none"
                stroke={VIZ_COLORS.highlighted}
                strokeWidth={1.5}
                strokeDasharray="4 2"
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: maxDist + 8, opacity: 0.6 }}
                transition={{ duration: 0.4 }}
              />
            );
          })()}

          {/* Data points */}
          {points.map((point, idx) => {
            const cx = xScale(point.x);
            const cy = yScale(point.y);
            const color = point.highlight
              ? VIZ_COLORS[point.highlight as keyof typeof VIZ_COLORS] ?? getPointColor(point.label)
              : getPointColor(point.label);
            const isSV = supportSet.has(idx);
            const isKN = kNearestSet.has(idx);

            return (
              <g key={point.id ?? `p-${idx}`}>
                {isSV && (
                  <motion.circle cx={cx} cy={cy} r={9} fill="none" stroke={VIZ_COLORS.highlighted} strokeWidth={2}
                    initial={false} animate={{ cx, cy }} transition={{ duration: 0.3 }} />
                )}
                {isKN && (
                  <motion.circle cx={cx} cy={cy} r={8} fill="none" stroke={VIZ_COLORS.comparing} strokeWidth={1.5}
                    initial={false} animate={{ cx, cy }} transition={{ duration: 0.3 }} />
                )}
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={isSV ? 5 : 4}
                  fill={color}
                  opacity={0.85}
                  initial={false}
                  animate={{ cx, cy, fill: color }}
                  transition={{ duration: 0.3 }}
                />
              </g>
            );
          })}

          {/* Centroids */}
          {centroids?.map((c, i) => (
            <motion.g key={`centroid-${i}`}>
              <motion.polygon
                points={`${xScale(c.x)},${yScale(c.y) - 8} ${xScale(c.x) - 7},${yScale(c.y) + 5} ${xScale(c.x) + 7},${yScale(c.y) + 5}`}
                fill={getPointColor(c.label)}
                stroke="#fff"
                strokeWidth={1.5}
                initial={false}
                animate={{
                  points: `${xScale(c.x)},${yScale(c.y) - 8} ${xScale(c.x) - 7},${yScale(c.y) + 5} ${xScale(c.x) + 7},${yScale(c.y) + 5}`,
                }}
                transition={{ duration: 0.5 }}
              />
            </motion.g>
          ))}

          {/* Query point */}
          {queryPoint && (
            <motion.g>
              <motion.circle
                cx={xScale(queryPoint.x)}
                cy={yScale(queryPoint.y)}
                r={6}
                fill={VIZ_COLORS.swapping}
                stroke="#fff"
                strokeWidth={2}
                initial={false}
                animate={{ cx: xScale(queryPoint.x), cy: yScale(queryPoint.y) }}
                transition={{ duration: 0.3 }}
              />
              <motion.text
                x={xScale(queryPoint.x)}
                y={yScale(queryPoint.y) - 12}
                textAnchor="middle"
                className="fill-white font-mono"
                fontSize={9}
              >
                ?
              </motion.text>
            </motion.g>
          )}
        </g>
      </svg>
    </div>
  );
}
