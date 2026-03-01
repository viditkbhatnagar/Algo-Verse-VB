"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateCrossValidationSteps } from "./logic";
import { CrossValidationCanvas } from "./Canvas";

export default function CrossValidationVisualization() {
  const [k, setK] = useState(5);
  const [dataSize, setDataSize] = useState(30);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateCrossValidationSteps({ k, dataSize, seed }),
    [k, dataSize, seed]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "k",
      label: "K (Folds)",
      value: k,
      min: 3,
      max: 10,
      step: 1,
    },
    {
      type: "slider",
      key: "dataSize",
      label: "Data Size",
      value: dataSize,
      min: 20,
      max: 50,
      step: 5,
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (key === "k") setK(numValue);
    if (key === "dataSize") setDataSize(numValue);
  }, []);

  const handleRandomize = useCallback(() => {
    setSeed((prev) => prev + 1);
  }, []);

  const handleReset = useCallback(() => {
    setK(5);
    setDataSize(30);
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
        {(currentStep) => <CrossValidationCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
