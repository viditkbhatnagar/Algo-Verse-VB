"use client";

import { useMemo, useState, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { GraphInputControls } from "@/visualizations/_shared/InputControls";
import { generatePrimSteps, DEFAULT_NODES } from "./logic";
import { PrimCanvas } from "./Canvas";

const PRESETS = [
  { label: "Default (6 nodes)", value: "default" },
];

export default function PrimVisualization() {
  const [preset, setPreset] = useState("default");
  const [startNode, setStartNode] = useState("A");

  const nodeOptions = useMemo(
    () => DEFAULT_NODES.map((n) => n.id),
    []
  );

  const steps = useMemo(
    () => generatePrimSteps(undefined, undefined, startNode),
    [startNode]
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
        startNode={startNode}
        onStartNodeChange={setStartNode}
        nodeOptions={nodeOptions}
      />
      <Player steps={steps}>
        {(currentStep) => <PrimCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
