"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateEpsilonGreedySteps } from "./logic";
import { EpsilonGreedyCanvas } from "./Canvas";

export default function EpsilonGreedyVisualization() {
  const [initialEpsilon, setInitialEpsilon] = useState(0.8);
  const [decayRate, setDecayRate] = useState(0.05);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateEpsilonGreedySteps({ initialEpsilon, decayRate, seed }),
    [initialEpsilon, decayRate, seed]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "initialEpsilon",
      label: "Initial Epsilon",
      value: initialEpsilon,
      min: 0.5,
      max: 1.0,
      step: 0.05,
    },
    {
      type: "slider",
      key: "decayRate",
      label: "Decay Rate",
      value: decayRate,
      min: 0.01,
      max: 0.1,
      step: 0.01,
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (key === "initialEpsilon") setInitialEpsilon(numValue);
    if (key === "decayRate") setDecayRate(numValue);
  }, []);

  const handleRandomize = useCallback(() => {
    setSeed((prev) => prev + 1);
  }, []);

  const handleReset = useCallback(() => {
    setInitialEpsilon(0.8);
    setDecayRate(0.05);
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
        {(currentStep) => <EpsilonGreedyCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
