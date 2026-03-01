"use client";

import { useState, useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { StringInputControls } from "@/visualizations/_shared/InputControls";
import { generateNaiveStringMatchSteps } from "./logic";
import { NaiveStringMatchCanvas } from "./Canvas";

export default function NaiveStringMatchingVisualization() {
  const [text, setText] = useState("AABAACAADAABAABA");
  const [pattern, setPattern] = useState("AABA");

  const steps = useMemo(
    () => generateNaiveStringMatchSteps(text, pattern),
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
        {(currentStep) => <NaiveStringMatchCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
