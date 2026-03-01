import type { VisualizationStep, SortingStepData } from "@/lib/visualization/types";

export function generateHeapSortSteps(input: number[]): VisualizationStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  steps.push({
    id: stepId++,
    description: `Starting Heap Sort with ${n} elements`,
    action: "highlight",
    highlights: [],
    data: { array: [...arr], highlights: [], heapSize: n } satisfies SortingStepData,
  });

  // Build max heap
  steps.push({
    id: stepId++,
    description: "Phase 1: Building max heap",
    action: "highlight",
    highlights: [],
    data: { array: [...arr], highlights: [], heapSize: n } satisfies SortingStepData,
  });

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  steps.push({
    id: stepId++,
    description: `Max heap built! Root = ${arr[0]} (maximum)`,
    action: "complete",
    highlights: [{ indices: [0], color: "active", label: "max" }],
    data: {
      array: [...arr],
      highlights: [{ indices: [0], color: "active", label: "max" }],
      heapSize: n,
    } satisfies SortingStepData,
  });

  // Extract elements
  steps.push({
    id: stepId++,
    description: "Phase 2: Extracting elements from heap",
    action: "highlight",
    highlights: [],
    data: { array: [...arr], highlights: [], heapSize: n } satisfies SortingStepData,
  });

  for (let i = n - 1; i > 0; i--) {
    steps.push({
      id: stepId++,
      description: `Swapping root ${arr[0]} with last unsorted element ${arr[i]}`,
      action: "swap",
      highlights: [{ indices: [0, i], color: "swapping" }],
      data: {
        array: [...arr],
        highlights: [{ indices: [0, i], color: "swapping" }],
        heapSize: i,
      } satisfies SortingStepData,
    });

    [arr[0], arr[i]] = [arr[i], arr[0]];

    steps.push({
      id: stepId++,
      description: `${arr[i]} placed at final position ${i}`,
      action: "complete",
      highlights: [{ indices: [i], color: "completed" }],
      data: {
        array: [...arr],
        highlights: [{ indices: [i], color: "completed" }],
        heapSize: i,
      } satisfies SortingStepData,
    });

    heapify(arr, i, 0);
  }

  const allIndices = arr.map((_, i) => i);
  steps.push({
    id: stepId++,
    description: "Heap Sort complete!",
    action: "complete",
    highlights: [{ indices: allIndices, color: "completed" }],
    data: {
      array: [...arr],
      highlights: [{ indices: allIndices, color: "completed" }],
    } satisfies SortingStepData,
  });

  return steps;

  function heapify(a: number[], size: number, root: number) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      steps.push({
        id: stepId++,
        description: `Comparing ${a[root]} (parent) with ${a[left]} (left child)`,
        action: "compare",
        highlights: [
          { indices: [root], color: "active", label: "parent" },
          { indices: [left], color: "comparing", label: "left" },
        ],
        data: {
          array: [...a],
          highlights: [
            { indices: [root], color: "active" },
            { indices: [left], color: "comparing" },
          ],
          heapSize: size,
        } satisfies SortingStepData,
      });

      if (a[left] > a[largest]) largest = left;
    }

    if (right < size) {
      steps.push({
        id: stepId++,
        description: `Comparing ${a[largest]} with ${a[right]} (right child)`,
        action: "compare",
        highlights: [
          { indices: [largest], color: "active" },
          { indices: [right], color: "comparing", label: "right" },
        ],
        data: {
          array: [...a],
          highlights: [
            { indices: [largest], color: "active" },
            { indices: [right], color: "comparing" },
          ],
          heapSize: size,
        } satisfies SortingStepData,
      });

      if (a[right] > a[largest]) largest = right;
    }

    if (largest !== root) {
      steps.push({
        id: stepId++,
        description: `Swapping ${a[root]} with ${a[largest]} to maintain heap property`,
        action: "swap",
        highlights: [{ indices: [root, largest], color: "swapping" }],
        data: {
          array: [...a],
          highlights: [{ indices: [root, largest], color: "swapping" }],
          heapSize: size,
        } satisfies SortingStepData,
      });

      [a[root], a[largest]] = [a[largest], a[root]];
      heapify(a, size, largest);
    }
  }
}
