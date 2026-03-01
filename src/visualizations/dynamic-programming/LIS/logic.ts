import type { VisualizationStep, HighlightColor } from "@/lib/visualization/types";

export interface LISStepData {
  array: number[];
  dp: number[];
  prev: number[];
  currentIndex: number;
  compareIndex: number;
  arrayHighlights: Record<number, HighlightColor>;
  dpHighlights: Record<number, HighlightColor>;
  subsequence: number[];
  subsequenceIndices: number[];
  maxLength: number;
}

export function generateLISSteps(input: number[]): VisualizationStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const dp = new Array(n).fill(1);
  const prev = new Array(n).fill(-1);

  // Initial step
  steps.push({
    id: stepId++,
    description: `Finding Longest Increasing Subsequence of [${arr.join(", ")}]. Initialize dp[i] = 1 for all i (each element is a subsequence of length 1).`,
    action: "highlight",
    highlights: [],
    data: {
      array: [...arr],
      dp: [...dp],
      prev: [...prev],
      currentIndex: -1,
      compareIndex: -1,
      arrayHighlights: {},
      dpHighlights: {},
      subsequence: [],
      subsequenceIndices: [],
      maxLength: 1,
    } as LISStepData,
  });

  // Main DP loop
  for (let i = 1; i < n; i++) {
    // Show which element we're considering
    const startHighlights: Record<number, HighlightColor> = {};
    startHighlights[i] = "active";

    steps.push({
      id: stepId++,
      description: `Processing arr[${i}] = ${arr[i]}. Scanning elements to the left for values smaller than ${arr[i]}.`,
      action: "highlight",
      highlights: [{ indices: [i], color: "active" }],
      data: {
        array: [...arr],
        dp: [...dp],
        prev: [...prev],
        currentIndex: i,
        compareIndex: -1,
        arrayHighlights: startHighlights,
        dpHighlights: { [i]: "active" as HighlightColor },
        subsequence: [],
        subsequenceIndices: [],
        maxLength: Math.max(...dp),
      } as LISStepData,
    });

    for (let j = 0; j < i; j++) {
      const arrH: Record<number, HighlightColor> = {};
      const dpH: Record<number, HighlightColor> = {};
      arrH[i] = "active";
      arrH[j] = "comparing";
      dpH[i] = "active";
      dpH[j] = "comparing";

      if (arr[j] < arr[i]) {
        if (dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
          prev[i] = j;

          arrH[j] = "swapping";
          dpH[j] = "swapping";
          dpH[i] = "swapping";

          steps.push({
            id: stepId++,
            description: `arr[${j}]=${arr[j]} < arr[${i}]=${arr[i]} and dp[${j}]+1=${dp[j]} > old dp[${i}]. Update: dp[${i}] = ${dp[i]}, prev[${i}] = ${j}.`,
            action: "fill-cell",
            highlights: [{ indices: [i, j], color: "swapping" }],
            data: {
              array: [...arr],
              dp: [...dp],
              prev: [...prev],
              currentIndex: i,
              compareIndex: j,
              arrayHighlights: arrH,
              dpHighlights: dpH,
              subsequence: [],
              subsequenceIndices: [],
              maxLength: Math.max(...dp),
            } as LISStepData,
            variables: { i, j, "arr[j]": arr[j], "arr[i]": arr[i], "dp[i]": dp[i] },
          });
        } else {
          steps.push({
            id: stepId++,
            description: `arr[${j}]=${arr[j]} < arr[${i}]=${arr[i]} but dp[${j}]+1=${dp[j] + 1} <= dp[${i}]=${dp[i]}. No improvement.`,
            action: "compare",
            highlights: [{ indices: [i, j], color: "comparing" }],
            data: {
              array: [...arr],
              dp: [...dp],
              prev: [...prev],
              currentIndex: i,
              compareIndex: j,
              arrayHighlights: arrH,
              dpHighlights: dpH,
              subsequence: [],
              subsequenceIndices: [],
              maxLength: Math.max(...dp),
            } as LISStepData,
            variables: { i, j, "arr[j]": arr[j], "arr[i]": arr[i], "dp[i]": dp[i] },
          });
        }
      } else {
        steps.push({
          id: stepId++,
          description: `arr[${j}]=${arr[j]} >= arr[${i}]=${arr[i]}. Skip — cannot extend increasing subsequence.`,
          action: "compare",
          highlights: [{ indices: [i, j], color: "comparing" }],
          data: {
            array: [...arr],
            dp: [...dp],
            prev: [...prev],
            currentIndex: i,
            compareIndex: j,
            arrayHighlights: arrH,
            dpHighlights: dpH,
            subsequence: [],
            subsequenceIndices: [],
            maxLength: Math.max(...dp),
          } as LISStepData,
          variables: { i, j, "arr[j]": arr[j], "arr[i]": arr[i] },
        });
      }
    }

    // Show dp[i] finalized
    const finalH: Record<number, HighlightColor> = {};
    const finalDpH: Record<number, HighlightColor> = {};
    finalH[i] = "completed";
    finalDpH[i] = "completed";

    steps.push({
      id: stepId++,
      description: `Finalized dp[${i}] = ${dp[i]}. The LIS ending at index ${i} (value ${arr[i]}) has length ${dp[i]}.`,
      action: "complete",
      highlights: [{ indices: [i], color: "completed" }],
      data: {
        array: [...arr],
        dp: [...dp],
        prev: [...prev],
        currentIndex: i,
        compareIndex: -1,
        arrayHighlights: finalH,
        dpHighlights: finalDpH,
        subsequence: [],
        subsequenceIndices: [],
        maxLength: Math.max(...dp),
      } as LISStepData,
      variables: { i, "dp[i]": dp[i] },
    });
  }

  // Backtrack to find the actual LIS
  let maxLen = 0;
  let maxIdx = 0;
  for (let i = 0; i < n; i++) {
    if (dp[i] > maxLen) {
      maxLen = dp[i];
      maxIdx = i;
    }
  }

  const subsequenceIndices: number[] = [];
  let idx = maxIdx;
  while (idx !== -1) {
    subsequenceIndices.unshift(idx);
    idx = prev[idx];
  }
  const subsequence = subsequenceIndices.map((i) => arr[i]);

  // Backtrack visualization step
  const backtrackArrH: Record<number, HighlightColor> = {};
  const backtrackDpH: Record<number, HighlightColor> = {};
  for (const si of subsequenceIndices) {
    backtrackArrH[si] = "path";
    backtrackDpH[si] = "path";
  }

  steps.push({
    id: stepId++,
    description: `LIS length = ${maxLen}. Subsequence: [${subsequence.join(", ")}] at indices [${subsequenceIndices.join(", ")}].`,
    action: "complete",
    highlights: [],
    data: {
      array: [...arr],
      dp: [...dp],
      prev: [...prev],
      currentIndex: -1,
      compareIndex: -1,
      arrayHighlights: backtrackArrH,
      dpHighlights: backtrackDpH,
      subsequence,
      subsequenceIndices,
      maxLength: maxLen,
    } as LISStepData,
    variables: { maxLen, subsequence },
  });

  return steps;
}
