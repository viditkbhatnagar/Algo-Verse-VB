"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Shuffle, Plus, Minus, Search, RotateCcw } from "lucide-react";

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

// --- Tree input controls ---

interface TreeInputControlsProps {
  onInsert: (value: number) => void;
  onDelete: (value: number) => void;
  onSearch: (value: number) => void;
  onReset: () => void;
}

export function TreeInputControls({
  onInsert,
  onDelete,
  onSearch,
  onReset,
}: TreeInputControlsProps) {
  const [value, setValue] = useState("");

  const numValue = parseInt(value, 10);
  const isValid = value !== "" && !isNaN(numValue);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        className="w-20 h-8 text-sm font-mono"
        placeholder="Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && isValid) {
            onInsert(numValue);
            setValue("");
          }
        }}
      />
      <Button variant="outline" size="sm" onClick={() => { if (isValid) { onInsert(numValue); setValue(""); } }} disabled={!isValid}>
        <Plus className="h-3.5 w-3.5 mr-1" />Insert
      </Button>
      <Button variant="outline" size="sm" onClick={() => { if (isValid) { onDelete(numValue); setValue(""); } }} disabled={!isValid}>
        <Minus className="h-3.5 w-3.5 mr-1" />Delete
      </Button>
      <Button variant="outline" size="sm" onClick={() => { if (isValid) { onSearch(numValue); setValue(""); } }} disabled={!isValid}>
        <Search className="h-3.5 w-3.5 mr-1" />Search
      </Button>
      <Button variant="outline" size="sm" onClick={onReset}>
        <RotateCcw className="h-3.5 w-3.5 mr-1" />Reset
      </Button>
    </div>
  );
}

// --- Graph input controls ---

interface GraphInputControlsProps {
  presets: { label: string; value: string }[];
  selectedPreset: string;
  onPresetChange: (preset: string) => void;
  startNode?: string;
  onStartNodeChange?: (node: string) => void;
  nodeOptions?: string[];
}

export function GraphInputControls({
  presets,
  selectedPreset,
  onPresetChange,
  startNode,
  onStartNodeChange,
  nodeOptions,
}: GraphInputControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-mono">Graph:</span>
        <select
          className="h-8 px-2 text-xs font-mono bg-surface border border-border rounded"
          value={selectedPreset}
          onChange={(e) => onPresetChange(e.target.value)}
        >
          {presets.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
      {onStartNodeChange && nodeOptions && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">Start:</span>
          <select
            className="h-8 px-2 text-xs font-mono bg-surface border border-border rounded"
            value={startNode}
            onChange={(e) => onStartNodeChange(e.target.value)}
          >
            {nodeOptions.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

// --- DP input controls ---

interface DPInputControlsProps {
  problemSize: number;
  onProblemSizeChange: (size: number) => void;
  onRandomize: () => void;
  label?: string;
  minSize?: number;
  maxSize?: number;
}

export function DPInputControls({
  problemSize,
  onProblemSizeChange,
  onRandomize,
  label = "N",
  minSize = 3,
  maxSize = 15,
}: DPInputControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-mono">{label}:</span>
        <Slider
          className="w-24"
          min={minSize}
          max={maxSize}
          step={1}
          value={[problemSize]}
          onValueChange={([val]) => onProblemSizeChange(val)}
        />
        <span className="text-xs text-muted-foreground font-mono w-6">
          {problemSize}
        </span>
      </div>
      <Button variant="outline" size="sm" onClick={onRandomize}>
        <Shuffle className="h-3.5 w-3.5 mr-1.5" />
        Randomize
      </Button>
    </div>
  );
}

// --- Grid input controls ---

interface GridInputControlsProps {
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  minSize?: number;
  maxSize?: number;
  label?: string;
}

export function GridInputControls({
  gridSize,
  onGridSizeChange,
  minSize = 4,
  maxSize = 12,
  label = "Size",
}: GridInputControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground font-mono">{label}:</span>
      <Slider
        className="w-24"
        min={minSize}
        max={maxSize}
        step={1}
        value={[gridSize]}
        onValueChange={([val]) => onGridSizeChange(val)}
      />
      <span className="text-xs text-muted-foreground font-mono w-6">
        {gridSize}
      </span>
    </div>
  );
}

// --- String input controls ---

interface StringInputControlsProps {
  text: string;
  pattern: string;
  onTextChange: (text: string) => void;
  onPatternChange: (pattern: string) => void;
}

export function StringInputControls({
  text,
  pattern,
  onTextChange,
  onPatternChange,
}: StringInputControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-mono">Text:</span>
        <Input
          className="w-40 h-8 text-sm font-mono"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-mono">Pattern:</span>
        <Input
          className="w-24 h-8 text-sm font-mono"
          value={pattern}
          onChange={(e) => onPatternChange(e.target.value)}
        />
      </div>
    </div>
  );
}
