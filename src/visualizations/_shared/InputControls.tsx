"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Shuffle } from "lucide-react";

interface InputControlsProps {
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  onRandomize: () => void;
  minSize?: number;
  maxSize?: number;
}

export function InputControls({
  arraySize,
  onArraySizeChange,
  onRandomize,
  minSize = 5,
  maxSize = 30,
}: InputControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-mono">Size:</span>
        <Slider
          className="w-24"
          min={minSize}
          max={maxSize}
          step={1}
          value={[arraySize]}
          onValueChange={([val]) => onArraySizeChange(val)}
        />
        <span className="text-xs text-muted-foreground font-mono w-6">
          {arraySize}
        </span>
      </div>
      <Button variant="outline" size="sm" onClick={onRandomize}>
        <Shuffle className="h-3.5 w-3.5 mr-1.5" />
        Randomize
      </Button>
    </div>
  );
}
