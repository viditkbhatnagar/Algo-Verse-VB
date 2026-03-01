import type { VisualizationStep, SortingStepData } from "@/lib/visualization/types";

export function generateInsertionSortSteps(input: number[]): VisualizationStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  if (n === 0) return steps;

  steps.push({
    id: stepId++,
    description: `Starting Insertion Sort with ${n} elements`,
    action: "highlight",
    highlights: [],
    data: { array: [...arr], highlights: [] } satisfies SortingStepData,
  });

  steps.push({
    id: stepId++,
    description: `Element ${arr[0]} at index 0 is trivially sorted`,
    action: "complete",
    highlights: [{ indices: [0], color: "completed" }],
    data: {
      array: [...arr],
      highlights: [{ indices: [0], color: "completed" }],
    } satisfies SortingStepData,
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];

    steps.push({
      id: stepId++,
      description: `Picking element ${key} at index ${i} to insert into sorted portion`,
      action: "select",
      highlights: [{ indices: [i], color: "active", label: "key" }],
      data: {
        array: [...arr],
        highlights: [{ indices: [i], color: "active", label: "key" }],
      } satisfies SortingStepData,
      variables: { i, key },
    });

    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      steps.push({
        id: stepId++,
        description: `${arr[j]} > ${key}, shifting ${arr[j]} to the right`,
        action: "compare",
        highlights: [
          { indices: [j], color: "comparing" },
          { indices: [j + 1], color: "swapping" },
        ],
        data: {
          array: [...arr],
          highlights: [
            { indices: [j], color: "comparing" },
            { indices: [j + 1], color: "swapping" },
          ],
        } satisfies SortingStepData,
        variables: { i, j, key },
      });

      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;

    steps.push({
      id: stepId++,
      description: `Inserting ${key} at position ${j + 1}`,
      action: "insert",
      highlights: [{ indices: [j + 1], color: "active", label: "key" }],
      data: {
        array: [...arr],
        highlights: [{ indices: [j + 1], color: "active", label: "key" }],
      } satisfies SortingStepData,
      variables: { i, insertedAt: j + 1, key },
    });
  }

  const allIndices = arr.map((_, i) => i);
  steps.push({
    id: stepId++,
    description: "Insertion Sort complete!",
    action: "complete",
    highlights: [{ indices: allIndices, color: "completed" }],
    data: {
      array: [...arr],
      highlights: [{ indices: allIndices, color: "completed" }],
    } satisfies SortingStepData,
  });

  return steps;
}
