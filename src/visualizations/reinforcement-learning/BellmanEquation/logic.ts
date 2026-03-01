import type { VisualizationStep } from "@/lib/visualization/types";

export interface BellmanCell {
  row: number;
  col: number;
  value: number;
  reward: number;
  type: "empty" | "goal" | "wall";
  highlight?: "active" | "comparing" | "completed" | "selected";
  isUpdating?: boolean;
}

export interface BellmanStepData {
  grid: BellmanCell[][];
  gridSize: number;
  gamma: number;
  iteration: number;
  maxDelta: number;
  converged: boolean;
  sweepCell?: { row: number; col: number };
  policyArrows?: { row: number; col: number; direction: string }[];
}

interface BellmanParams {
  discountFactor?: number;
}

const GRID_SIZE = 3;

// Grid layout:
// [ ][ ][ ]
// [ ][W][ ]
// [ ][ ][G]
// G = goal (reward=+10), W = wall, all others = step penalty -0.04
const WALL = { row: 1, col: 1 };
const GOAL = { row: 2, col: 2 };
const GOAL_REWARD = 10;
const STEP_PENALTY = -0.04;

function isWall(r: number, c: number): boolean {
  return r === WALL.row && c === WALL.col;
}

function isGoal(r: number, c: number): boolean {
  return r === GOAL.row && c === GOAL.col;
}

function isValid(r: number, c: number): boolean {
  return r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && !isWall(r, c);
}

type Direction = "up" | "down" | "left" | "right";
const DIRECTIONS: Direction[] = ["up", "down", "left", "right"];

function neighbor(r: number, c: number, dir: Direction): { row: number; col: number } {
  let nr = r,
    nc = c;
  if (dir === "up") nr--;
  else if (dir === "down") nr++;
  else if (dir === "left") nc--;
  else if (dir === "right") nc++;

  if (!isValid(nr, nc)) return { row: r, col: c }; // bounce back
  return { row: nr, col: nc };
}

function makeGrid(
  values: number[][],
  highlights?: Record<string, "active" | "comparing" | "completed" | "selected">,
  updatingCell?: { row: number; col: number }
): BellmanCell[][] {
  const grid: BellmanCell[][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const row: BellmanCell[] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      const key = `${r},${c}`;
      let type: BellmanCell["type"] = "empty";
      if (isWall(r, c)) type = "wall";
      else if (isGoal(r, c)) type = "goal";

      row.push({
        row: r,
        col: c,
        value: values[r][c],
        reward: isGoal(r, c) ? GOAL_REWARD : isWall(r, c) ? 0 : STEP_PENALTY,
        type,
        highlight: highlights?.[key],
        isUpdating: updatingCell?.row === r && updatingCell?.col === c,
      });
    }
    grid.push(row);
  }
  return grid;
}

function computePolicy(values: number[][]): { row: number; col: number; direction: string }[] {
  const arrows: { row: number; col: number; direction: string }[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (isWall(r, c) || isGoal(r, c)) continue;
      let bestDir: Direction = "up";
      let bestVal = -Infinity;
      for (const dir of DIRECTIONS) {
        const n = neighbor(r, c, dir);
        if (values[n.row][n.col] > bestVal) {
          bestVal = values[n.row][n.col];
          bestDir = dir;
        }
      }
      arrows.push({ row: r, col: c, direction: bestDir });
    }
  }
  return arrows;
}

