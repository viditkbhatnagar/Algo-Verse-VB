"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateDBSCANSteps } from "./logic";
import { DBSCANCanvas } from "./Canvas";

export default function DBSCANVisualization() {
  const [epsilon, setEpsilon] = useState(1.5);
  const [minPts, setMinPts] = useState(3);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateDBSCANSteps({ epsilon, minPoints: minPts, seed }),
    [epsilon, minPts, seed]
  );

  const handleControlChange = useCallback(
    (key: string, value: number | string) => {
      const numVal = typeof value === "string" ? parseFloat(value) : value;
      if (key === "epsilon") setEpsilon(numVal);
      if (key === "minPoints") setMinPts(numVal);
    },
    []
  );

  const handleRandomize = useCallback(() => {
    setSeed(Math.floor(Math.random() * 100000));
  }, []);

  const handleReset = useCallback(() => {
    setEpsilon(1.5);
    setMinPts(3);
    setSeed(42);
  }, []);

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "epsilon",
      label: "Epsilon (eps)",
      value: epsilon,
      min: 0.5,
      max: 3.0,
      step: 0.1,
    },
    {
      type: "slider",
      key: "minPoints",
      label: "Min Points",
      value: minPts,
      min: 2,
      max: 8,
      step: 1,
    },
  ];

  return (
    <div className="space-y-4">
      <MLInputPanel
        controls={controls}
        onControlChange={handleControlChange}
        onRandomize={handleRandomize}
        onReset={handleReset}
      />
      <Player steps={steps}>
        {(currentStep) => <DBSCANCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
