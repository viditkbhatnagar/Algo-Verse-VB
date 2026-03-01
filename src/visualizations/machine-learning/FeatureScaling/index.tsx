"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateFeatureScalingSteps } from "./logic";
import { FeatureScalingCanvas } from "./Canvas";

export default function FeatureScalingVisualization() {
  const [numPoints, setNumPoints] = useState(20);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateFeatureScalingSteps({ numPoints, seed }),
    [numPoints, seed]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "numPoints",
      label: "Points",
      value: numPoints,
      min: 10,
      max: 30,
      step: 2,
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (key === "numPoints") setNumPoints(numValue);
  }, []);

  const handleRandomize = useCallback(() => {
    setSeed((prev) => prev + 1);
  }, []);

  const handleReset = useCallback(() => {
    setNumPoints(20);
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
        {(currentStep) => <FeatureScalingCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
