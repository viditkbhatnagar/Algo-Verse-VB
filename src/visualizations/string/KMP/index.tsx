"use client";

import { useState, useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { StringInputControls } from "@/visualizations/_shared/InputControls";
import { generateKMPSteps } from "./logic";
import { KMPCanvas } from "./Canvas";

export default function KMPVisualization() {
  const [text, setText] = useState("ABABDABACDABABCABAB");
  const [pattern, setPattern] = useState("ABABCABAB");

  const steps = useMemo(
    () => generateKMPSteps(text, pattern),
    [text, pattern]
  );

  return (
    <div className="space-y-4">
      <StringInputControls
        text={text}
        pattern={pattern}
        onTextChange={setText}
        onPatternChange={setPattern}
      />
      <Player steps={steps}>
        {(currentStep) => <KMPCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
