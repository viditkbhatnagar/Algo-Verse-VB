"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateROCAUCSteps } from "./logic";
import { ROCAUCCanvas } from "./Canvas";

export default function ROCAUCVisualization() {
  const [numSamples, setNumSamples] = useState(50);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateROCAUCSteps({ numSamples, seed }),
    [numSamples, seed]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "numSamples",
      label: "Samples",
      value: numSamples,
      min: 20,
      max: 100,
      step: 10,
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (key === "numSamples") setNumSamples(numValue);
  }, []);

  const handleRandomize = useCallback(() => {
    setSeed((prev) => prev + 1);
  }, []);

  const handleReset = useCallback(() => {
    setNumSamples(50);
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
        {(currentStep) => <ROCAUCCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
