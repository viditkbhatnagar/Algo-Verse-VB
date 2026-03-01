"use client";

import type { VisualizationStep, NeuralNetStepData } from "@/lib/visualization/types";
import { NeuralNetCanvas } from "@/visualizations/_shared/NeuralNetCanvas";

interface CNNArchitectureCanvasProps {
  step: VisualizationStep;
}

export function CNNArchitectureCanvas({ step }: CNNArchitectureCanvasProps) {
  const data = step.data as NeuralNetStepData;

  return (
    <NeuralNetCanvas
      layers={data.layers}
      neurons={data.neurons}
      connections={data.connections}
      currentLayer={data.currentLayer}
      dataFlowDirection={data.dataFlowDirection}
      compactMode
      showActivations
      className="w-full"
    />
  );
}
