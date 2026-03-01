"use client";

import { useMemo, useState, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { GraphInputControls } from "@/visualizations/_shared/InputControls";
import { generateKruskalSteps } from "./logic";
import { KruskalCanvas } from "./Canvas";

const PRESETS = [
  { label: "Default (6 nodes)", value: "default" },
];

export default function KruskalVisualization() {
  const [preset, setPreset] = useState("default");

  const steps = useMemo(() => generateKruskalSteps(), []);

  const handlePresetChange = useCallback((value: string) => {
    setPreset(value);
  }, []);

  return (
    <div className="space-y-4">
      <GraphInputControls
        presets={PRESETS}
        selectedPreset={preset}
        onPresetChange={handlePresetChange}
      />
      <Player steps={steps}>
        {(currentStep) => <KruskalCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
