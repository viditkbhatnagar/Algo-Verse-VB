"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateDropoutSteps } from "./logic";
import { DropoutCanvas } from "./Canvas";

export default function DropoutVisualization() {
  const [dropoutRate, setDropoutRate] = useState(0.3);

  const steps = useMemo(
    () => generateDropoutSteps({ dropoutRate }),
    [dropoutRate]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "dropoutRate",
      label: "Dropout Rate",
      value: dropoutRate,
      min: 0.1,
      max: 0.5,
      step: 0.05,
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (key === "dropoutRate") setDropoutRate(numValue);
  }, []);

  const handleReset = useCallback(() => {
    setDropoutRate(0.3);
  }, []);

  return (
    <div className="space-y-4">
      <MLInputPanel
        controls={controls}
        onControlChange={handleControlChange}
        onReset={handleReset}
      />
      <Player steps={steps}>
        {(currentStep) => <DropoutCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
