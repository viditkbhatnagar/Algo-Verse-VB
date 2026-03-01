"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateDoublyLinkedListSteps } from "./logic";
import { DoublyLinkedListCanvas } from "./Canvas";

export default function DoublyLinkedListVisualization() {
  const steps = useMemo(() => generateDoublyLinkedListSteps(), []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="text-xs text-muted-foreground font-mono">
          Demo: insertAtHead, insertAtTail, insertAfter (middle), search, delete (middle/head/tail)
        </div>
      </div>
      <Player steps={steps}>
        {(currentStep) => <DoublyLinkedListCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
