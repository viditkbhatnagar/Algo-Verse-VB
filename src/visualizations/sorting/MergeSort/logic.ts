import type { VisualizationStep, SortingStepData } from "@/lib/visualization/types";

export function generateMergeSortSteps(input: number[]): VisualizationStep[] {
  const arr = [...input];
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  steps.push({
    id: stepId++,
    description: `Starting Merge Sort with ${arr.length} elements`,
    action: "highlight",
    highlights: [],
    data: { array: [...arr], highlights: [], subarrays: [] } satisfies SortingStepData,
  });

  function mergeSort(start: number, end: number) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);

    steps.push({
      id: stepId++,
      description: `Splitting [${start}..${end}] into [${start}..${mid}] and [${mid + 1}..${end}]`,
      action: "split",
      highlights: [{ indices: [mid], color: "active", label: "mid" }],
      data: {
        array: [...arr],
        highlights: [{ indices: [mid], color: "active" }],
        subarrays: [
          { startIndex: start, endIndex: mid, level: 0, label: "left" },
          { startIndex: mid + 1, endIndex: end, level: 0, label: "right" },
        ],
      } satisfies SortingStepData,
      variables: { start, mid, end },
    });

    mergeSort(start, mid);
    mergeSort(mid + 1, end);
    merge(start, mid, end);
  }

  function merge(start: number, mid: number, end: number) {
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);

    steps.push({
      id: stepId++,
      description: `Merging [${left.join(", ")}] and [${right.join(", ")}]`,
      action: "merge",
      highlights: [
        { indices: range(start, mid), color: "active" },
        { indices: range(mid + 1, end), color: "comparing" },
      ],
      data: {
        array: [...arr],
        highlights: [
          { indices: range(start, mid), color: "active" },
          { indices: range(mid + 1, end), color: "comparing" },
        ],
      } satisfies SortingStepData,
    });

    let i = 0,
      j = 0,
      k = start;

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        steps.push({
          id: stepId++,
          description: `${left[i]} ≤ ${right[j]}, placing ${left[i]} at position ${k}`,
          action: "compare",
          highlights: [{ indices: [k], color: "selected" }],
          data: {
            array: [...arr],
            highlights: [{ indices: [k], color: "selected" }],
          } satisfies SortingStepData,
        });
        i++;
      } else {
        arr[k] = right[j];
        steps.push({
          id: stepId++,
          description: `${right[j]} < ${left[i]}, placing ${right[j]} at position ${k}`,
          action: "compare",
          highlights: [{ indices: [k], color: "selected" }],
          data: {
            array: [...arr],
            highlights: [{ indices: [k], color: "selected" }],
          } satisfies SortingStepData,
        });
        j++;
      }
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      steps.push({
        id: stepId++,
        description: `Placing remaining element ${left[i]} at position ${k}`,
        action: "insert",
        highlights: [{ indices: [k], color: "selected" }],
        data: {
          array: [...arr],
          highlights: [{ indices: [k], color: "selected" }],
        } satisfies SortingStepData,
      });
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      steps.push({
        id: stepId++,
        description: `Placing remaining element ${right[j]} at position ${k}`,
        action: "insert",
        highlights: [{ indices: [k], color: "selected" }],
        data: {
          array: [...arr],
          highlights: [{ indices: [k], color: "selected" }],
        } satisfies SortingStepData,
      });
      j++;
      k++;
    }

    steps.push({
      id: stepId++,
      description: `Merged subarray [${start}..${end}]: [${arr.slice(start, end + 1).join(", ")}]`,
      action: "complete",
      highlights: [{ indices: range(start, end), color: "completed" }],
      data: {
        array: [...arr],
        highlights: [{ indices: range(start, end), color: "completed" }],
      } satisfies SortingStepData,
    });
  }

  mergeSort(0, arr.length - 1);

  const allIndices = arr.map((_, i) => i);
  steps.push({
    id: stepId++,
    description: "Merge Sort complete!",
    action: "complete",
    highlights: [{ indices: allIndices, color: "completed" }],
    data: {
      array: [...arr],
      highlights: [{ indices: allIndices, color: "completed" }],
    } satisfies SortingStepData,
  });

  return steps;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
