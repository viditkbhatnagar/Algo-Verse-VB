"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateConvolutionSteps } from "./logic";
import { ConvolutionVizCanvas } from "./Canvas";

export default function ConvolutionVisualization() {
  const [kernelSize, setKernelSize] = useState(3);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateConvolutionSteps({ kernelSize, seed }),
    [kernelSize, seed]
  );

  const controls: MLControl[] = [
    {
      type: "select",
      key: "kernelSize",
      label: "Kernel Size",
      value: String(kernelSize),
      options: [
        { label: "3x3", value: "3" },
        { label: "5x5", value: "5" },
      ],
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    if (key === "kernelSize") setKernelSize(Number(value));
  }, []);

  const handleRandomize = useCallback(() => {
    setSeed((prev) => prev + 1);
  }, []);

  const handleReset = useCallback(() => {
    setKernelSize(3);
    setSeed(42);
  }, []);

  return (
    <div className="space-y-4">
      <MLInputPanel
        controls={controls}
        onControlChange={handleControlChange}
        onRandomize={handleRandomize}
        onReset={handleReset}
      />
      <Player steps={steps}>
        {(currentStep) => <ConvolutionVizCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
