"use client";

import type { VisualizationStep, ConvolutionStepData } from "@/lib/visualization/types";
import { ConvolutionCanvas } from "@/visualizations/_shared/ConvolutionCanvas";

interface StrideCanvasProps {
  step: VisualizationStep;
}

export function StrideCanvas({ step }: StrideCanvasProps) {
  const data = step.data as ConvolutionStepData;

  return (
    <ConvolutionCanvas
      input={data.input}
      kernel={data.kernel}
      output={data.output}
      kernelPosition={data.kernelPosition}
      stride={data.stride}
      currentOutputCell={data.currentOutputCell}
      computationDetail={data.computationDetail}
      className="w-full"
    />
  );
}
