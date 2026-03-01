"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generatePolynomialRegressionSteps } from "./logic";
import { PolynomialRegressionCanvas } from "./Canvas";

export default function PolynomialRegressionVisualization() {
  const [numPoints, setNumPoints] = useState(20);
  const [degree, setDegree] = useState(2);
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generatePolynomialRegressionSteps({ numPoints, degree, seed }),
    [numPoints, degree, seed]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "numPoints",
      label: "Points",
      value: numPoints,
      min: 8,
      max: 30,
      step: 1,
    },
    {
      type: "select",
      key: "degree",
      label: "Degree",
      value: String(degree),
      options: [
        { label: "2 (Quadratic)", value: "2" },
        { label: "3 (Cubic)", value: "3" },
      ],
    },
  ];

  const handleControlChange = useCallback(
    (key: string, value: number | string) => {
      if (key === "numPoints") setNumPoints(value as number);
      if (key === "degree") setDegree(Number(value));
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
        {(currentStep) => <PolynomialRegressionCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
