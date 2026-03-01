"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateBanditSteps } from "./logic";
import { MultiArmedBanditCanvas } from "./Canvas";

export default function MultiArmedBanditVisualization() {
  const [numArms, setNumArms] = useState(4);
  const [epsilon, setEpsilon] = useState(0.2);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateBanditSteps({ numArms, epsilon, seed }),
    [numArms, epsilon, seed]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "numArms",
      label: "Arms",
      value: numArms,
      min: 3,
      max: 5,
      step: 1,
    },
    {
      type: "slider",
      key: "epsilon",
      label: "Epsilon",
      value: epsilon,
      min: 0.1,
      max: 0.5,
      step: 0.05,
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (key === "numArms") setNumArms(numValue);
    if (key === "epsilon") setEpsilon(numValue);
  }, []);

  const handleRandomize = useCallback(() => {
    setSeed((prev) => prev + 1);
  }, []);

  const handleReset = useCallback(() => {
    setNumArms(4);
    setEpsilon(0.2);
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
        {(currentStep) => <MultiArmedBanditCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
