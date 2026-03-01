"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateRegularizationSteps } from "./logic";
import { RegularizationCanvas } from "./Canvas";

export default function RegularizationVisualization() {
  const [lambda, setLambda] = useState(1.0);
  const [regType, setRegType] = useState<"L1" | "L2">("L1");
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generateRegularizationSteps({ lambda, regType, seed }),
    [lambda, regType, seed]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "lambda",
      label: "Lambda",
      value: lambda,
      min: 0.01,
      max: 10,
      step: 0.1,
    },
    {
      type: "select",
      key: "regType",
      label: "Type",
      value: regType,
      options: [
        { label: "L1 (Lasso)", value: "L1" },
        { label: "L2 (Ridge)", value: "L2" },
      ],
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    if (key === "lambda") setLambda(typeof value === "string" ? parseFloat(value) : value);
    if (key === "regType") setRegType(value as "L1" | "L2");
  }, []);

  const handleRandomize = useCallback(() => {
    setSeed((prev) => prev + 1);
  }, []);

  const handleReset = useCallback(() => {
    setLambda(1.0);
    setRegType("L1");
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
        {(currentStep) => <RegularizationCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
