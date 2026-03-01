"use client";

import type { VisualizationStep, NeuralNetStepData } from "@/lib/visualization/types";
import { NeuralNetCanvas } from "@/visualizations/_shared/NeuralNetCanvas";

interface GPTArchitectureCanvasProps {
  step: VisualizationStep;
}

export function GPTArchitectureCanvas({ step }: GPTArchitectureCanvasProps) {
  const data = step.data as NeuralNetStepData;

  return (
    <NeuralNetCanvas
      layers={data.layers}
      neurons={data.neurons}
      connections={data.connections}
      currentLayer={data.currentLayer}
      dataFlowDirection={data.dataFlowDirection}
      showActivations
      compactMode
    />
  );
}
