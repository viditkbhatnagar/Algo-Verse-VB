import type { VisualizationStep, SortingStepData } from "@/lib/visualization/types";

export function generateQuickSortSteps(input: number[]): VisualizationStep[] {
  const arr = [...input];
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  steps.push({
    id: stepId++,
    description: `Starting Quick Sort with ${arr.length} elements`,
    action: "highlight",
    highlights: [],
    data: { array: [...arr], highlights: [] } satisfies SortingStepData,
  });

  function quickSort(low: number, high: number) {
    if (low >= high) {
      if (low === high) {
        steps.push({
          id: stepId++,
          description: `Single element ${arr[low]} at index ${low} is already sorted`,
          action: "complete",
          highlights: [{ indices: [low], color: "completed" }],
          data: {
            array: [...arr],
            highlights: [{ indices: [low], color: "completed" }],
          } satisfies SortingStepData,
        });
      }
      return;
    }

    const pivotIdx = partition(low, high);
    quickSort(low, pivotIdx - 1);
    quickSort(pivotIdx + 1, high);
  }

  function partition(low: number, high: number): number {
    const pivot = arr[high];

    steps.push({
      id: stepId++,
      description: `Partitioning [${low}..${high}] with pivot ${pivot} (index ${high})`,
      action: "select",
      highlights: [{ indices: [high], color: "selected", label: "pivot" }],
      data: {
        array: [...arr],
        highlights: [{ indices: [high], color: "selected", label: "pivot" }],
      } satisfies SortingStepData,
      variables: { low, high, pivot },
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        id: stepId++,
        description: `Comparing ${arr[j]} with pivot ${pivot}`,
        action: "compare",
        highlights: [
          { indices: [j], color: "comparing" },
          { indices: [high], color: "selected", label: "pivot" },
        ],
        data: {
          array: [...arr],
          highlights: [
            { indices: [j], color: "comparing" },
            { indices: [high], color: "selected", label: "pivot" },
          ],
        } satisfies SortingStepData,
        variables: { i, j, pivot },
      });

      if (arr[j] <= pivot) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            id: stepId++,
            description: `${arr[j]} ≤ ${pivot}, swapping positions ${i} and ${j}`,
            action: "swap",
            highlights: [{ indices: [i, j], color: "swapping" }],
            data: {
              array: [...arr],
              highlights: [{ indices: [i, j], color: "swapping" }],
            } satisfies SortingStepData,
          });
        }
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    steps.push({
      id: stepId++,
      description: `Placing pivot ${pivot} at its final position ${i + 1}`,
      action: "swap",
      highlights: [{ indices: [i + 1], color: "completed", label: "pivot" }],
      data: {
        array: [...arr],
        highlights: [{ indices: [i + 1], color: "completed", label: "pivot" }],
      } satisfies SortingStepData,
    });

    return i + 1;
  }

  quickSort(0, arr.length - 1);

  const allIndices = arr.map((_, i) => i);
  steps.push({
    id: stepId++,
    description: "Quick Sort complete!",
    action: "complete",
    highlights: [{ indices: allIndices, color: "completed" }],
    data: {
      array: [...arr],
      highlights: [{ indices: allIndices, color: "completed" }],
    } satisfies SortingStepData,
  });

  return steps;
}
