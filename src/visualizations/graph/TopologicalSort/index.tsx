"use client";

import { useMemo, useState, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { GraphInputControls } from "@/visualizations/_shared/InputControls";
import { generateTopologicalSortSteps } from "./logic";
import { TopologicalSortCanvas } from "./Canvas";

const PRESETS = [
  { label: "Default DAG (6 nodes)", value: "default" },
];

export default function TopologicalSortVisualization() {
  const [preset, setPreset] = useState("default");

  const steps = useMemo(() => generateTopologicalSortSteps(), []);

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
        {(currentStep) => <TopologicalSortCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
