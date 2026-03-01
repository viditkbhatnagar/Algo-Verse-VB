"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, Shuffle } from "lucide-react";

export type MLControl =
  | { type: "slider"; key: string; label: string; value: number; min: number; max: number; step: number }
  | { type: "select"; key: string; label: string; value: string; options: { label: string; value: string }[] };

interface MLInputPanelProps {
  controls: MLControl[];
  onControlChange: (key: string, value: number | string) => void;
  onReset?: () => void;
  onRandomize?: () => void;
}

export function MLInputPanel({
  controls,
  onControlChange,
  onReset,
  onRandomize,
}: MLInputPanelProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {controls.map((ctrl) => {
        if (ctrl.type === "slider") {
          return (
            <div key={ctrl.key} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">{ctrl.label}:</span>
              <Slider
                className="w-20"
                min={ctrl.min}
                max={ctrl.max}
                step={ctrl.step}
                value={[ctrl.value]}
                onValueChange={([val]) => onControlChange(ctrl.key, val)}
              />
              <span className="text-xs text-muted-foreground font-mono w-8">
                {ctrl.step < 0.01 ? ctrl.value.toFixed(3) : ctrl.step < 1 ? ctrl.value.toFixed(2) : ctrl.value}
              </span>
            </div>
          );
        }

        if (ctrl.type === "select") {
          return (
            <div key={ctrl.key} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">{ctrl.label}:</span>
              <select
                className="h-8 px-2 text-xs font-mono bg-surface border border-border rounded"
                value={ctrl.value}
                onChange={(e) => onControlChange(ctrl.key, e.target.value)}
              >
                {ctrl.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          );
        }

        return null;
      })}

      {onRandomize && (
        <Button variant="outline" size="sm" onClick={onRandomize}>
          <Shuffle className="h-3.5 w-3.5 mr-1.5" />
          Randomize
        </Button>
      )}
      {onReset && (
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          Reset
        </Button>
      )}
    </div>
  );
}
