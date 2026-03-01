"use client";

import type { VisualizationStep, NeuralNetStepData } from "@/lib/visualization/types";
import { NeuralNetCanvas } from "@/visualizations/_shared/NeuralNetCanvas";

interface Word2VecSkipGramCanvasProps {
  step: VisualizationStep;
}

export function Word2VecSkipGramCanvas({ step }: Word2VecSkipGramCanvasProps) {
  const data = step.data as NeuralNetStepData;

  return (
    <NeuralNetCanvas
      layers={data.layers}
      neurons={data.neurons}
      connections={data.connections}
      currentLayer={data.currentLayer}
      dataFlowDirection={data.dataFlowDirection}
      showActivations
      showWeights={false}
    />
  );
}
