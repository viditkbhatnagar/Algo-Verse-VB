"use client";

import { motion } from "framer-motion";
import { VIZ_COLORS } from "@/lib/constants";
import type { VisualizationStep } from "@/lib/visualization/types";
import { TreeCanvas } from "@/visualizations/_shared/TreeCanvas";
import type { HuffmanStepData } from "./logic";

interface HuffmanCodingCanvasProps {
  step: VisualizationStep;
}

export function HuffmanCodingCanvas({ step }: HuffmanCodingCanvasProps) {
  const data = step.data as HuffmanStepData;
  const { nodes, edges, rootId, currentNodeId, priorityQueue, codes, phase } = data;

  const hasTree = nodes.length > 0 && rootId !== null;

  return (
    <div className="flex gap-4">
      {/* Tree visualization */}
      <div className="flex-1">
        {hasTree ? (
          <TreeCanvas
            nodes={nodes}
            edges={edges}
            rootId={rootId}
            currentNodeId={currentNodeId}
            showValues
            edgeLabels
          />
        ) : (
          <div className="flex items-center justify-center min-h-[200px] text-muted-foreground text-sm">
            Building tree...
          </div>
        )}
      </div>

      {/* Side panel */}
      <div className="w-36 shrink-0 space-y-3 text-xs font-mono">
        {/* Priority Queue */}
        {priorityQueue.length > 0 && (
          <div>
            <p className="text-muted-foreground text-center font-bold uppercase mb-1">
              Priority Queue
            </p>
            <div className="space-y-0.5">
              {priorityQueue.map((item, i) => (
                <motion.div
                  key={`${item.id}-${i}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-surface border border-border rounded px-1.5 py-0.5 flex justify-between"
                >
                  <span className="text-foreground">{item.label}</span>
                  <span className="text-muted-foreground">{item.freq}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Huffman Codes */}
        {Object.keys(codes).length > 0 && (
          <div>
            <p className="text-muted-foreground text-center font-bold uppercase mb-1">
              Codes
            </p>
            <div className="space-y-0.5">
              {Object.entries(codes)
                .sort((a, b) => a[1].length - b[1].length)
                .map(([char, code]) => {
                  const isHighlighted =
                    currentNodeId === `leaf-${char}`;

                  return (
                    <div
                      key={char}
                      className={`flex justify-between px-1.5 py-0.5 rounded ${
                        isHighlighted
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      <span className="font-bold">&apos;{char}&apos;</span>
                      <span>{code}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Phase indicator */}
        <div>
          <p className="text-muted-foreground text-center font-bold uppercase mb-1">
            Phase
          </p>
          <p className="text-center text-primary text-[10px]">
            {phase === "init" && "Initializing"}
            {phase === "building" && "Building Tree"}
            {phase === "encoding" && "Generating Codes"}
            {phase === "done" && "Complete"}
          </p>
        </div>

        {/* Legend */}
        <div className="space-y-1">
          <p className="text-muted-foreground text-center font-bold uppercase mb-1">
            Edge Labels
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Left = 0</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Right = 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