export function generateBellmanSteps(params: BellmanParams = {}): VisualizationStep[] {
  const { discountFactor = 0.9 } = params;
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Initialize values
  const values: number[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(0)
  );
  values[GOAL.row][GOAL.col] = GOAL_REWARD;

  // Step 1: Introduce the grid
  steps.push({
    id: stepId++,
    description: `Bellman Equation for a ${GRID_SIZE}x${GRID_SIZE} grid. Goal at bottom-right (R=+10), wall in center. Step penalty: ${STEP_PENALTY}. All V(s) initialized to 0 except goal.`,
    action: "explore-state",
    highlights: [],
    data: {
      grid: makeGrid(values, { "2,2": "completed", "1,1": "selected" }),
      gridSize: GRID_SIZE,
      gamma: discountFactor,
      iteration: 0,
      maxDelta: 0,
      converged: false,
    } as BellmanStepData,
  });

  // Step 2: Explain the equation
  steps.push({
    id: stepId++,
    description: `The Bellman equation: V(s) = max_a [R(s,a) + gamma * V(s')]. For each cell, compute the value of each action (up/down/left/right) and take the max. gamma=${discountFactor}.`,
    action: "explore-state",
    highlights: [],
    data: {
      grid: makeGrid(values),
      gridSize: GRID_SIZE,
      gamma: discountFactor,
      iteration: 0,
      maxDelta: 0,
      converged: false,
    } as BellmanStepData,
  });

  // Value iteration sweeps
  const maxIterations = 8;
  let converged = false;

  for (let iter = 1; iter <= maxIterations && !converged; iter++) {
    let maxDelta = 0;

    // Show the start of each sweep
    const iterHighlights: Record<string, "active" | "comparing" | "completed" | "selected"> = {};

    // Sweep through all cells
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (isWall(r, c) || isGoal(r, c)) continue;

        const oldVal = values[r][c];

        // Compute best action value
        let bestVal = -Infinity;
        for (const dir of DIRECTIONS) {
          const n = neighbor(r, c, dir);
          const actionVal = STEP_PENALTY + discountFactor * values[n.row][n.col];
          bestVal = Math.max(bestVal, actionVal);
        }
        values[r][c] = Math.round(bestVal * 1000) / 1000;
        maxDelta = Math.max(maxDelta, Math.abs(values[r][c] - oldVal));

        iterHighlights[`${r},${c}`] = "comparing";
      }
    }

    converged = maxDelta < 0.001;

    // Create step for this iteration
    if (converged) {
      // Mark all as completed
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (!isWall(r, c)) {
            iterHighlights[`${r},${c}`] = "completed";
          }
        }
      }
    }

    steps.push({
      id: stepId++,
      description: `Sweep ${iter}: Updated all non-terminal values using Bellman equation. Max change: ${maxDelta.toFixed(4)}.${converged ? " Values have converged!" : ""}`,
      action: "update-q",
      highlights: [],
      data: {
        grid: makeGrid(values, iterHighlights),
        gridSize: GRID_SIZE,
        gamma: discountFactor,
        iteration: iter,
        maxDelta: Math.round(maxDelta * 10000) / 10000,
        converged,
      } as BellmanStepData,
    });
  }

  // Show individual cell updates for the last sweep for illustration
  // Re-run one more sweep with per-cell steps
  {
    let maxDelta = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (isWall(r, c) || isGoal(r, c)) continue;

        const cellHighlights: Record<string, "active" | "comparing" | "completed" | "selected"> = {};
        cellHighlights[`${r},${c}`] = "active";

        // Show neighbors being considered
        for (const dir of DIRECTIONS) {
          const n = neighbor(r, c, dir);
          if (n.row !== r || n.col !== c) {
            cellHighlights[`${n.row},${n.col}`] = "comparing";
          }
        }

        let bestVal = -Infinity;
        let bestDir: Direction = "up";
        for (const dir of DIRECTIONS) {
          const n = neighbor(r, c, dir);
          const actionVal = STEP_PENALTY + discountFactor * values[n.row][n.col];
          if (actionVal > bestVal) {
            bestVal = actionVal;
            bestDir = dir;
          }
        }

        const oldVal = values[r][c];
        values[r][c] = Math.round(bestVal * 1000) / 1000;
        maxDelta = Math.max(maxDelta, Math.abs(values[r][c] - oldVal));

        steps.push({
          id: stepId++,
          description: `Cell (${r},${c}): Best action = ${bestDir}. V = max(${STEP_PENALTY} + ${discountFactor} * V(neighbor)) = ${values[r][c].toFixed(3)}. Looking at neighbors (yellow).`,
          action: "update-q",
          highlights: [],
          data: {
            grid: makeGrid(values, cellHighlights, { row: r, col: c }),
            gridSize: GRID_SIZE,
            gamma: discountFactor,
            iteration: -1,
            maxDelta: Math.round(maxDelta * 10000) / 10000,
            converged: false,
            sweepCell: { row: r, col: c },
          } as BellmanStepData,
        });
      }
    }
  }

  // Final: Show optimal policy with arrows
  const policy = computePolicy(values);
  const finalHighlights: Record<string, "active" | "comparing" | "completed" | "selected"> = {};
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!isWall(r, c)) {
        finalHighlights[`${r},${c}`] = "completed";
      }
    }
  }

  steps.push({
    id: stepId++,
    description: `Converged! Optimal policy arrows show the best action from each cell. All values satisfy the Bellman optimality equation. The agent follows arrows to reach the goal with maximum expected reward.`,
    action: "complete",
    highlights: [],
    data: {
      grid: makeGrid(values, finalHighlights),
      gridSize: GRID_SIZE,
      gamma: discountFactor,
      iteration: -1,
      maxDelta: 0,
      converged: true,
      policyArrows: policy,
    } as BellmanStepData,
  });

  // Summary
  steps.push({
    id: stepId++,
    description: `The Bellman equation is the foundation of dynamic programming in RL. Value Iteration repeatedly applies V(s) = max_a [R + gamma * V(s')] until convergence. The optimal policy is then extracted greedily from the converged values.`,
    action: "complete",
    highlights: [],
    data: {
      grid: makeGrid(values, finalHighlights),
      gridSize: GRID_SIZE,
      gamma: discountFactor,
      iteration: -1,
      maxDelta: 0,
      converged: true,
      policyArrows: policy,
    } as BellmanStepData,
  });

  return steps;
}
