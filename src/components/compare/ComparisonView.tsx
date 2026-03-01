"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getVisualization } from "@/visualizations/registry";
import type { ComplexityInfo } from "@/lib/visualization/types";

interface CompAlgorithm {
  id: string;
  name: string;
  category: string;
  timeComplexity: ComplexityInfo;
  spaceComplexity: ComplexityInfo;
}

interface ComparisonViewProps {
  algorithm1: CompAlgorithm;
  algorithm2: CompAlgorithm;
}

export function ComparisonView({
  algorithm1,
  algorithm2,
}: ComparisonViewProps) {
  const Viz1 = getVisualization(algorithm1.id);
  const Viz2 = getVisualization(algorithm2.id);

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/compare"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to selector
      </Link>

      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          <span className="text-primary">{algorithm1.name}</span>
          <span className="text-muted-foreground mx-3">vs</span>
          <span className="text-accent">{algorithm2.name}</span>
        </h1>
      </div>

      {/* Complexity comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full max-w-2xl mx-auto text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 px-3 text-left text-muted-foreground font-medium">
                Metric
              </th>
              <th className="py-2 px-3 text-center text-primary font-medium">
                {algorithm1.name}
              </th>
              <th className="py-2 px-3 text-center text-accent font-medium">
                {algorithm2.name}
              </th>
            </tr>
          </thead>
          <tbody className="font-mono text-xs">
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-muted-foreground">Time (Best)</td>
              <td className="py-2 px-3 text-center text-foreground">
                {algorithm1.timeComplexity.best}
              </td>
              <td className="py-2 px-3 text-center text-foreground">
                {algorithm2.timeComplexity.best}
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-muted-foreground">Time (Avg)</td>
              <td className="py-2 px-3 text-center text-foreground">
                {algorithm1.timeComplexity.average}
              </td>
              <td className="py-2 px-3 text-center text-foreground">
                {algorithm2.timeComplexity.average}
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-muted-foreground">Time (Worst)</td>
              <td className="py-2 px-3 text-center text-foreground">
                {algorithm1.timeComplexity.worst}
              </td>
              <td className="py-2 px-3 text-center text-foreground">
                {algorithm2.timeComplexity.worst}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-muted-foreground">Space</td>
              <td className="py-2 px-3 text-center text-foreground">
                {algorithm1.spaceComplexity.worst}
              </td>
              <td className="py-2 px-3 text-center text-foreground">
                {algorithm2.spaceComplexity.worst}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Side-by-side visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2 min-w-0">
          <h2 className="text-lg font-semibold text-primary">
            {algorithm1.name}
          </h2>
          <div className="rounded-lg border border-border bg-surface/30 p-2">
            {Viz1 ? (
              <Viz1 />
            ) : (
              <div className="flex items-center justify-center min-h-[300px] text-muted-foreground text-sm">
                No visualization available
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2 min-w-0">
          <h2 className="text-lg font-semibold text-accent">
            {algorithm2.name}
          </h2>
          <div className="rounded-lg border border-border bg-surface/30 p-2">
            {Viz2 ? (
              <Viz2 />
            ) : (
              <div className="flex items-center justify-center min-h-[300px] text-muted-foreground text-sm">
                No visualization available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
