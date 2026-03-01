"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateKNNSteps } from "./logic";
import { KNNCanvas } from "./Canvas";

export default function KNNVisualization() {
  const [k, setK] = useState(3);
  const [numPoints, setNumPoints] = useState(20);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateKNNSteps({ k, numPoints, seed }),
    [k, numPoints, seed]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "k",
      label: "K",
      value: k,
      min: 1,
      max: 9,
      step: 2,
    },
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
    if (key === "k") setK(numValue);
    if (key === "numPoints") setNumPoints(numValue);
  }, []);

  const handleRandomize = useCallback(() => {
    setSeed((prev) => prev + 1);
  }, []);

  const handleReset = useCallback(() => {
    setK(3);
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
        {(currentStep) => <KNNCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
