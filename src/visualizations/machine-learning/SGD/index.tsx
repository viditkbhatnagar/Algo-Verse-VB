"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateSGDSteps } from "./logic";
import { SGDCanvas } from "./Canvas";

export default function SGDVisualization() {
  const [learningRate, setLearningRate] = useState(0.1);
  const [batchSize, setBatchSize] = useState(1);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateSGDSteps({ learningRate, batchSize, seed }),
    [learningRate, batchSize, seed]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "learningRate",
      label: "Learning Rate",
      value: learningRate,
      min: 0.01,
      max: 1.0,
      step: 0.01,
    },
    {
      type: "slider",
      key: "batchSize",
      label: "Batch Size",
      value: batchSize,
      min: 1,
      max: 10,
      step: 1,
    },
  ];

  const handleControlChange = useCallback(
    (key: string, value: number | string) => {
      if (key === "learningRate") setLearningRate(value as number);
      if (key === "batchSize") setBatchSize(value as number);
    },
    []
  );

  const handleRandomize = useCallback(() => {
    setSeed(Math.floor(Math.random() * 100000));
  }, []);

  return (
    <div className="space-y-4">
      <MLInputPanel
        controls={controls}
        onControlChange={handleControlChange}
        onRandomize={handleRandomize}
      />
      <Player steps={steps}>
        {(currentStep) => <SGDCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
