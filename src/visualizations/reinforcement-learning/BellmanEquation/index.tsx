"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generateBellmanSteps } from "./logic";
import { BellmanCanvas } from "./Canvas";

export default function BellmanEquationVisualization() {
  const [discountFactor, setDiscountFactor] = useState(0.9);

  const steps = useMemo(
    () => generateBellmanSteps({ discountFactor }),
    [discountFactor]
  );

  const controls: MLControl[] = [
    {
      type: "slider",
      key: "discountFactor",
      label: "Discount (gamma)",
      value: discountFactor,
      min: 0.5,
      max: 0.99,
      step: 0.01,
    },
  ];

  const handleControlChange = useCallback((key: string, value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (key === "discountFactor") setDiscountFactor(numValue);
  }, []);

  const handleReset = useCallback(() => {
    setDiscountFactor(0.9);
  }, []);

  return (
    <div className="space-y-4">
      <MLInputPanel
        controls={controls}
        onControlChange={handleControlChange}
        onReset={handleReset}
      />
      <Player steps={steps}>
        {(currentStep) => <BellmanCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
