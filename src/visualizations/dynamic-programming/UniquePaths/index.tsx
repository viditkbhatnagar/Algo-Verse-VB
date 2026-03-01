"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { generateUniquePathsSteps } from "./logic";
import { UniquePathsCanvas } from "./Canvas";
import { Slider } from "@/components/ui/slider";

const DEFAULT_ROWS = 4;
const DEFAULT_COLS = 5;

export default function UniquePathsVisualization() {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);

  const steps = useMemo(
    () => generateUniquePathsSteps(rows, cols),
    [rows, cols]
  );

  const handleRowsChange = useCallback((val: number) => {
    setRows(val);
  }, []);

  const handleColsChange = useCallback((val: number) => {
    setCols(val);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">Rows:</span>
          <Slider
            className="w-24"
            min={2}
            max={8}
            step={1}
            value={[rows]}
            onValueChange={([val]) => handleRowsChange(val)}
          />
          <span className="text-xs text-muted-foreground font-mono w-6">
            {rows}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">Cols:</span>
          <Slider
            className="w-24"
            min={2}
            max={8}
            step={1}
            value={[cols]}
            onValueChange={([val]) => handleColsChange(val)}
          />
          <span className="text-xs text-muted-foreground font-mono w-6">
            {cols}
          </span>
        </div>
      </div>
      <Player steps={steps}>
        {(currentStep) => <UniquePathsCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
