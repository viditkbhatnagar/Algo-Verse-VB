"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateLinearRegressionSteps } from "./logic";
import { LinearRegressionCanvas } from "./Canvas";

export default function LinearRegressionVisualization() {
  const [numPoints, setNumPoints] = useState(20);
  const [noise, setNoise] = useState(3);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateLinearRegressionSteps({ numPoints, noise, seed }),
    [numPoints, noise, seed]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "numPoints",
      label: "Points",
      value: numPoints,
      min: 5,
      max: 30,
      step: 1,
    },
    {
      type: "slider",
      key: "noise",
      label: "Noise",
      value: noise,
      min: 0,
      max: 10,
      step: 0.5,
    },
  ];

  const handleControlChange = useCallback(
    (key: string, value: number | string) => {
      if (key === "numPoints") setNumPoints(value as number);
      if (key === "noise") setNoise(value as number);
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
        {(currentStep) => <LinearRegressionCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
