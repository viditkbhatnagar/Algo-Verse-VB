import type { VisualizationStep } from "@/lib/visualization/types";

export interface QLearningCell {
  row: number;
  col: number;
  type: "empty" | "agent" | "goal" | "obstacle" | "pit";
  qValues: { up: number; down: number; left: number; right: number };
  highlight?: "active" | "comparing" | "completed" | "selected" | "path";
}

export interface QLearningStepData {
  grid: QLearningCell[][];
  gridSize: number;
  agentRow: number;
  agentCol: number;
  goalRow: number;
  goalCol: number;
  episode: number;
  stepInEpisode: number;
  totalReward: number;
  alpha: number;
  gamma: number;
  epsilon: number;
  lastAction?: string;
  lastReward?: number;
  optimalPath?: { row: number; col: number }[];
  converged: boolean;
}

interface QLearningParams {
  learningRate?: number;
  discountFactor?: number;
  epsilon?: number;
  seed?: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

type Action = "up" | "down" | "left" | "right";
const ACTIONS: Action[] = ["up", "down", "left", "right"];

const GRID_SIZE = 4;

// Grid layout:
// [S][ ][ ][ ]
// [ ][X][ ][ ]
// [ ][ ][X][ ]
// [ ][ ][ ][G]
// S=start(0,0), G=goal(3,3), X=obstacles
const OBSTACLES = [
  { row: 1, col: 1 },
  { row: 2, col: 2 },
];

const GOAL = { row: 3, col: 3 };

function isObstacle(r: number, c: number): boolean {
  return OBSTACLES.some((o) => o.row === r && o.col === c);
}

function isGoal(r: number, c: number): boolean {
  return r === GOAL.row && c === GOAL.col;
}

function isValid(r: number, c: number): boolean {
  return r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && !isObstacle(r, c);
}

function move(r: number, c: number, action: Action): { row: number; col: number } {
  let nr = r,
    nc = c;
  if (action === "up") nr = r - 1;
  else if (action === "down") nr = r + 1;
  else if (action === "left") nc = c - 1;
  else if (action === "right") nc = c + 1;

  if (!isValid(nr, nc)) return { row: r, col: c }; // stay in place
  return { row: nr, col: nc };
}

function getReward(r: number, c: number): number {
  if (isGoal(r, c)) return 10;
  return -0.1; // small penalty for each step
}

function makeGrid(
  qTable: Record<string, Record<Action, number>>,
  agentR: number,
  agentC: number,
  highlights?: Record<string, "active" | "comparing" | "completed" | "selected" | "path">
): QLearningCell[][] {
  const grid: QLearningCell[][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const row: QLearningCell[] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      const key = `${r},${c}`;
      const q = qTable[key] || { up: 0, down: 0, left: 0, right: 0 };
      let type: QLearningCell["type"] = "empty";
      if (isObstacle(r, c)) type = "obstacle";
      else if (isGoal(r, c)) type = "goal";
      else if (r === agentR && c === agentC) type = "agent";

      row.push({
        row: r,
        col: c,
        type,
        qValues: { ...q },
        highlight: highlights?.[key],
      });
    }
    grid.push(row);
  }
  return grid;
}

