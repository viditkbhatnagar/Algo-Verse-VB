"use client";

import type { VisualizationStep, WeightedGraphStepData } from "@/lib/visualization/types";
import { WeightedGraphCanvas } from "@/visualizations/_shared/WeightedGraphCanvas";

interface CycleDetectionCanvasProps {
  step: VisualizationStep;
}

export function CycleDetectionCanvas({ step }: CycleDetectionCanvasProps) {
  const data = step.data as WeightedGraphStepData;

  // Convert distance codes to color labels for the distance table
  const colorLabels: Record<string, number> = {};
  if (data.distances) {
    for (const [node, code] of Object.entries(data.distances)) {
      colorLabels[node] = code;
    }
  }

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <WeightedGraphCanvas
          nodes={data.nodes}
          edges={data.edges}
          nodeStates={data.nodeStates}
          currentNode={data.currentNode}
          visitOrder={data.visitOrder}
          showDistanceTable={false}
        />
      </div>

      {/* Side panel with color states */}
      <div className="w-32 shrink-0 space-y-3 text-xs font-mono">
        {/* Node colors */}
        <div>
          <p className="text-muted-foreground text-center font-bold uppercase mb-1">
            Node Colors
          </p>
          <div className="space-y-0.5">
            {data.nodes.map((node) => {
              const code = colorLabels[node.id] ?? 0;
              const colorName =
                code === 0 ? "White" : code === 1 ? "Gray" : "Black";
              const textColor =
                code === 0
                  ? "text-slate-400"
                  : code === 1
                    ? "text-yellow-400"
                    : "text-green-400";

              return (
                <div
                  key={node.id}
                  className={`flex justify-between px-1.5 py-0.5 rounded ${
                    node.id === data.currentNode
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <span>{node.id}</span>
                  <span className={textColor}>{colorName}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visit order */}
        {data.visitOrder && data.visitOrder.length > 0 && (
          <div>
            <p className="text-muted-foreground text-center font-bold uppercase mb-1">
              DFS Order
            </p>
            <p className="text-muted-foreground text-center text-[10px]">
              {data.visitOrder.join(" \u2192 ")}
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="space-y-1">
          <p className="text-muted-foreground text-center font-bold uppercase mb-1">
            Legend
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#475569]" />
            <span className="text-muted-foreground">White</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <span className="text-muted-foreground">Gray</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
            <span className="text-muted-foreground">Black</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[#ef4444]" />
            <span className="text-muted-foreground">Cycle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
