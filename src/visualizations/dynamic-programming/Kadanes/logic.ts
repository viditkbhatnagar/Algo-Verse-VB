import type { VisualizationStep, HighlightColor } from "@/lib/visualization/types";

export interface KadanesStepData {
  array: number[];
  currentSum: number;
  maxSum: number;
  currentIndex: number;
  subarrayStart: number;
  subarrayEnd: number;
  bestStart: number;
  bestEnd: number;
  arrayHighlights: Record<number, HighlightColor>;
  isNewSubarray: boolean;
}

export function generateKadanesSteps(input: number[]): VisualizationStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  let currentSum = arr[0];
  let maxSum = arr[0];
  let tempStart = 0;
  let bestStart = 0;
  let bestEnd = 0;

  // Initial step
  steps.push({
    id: stepId++,
    description: `Kadane's Algorithm on [${arr.join(", ")}]. Initialize: currentSum = arr[0] = ${arr[0]}, maxSum = ${arr[0]}.`,
    action: "highlight",
    highlights: [],
    data: {
      array: [...arr],
      currentSum,
      maxSum,
      currentIndex: 0,
      subarrayStart: 0,
      subarrayEnd: 0,
      bestStart: 0,
      bestEnd: 0,
      arrayHighlights: { 0: "active" as HighlightColor },
      isNewSubarray: false,
    } as KadanesStepData,
    variables: { currentSum, maxSum, start: 0, end: 0 },
  });

  // Main loop
  for (let i = 1; i < n; i++) {
    const extendSum = currentSum + arr[i];
    const restartSum = arr[i];

    if (restartSum > extendSum) {
      // Start new subarray
      currentSum = restartSum;
      tempStart = i;

      const highlights: Record<number, HighlightColor> = {};
      // Highlight current active subarray
      highlights[i] = "active";
      // Mark the best subarray so far
      for (let k = bestStart; k <= bestEnd; k++) {
        if (k !== i) highlights[k] = "completed";
      }

      steps.push({
        id: stepId++,
        description: `Index ${i}: arr[${i}] = ${arr[i]}. Extend (${extendSum}) vs restart (${restartSum}). Restart is better — start new subarray at index ${i}. currentSum = ${currentSum}.`,
        action: "fill-cell",
        highlights: [{ indices: [i], color: "active" }],
        data: {
          array: [...arr],
          currentSum,
          maxSum,
          currentIndex: i,
          subarrayStart: tempStart,
          subarrayEnd: i,
          bestStart,
          bestEnd,
          arrayHighlights: highlights,
          isNewSubarray: true,
        } as KadanesStepData,
        variables: { i, "arr[i]": arr[i], currentSum, maxSum, extendSum, restartSum },
      });
    } else {
      // Extend current subarray
      currentSum = extendSum;

      const highlights: Record<number, HighlightColor> = {};
      // Highlight current active subarray (window)
      for (let k = tempStart; k <= i; k++) {
        highlights[k] = "window";
      }
      highlights[i] = "active";

      steps.push({
        id: stepId++,
        description: `Index ${i}: arr[${i}] = ${arr[i]}. Extend (${extendSum}) vs restart (${restartSum}). Extend is better — add to current subarray. currentSum = ${currentSum}.`,
        action: "fill-cell",
        highlights: [{ indices: [i], color: "active" }],
        data: {
          array: [...arr],
          currentSum,
          maxSum,
          currentIndex: i,
          subarrayStart: tempStart,
          subarrayEnd: i,
          bestStart,
          bestEnd,
          arrayHighlights: highlights,
          isNewSubarray: false,
        } as KadanesStepData,
        variables: { i, "arr[i]": arr[i], currentSum, maxSum, extendSum, restartSum },
      });
    }

    // Check if we have a new maximum
    if (currentSum > maxSum) {
      maxSum = currentSum;
      bestStart = tempStart;
      bestEnd = i;

      const highlights: Record<number, HighlightColor> = {};
      for (let k = bestStart; k <= bestEnd; k++) {
        highlights[k] = "completed";
      }

      steps.push({
        id: stepId++,
        description: `New maximum found! maxSum updated to ${maxSum}. Best subarray: [${arr.slice(bestStart, bestEnd + 1).join(", ")}] (indices ${bestStart} to ${bestEnd}).`,
        action: "complete",
        highlights: [{ indices: Array.from({ length: bestEnd - bestStart + 1 }, (_, k) => bestStart + k), color: "completed" }],
        data: {
          array: [...arr],
          currentSum,
          maxSum,
          currentIndex: i,
          subarrayStart: tempStart,
          subarrayEnd: i,
          bestStart,
          bestEnd,
          arrayHighlights: highlights,
          isNewSubarray: false,
        } as KadanesStepData,
        variables: { i, currentSum, maxSum, bestStart, bestEnd },
      });
    }
  }

  // Final result
  const finalHighlights: Record<number, HighlightColor> = {};
  for (let k = bestStart; k <= bestEnd; k++) {
    finalHighlights[k] = "path";
  }

  steps.push({
    id: stepId++,
    description: `Kadane's complete! Maximum subarray sum = ${maxSum}. Subarray: [${arr.slice(bestStart, bestEnd + 1).join(", ")}] (indices ${bestStart} to ${bestEnd}).`,
    action: "complete",
    highlights: [],
    data: {
      array: [...arr],
      currentSum,
      maxSum,
      currentIndex: -1,
      subarrayStart: bestStart,
      subarrayEnd: bestEnd,
      bestStart,
      bestEnd,
      arrayHighlights: finalHighlights,
      isNewSubarray: false,
    } as KadanesStepData,
    variables: { maxSum, subarray: arr.slice(bestStart, bestEnd + 1) },
  });

  return steps;
}
