"use client";

import type { VisualizationStep, TokenStepData } from "@/lib/visualization/types";
import { TokenCanvas } from "@/visualizations/_shared/TokenCanvas";

interface LemmatizationCanvasProps {
  step: VisualizationStep;
}

export function LemmatizationCanvas({ step }: LemmatizationCanvasProps) {
  const data = step.data as TokenStepData;

  return (
    <TokenCanvas
      tokens={data.tokens}
      connections={data.connections}
      outputTokens={data.outputTokens}
      processingIndex={data.processingIndex}
      vocabulary={data.vocabulary}
      layout="two-row"
    />
  );
}
