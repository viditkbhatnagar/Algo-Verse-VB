import type {
  VisualizationStep,
  ArrayWithPointersStepData,
} from "@/lib/visualization/types";

export function generateSlidingWindowSteps(
  input: number[],
  k: number
): VisualizationStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Initial state
  steps.push({
    id: stepId++,
    description: `Sliding Window: find the maximum sum subarray of size k=${k} in [${arr.join(", ")}]. We start by computing the sum of the first window (indices 0 to ${k - 1}).`,
    action: "highlight",
    highlights: [],
    data: {
      array: [...arr],
      pointers: { windowStart: 0, windowEnd: k - 1 },
      windowRange: [0, k - 1],
      highlights: [],
      currentValue: 0,
    } satisfies ArrayWithPointersStepData,
    variables: { k, windowStart: 0, windowEnd: k - 1 },
  });

  // Compute initial window sum
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }

  steps.push({
    id: stepId++,
    description: `Initial window [${arr.slice(0, k).join(", ")}] has sum = ${windowSum}. This is our current max sum. Window spans indices 0 to ${k - 1}.`,
    action: "slide-window",
    highlights: [{ indices: Array.from({ length: k }, (_, i) => i), color: "window" }],
    data: {
      array: [...arr],
      pointers: { windowStart: 0, windowEnd: k - 1 },
      windowRange: [0, k - 1],
      highlights: [{ indices: Array.from({ length: k }, (_, i) => i), color: "window" }],
      currentValue: windowSum,
    } satisfies ArrayWithPointersStepData,
    variables: { k, windowStart: 0, windowEnd: k - 1, windowSum, maxSum: windowSum, maxStart: 0 },
  });

  let maxSum = windowSum;
  let maxStart = 0;

  // Slide the window
  for (let i = k; i < n; i++) {
    const leaving = arr[i - k];
    const entering = arr[i];
    const windowStart = i - k + 1;
    const windowEnd = i;

    // Show the element leaving
    steps.push({
      id: stepId++,
      description: `Slide window right: remove arr[${i - k}]=${leaving} (leaving) and add arr[${i}]=${entering} (entering). Old sum: ${windowSum}.`,
      action: "slide-window",
      highlights: [
        { indices: [i - k], color: "swapping", label: "leaving" },
        { indices: [i], color: "active", label: "entering" },
      ],
      data: {
        array: [...arr],
        pointers: { windowStart: i - k, windowEnd: i },
        windowRange: [i - k, i],
        highlights: [
          { indices: [i - k], color: "swapping" },
          { indices: [i], color: "active" },
        ],
        currentValue: windowSum,
      } satisfies ArrayWithPointersStepData,
      variables: { k, windowStart: i - k, windowEnd: i, leaving, entering, windowSum },
    });

    // Update sum
    windowSum = windowSum - leaving + entering;

    // Window indices for highlight
    const windowIndices = Array.from({ length: k }, (_, j) => windowStart + j);

    // Compare with max
    if (windowSum > maxSum) {
      maxSum = windowSum;
      maxStart = windowStart;

      steps.push({
        id: stepId++,
        description: `New window sum = ${windowSum} > previous max ${maxSum - (windowSum - maxSum) + (windowSum - maxSum)}. New maximum found! Window [${arr.slice(windowStart, windowEnd + 1).join(", ")}] at indices ${windowStart}-${windowEnd}.`,
        action: "slide-window",
        highlights: [{ indices: windowIndices, color: "completed", label: "new max" }],
        data: {
          array: [...arr],
          pointers: { windowStart, windowEnd },
          windowRange: [windowStart, windowEnd],
          highlights: [{ indices: windowIndices, color: "completed" }],
          currentValue: windowSum,
          result: arr.slice(windowStart, windowEnd + 1),
        } satisfies ArrayWithPointersStepData,
        variables: { k, windowStart, windowEnd, windowSum, maxSum, maxStart },
      });
    } else {
      steps.push({
        id: stepId++,
        description: `New window sum = ${windowSum} ${windowSum === maxSum ? "=" : "<"} max ${maxSum}. No update needed. Continue sliding.`,
        action: "slide-window",
        highlights: [{ indices: windowIndices, color: "window" }],
        data: {
          array: [...arr],
          pointers: { windowStart, windowEnd },
          windowRange: [windowStart, windowEnd],
          highlights: [{ indices: windowIndices, color: "window" }],
          currentValue: windowSum,
        } satisfies ArrayWithPointersStepData,
        variables: { k, windowStart, windowEnd, windowSum, maxSum, maxStart },
      });
    }
  }

  // Final result
  const maxWindowIndices = Array.from({ length: k }, (_, j) => maxStart + j);
  steps.push({
    id: stepId++,
    description: `Sliding window complete! Maximum sum subarray of size ${k} is [${arr.slice(maxStart, maxStart + k).join(", ")}] at indices ${maxStart}-${maxStart + k - 1} with sum = ${maxSum}.`,
    action: "complete",
    highlights: [{ indices: maxWindowIndices, color: "completed" }],
    data: {
      array: [...arr],
      pointers: { windowStart: maxStart, windowEnd: maxStart + k - 1 },
      windowRange: [maxStart, maxStart + k - 1],
      highlights: [{ indices: maxWindowIndices, color: "completed" }],
      currentValue: maxSum,
      result: arr.slice(maxStart, maxStart + k),
    } satisfies ArrayWithPointersStepData,
    variables: { k, maxSum, maxStart, maxWindow: arr.slice(maxStart, maxStart + k) },
  });

  return steps;
}
