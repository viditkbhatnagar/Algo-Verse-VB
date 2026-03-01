import type { VisualizationStep, SearchStepData } from "@/lib/visualization/types";

export function generateBinarySearchSteps(
  input: number[],
  target: number
): VisualizationStep[] {
  const arr = [...input].sort((a, b) => a - b);
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const eliminated: number[] = [];

  steps.push({
    id: stepId++,
    description: `Starting Binary Search for ${target} in sorted array of ${arr.length} elements`,
    action: "highlight",
    highlights: [],
    data: {
      array: [...arr],
      target,
      currentIndex: -1,
      low: 0,
      mid: Math.floor((arr.length - 1) / 2),
      high: arr.length - 1,
      eliminated: [],
      found: false,
      checked: [],
    } satisfies SearchStepData,
  });

  let low = 0;
  let high = arr.length - 1;
  const checked: number[] = [];

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    steps.push({
      id: stepId++,
      description: `low=${low}, mid=${mid}, high=${high} — checking ${arr[mid]}`,
      action: "compare",
      highlights: [
        { indices: [mid], color: "active", label: "mid" },
        { indices: [low], color: "comparing", label: "low" },
        { indices: [high], color: "swapping", label: "high" },
      ],
      data: {
        array: [...arr],
        target,
        currentIndex: mid,
        low,
        mid,
        high,
        eliminated: [...eliminated],
        found: false,
        checked: [...checked],
      } satisfies SearchStepData,
    });

    checked.push(mid);

    if (arr[mid] === target) {
      steps.push({
        id: stepId++,
        description: `Found ${target} at index ${mid}!`,
        action: "complete",
        highlights: [{ indices: [mid], color: "completed" }],
        data: {
          array: [...arr],
          target,
          currentIndex: mid,
          low,
          mid,
          high,
          eliminated: [...eliminated],
          found: true,
          checked: [...checked],
        } satisfies SearchStepData,
      });
      return steps;
    } else if (arr[mid] < target) {
      // Eliminate left half
      for (let i = low; i <= mid; i++) {
        if (!eliminated.includes(i)) eliminated.push(i);
      }

      steps.push({
        id: stepId++,
        description: `${arr[mid]} < ${target}, eliminating left half [${low}..${mid}]`,
        action: "highlight",
        highlights: [],
        data: {
          array: [...arr],
          target,
          currentIndex: mid,
          low: mid + 1,
          mid: -1,
          high,
          eliminated: [...eliminated],
          found: false,
          checked: [...checked],
        } satisfies SearchStepData,
      });

      low = mid + 1;
    } else {
      // Eliminate right half
      for (let i = mid; i <= high; i++) {
        if (!eliminated.includes(i)) eliminated.push(i);
      }

      steps.push({
        id: stepId++,
        description: `${arr[mid]} > ${target}, eliminating right half [${mid}..${high}]`,
        action: "highlight",
        highlights: [],
        data: {
          array: [...arr],
          target,
          currentIndex: mid,
          low,
          mid: -1,
          high: mid - 1,
          eliminated: [...eliminated],
          found: false,
          checked: [...checked],
        } satisfies SearchStepData,
      });

      high = mid - 1;
    }
  }

  steps.push({
    id: stepId++,
    description: `${target} not found in the array`,
    action: "complete",
    highlights: [],
    data: {
      array: [...arr],
      target,
      currentIndex: -1,
      low,
      mid: -1,
      high,
      eliminated: [...eliminated],
      found: false,
      checked: [...checked],
    } satisfies SearchStepData,
  });

  return steps;
}
