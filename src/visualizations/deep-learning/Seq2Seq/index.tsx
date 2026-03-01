"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateSeq2SeqSteps } from "./logic";
import { Seq2SeqCanvas } from "./Canvas";

export default function Seq2SeqVisualization() {
  const steps = useMemo(() => generateSeq2SeqSteps(), []);

  return (
    <div className="space-y-4">
      <Player steps={steps}>
        {(currentStep) => <Seq2SeqCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
