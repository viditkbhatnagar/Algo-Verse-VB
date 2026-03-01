import type { VisualizationStep, FunctionPlotStepData } from "@/lib/visualization/types";
import { VIZ_COLORS } from "@/lib/constants";

interface EpsilonGreedyParams {
  initialEpsilon?: number;
  decayRate?: number;
  seed?: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function generateEpsilonGreedySteps(params: EpsilonGreedyParams = {}): VisualizationStep[] {
  const { initialEpsilon = 0.8, decayRate = 0.05, seed = 42 } = params;
  const rand = seededRandom(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const numEpisodes = 40;

  // Precompute all epsilon values and cumulative rewards
  const epsilonPoints: { x: number; y: number }[] = [];
  const rewardPoints: { x: number; y: number }[] = [];
  const explorationPoints: { x: number; y: number }[] = [];

  // Simulate a simple bandit problem alongside
  const trueMeans = [2.0, 5.0, 3.5]; // 3 arms, arm 1 is best
  let cumulativeReward = 0;
  const armEstimates = [0, 0, 0];
  const armCounts = [0, 0, 0];

  for (let ep = 0; ep < numEpisodes; ep++) {
    const epsilon = initialEpsilon * Math.exp(-decayRate * ep);
    epsilonPoints.push({ x: ep, y: Math.round(epsilon * 1000) / 1000 });

    // Simulate one pull
    const isExploring = rand() < epsilon;
    let chosenArm: number;
    if (isExploring) {
      chosenArm = Math.floor(rand() * 3);
    } else {
      chosenArm = armEstimates.indexOf(Math.max(...armEstimates));
      if (chosenArm < 0) chosenArm = 0;
    }

    // Get reward (normal with mean=trueMeans[arm], std=1)
    const u1 = rand();
    const u2 = rand();
    const z = Math.sqrt(-2 * Math.log(u1 + 0.0001)) * Math.cos(2 * Math.PI * u2);
    const reward = trueMeans[chosenArm] + z;
    armCounts[chosenArm]++;
    armEstimates[chosenArm] += (reward - armEstimates[chosenArm]) / armCounts[chosenArm];

    cumulativeReward += reward;
    rewardPoints.push({ x: ep, y: Math.round(cumulativeReward * 10) / 10 });

    // Exploration rate (fraction of explores so far)
    const exploreCount = epsilonPoints.filter((_, i) => i <= ep).reduce((sum, p) => sum + p.y, 0);
    const exploreRate = exploreCount / (ep + 1);
    explorationPoints.push({ x: ep, y: Math.round(exploreRate * 100) / 100 });
  }

  // Max Y for reward curve
  const maxReward = Math.max(10, ...rewardPoints.map((p) => p.y));

  // Step 1: Introduce epsilon-greedy
  steps.push({
    id: stepId++,
    description: `Epsilon-Greedy balances exploration and exploitation. At each step, with probability epsilon choose randomly (explore), otherwise choose the best-known arm (exploit). Epsilon starts at ${initialEpsilon}.`,
    action: "explore-state",
    highlights: [],
    data: {
      functions: [
        {
          name: "Epsilon",
          points: [{ x: 0, y: initialEpsilon }],
          color: VIZ_COLORS.active,
          active: true,
        },
      ],
      xLabel: "Episode",
      yLabel: "Epsilon",
      xRange: [0, numEpisodes] as [number, number],
      yRange: [0, 1.1] as [number, number],
    } as FunctionPlotStepData,
  });

  // Step 2: Show the decay concept
  steps.push({
    id: stepId++,
    description: `Epsilon decays over time: epsilon(t) = ${initialEpsilon} * exp(-${decayRate} * t). This means early episodes favor exploration, while later episodes favor exploitation as knowledge improves.`,
    action: "explore-state",
    highlights: [],
    data: {
      functions: [
        {
          name: "Epsilon",
          points: epsilonPoints.slice(0, 5),
          color: VIZ_COLORS.active,
          active: true,
        },
      ],
      currentX: 0,
      xLabel: "Episode",
      yLabel: "Epsilon",
      xRange: [0, numEpisodes] as [number, number],
      yRange: [0, 1.1] as [number, number],
    } as FunctionPlotStepData,
  });

  // Steps 3-N: Show epsilon curve growing episode by episode (batches of ~5)
  const batchSize = 5;
  for (let batch = batchSize; batch <= numEpisodes; batch += batchSize) {
    const end = Math.min(batch, numEpisodes);
    const currentEpsilon = epsilonPoints[end - 1]?.y ?? 0;
    const currentReward = rewardPoints[end - 1]?.y ?? 0;

    steps.push({
      id: stepId++,
      description: `Episode ${end}: epsilon=${currentEpsilon.toFixed(3)}, cumulative reward=${currentReward.toFixed(1)}. ${currentEpsilon > 0.3 ? "Still exploring frequently." : currentEpsilon > 0.1 ? "Exploring less, exploiting more." : "Mostly exploiting now."}`,
      action: currentEpsilon > 0.3 ? "explore-state" : "exploit",
      highlights: [],
      data: {
        functions: [
          {
            name: "Epsilon",
            points: epsilonPoints.slice(0, end),
            color: VIZ_COLORS.active,
            active: true,
          },
          {
            name: "Cum. Reward / " + Math.round(maxReward),
            points: rewardPoints.slice(0, end).map((p) => ({
              x: p.x,
              y: p.y / maxReward,
            })),
            color: VIZ_COLORS.rewardPositive,
            active: true,
          },
        ],
        currentX: end - 1,
        xLabel: "Episode",
        yLabel: "Value",
        xRange: [0, numEpisodes] as [number, number],
        yRange: [0, 1.1] as [number, number],
        annotations:
          end === numEpisodes
            ? [
                { x: 0, y: initialEpsilon, label: `eps_0=${initialEpsilon}` },
                {
                  x: numEpisodes - 1,
                  y: currentEpsilon,
                  label: `eps_T=${currentEpsilon.toFixed(3)}`,
                },
              ]
            : undefined,
      } as FunctionPlotStepData,
    });
  }

  // Final step: full view with annotations
  const finalEps = epsilonPoints[numEpisodes - 1]?.y ?? 0;
  const finalReward = rewardPoints[numEpisodes - 1]?.y ?? 0;

  steps.push({
    id: stepId++,
    description: `Training complete! Epsilon decayed from ${initialEpsilon} to ${finalEps.toFixed(3)} over ${numEpisodes} episodes. Total cumulative reward: ${finalReward.toFixed(1)}. The agent learned to exploit the best arm while gradually reducing exploration.`,
    action: "complete",
    highlights: [],
    data: {
      functions: [
        {
          name: "Epsilon",
          points: epsilonPoints,
          color: VIZ_COLORS.active,
          active: true,
        },
        {
          name: "Cum. Reward (scaled)",
          points: rewardPoints.map((p) => ({
            x: p.x,
            y: p.y / maxReward,
          })),
          color: VIZ_COLORS.rewardPositive,
          active: true,
        },
      ],
      xLabel: "Episode",
      yLabel: "Value",
      xRange: [0, numEpisodes] as [number, number],
      yRange: [0, 1.1] as [number, number],
      annotations: [
        { x: 0, y: initialEpsilon, label: `eps_0=${initialEpsilon}` },
        {
          x: numEpisodes - 1,
          y: finalEps,
          label: `eps_T=${finalEps.toFixed(3)}`,
        },
      ],
    } as FunctionPlotStepData,
  });

  // Summary step
  steps.push({
    id: stepId++,
    description: `Epsilon-Greedy with decay is the simplest exploration strategy. The decay rate (${decayRate}) controls how quickly the agent shifts from exploration to exploitation. Too fast: may converge to suboptimal arm. Too slow: wastes pulls on exploration.`,
    action: "complete",
    highlights: [],
    data: {
      functions: [
        {
          name: "Epsilon",
          points: epsilonPoints,
          color: VIZ_COLORS.active,
          active: true,
        },
        {
          name: "Cum. Reward (scaled)",
          points: rewardPoints.map((p) => ({
            x: p.x,
            y: p.y / maxReward,
          })),
          color: VIZ_COLORS.rewardPositive,
          active: true,
        },
      ],
      xLabel: "Episode",
      yLabel: "Value",
      xRange: [0, numEpisodes] as [number, number],
      yRange: [0, 1.1] as [number, number],
      annotations: [
        { x: 0, y: initialEpsilon, label: `eps_0=${initialEpsilon}` },
        {
          x: numEpisodes - 1,
          y: finalEps,
          label: `eps_T=${finalEps.toFixed(3)}`,
        },
      ],
    } as FunctionPlotStepData,
  });

  return steps;
}
