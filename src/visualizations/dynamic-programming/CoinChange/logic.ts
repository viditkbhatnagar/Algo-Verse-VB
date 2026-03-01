import type { VisualizationStep, MatrixStepData, HighlightColor } from "@/lib/visualization/types";

function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

interface CoinChangeConfig {
  coins: number[];
  amount: number;
}

export const DEFAULT_COIN_CHANGE_CONFIG: CoinChangeConfig = {
  coins: [1, 3, 4],
  amount: 6,
};

export function generateCoinChangeSteps(
  coins: number[] = DEFAULT_COIN_CHANGE_CONFIG.coins,
  amount: number = DEFAULT_COIN_CHANGE_CONFIG.amount
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const INF = Infinity;
  const dp: number[] = new Array(amount + 1).fill(INF);
  const coinUsed: (number | null)[] = new Array(amount + 1).fill(null);
  let filledUpTo = -1;

  // Column headers: amounts 0..amount
  const colHeaders = Array.from({ length: amount + 1 }, (_, i) => String(i));

  // Helper to display dp values (Infinity as "INF")
  function displayVal(v: number): string | number {
    return v === INF ? "INF" : v;
  }

  function buildMatrix(): (number | string | null)[][] {
    return [dp.map((v, i) => (i <= filledUpTo ? displayVal(v) : null))];
  }

  // Step 0: Initialize
  steps.push({
    id: stepId++,
    description: `Coin Change: Find minimum coins from [${coins.join(", ")}] to make amount ${amount}. Recurrence: dp[i] = min(dp[i - coin] + 1) for each coin.`,
    action: "highlight",
    highlights: [],
    data: {
      matrix: [new Array(amount + 1).fill(null)],
      cellHighlights: {},
      colHeaders,
    } satisfies MatrixStepData,
  });

  // Base case dp[0] = 0
  dp[0] = 0;
  filledUpTo = 0;
  steps.push({
    id: stepId++,
    description: `Base case: dp[0] = 0. Zero coins are needed to make amount 0.`,
    action: "fill-cell",
    highlights: [{ indices: [0], color: "active" }],
    data: {
      matrix: buildMatrix(),
      cellHighlights: { [cellKey(0, 0)]: "active" as HighlightColor },
      colHeaders,
      currentCell: [0, 0] as [number, number],
    } satisfies MatrixStepData,
  });

  // Fill dp[1] through dp[amount]
  for (let i = 1; i <= amount; i++) {
    filledUpTo = i; // Show the cell (as INF initially)

    // Try each coin
    let bestCoin: number | null = null;
    let bestVal = INF;

    for (const coin of coins) {
      if (coin > i) continue;

      const prevAmount = i - coin;
      const candidateVal = dp[prevAmount] === INF ? INF : dp[prevAmount] + 1;

      // Show the comparison step
      const tryHighlights: Record<string, HighlightColor> = {};
      for (let j = 0; j < i; j++) {
        if (j === prevAmount) {
          tryHighlights[cellKey(0, j)] = "comparing";
        } else if (dp[j] !== INF && j < i) {
          tryHighlights[cellKey(0, j)] = "completed";
        }
      }
      tryHighlights[cellKey(0, i)] = "active";

      const candidateDisplay = candidateVal === INF ? "INF" : candidateVal;
      const prevDisplay = dp[prevAmount] === INF ? "INF" : dp[prevAmount];

      steps.push({
        id: stepId++,
        description: `Amount ${i}: Try coin ${coin}. dp[${i} - ${coin}] = dp[${prevAmount}] = ${prevDisplay}. Candidate: ${prevDisplay} + 1 = ${candidateDisplay}. Current best: ${displayVal(bestVal)}.`,
        action: "compare",
        highlights: [{ indices: [prevAmount], color: "comparing" }],
        data: {
          matrix: buildMatrix(),
          cellHighlights: tryHighlights,
          colHeaders,
          currentCell: [0, i] as [number, number],
          arrows: dp[prevAmount] !== INF
            ? [{ from: [0, prevAmount], to: [0, i], label: `+coin(${coin})` }]
            : [],
        } satisfies MatrixStepData,
      });

      if (candidateVal < bestVal) {
        bestVal = candidateVal;
        bestCoin = coin;
      }
    }

    // Fill the cell with the best value
    dp[i] = bestVal;
    coinUsed[i] = bestCoin;

    const fillHighlights: Record<string, HighlightColor> = {};
    for (let j = 0; j < i; j++) {
      fillHighlights[cellKey(0, j)] = "completed";
    }
    fillHighlights[cellKey(0, i)] = "active";

    const coinDesc = bestCoin !== null
      ? ` Best choice: use coin ${bestCoin} (dp[${i - bestCoin}] + 1 = ${bestVal}).`
      : " No coin can reach this amount.";

    steps.push({
      id: stepId++,
      description: `dp[${i}] = ${displayVal(dp[i])}.${coinDesc}`,
      action: "fill-cell",
      highlights: [{ indices: [i], color: "active" }],
      data: {
        matrix: buildMatrix(),
        cellHighlights: fillHighlights,
        colHeaders,
        currentCell: [0, i] as [number, number],
      } satisfies MatrixStepData,
    });
  }

  // Final result
  const finalHighlights: Record<string, HighlightColor> = {};
  for (let j = 0; j <= amount; j++) {
    finalHighlights[cellKey(0, j)] = "completed";
  }
  finalHighlights[cellKey(0, amount)] = "selected";

  // Backtrack to find which coins were used
  const coinsUsedList: number[] = [];
  let remaining = amount;
  while (remaining > 0 && coinUsed[remaining] !== null) {
    coinsUsedList.push(coinUsed[remaining]!);
    remaining -= coinUsed[remaining]!;
  }

  const resultDesc = dp[amount] === INF
    ? `It is impossible to make amount ${amount} with coins [${coins.join(", ")}].`
    : `Minimum coins to make ${amount}: ${dp[amount]} coins. Used: [${coinsUsedList.join(", ")}].`;

  steps.push({
    id: stepId++,
    description: resultDesc,
    action: "complete",
    highlights: [{ indices: [amount], color: "selected" }],
    data: {
      matrix: buildMatrix(),
      cellHighlights: finalHighlights,
      colHeaders,
      currentCell: [0, amount] as [number, number],
    } satisfies MatrixStepData,
  });

  return steps;
}
