"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateMiniBatchGDSteps } from "./logic";
import { MiniBatchGDCanvas } from "./Canvas";

export default function MiniBatchGDVisualization() {
  const [batchSize, setBatchSize] = useState(8);
  const [learningRate, setLearningRate] = useState(0.1);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateMiniBatchGDSteps({ batchSize, learningRate, seed }),
    [batchSize, learningRate, seed]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "batchSize",
      label: "Batch Size",
      value: batchSize,
      min: 4,
      max: 32,
      step: 4,
    },
    {
      type: "slider",
      key: "learningRate",
      label: "Learning Rate",
      value: learningRate,
      min: 0.01,
      max: 1.0,
      step: 0.01,
    },
  ];

  const handleControlChange = useCallback(
    (key: string, value: number | string) => {
      if (key === "batchSize") setBatchSize(value as number);
      if (key === "learningRate") setLearningRate(value as number);
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
        {(currentStep) => <MiniBatchGDCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
