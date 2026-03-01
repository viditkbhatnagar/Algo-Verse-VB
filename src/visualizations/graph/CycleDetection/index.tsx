"use client";

import { useMemo, useState, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { GraphInputControls } from "@/visualizations/_shared/InputControls";
import { generateCycleDetectionSteps, DEFAULT_NODES } from "./logic";
import { CycleDetectionCanvas } from "./Canvas";

const PRESETS = [
  { label: "Default (with cycle)", value: "default" },
];

export default function CycleDetectionVisualization() {
  const [preset, setPreset] = useState("default");

  const steps = useMemo(
    () => generateCycleDetectionSteps(),
    [preset],
  );

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
        {(currentStep) => <CycleDetectionCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
