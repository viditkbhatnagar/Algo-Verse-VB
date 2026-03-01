"use client";

import { useMemo, useState, useCallback } from "react";
import { Player } from "@/components/visualization/Player";
import { GridInputControls } from "@/visualizations/_shared/InputControls";
import { generateAStarSteps, DEFAULT_GRID, DEFAULT_START, DEFAULT_GOAL } from "./logic";
import { AStarCanvas } from "./Canvas";

function generateRandomGrid(size: number): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < size; r++) {
    const row: number[] = [];
    for (let c = 0; c < size; c++) {
      // Keep start and goal clear
      if ((r === 0 && c === 0) || (r === size - 1 && c === size - 1)) {
        row.push(0);
      } else {
        row.push(Math.random() < 0.2 ? 1 : 0);
      }
    }
    grid.push(row);
  }
  return grid;
}

export default function AStarVisualization() {
  const [gridSize, setGridSize] = useState(8);
  const [grid, setGrid] = useState(DEFAULT_GRID);

  const start: [number, number] = [0, 0];
  const goal: [number, number] = [gridSize - 1, gridSize - 1];

  const steps = useMemo(
    () => generateAStarSteps(grid, start, goal),
    [grid, gridSize],
  );

  const handleGridSizeChange = useCallback((size: number) => {
    setGridSize(size);
    setGrid(generateRandomGrid(size));
  }, []);

  return (
    <div className="space-y-4">
      <GridInputControls
        gridSize={gridSize}
        onGridSizeChange={handleGridSizeChange}
        minSize={5}
        maxSize={12}
        label="Grid"
      />
      <Player steps={steps}>
        {(currentStep) => <AStarCanvas step={currentStep} />}
      </Player>
    </div>
  );
}
