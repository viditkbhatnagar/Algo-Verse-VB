"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateLogisticRegressionSteps } from "./logic";
import { LogisticRegressionCanvas } from "./Canvas";

export default function LogisticRegressionVisualization() {
  const [numPoints, setNumPoints] = useState(20);
  const [learningRate, setLearningRate] = useState(0.5);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateLogisticRegressionSteps({ numPoints, learningRate, seed }),
    [numPoints, learningRate, seed]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "numPoints",
      label: "Points",
      value: numPoints,
      min: 10,
      max: 40,
      step: 2,
    },
    {
      type: "slider",
      key: "learningRate",
      label: "Learning Rate",
      value: learningRate,
      min: 0.01,
      max: 2.0,
      step: 0.01,
    },
  ];

  const handleControlChange = useCallback(
    (key: string, value: number | string) => {
      if (key === "numPoints") setNumPoints(value as number);
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
        {(currentStep) => <LogisticRegressionCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
