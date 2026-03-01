"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { MLInputPanel, type MLControl } from "@/visualizations/_shared/MLInputPanel";
import { generatePaddingSteps } from "./logic";
import { PaddingCanvas } from "./Canvas";

export default function PaddingVisualization() {
  const [seed, setSeed] = useState(42);

  const steps = useMemo(
    () => generatePaddingSteps({ seed }),
    [seed]
  );

  const controls: MLControl[] = [];

  const handleControlChange = useCallback(() => {}, []);

  const handleRandomize = useCallback(() => {
    setSeed((prev) => prev + 1);
  }, []);

  const handleReset = useCallback(() => {
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
        {(currentStep) => <PaddingCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
