import type { VisualizationStep, SortingStepData } from "@/lib/visualization/types";

export function generateRadixSortSteps(input: number[]): VisualizationStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  if (n === 0) return steps;

  const max = Math.max(...arr);
  const maxDigits = max === 0 ? 1 : Math.floor(Math.log10(max)) + 1;

  steps.push({
    id: stepId++,
    description: `Starting Radix Sort with ${n} elements (max digits: ${maxDigits})`,
    action: "highlight",
    highlights: [],
    data: { array: [...arr], highlights: [] } satisfies SortingStepData,
  });

  for (let digit = 0; digit < maxDigits; digit++) {
    const exp = Math.pow(10, digit);
    const digitName = digit === 0 ? "ones" : digit === 1 ? "tens" : digit === 2 ? "hundreds" : `10^${digit}`;

    steps.push({
      id: stepId++,
      description: `Processing ${digitName} digit (position ${digit})`,
      action: "highlight",
      highlights: [],
      data: {
        array: [...arr],
        highlights: [],
        buckets: Array.from({ length: 10 }, (_, i) => ({
          label: String(i),
          items: [],
        })),
      } satisfies SortingStepData,
    });

    // Create buckets
    const buckets: number[][] = Array.from({ length: 10 }, () => []);

    for (let i = 0; i < n; i++) {
      const d = Math.floor(arr[i] / exp) % 10;
      buckets[d].push(arr[i]);

      steps.push({
        id: stepId++,
        description: `${arr[i]}: ${digitName} digit is ${d}, placing in bucket ${d}`,
        action: "highlight",
        highlights: [{ indices: [i], color: "active" }],
        data: {
          array: [...arr],
          highlights: [{ indices: [i], color: "active" }],
          buckets: buckets.map((b, idx) => ({
            label: String(idx),
            items: [...b],
          })),
        } satisfies SortingStepData,
      });
    }

    // Collect from buckets
    let idx = 0;
    for (let d = 0; d < 10; d++) {
      for (const val of buckets[d]) {
        arr[idx] = val;
        idx++;
      }
    }

    steps.push({
      id: stepId++,
      description: `Collected from buckets after ${digitName} digit: [${arr.join(", ")}]`,
      action: "complete",
      highlights: [],
      data: {
        array: [...arr],
        highlights: [],
      } satisfies SortingStepData,
    });
  }

  const allIndices = arr.map((_, i) => i);
  steps.push({
    id: stepId++,
    description: "Radix Sort complete!",
    action: "complete",
    highlights: [{ indices: allIndices, color: "completed" }],
    data: {
      array: [...arr],
      highlights: [{ indices: allIndices, color: "completed" }],
    } satisfies SortingStepData,
  });

  return steps;
}
