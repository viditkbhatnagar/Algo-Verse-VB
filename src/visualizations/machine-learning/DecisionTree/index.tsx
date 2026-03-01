"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateDecisionTreeSteps } from "./logic";
import { DecisionTreeCanvas } from "./Canvas";

export default function DecisionTreeVisualization() {
  const [maxDepth, setMaxDepth] = useState(3);
  const [numSamples, setNumSamples] = useState(20);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateDecisionTreeSteps({ maxDepth, numSamples, seed }),
    [maxDepth, numSamples, seed]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "maxDepth",
      label: "Max Depth",
      value: maxDepth,
      min: 2,
      max: 5,
      step: 1,
    },
    {
      type: "slider",
      key: "numSamples",
      label: "Samples",
      value: numSamples,
      min: 10,
      max: 30,
      step: 5,
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (key === "maxDepth") setMaxDepth(numValue);
    if (key === "numSamples") setNumSamples(numValue);
  }, []);

  const handleRandomize = useCallback(() => {
    setSeed((prev) => prev + 1);
  }, []);

  const handleReset = useCallback(() => {
    setMaxDepth(3);
    setNumSamples(20);
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
        {(currentStep) => <DecisionTreeCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
