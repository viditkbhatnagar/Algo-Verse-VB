"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateNaiveBayesSteps } from "./logic";
import { NaiveBayesCanvas } from "./Canvas";

export default function NaiveBayesVisualization() {
  const [numFeatures, setNumFeatures] = useState(3);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateNaiveBayesSteps({ numFeatures, seed }),
    [numFeatures, seed]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "numFeatures",
      label: "Features",
      value: numFeatures,
      min: 2,
      max: 4,
      step: 1,
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (key === "numFeatures") setNumFeatures(numValue);
  }, []);

  const handleRandomize = useCallback(() => {
    setSeed((prev) => prev + 1);
  }, []);

  const handleReset = useCallback(() => {
    setNumFeatures(3);
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
        {(currentStep) => <NaiveBayesCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
