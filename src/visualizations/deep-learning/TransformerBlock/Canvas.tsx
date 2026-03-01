"use client";

import type { VisualizationStep, NeuralNetStepData } from "@/lib/visualization/types";
import { NeuralNetCanvas } from "@/visualizations/_shared/NeuralNetCanvas";

interface TransformerBlockCanvasProps {
  step: VisualizationStep;
}

export function TransformerBlockCanvas({ step }: TransformerBlockCanvasProps) {
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
