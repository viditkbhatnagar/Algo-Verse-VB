import type { VisualizationStep, SortingStepData } from "@/lib/visualization/types";

export function generateCountingSortSteps(input: number[]): VisualizationStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const max = Math.max(...arr);

  steps.push({
    id: stepId++,
    description: `Starting Counting Sort with ${n} elements (max value: ${max})`,
    action: "highlight",
    highlights: [],
    data: {
      array: [...arr],
      highlights: [],
      auxiliaryArrays: [{ label: "count", data: new Array(max + 1).fill(0) }],
    } satisfies SortingStepData,
  });

  // Build count array
  const count = new Array(max + 1).fill(0);

  for (let i = 0; i < n; i++) {
    count[arr[i]]++;
    steps.push({
      id: stepId++,
      description: `Counting ${arr[i]} — count[${arr[i]}] = ${count[arr[i]]}`,
      action: "highlight",
      highlights: [{ indices: [i], color: "active" }],
      data: {
        array: [...arr],
        highlights: [{ indices: [i], color: "active" }],
        auxiliaryArrays: [{ label: "count", data: [...count] }],
      } satisfies SortingStepData,
    });
  }

  // Cumulative count
  steps.push({
    id: stepId++,
    description: "Computing cumulative counts",
    action: "highlight",
    highlights: [],
    data: {
      array: [...arr],
      highlights: [],
      auxiliaryArrays: [{ label: "count", data: [...count] }],
    } satisfies SortingStepData,
  });

  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }

  steps.push({
    id: stepId++,
    description: `Cumulative counts computed: [${count.join(", ")}]`,
    action: "highlight",
    highlights: [],
    data: {
      array: [...arr],
      highlights: [],
      auxiliaryArrays: [{ label: "cumulative", data: [...count] }],
    } satisfies SortingStepData,
  });

  // Build output array
  const output = new Array(n).fill(0);

  for (let i = n - 1; i >= 0; i--) {
    const val = arr[i];
    const pos = count[val] - 1;
    output[pos] = val;
    count[val]--;

    steps.push({
      id: stepId++,
      description: `Placing ${val} at output position ${pos}`,
      action: "insert",
      highlights: [{ indices: [i], color: "comparing" }],
      data: {
        array: [...output],
        highlights: [{ indices: [pos], color: "selected" }],
        auxiliaryArrays: [{ label: "count", data: [...count] }],
      } satisfies SortingStepData,
    });
  }

  const allIndices = output.map((_, i) => i);
  steps.push({
    id: stepId++,
    description: "Counting Sort complete!",
    action: "complete",
    highlights: [{ indices: allIndices, color: "completed" }],
    data: {
      array: [...output],
      highlights: [{ indices: allIndices, color: "completed" }],
    } satisfies SortingStepData,
  });

  return steps;
}
