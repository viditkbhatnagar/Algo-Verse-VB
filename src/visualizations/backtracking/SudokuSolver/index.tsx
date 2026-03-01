"use client";

import { useState, useMemo, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { generateSudokuSteps, DEFAULT_PUZZLE } from "./logic";
import { SudokuCanvas } from "./Canvas";

// A second puzzle option
const PUZZLE_2: number[][] = [
  [0, 0, 0, 2, 6, 0, 7, 0, 1],
  [6, 8, 0, 0, 7, 0, 0, 9, 0],
  [1, 9, 0, 0, 0, 4, 5, 0, 0],
  [8, 2, 0, 1, 0, 0, 0, 4, 0],
  [0, 0, 4, 6, 0, 2, 9, 0, 0],
  [0, 5, 0, 0, 0, 3, 0, 2, 8],
  [0, 0, 9, 3, 0, 0, 0, 7, 4],
  [0, 4, 0, 0, 5, 0, 0, 3, 6],
  [7, 0, 3, 0, 1, 8, 0, 0, 0],
];

const PUZZLES = [
  { label: "Classic #1", puzzle: DEFAULT_PUZZLE },
  { label: "Classic #2", puzzle: PUZZLE_2 },
];

export default function SudokuSolverVisualization() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const puzzle = PUZZLES[puzzleIndex].puzzle;

  const steps = useMemo(
    () => generateSudokuSteps(puzzle),
    [puzzle]
  );

  const handleSwitch = useCallback(() => {
    setPuzzleIndex((i) => (i + 1) % PUZZLES.length);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground font-mono">
          Puzzle: {PUZZLES[puzzleIndex].label}
        </span>
        <Button variant="outline" size="sm" onClick={handleSwitch}>
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          Switch Puzzle
        </Button>
      </div>
      <Player steps={steps}>
        {(currentStep) => <SudokuCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
