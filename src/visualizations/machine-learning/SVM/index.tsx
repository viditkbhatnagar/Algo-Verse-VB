"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateSVMSteps } from "./logic";
import { SVMCanvas } from "./Canvas";

export default function SVMVisualization() {
  const [numPoints, setNumPoints] = useState(20);
  const [marginSize, setMarginSize] = useState(1.5);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateSVMSteps({ numPoints, marginSize, seed }),
    [numPoints, marginSize, seed]
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
    {
      type: "slider",
      key: "marginSize",
      label: "Margin",
      value: marginSize,
      min: 0.5,
      max: 3,
      step: 0.25,
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (key === "numPoints") setNumPoints(numValue);
    if (key === "marginSize") setMarginSize(numValue);
  }, []);

  const handleRandomize = useCallback(() => {
    setSeed((prev) => prev + 1);
  }, []);

  const handleReset = useCallback(() => {
    setNumPoints(20);
    setMarginSize(1.5);
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
        {(currentStep) => <SVMCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
