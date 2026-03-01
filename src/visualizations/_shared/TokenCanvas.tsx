"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { TokenData, TokenConnection } from "@/lib/visualization/types";

interface TokenCanvasProps {
  tokens: TokenData[];
  connections?: TokenConnection[];
  outputTokens?: TokenData[];
  processingIndex?: number;
  vocabulary?: { token: string; count: number }[];
  showConnections?: boolean;
  layout?: "horizontal" | "two-row";
  className?: string;
}

const TYPE_COLORS: Record<string, string> = {
  PERSON: "#6366f1",
  ORG: "#f59e0b",
  LOC: "#22d3ee",
  DATE: "#a855f7",
  NOUN: "#3b82f6",
  VERB: "#22c55e",
  ADJ: "#f97316",
  ADV: "#ec4899",
  SUBWORD: "#8b5cf6",
  MERGED: "#22c55e",
  default: VIZ_COLORS.token,
};

function getTokenColor(token: TokenData, isProcessing: boolean): string {
  if (isProcessing) return VIZ_COLORS.active;
  if (token.highlight) {
    return VIZ_COLORS[token.highlight as keyof typeof VIZ_COLORS] ?? VIZ_COLORS.token;
  }
  if (token.type) return TYPE_COLORS[token.type] ?? TYPE_COLORS.default;
  return TYPE_COLORS.default;
}

export function TokenCanvas({
  tokens,
  connections,
  outputTokens,
  processingIndex,
  vocabulary,
  showConnections = true,
  layout = "horizontal",
  className,
}: TokenCanvasProps) {
  return (
    <div className={`${className ?? ""} space-y-4`} style={{ minHeight: 150 }}>
      {/* Input tokens row */}
      <div className="flex flex-wrap items-center gap-2 justify-center">
        {tokens.map((token, idx) => {
          const isProcessing = processingIndex === idx;
          const color = getTokenColor(token, isProcessing);
          return (
            <motion.div
              key={token.id}
              className="relative flex flex-col items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.2 }}
            >
              <motion.div
                className="px-3 py-1.5 rounded-md border font-mono text-sm whitespace-nowrap"
                style={{
                  borderColor: color,
                  backgroundColor: `${color}20`,
                  color: "#e2e8f0",
                }}
                animate={{
                  borderColor: color,
                  backgroundColor: `${color}${isProcessing ? "40" : "20"}`,
                  scale: isProcessing ? 1.08 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {token.text}
              </motion.div>
              {token.type && (
                <span
                  className="mt-1 text-[9px] font-mono px-1.5 py-0.5 rounded"
                  style={{ color, backgroundColor: `${color}15` }}
                >
                  {token.type}
                </span>
              )}
              {token.position !== undefined && (
                <span className="text-[8px] text-muted-foreground font-mono mt-0.5">
                  {token.position}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Connections as arrows (simplified — SVG overlay) */}
      {showConnections && connections && connections.length > 0 && (
        <div className="flex justify-center">
          <svg width="100%" height={40} className="overflow-visible">
            {connections.map((conn, idx) => {
              const srcIdx = tokens.findIndex((t) => t.id === conn.source);
              const tgtIdx = tokens.findIndex((t) => t.id === conn.target);
              if (srcIdx < 0 || tgtIdx < 0) return null;
              const srcX = srcIdx * 80 + 40;
              const tgtX = tgtIdx * 80 + 40;
              const midY = -Math.abs(tgtX - srcX) * 0.15 - 5;
              const opacity = conn.weight !== undefined ? Math.max(0.2, Math.min(1, conn.weight)) : 0.6;
              return (
                <motion.path
                  key={`conn-${idx}`}
                  d={`M ${srcX} 0 Q ${(srcX + tgtX) / 2} ${midY} ${tgtX} 0`}
                  fill="none"
                  stroke={conn.highlight ? (VIZ_COLORS[conn.highlight as keyof typeof VIZ_COLORS] ?? VIZ_COLORS.active) : VIZ_COLORS.active}
                  strokeWidth={1.5}
                  opacity={opacity}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.02 }}
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* Output tokens (two-row layout) */}
      {layout === "two-row" && outputTokens && outputTokens.length > 0 && (
        <>
          <div className="flex justify-center">
            <svg width={40} height={24}>
              <line x1={20} y1={0} x2={20} y2={24} stroke="#475569" strokeWidth={1.5} markerEnd="url(#token-arrow)" />
              <defs>
                <marker id="token-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#475569" />
                </marker>
              </defs>
            </svg>
          </div>
          <div className="flex flex-wrap items-center gap-2 justify-center">
            {outputTokens.map((token, idx) => {
              const color = getTokenColor(token, false);
              return (
                <motion.div
                  key={token.id}
                  className="px-3 py-1.5 rounded-md border font-mono text-sm whitespace-nowrap"
                  style={{
                    borderColor: color,
                    backgroundColor: `${color}20`,
                    color: "#e2e8f0",
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.2 }}
                >
                  {token.text}
                  {token.type && (
                    <span className="ml-1.5 text-[9px] opacity-60">{token.type}</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {/* Vocabulary sidebar */}
      {vocabulary && vocabulary.length > 0 && (
        <div className="mt-3 p-2 rounded bg-surface/50 border border-border max-h-32 overflow-y-auto">
          <span className="text-[10px] text-muted-foreground font-mono block mb-1">Vocabulary</span>
          <div className="flex flex-wrap gap-1.5">
            {vocabulary.slice(0, 20).map((v, i) => (
              <span
                key={i}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/40 text-muted-foreground"
              >
                {v.token}: {v.count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
