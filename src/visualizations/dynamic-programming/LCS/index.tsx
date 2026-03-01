"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { generateLCSSteps, DEFAULT_LCS_CONFIG } from "./logic";
import { LCSCanvas } from "./Canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCcw } from "lucide-react";

const PRESETS = [
  { str1: "ABCBDAB", str2: "BDCAB", label: "Classic" },
  { str1: "AGGTAB", str2: "GXTXAYB", label: "Example 2" },
  { str1: "ABCD", str2: "ACDF", label: "Short" },
  { str1: "STONE", str2: "LONGEST", label: "Words" },
];

export default function LCSVisualization() {
  const [str1, setStr1] = useState(DEFAULT_LCS_CONFIG.str1);
  const [str2, setStr2] = useState(DEFAULT_LCS_CONFIG.str2);
  const [inputStr1, setInputStr1] = useState(DEFAULT_LCS_CONFIG.str1);
  const [inputStr2, setInputStr2] = useState(DEFAULT_LCS_CONFIG.str2);

  const steps = useMemo(() => generateLCSSteps(str1, str2), [str1, str2]);

  const handleApply = useCallback(() => {
    const s1 = inputStr1.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 8);
    const s2 = inputStr2.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 8);
    if (s1.length >= 2 && s2.length >= 2) {
      setStr1(s1);
      setStr2(s2);
    }
  }, [inputStr1, inputStr2]);

  const handlePreset = useCallback((preset: typeof PRESETS[number]) => {
    setStr1(preset.str1);
    setStr2(preset.str2);
    setInputStr1(preset.str1);
    setInputStr2(preset.str2);
  }, []);

  const handleReset = useCallback(() => {
    setStr1(DEFAULT_LCS_CONFIG.str1);
    setStr2(DEFAULT_LCS_CONFIG.str2);
    setInputStr1(DEFAULT_LCS_CONFIG.str1);
    setInputStr2(DEFAULT_LCS_CONFIG.str2);
  }, []);

  return (
    <div className="space-y-4">
      {/* Input controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">Str1:</span>
          <Input
            className="w-28 h-8 text-sm font-mono uppercase"
            value={inputStr1}
            onChange={(e) => setInputStr1(e.target.value)}
            maxLength={8}
            placeholder="ABCBDAB"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">Str2:</span>
          <Input
            className="w-28 h-8 text-sm font-mono uppercase"
            value={inputStr2}
            onChange={(e) => setInputStr2(e.target.value)}
            maxLength={8}
            placeholder="BDCAB"
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleApply}>
          Apply
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-3.5 w-3.5 mr-1" />
          Reset
        </Button>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground font-mono">Presets:</span>
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => handlePreset(preset)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <Player steps={steps} defaultSpeed={2}>
        {(currentStep) => (
          <LCSCanvas step={currentStep} str1={str1} str2={str2} />
        )}
      </Player>
    </div>
  );
}
