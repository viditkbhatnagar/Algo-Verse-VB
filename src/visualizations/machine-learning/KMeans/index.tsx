"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateKMeansSteps } from "./logic";
import { KMeansCanvas } from "./Canvas";

export default function KMeansVisualization() {
  const [k, setK] = useState(3);
  const [numPoints, setNumPoints] = useState(30);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateKMeansSteps({ k, numPoints, seed }),
    [k, numPoints, seed]
  );

  const handleControlChange = useCallback(
    (key: string, value: number | string) => {
      const numVal = typeof value === "string" ? parseFloat(value) : value;
      if (key === "k") setK(numVal);
      if (key === "numPoints") setNumPoints(numVal);
    },
    []
  );

  const handleRandomize = useCallback(() => {
    setSeed(Math.floor(Math.random() * 100000));
  }, []);

  const handleReset = useCallback(() => {
    setK(3);
    setNumPoints(30);
    setSeed(42);
  }, []);

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "k",
      label: "k (clusters)",
      value: k,
      min: 2,
      max: 5,
      step: 1,
    },
    {
      type: "slider",
      key: "numPoints",
      label: "Points",
      value: numPoints,
      min: 15,
      max: 50,
      step: 5,
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
        {(currentStep) => <KMeansCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
