"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateActivationFunctionsSteps } from "./logic";
import { ActivationFunctionsCanvas } from "./Canvas";

export default function ActivationFunctionsVisualization() {
  const [functionType, setFunctionType] = useState("relu");

  const steps = useMemo(
    () => generateActivationFunctionsSteps({ functionType }),
    [functionType]
  );

  const controls: MLControl[] = [
    {
      type: "select",
      key: "functionType",
      label: "Focus",
      value: functionType,
      options: [
        { label: "ReLU", value: "relu" },
        { label: "Sigmoid", value: "sigmoid" },
        { label: "Tanh", value: "tanh" },
        { label: "Leaky ReLU", value: "leakyRelu" },
      ],
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    if (key === "functionType") setFunctionType(value as string);
  }, []);

  const handleReset = useCallback(() => {
    setFunctionType("relu");
  }, []);

  return (
    <div className="space-y-4">
      <MLInputPanel
        controls={controls}
        onControlChange={handleControlChange}
        onReset={handleReset}
      />
      <Player steps={steps}>
        {(currentStep) => <ActivationFunctionsCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
