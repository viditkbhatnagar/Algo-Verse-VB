"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shuffle } from "lucide-react";
import { generateEuclideanGCDSteps } from "./logic";
import { EuclideanGCDCanvas } from "./Canvas";

function randomPair(): [number, number] {
  const a = Math.floor(Math.random() * 900) + 100;
  const b = Math.floor(Math.random() * (a - 10)) + 10;
  return [a, b];
}

export default function EuclideanGCDVisualization() {
  const [a, setA] = useState(252);
  const [b, setB] = useState(105);

  const steps = useMemo(
    () => generateEuclideanGCDSteps(a, b),
    [a, b]
  );

  const handleRandomize = useCallback(() => {
    const [na, nb] = randomPair();
    setA(na);
    setB(nb);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">a:</span>
          <Input
            className="w-24 h-8 text-sm font-mono"
            type="number"
            value={a}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v) && v > 0) setA(v);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">b:</span>
          <Input
            className="w-24 h-8 text-sm font-mono"
            type="number"
            value={b}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v) && v > 0) setB(v);
            }}
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleRandomize}>
          <Shuffle className="h-3.5 w-3.5 mr-1.5" />
          Randomize
        </Button>
      </div>
      <Player steps={steps}>
        {(currentStep) => <EuclideanGCDCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
