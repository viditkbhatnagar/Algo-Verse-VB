"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateStrideSteps } from "./logic";
import { StrideCanvas } from "./Canvas";

export default function StrideVisualization() {
  const [stride, setStride] = useState(1);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateStrideSteps({ stride, seed }),
    [stride, seed]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "stride",
      label: "Stride",
      value: stride,
      min: 1,
      max: 3,
      step: 1,
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (key === "stride") setStride(numValue);
  }, []);

  const handleRandomize = useCallback(() => {
    setSeed((prev) => prev + 1);
  }, []);

  const handleReset = useCallback(() => {
    setStride(1);
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
        {(currentStep) => <StrideCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
