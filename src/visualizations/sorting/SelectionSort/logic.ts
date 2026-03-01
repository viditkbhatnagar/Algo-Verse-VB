import type { VisualizationStep, SortingStepData } from "@/lib/visualization/types";

export function generateSelectionSortSteps(input: number[]): VisualizationStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  steps.push({
    id: stepId++,
    description: `Starting Selection Sort with ${n} elements`,
    action: "highlight",
    highlights: [],
    data: { array: [...arr], highlights: [] } satisfies SortingStepData,
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      id: stepId++,
      description: `Looking for minimum in unsorted region [${i}..${n - 1}]`,
      action: "select",
      highlights: [{ indices: [i], color: "active", label: "min" }],
      data: {
        array: [...arr],
        highlights: [{ indices: [i], color: "active", label: "min" }],
      } satisfies SortingStepData,
      variables: { i, minIdx },
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        id: stepId++,
        description: `Comparing ${arr[j]} with current minimum ${arr[minIdx]}`,
        action: "compare",
        highlights: [
          { indices: [minIdx], color: "selected", label: "min" },
          { indices: [j], color: "comparing" },
        ],
        data: {
          array: [...arr],
          highlights: [
            { indices: [minIdx], color: "selected", label: "min" },
            { indices: [j], color: "comparing" },
          ],
        } satisfies SortingStepData,
        variables: { i, j, minIdx },
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          id: stepId++,
          description: `New minimum found: ${arr[minIdx]} at index ${minIdx}`,
          action: "select",
          highlights: [{ indices: [minIdx], color: "selected", label: "min" }],
          data: {
            array: [...arr],
            highlights: [{ indices: [minIdx], color: "selected", label: "min" }],
          } satisfies SortingStepData,
          variables: { i, minIdx },
        });
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      steps.push({
        id: stepId++,
        description: `Swapping ${arr[minIdx]} (pos ${minIdx}) with ${arr[i]} (pos ${i})`,
        action: "swap",
        highlights: [{ indices: [i, minIdx], color: "swapping" }],
        data: {
          array: [...arr],
          highlights: [{ indices: [i, minIdx], color: "swapping" }],
        } satisfies SortingStepData,
      });
    }

    steps.push({
      id: stepId++,
      description: `${arr[i]} placed at position ${i}`,
      action: "complete",
      highlights: [{ indices: [i], color: "completed" }],
      data: {
        array: [...arr],
        highlights: [{ indices: [i], color: "completed" }],
      } satisfies SortingStepData,
    });
  }

  const allIndices = arr.map((_, i) => i);
  steps.push({
    id: stepId++,
    description: "Selection Sort complete!",
    action: "complete",
    highlights: [{ indices: allIndices, color: "completed" }],
    data: {
      array: [...arr],
      highlights: [{ indices: allIndices, color: "completed" }],
    } satisfies SortingStepData,
  });

  return steps;
}