export function generateQLearningSteps(params: QLearningParams = {}): VisualizationStep[] {
  const {
    learningRate = 0.5,
    discountFactor = 0.9,
    epsilon = 0.3,
    seed = 42,
  } = params;
  const rand = seededRandom(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Initialize Q-table
  const qTable: Record<string, Record<Action, number>> = {};
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      qTable[`${r},${c}`] = { up: 0, down: 0, left: 0, right: 0 };
    }
  }

  // Step 1: Introduce the grid
  steps.push({
    id: stepId++,
    description: `A ${GRID_SIZE}x${GRID_SIZE} grid world. Agent starts at top-left, goal (G) at bottom-right. Dark cells are obstacles. The agent learns Q-values for each state-action pair.`,
    action: "explore-state",
    highlights: [],
    data: {
      grid: makeGrid(qTable, 0, 0),
      gridSize: GRID_SIZE,
      agentRow: 0,
      agentCol: 0,
      goalRow: GOAL.row,
      goalCol: GOAL.col,
      episode: 0,
      stepInEpisode: 0,
      totalReward: 0,
      alpha: learningRate,
      gamma: discountFactor,
      epsilon,
      converged: false,
    } as QLearningStepData,
  });

  // Step 2: Explain Q-learning
  steps.push({
    id: stepId++,
    description: `Q-Learning uses the Bellman equation: Q(s,a) = Q(s,a) + alpha * [r + gamma * max_a' Q(s',a') - Q(s,a)]. alpha=${learningRate}, gamma=${discountFactor}, epsilon=${epsilon}.`,
    action: "explore-state",
    highlights: [],
    data: {
      grid: makeGrid(qTable, 0, 0),
      gridSize: GRID_SIZE,
      agentRow: 0,
      agentCol: 0,
      goalRow: GOAL.row,
      goalCol: GOAL.col,
      episode: 0,
      stepInEpisode: 0,
      totalReward: 0,
      alpha: learningRate,
      gamma: discountFactor,
      epsilon,
      converged: false,
    } as QLearningStepData,
  });

  // Run episodes
  const numEpisodes = 5;
  const maxStepsPerEpisode = 10;

  for (let ep = 1; ep <= numEpisodes; ep++) {
    let agentR = 0;
    let agentC = 0;
    let totalReward = 0;

    for (let s = 0; s < maxStepsPerEpisode; s++) {
      if (isGoal(agentR, agentC)) break;

      // Epsilon-greedy action selection
      let action: Action;
      const isExploring = rand() < epsilon;
      if (isExploring) {
        action = ACTIONS[Math.floor(rand() * ACTIONS.length)];
      } else {
        const q = qTable[`${agentR},${agentC}`];
        const bestVal = Math.max(q.up, q.down, q.left, q.right);
        const bestActions = ACTIONS.filter((a) => Math.abs(q[a] - bestVal) < 0.001);
        action = bestActions[Math.floor(rand() * bestActions.length)];
      }

      // Take action
      const next = move(agentR, agentC, action);
      const reward = getReward(next.row, next.col);
      totalReward += reward;

      // Q-Learning update
      const currentQ = qTable[`${agentR},${agentC}`][action];
      const nextQ = qTable[`${next.row},${next.col}`];
      const maxNextQ = Math.max(nextQ.up, nextQ.down, nextQ.left, nextQ.right);
      const newQ = currentQ + learningRate * (reward + discountFactor * maxNextQ - currentQ);
      qTable[`${agentR},${agentC}`][action] = Math.round(newQ * 100) / 100;

      const highlights: Record<string, "active" | "comparing" | "completed" | "selected" | "path"> = {};
      highlights[`${agentR},${agentC}`] = "comparing";
      highlights[`${next.row},${next.col}`] = "active";

      steps.push({
        id: stepId++,
        description: `Ep ${ep}, Step ${s + 1}: From (${agentR},${agentC}), ${isExploring ? "explore" : "exploit"} -> ${action}. Move to (${next.row},${next.col}), reward=${reward.toFixed(1)}. Q(${agentR},${agentC},${action}) updated: ${currentQ.toFixed(2)} -> ${newQ.toFixed(2)}.`,
        action: "update-q",
        highlights: [],
        data: {
          grid: makeGrid(qTable, next.row, next.col, highlights),
          gridSize: GRID_SIZE,
          agentRow: next.row,
          agentCol: next.col,
          goalRow: GOAL.row,
          goalCol: GOAL.col,
          episode: ep,
          stepInEpisode: s + 1,
          totalReward: Math.round(totalReward * 100) / 100,
          alpha: learningRate,
          gamma: discountFactor,
          epsilon,
          lastAction: action,
          lastReward: reward,
          converged: false,
        } as QLearningStepData,
      });

      agentR = next.row;
      agentC = next.col;
    }

    // Episode summary
    const reachedGoal = isGoal(agentR, agentC);
    steps.push({
      id: stepId++,
      description: `Episode ${ep} finished. ${reachedGoal ? "Goal reached!" : "Max steps hit."} Total reward: ${totalReward.toFixed(2)}. Q-values are being refined.`,
      action: reachedGoal ? "exploit" : "explore-state",
      highlights: [],
      data: {
        grid: makeGrid(qTable, reachedGoal ? GOAL.row : agentR, reachedGoal ? GOAL.col : agentC),
        gridSize: GRID_SIZE,
        agentRow: reachedGoal ? GOAL.row : agentR,
        agentCol: reachedGoal ? GOAL.col : agentC,
        goalRow: GOAL.row,
        goalCol: GOAL.col,
        episode: ep,
        stepInEpisode: -1,
        totalReward: Math.round(totalReward * 100) / 100,
        alpha: learningRate,
        gamma: discountFactor,
        epsilon,
        converged: false,
      } as QLearningStepData,
    });
  }

  // Extract optimal path
  const optimalPath: { row: number; col: number }[] = [{ row: 0, col: 0 }];
  let r = 0,
    c = 0;
  const visited = new Set<string>();
  visited.add(`${r},${c}`);

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    if (isGoal(r, c)) break;
    const q = qTable[`${r},${c}`];
    const bestVal = Math.max(q.up, q.down, q.left, q.right);
    const bestActions = ACTIONS.filter((a) => Math.abs(q[a] - bestVal) < 0.001);
    let moved = false;
    for (const action of bestActions) {
      const next = move(r, c, action);
      if (!visited.has(`${next.row},${next.col}`)) {
        r = next.row;
        c = next.col;
        optimalPath.push({ row: r, col: c });
        visited.add(`${r},${c}`);
        moved = true;
        break;
      }
    }
    if (!moved) break;
  }

  // Highlight optimal path
  const pathHighlights: Record<string, "active" | "comparing" | "completed" | "selected" | "path"> = {};
  for (const p of optimalPath) {
    pathHighlights[`${p.row},${p.col}`] = "path";
  }

  steps.push({
    id: stepId++,
    description: `Training complete! The learned optimal path is highlighted. Q-values encode the expected future reward for each state-action pair.`,
    action: "complete",
    highlights: [],
    data: {
      grid: makeGrid(qTable, 0, 0, pathHighlights),
      gridSize: GRID_SIZE,
      agentRow: 0,
      agentCol: 0,
      goalRow: GOAL.row,
      goalCol: GOAL.col,
      episode: numEpisodes,
      stepInEpisode: -1,
      totalReward: 0,
      alpha: learningRate,
      gamma: discountFactor,
      epsilon,
      optimalPath,
      converged: true,
    } as QLearningStepData,
  });

  // Summary
  steps.push({
    id: stepId++,
    description: `Q-Learning is model-free: it learns the optimal policy without knowing transition probabilities. It uses temporal difference updates to propagate reward information backward through the state space.`,
    action: "complete",
    highlights: [],
    data: {
      grid: makeGrid(qTable, 0, 0, pathHighlights),
      gridSize: GRID_SIZE,
      agentRow: 0,
      agentCol: 0,
      goalRow: GOAL.row,
      goalCol: GOAL.col,
      episode: numEpisodes,
      stepInEpisode: -1,
      totalReward: 0,
      alpha: learningRate,
      gamma: discountFactor,
      epsilon,
      optimalPath,
      converged: true,
    } as QLearningStepData,
  });

  return steps;
}
