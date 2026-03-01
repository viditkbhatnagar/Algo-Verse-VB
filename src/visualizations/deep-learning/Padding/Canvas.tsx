"use client";

import type { VisualizationStep, ConvolutionStepData } from "@/lib/visualization/types";
import { ConvolutionCanvas } from "@/visualizations/_shared/ConvolutionCanvas";

interface PaddingCanvasProps {
  step: VisualizationStep;
}

export function PaddingCanvas({ step }: PaddingCanvasProps) {
  const data = step.data as ConvolutionStepData;

  return (
    <ConvolutionCanvas
      input={data.input}
      kernel={data.kernel}
      output={data.output}
      kernelPosition={data.kernelPosition}
      padding={data.padding}
      currentOutputCell={data.currentOutputCell}
      computationDetail={data.computationDetail}
      className="w-full"
    />
  );
}
