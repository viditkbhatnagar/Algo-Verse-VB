"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateRandomForestSteps } from "./logic";
import { RandomForestCanvas } from "./Canvas";

export default function RandomForestVisualization() {
  const [numTrees, setNumTrees] = useState(5);
  const [maxDepth, setMaxDepth] = useState(3);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateRandomForestSteps({ numTrees, maxDepth, seed }),
    [numTrees, maxDepth, seed]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "numTrees",
      label: "Trees",
      value: numTrees,
      min: 3,
      max: 7,
      step: 1,
    },
    {
      type: "slider",
      key: "maxDepth",
      label: "Max Depth",
      value: maxDepth,
      min: 2,
      max: 4,
      step: 1,
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (key === "numTrees") setNumTrees(numValue);
    if (key === "maxDepth") setMaxDepth(numValue);
  }, []);

  const handleRandomize = useCallback(() => {
    setSeed((prev) => prev + 1);
  }, []);

  const handleReset = useCallback(() => {
    setNumTrees(5);
    setMaxDepth(3);
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
        {(currentStep) => <RandomForestCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
