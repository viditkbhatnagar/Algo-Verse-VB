"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { generateEditDistanceSteps } from "./logic";
import { EditDistanceCanvas } from "./Canvas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const DEFAULT_WORD1 = "kitten";
const DEFAULT_WORD2 = "sitting";

export default function EditDistanceVisualization() {
  const [word1, setWord1] = useState(DEFAULT_WORD1);
  const [word2, setWord2] = useState(DEFAULT_WORD2);
  const [activeWord1, setActiveWord1] = useState(DEFAULT_WORD1);
  const [activeWord2, setActiveWord2] = useState(DEFAULT_WORD2);

  const steps = useMemo(
    () => generateEditDistanceSteps(activeWord1, activeWord2),
    [activeWord1, activeWord2]
  );

  const handleApply = useCallback(() => {
    const w1 = word1.trim().slice(0, 8) || "abc";
    const w2 = word2.trim().slice(0, 8) || "def";
    setActiveWord1(w1);
    setActiveWord2(w2);
  }, [word1, word2]);

  const handleReset = useCallback(() => {
    setWord1(DEFAULT_WORD1);
    setWord2(DEFAULT_WORD2);
    setActiveWord1(DEFAULT_WORD1);
    setActiveWord2(DEFAULT_WORD2);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">Word 1:</span>
          <Input
            className="w-28 h-8 text-sm font-mono"
            value={word1}
            onChange={(e) => setWord1(e.target.value)}
            maxLength={8}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApply();
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">Word 2:</span>
          <Input
            className="w-28 h-8 text-sm font-mono"
            value={word2}
            onChange={(e) => setWord2(e.target.value)}
            maxLength={8}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApply();
            }}
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleApply}>
          Apply
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          Reset
        </Button>
      </div>
      <Player steps={steps}>
        {(currentStep) => <EditDistanceCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
