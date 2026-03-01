"use client";

import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { Player } from "@/components/visualization/Player";
import { generateHuffmanSteps, DEFAULT_FREQUENCIES } from "./logic";
import { HuffmanCodingCanvas } from "./Canvas";

function generateRandomFrequencies(): Record<string, number> {
  const chars = "abcdefghijklmnop";
  const numChars = Math.floor(Math.random() * 4) + 4; // 4-7 characters
  const freqs: Record<string, number> = {};

  for (let i = 0; i < numChars; i++) {
    freqs[chars[i]] = Math.floor(Math.random() * 45) + 1;
  }

  return freqs;
}

export default function HuffmanCodingVisualization() {
  const [frequencies, setFrequencies] =
    useState<Record<string, number>>(DEFAULT_FREQUENCIES);

  const steps = useMemo(
    () => generateHuffmanSteps(frequencies),
    [frequencies],
  );

  const handleRandomize = useCallback(() => {
    setFrequencies(generateRandomFrequencies());
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted-foreground font-mono">
          {Object.entries(frequencies)
            .map(([c, f]) => `${c}:${f}`)
            .join(" ")}
        </span>
        <Button variant="outline" size="sm" onClick={handleRandomize}>
          <Shuffle className="h-3.5 w-3.5 mr-1.5" />
          Randomize
        </Button>
      </div>
      <Player steps={steps}>
        {(currentStep) => <HuffmanCodingCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
