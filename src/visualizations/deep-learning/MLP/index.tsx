"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateMLPSteps } from "./logic";
import { MLPCanvas } from "./Canvas";

export default function MLPVisualization() {
  const [hiddenSize, setHiddenSize] = useState(4);

  const steps = useMemo(
    () => generateMLPSteps({ hiddenSize }),
    [hiddenSize]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "hiddenSize",
      label: "Hidden Neurons",
      value: hiddenSize,
      min: 2,
      max: 6,
      step: 1,
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (key === "hiddenSize") setHiddenSize(numValue);
  }, []);

  const handleReset = useCallback(() => {
    setHiddenSize(4);
  }, []);

  return (
    <div className="space-y-4">
      <MLInputPanel
        controls={controls}
        onControlChange={handleControlChange}
        onReset={handleReset}
      />
      <Player steps={steps}>
        {(currentStep) => <MLPCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
