"use client";

import { useMemo } from "react";
import { Player } from "@/components/visualization/Player";
import { generateQueueSteps } from "./logic";
import { QueueCanvas } from "./Canvas";

export default function QueueVisualization() {
  const steps = useMemo(() => generateQueueSteps(), []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="text-xs text-muted-foreground font-mono">
          Demo: enqueue(10), enqueue(20), enqueue(30), enqueue(40), dequeue(), peek(), dequeue(), enqueue(50), dequeue()
        </div>
      </div>
      <Player steps={steps}>
        {(currentStep) => <QueueCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
