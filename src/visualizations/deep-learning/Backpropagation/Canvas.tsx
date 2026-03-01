"use client";

import type { VisualizationStep, NeuralNetStepData } from "@/lib/visualization/types";
import { NeuralNetCanvas } from "@/visualizations/_shared/NeuralNetCanvas";

interface BackpropagationCanvasProps {
  step: VisualizationStep;
}

export function BackpropagationCanvas({ step }: BackpropagationCanvasProps) {
  const data = step.data as NeuralNetStepData;

  return (
    <NeuralNetCanvas
      layers={data.layers}
      neurons={data.neurons}
      connections={data.connections}
      currentLayer={data.currentLayer}
      dataFlowDirection={data.dataFlowDirection}
      showWeights={false}
      showActivations
      className="w-full"
    />
  );
}
