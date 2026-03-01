import type { VisualizationStep } from "@/lib/visualization/types";

// MDP-specific step data
export interface MDPStepData {
  states: {
    id: string;
    x: number;
    y: number;
    label: string;
    value: number;
    reward: number;
    isTerminal: boolean;
    highlight?: "active" | "comparing" | "completed" | "selected";
  }[];
  transitions: {
    from: string;
    to: string;
    action: string;
    probability: number;
    reward: number;
    highlight?: "active" | "comparing" | "completed";
  }[];
  currentState?: string;
  gamma: number;
  iteration: number;
  converged: boolean;
}

interface MDPParams {
  gamma?: number;
}

export function generateMDPSteps(params: MDPParams = {}): VisualizationStep[] {
  const { gamma = 0.9 } = params;
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Define a simple MDP: 5 states in a graph structure
  // S0 -> S1 (r=0), S0 -> S2 (r=0)
  // S1 -> S3 (r=+5), S1 -> S0 (r=-1)
  // S2 -> S3 (r=+5), S2 -> S4 (r=+10)
  // S3 = terminal (+5 reward)
  // S4 = terminal (+10 reward)
  const baseStates = [
    { id: "S0", x: 0.15, y: 0.5, label: "S0 (Start)", reward: 0, isTerminal: false },
    { id: "S1", x: 0.4, y: 0.2, label: "S1", reward: 0, isTerminal: false },
    { id: "S2", x: 0.4, y: 0.8, label: "S2", reward: 0, isTerminal: false },
    { id: "S3", x: 0.75, y: 0.2, label: "S3 (+5)", reward: 5, isTerminal: true },
    { id: "S4", x: 0.75, y: 0.8, label: "S4 (+10)", reward: 10, isTerminal: true },
  ];

  const transitions = [
    { from: "S0", to: "S1", action: "a1", probability: 0.7, reward: 0 },
    { from: "S0", to: "S2", action: "a1", probability: 0.3, reward: 0 },
    { from: "S0", to: "S2", action: "a2", probability: 0.8, reward: 0 },
    { from: "S0", to: "S1", action: "a2", probability: 0.2, reward: 0 },
    { from: "S1", to: "S3", action: "a1", probability: 0.9, reward: 5 },
    { from: "S1", to: "S0", action: "a1", probability: 0.1, reward: -1 },
    { from: "S1", to: "S0", action: "a2", probability: 1.0, reward: -1 },
    { from: "S2", to: "S3", action: "a1", probability: 0.6, reward: 5 },
    { from: "S2", to: "S4", action: "a1", probability: 0.4, reward: 10 },
    { from: "S2", to: "S4", action: "a2", probability: 0.9, reward: 10 },
    { from: "S2", to: "S0", action: "a2", probability: 0.1, reward: 0 },
  ];

  // Helper to create state data with values
  const makeStates = (
    values: Record<string, number>,
    highlights?: Record<string, "active" | "comparing" | "completed" | "selected">
  ) =>
    baseStates.map((s) => ({
      ...s,
      value: values[s.id] ?? 0,
      highlight: highlights?.[s.id],
    }));

  // Step 1: Introduce the MDP
  steps.push({
    id: stepId++,
    description: "A Markov Decision Process (MDP) consists of states, actions, transition probabilities, and rewards. Here is a 5-state MDP.",
    action: "explore-state",
    highlights: [],
    data: {
      states: makeStates({ S0: 0, S1: 0, S2: 0, S3: 5, S4: 10 }),
      transitions: [],
      gamma,
      iteration: 0,
      converged: false,
    } as MDPStepData,
  });

  // Step 2: Show states with rewards
  steps.push({
    id: stepId++,
    description: "States S3 and S4 are terminal states with rewards +5 and +10 respectively. Non-terminal states start with value 0.",
    action: "explore-state",
    highlights: [],
    data: {
      states: makeStates(
        { S0: 0, S1: 0, S2: 0, S3: 5, S4: 10 },
        { S3: "completed", S4: "completed" }
      ),
      transitions: [],
      gamma,
      iteration: 0,
      converged: false,
    } as MDPStepData,
  });

  // Step 3: Show transitions from S0
  steps.push({
    id: stepId++,
    description: "From S0, action a1 goes to S1 (p=0.7) or S2 (p=0.3). Action a2 goes to S2 (p=0.8) or S1 (p=0.2). Transitions are stochastic.",
    action: "explore-state",
    highlights: [],
    data: {
      states: makeStates({ S0: 0, S1: 0, S2: 0, S3: 5, S4: 10 }, { S0: "active" }),
      transitions: transitions.filter((t) => t.from === "S0").map((t) => ({ ...t, highlight: "active" as const })),
      currentState: "S0",
      gamma,
      iteration: 0,
      converged: false,
    } as MDPStepData,
  });

  // Step 4: Show transitions from S1
  steps.push({
    id: stepId++,
    description: "From S1, action a1 goes to S3 (p=0.9, r=+5) or S0 (p=0.1, r=-1). Action a2 always returns to S0 (r=-1).",
    action: "explore-state",
    highlights: [],
    data: {
      states: makeStates({ S0: 0, S1: 0, S2: 0, S3: 5, S4: 10 }, { S1: "active" }),
      transitions: transitions.filter((t) => t.from === "S1").map((t) => ({ ...t, highlight: "active" as const })),
      currentState: "S1",
      gamma,
      iteration: 0,
      converged: false,
    } as MDPStepData,
  });

  // Step 5: Show transitions from S2
  steps.push({
    id: stepId++,
    description: "From S2, action a1 goes to S3 (p=0.6, r=+5) or S4 (p=0.4, r=+10). Action a2 goes to S4 (p=0.9, r=+10) or S0 (p=0.1).",
    action: "explore-state",
    highlights: [],
    data: {
      states: makeStates({ S0: 0, S1: 0, S2: 0, S3: 5, S4: 10 }, { S2: "active" }),
      transitions: transitions.filter((t) => t.from === "S2").map((t) => ({ ...t, highlight: "active" as const })),
      currentState: "S2",
      gamma,
      iteration: 0,
      converged: false,
    } as MDPStepData,
  });

  // Step 6: Show all transitions
  steps.push({
    id: stepId++,
    description: `Full MDP structure with all transitions. Discount factor gamma = ${gamma}. Now computing the optimal value function using value iteration.`,
    action: "explore-state",
    highlights: [],
    data: {
      states: makeStates({ S0: 0, S1: 0, S2: 0, S3: 5, S4: 10 }),
      transitions: transitions.map((t) => ({ ...t })),
      gamma,
      iteration: 0,
      converged: false,
    } as MDPStepData,
  });

  // Value iteration
  const values: Record<string, number> = { S0: 0, S1: 0, S2: 0, S3: 5, S4: 10 };

  // Group transitions by (from, action)
  const actionMap: Record<string, Record<string, { to: string; prob: number; reward: number }[]>> = {};
  for (const t of transitions) {
    if (!actionMap[t.from]) actionMap[t.from] = {};
    if (!actionMap[t.from][t.action]) actionMap[t.from][t.action] = [];
    actionMap[t.from][t.action].push({ to: t.to, prob: t.probability, reward: t.reward });
  }

  for (let iter = 1; iter <= 5; iter++) {
    const oldValues = { ...values };
    const stateHighlights: Record<string, "active" | "comparing" | "completed" | "selected"> = {};

    for (const state of ["S0", "S1", "S2"]) {
      const actions = actionMap[state] || {};
      let bestValue = -Infinity;
      for (const [, outcomes] of Object.entries(actions)) {
        let actionValue = 0;
        for (const outcome of outcomes) {
          actionValue += outcome.prob * (outcome.reward + gamma * oldValues[outcome.to]);
        }
        bestValue = Math.max(bestValue, actionValue);
      }
      values[state] = Math.round(bestValue * 100) / 100;
      stateHighlights[state] = "comparing";
    }

    const maxDelta = Math.max(
      ...["S0", "S1", "S2"].map((s) => Math.abs(values[s] - oldValues[s]))
    );
    const isConverged = maxDelta < 0.01;

    if (isConverged && iter > 2) {
      stateHighlights.S0 = "completed";
      stateHighlights.S1 = "completed";
      stateHighlights.S2 = "completed";
    }

    steps.push({
      id: stepId++,
      description: `Value Iteration ${iter}: V(S0)=${values.S0.toFixed(2)}, V(S1)=${values.S1.toFixed(2)}, V(S2)=${values.S2.toFixed(2)}. Max change = ${maxDelta.toFixed(3)}.`,
      action: "update-q",
      highlights: [],
      data: {
        states: makeStates(values, stateHighlights),
        transitions: transitions.map((t) => ({ ...t })),
        gamma,
        iteration: iter,
        converged: isConverged,
      } as MDPStepData,
    });

    if (isConverged) break;
  }

  // Final step: show optimal policy
  const optimalPolicy: Record<string, string> = {};
  for (const state of ["S0", "S1", "S2"]) {
    const actions = actionMap[state] || {};
    let bestAction = "";
    let bestValue = -Infinity;
    for (const [action, outcomes] of Object.entries(actions)) {
      let actionValue = 0;
      for (const outcome of outcomes) {
        actionValue += outcome.prob * (outcome.reward + gamma * values[outcome.to]);
      }
      if (actionValue > bestValue) {
        bestValue = actionValue;
        bestAction = action;
      }
    }
    optimalPolicy[state] = bestAction;
  }

  // Show optimal policy with highlighted best transitions
  const policyTransitions = transitions.map((t) => ({
    ...t,
    highlight: optimalPolicy[t.from] === t.action ? ("completed" as const) : undefined,
  }));

  steps.push({
    id: stepId++,
    description: `Optimal policy found! S0 -> ${optimalPolicy.S0}, S1 -> ${optimalPolicy.S1}, S2 -> ${optimalPolicy.S2}. Green arrows show the optimal actions.`,
    action: "complete",
    highlights: [],
    data: {
      states: makeStates(values, { S0: "completed", S1: "completed", S2: "completed", S3: "completed", S4: "completed" }),
      transitions: policyTransitions,
      gamma,
      iteration: -1,
      converged: true,
    } as MDPStepData,
  });

  // Summary step
  steps.push({
    id: stepId++,
    description: `MDP solved! The Bellman optimality equation was used to compute optimal state values. The optimal policy maximizes expected cumulative discounted reward (gamma=${gamma}).`,
    action: "complete",
    highlights: [],
    data: {
      states: makeStates(values, { S0: "completed", S1: "completed", S2: "completed", S3: "completed", S4: "completed" }),
      transitions: policyTransitions,
      gamma,
      iteration: -1,
      converged: true,
    } as MDPStepData,
  });

  return steps;
}
