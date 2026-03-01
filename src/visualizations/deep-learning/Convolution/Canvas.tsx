"use client";

import type { VisualizationStep, ConvolutionStepData } from "@/lib/visualization/types";
import { ConvolutionCanvas } from "@/visualizations/_shared/ConvolutionCanvas";

interface ConvolutionVizCanvasProps {
  step: VisualizationStep;
}

export function ConvolutionVizCanvas({ step }: ConvolutionVizCanvasProps) {
  const data = step.data as ConvolutionStepData;

  return (
    <ConvolutionCanvas
      input={data.input}
      kernel={data.kernel}
      output={data.output}
      kernelPosition={data.kernelPosition}
      currentOutputCell={data.currentOutputCell}
      computationDetail={data.computationDetail}
      className="w-full"
    />
  );
}
