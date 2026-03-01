import type { VisualizationStep } from "@/lib/visualization/types";

export interface BanditArm {
  id: number;
  label: string;
  trueMean: number;
  estimatedMean: number;
  pullCount: number;
  totalReward: number;
  lastReward?: number;
  highlight?: "active" | "comparing" | "completed" | "selected";
}

export interface BanditStepData {
  arms: BanditArm[];
  numArms: number;
  epsilon: number;
  totalPulls: number;
  totalReward: number;
  currentArm?: number;
  isExploring: boolean;
  rewardHistory: { pull: number; reward: number; arm: number }[];
}

interface BanditParams {
  numArms?: number;
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

// Box-Muller transform for normal distribution
function gaussianRandom(rand: () => number, mean: number, stddev: number): number {
  const u1 = rand();
  const u2 = rand();
  const z = Math.sqrt(-2 * Math.log(u1 + 0.0001)) * Math.cos(2 * Math.PI * u2);
  return mean + stddev * z;
}

export function generateBanditSteps(params: BanditParams = {}): VisualizationStep[] {
  const { numArms = 4, epsilon = 0.2, seed = 42 } = params;
  const rand = seededRandom(seed);
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // True reward means for each arm (hidden from the agent)
  const trueMeans: number[] = [];
  for (let i = 0; i < numArms; i++) {
    trueMeans.push(Math.round((1 + rand() * 8) * 10) / 10);
  }
  // Ensure at least one clearly better arm
  const bestArmIdx = Math.floor(rand() * numArms);
  trueMeans[bestArmIdx] = Math.max(...trueMeans) + 1.5;

  const arms: BanditArm[] = trueMeans.map((mean, i) => ({
    id: i,
    label: `Arm ${i + 1}`,
    trueMean: mean,
    estimatedMean: 0,
    pullCount: 0,
    totalReward: 0,
  }));

  let totalPulls = 0;
  let totalReward = 0;
  const rewardHistory: { pull: number; reward: number; arm: number }[] = [];

  // Step 1: Introduce the problem
  steps.push({
    id: stepId++,
    description: `The Multi-Armed Bandit problem: ${numArms} slot machines (arms), each with an unknown reward distribution. Goal: maximize total reward by balancing exploration and exploitation.`,
    action: "explore-state",
    highlights: [],
    data: {
      arms: arms.map((a) => ({ ...a })),
      numArms,
      epsilon,
      totalPulls: 0,
      totalReward: 0,
      isExploring: false,
      rewardHistory: [],
    } as BanditStepData,
  });

  // Step 2: Explain epsilon-greedy strategy
  steps.push({
    id: stepId++,
    description: `Using epsilon-greedy strategy (epsilon=${epsilon}): with probability ${epsilon} explore a random arm, otherwise exploit the arm with highest estimated reward.`,
    action: "explore-state",
    highlights: [],
    data: {
      arms: arms.map((a) => ({ ...a })),
      numArms,
      epsilon,
      totalPulls: 0,
      totalReward: 0,
      isExploring: false,
      rewardHistory: [],
    } as BanditStepData,
  });

  // Pull arms for ~25 steps
  const numPulls = 25;
  for (let pull = 0; pull < numPulls; pull++) {
    // Epsilon-greedy selection
    const isExploring = rand() < epsilon;
    let chosenArm: number;

    if (isExploring || totalPulls < numArms) {
      // Explore: try each arm at least once first, then random
      if (totalPulls < numArms) {
        chosenArm = totalPulls;
      } else {
        chosenArm = Math.floor(rand() * numArms);
      }
    } else {
      // Exploit: pick arm with highest estimated mean
      chosenArm = 0;
      for (let i = 1; i < numArms; i++) {
        if (arms[i].estimatedMean > arms[chosenArm].estimatedMean) {
          chosenArm = i;
        }
      }
    }

    // Pull the arm and get reward
    const reward = Math.round(gaussianRandom(rand, trueMeans[chosenArm], 1.5) * 10) / 10;
    arms[chosenArm].pullCount++;
    arms[chosenArm].totalReward += reward;
    arms[chosenArm].estimatedMean = Math.round((arms[chosenArm].totalReward / arms[chosenArm].pullCount) * 100) / 100;
    arms[chosenArm].lastReward = reward;
    totalPulls++;
    totalReward += reward;
    rewardHistory.push({ pull: totalPulls, reward, arm: chosenArm });

    // Highlight the chosen arm
    const highlightedArms = arms.map((a, i) => ({
      ...a,
      highlight: i === chosenArm ? ("active" as const) : undefined,
      lastReward: i === chosenArm ? reward : undefined,
    }));

    steps.push({
      id: stepId++,
      description: `Pull ${totalPulls}: ${isExploring || totalPulls <= numArms ? "Explore" : "Exploit"} -> ${arms[chosenArm].label}. Reward: ${reward.toFixed(1)}. Updated estimate: ${arms[chosenArm].estimatedMean.toFixed(2)} (${arms[chosenArm].pullCount} pulls).`,
      action: isExploring ? "explore-state" : "exploit",
      highlights: [],
      data: {
        arms: highlightedArms,
        numArms,
        epsilon,
        totalPulls,
        totalReward: Math.round(totalReward * 10) / 10,
        currentArm: chosenArm,
        isExploring: isExploring || totalPulls <= numArms,
        rewardHistory: [...rewardHistory],
      } as BanditStepData,
    });
  }

  // Final step: reveal true means and compare
  const finalArms = arms.map((a, i) => ({
    ...a,
    highlight: i === bestArmIdx ? ("completed" as const) : ("comparing" as const),
  }));

  const bestEstimatedArm = arms.reduce((best, arm) =>
    arm.estimatedMean > best.estimatedMean ? arm : best
  );

  steps.push({
    id: stepId++,
    description: `After ${totalPulls} pulls, the agent estimates ${bestEstimatedArm.label} as best (est=${bestEstimatedArm.estimatedMean.toFixed(2)}). True best: ${arms[bestArmIdx].label} (true mean=${trueMeans[bestArmIdx].toFixed(1)}). Total reward: ${totalReward.toFixed(1)}.`,
    action: "complete",
    highlights: [],
    data: {
      arms: finalArms,
      numArms,
      epsilon,
      totalPulls,
      totalReward: Math.round(totalReward * 10) / 10,
      isExploring: false,
      rewardHistory: [...rewardHistory],
    } as BanditStepData,
  });

  // Summary
  steps.push({
    id: stepId++,
    description: `The exploration-exploitation tradeoff is central to the bandit problem. Higher epsilon means more exploration (better long-term estimates) but lower short-term reward. Lower epsilon exploits current knowledge but may miss the true best arm.`,
    action: "complete",
    highlights: [],
    data: {
      arms: finalArms,
      numArms,
      epsilon,
      totalPulls,
      totalReward: Math.round(totalReward * 10) / 10,
      isExploring: false,
      rewardHistory: [...rewardHistory],
    } as BanditStepData,
  });

  return steps;
}
