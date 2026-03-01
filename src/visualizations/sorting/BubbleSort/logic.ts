import type { VisualizationStep, SortingStepData } from "@/lib/visualization/types";

export function generateBubbleSortSteps(input: number[]): VisualizationStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  steps.push({
    id: stepId++,
    description: `Starting Bubble Sort with ${n} elements`,
    action: "highlight",
    highlights: [],
    data: { array: [...arr], highlights: [] } satisfies SortingStepData,
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - 1 - i; j++) {
      // Compare step
      steps.push({
        id: stepId++,
        description: `Comparing ${arr[j]} and ${arr[j + 1]}`,
        action: "compare",
        highlights: [{ indices: [j, j + 1], color: "comparing" }],
        data: {
          array: [...arr],
          highlights: [{ indices: [j, j + 1], color: "comparing" }],
        } satisfies SortingStepData,
        variables: { i, j, swapped },
      });

      if (arr[j] > arr[j + 1]) {
        // Capture pre-swap values for accurate description
        const left = arr[j];
        const right = arr[j + 1];

        // Swap step
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        steps.push({
          id: stepId++,
          description: `Swapping ${left} and ${right} (${left} > ${right})`,
          action: "swap",
          highlights: [{ indices: [j, j + 1], color: "swapping" }],
          data: {
            array: [...arr],
            highlights: [{ indices: [j, j + 1], color: "swapping" }],
          } satisfies SortingStepData,
          variables: { i, j, swapped },
        });
      }
    }

    // Mark last element of this pass as completed
    steps.push({
      id: stepId++,
      description: `Pass ${i + 1} complete — ${arr[n - 1 - i]} is in its final position`,
      action: "complete",
      highlights: [{ indices: [n - 1 - i], color: "completed" }],
      data: {
        array: [...arr],
        highlights: [{ indices: [n - 1 - i], color: "completed" }],
      } satisfies SortingStepData,
    });

    if (!swapped) {
      steps.push({
        id: stepId++,
        description: "No swaps in this pass — array is sorted! (Early termination)",
        action: "complete",
        highlights: [],
        data: { array: [...arr], highlights: [] } satisfies SortingStepData,
      });
      break;
    }
  }

  // Final completion
  const allIndices = arr.map((_, i) => i);
  steps.push({
    id: stepId++,
    description: "Bubble Sort complete!",
    action: "complete",
    highlights: [{ indices: allIndices, color: "completed" }],
    data: {
      array: [...arr],
      highlights: [{ indices: allIndices, color: "completed" }],
    } satisfies SortingStepData,
  });

  return steps;
}
