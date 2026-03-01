"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generatePCASteps } from "./logic";
import { PCACanvas } from "./Canvas";

export default function PCAVisualization() {
  const [numPoints, setNumPoints] = useState(20);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generatePCASteps({ numPoints, seed }),
    [numPoints, seed]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "numPoints",
      label: "Points",
      value: numPoints,
      min: 10,
      max: 30,
      step: 1,
    },
  ];

  const handleControlChange = useCallback(
    (key: string, value: number | string) => {
      if (key === "numPoints") setNumPoints(value as number);
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
        {(currentStep) => <PCACanvas step={currentStep} />}
      </Player>
    </div>
  );
}
