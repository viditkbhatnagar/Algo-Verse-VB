import type { VisualizationStep } from "@/lib/visualization/types";

export interface ArrayStepData {
  array: (number | null)[];
  capacity: number;
  size: number;
  operation: string;
  value?: number;
  targetIndex?: number;
  highlights: { index: number; color: string }[];
  shiftingIndices?: number[];
}

export function generateArraySteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const capacity = 8;
  const arr: (number | null)[] = new Array(capacity).fill(null);
  let size = 0;

  function setVal(index: number, value: number | null) {
    arr[index] = value;
  }

  // Initial state
  steps.push({
    id: stepId++,
    description: `Starting with an empty array of capacity ${capacity}. We will demonstrate access, insertion, and deletion.`,
    action: "highlight",
    highlights: [],
    data: {
      array: [...arr],
      capacity,
      size,
      operation: "init",
      highlights: [],
    } satisfies ArrayStepData,
    variables: { size, capacity },
  });

  // Insert 10 at index 0
  setVal(0, 10);
  size = 1;
  steps.push({
    id: stepId++,
    description: "insert(0, 10) — Insert 10 at index 0. No shifting needed since the array is empty.",
    action: "insert",
    highlights: [{ indices: [0], color: "active" }],
    data: {
      array: [...arr],
      capacity,
      size,
      operation: "insert",
      value: 10,
      targetIndex: 0,
      highlights: [{ index: 0, color: "#6366f1" }],
    } satisfies ArrayStepData,
    variables: { size, capacity },
  });

  // Insert 20 at index 1
  setVal(1, 20);
  size = 2;
  steps.push({
    id: stepId++,
    description: "insert(1, 20) — Insert 20 at index 1 (end). No shifting needed when inserting at the end.",
    action: "insert",
    highlights: [{ indices: [1], color: "active" }],
    data: {
      array: [...arr],
      capacity,
      size,
      operation: "insert",
      value: 20,
      targetIndex: 1,
      highlights: [{ index: 1, color: "#6366f1" }],
    } satisfies ArrayStepData,
    variables: { size, capacity },
  });

  // Insert 30 at index 2
  setVal(2, 30);
  size = 3;
  steps.push({
    id: stepId++,
    description: "insert(2, 30) — Insert 30 at the end. Array: [10, 20, 30].",
    action: "insert",
    highlights: [{ indices: [2], color: "active" }],
    data: {
      array: [...arr],
      capacity,
      size,
      operation: "insert",
      value: 30,
      targetIndex: 2,
      highlights: [{ index: 2, color: "#6366f1" }],
    } satisfies ArrayStepData,
    variables: { size, capacity },
  });

  // Insert 40 at index 3
  setVal(3, 40);
  size = 4;
  steps.push({
    id: stepId++,
    description: "insert(3, 40) — Insert 40. Array: [10, 20, 30, 40].",
    action: "insert",
    highlights: [{ indices: [3], color: "active" }],
    data: {
      array: [...arr],
      capacity,
      size,
      operation: "insert",
      value: 40,
      targetIndex: 3,
      highlights: [{ index: 3, color: "#6366f1" }],
    } satisfies ArrayStepData,
    variables: { size, capacity },
  });

  // Insert 50 at index 4
  setVal(4, 50);
  size = 5;
  steps.push({
    id: stepId++,
    description: "insert(4, 50) — Insert 50. Array: [10, 20, 30, 40, 50].",
    action: "insert",
    highlights: [{ indices: [4], color: "active" }],
    data: {
      array: [...arr],
      capacity,
      size,
      operation: "insert",
      value: 50,
      targetIndex: 4,
      highlights: [{ index: 4, color: "#6366f1" }],
    } satisfies ArrayStepData,
    variables: { size, capacity },
  });

  // Access index 2
  steps.push({
    id: stepId++,
    description: `access(2) → ${arr[2]} — Direct access by index is O(1). Address = base + 2 * element_size.`,
    action: "highlight",
    highlights: [{ indices: [2], color: "comparing" }],
    data: {
      array: [...arr],
      capacity,
      size,
      operation: "access",
      value: arr[2] as number,
      targetIndex: 2,
      highlights: [{ index: 2, color: "#f59e0b" }],
    } satisfies ArrayStepData,
    variables: { size, capacity, accessedValue: arr[2] },
  });

  // Insert 25 at index 2 — requires shifting
  // Step 1: Show elements that need to shift
  steps.push({
    id: stepId++,
    description: "insert(2, 25) — To insert at index 2, elements at indices 2-4 must shift right to make room.",
    action: "highlight",
    highlights: [{ indices: [2, 3, 4], color: "comparing" }],
    data: {
      array: [...arr],
      capacity,
      size,
      operation: "shift-right",
      value: 25,
      targetIndex: 2,
      highlights: [
        { index: 2, color: "#f59e0b" },
        { index: 3, color: "#f59e0b" },
        { index: 4, color: "#f59e0b" },
      ],
      shiftingIndices: [2, 3, 4],
    } satisfies ArrayStepData,
    variables: { size, capacity, shifting: "indices 2, 3, 4 → 3, 4, 5" },
  });

  // Step 2: After shift
  setVal(5, arr[4] as number);
  setVal(4, arr[3] as number);
  setVal(3, arr[2] as number);
  setVal(2, 25);
  size = 6;
  steps.push({
    id: stepId++,
    description: "insert(2, 25) — Elements shifted right. 25 is now at index 2. This shifting costs O(n) time.",
    action: "insert",
    highlights: [{ indices: [2], color: "active" }],
    data: {
      array: [...arr],
      capacity,
      size,
      operation: "insert",
      value: 25,
      targetIndex: 2,
      highlights: [
        { index: 2, color: "#6366f1" },
        { index: 3, color: "#22d3ee" },
        { index: 4, color: "#22d3ee" },
        { index: 5, color: "#22d3ee" },
      ],
    } satisfies ArrayStepData,
    variables: { size, capacity },
  });

  // Delete at index 1 — requires shifting
  // Step 1: Highlight element to delete
  steps.push({
    id: stepId++,
    description: `delete(1) — Removing element ${arr[1]} at index 1. Elements at indices 2-5 must shift left.`,
    action: "highlight",
    highlights: [{ indices: [1], color: "swapping" }],
    data: {
      array: [...arr],
      capacity,
      size,
      operation: "shift-left",
      value: arr[1] as number,
      targetIndex: 1,
      highlights: [
        { index: 1, color: "#ef4444" },
        { index: 2, color: "#f59e0b" },
        { index: 3, color: "#f59e0b" },
        { index: 4, color: "#f59e0b" },
        { index: 5, color: "#f59e0b" },
      ],
      shiftingIndices: [2, 3, 4, 5],
    } satisfies ArrayStepData,
    variables: { size, capacity, deleting: arr[1] },
  });

  // Step 2: After shift
  const deletedVal = arr[1];
  for (let i = 1; i < size - 1; i++) {
    arr[i] = arr[i + 1];
  }
  arr[size - 1] = null;
  size = 5;
  steps.push({
    id: stepId++,
    description: `delete(1) — ${deletedVal} removed. Elements shifted left to fill the gap. Array: [${arr.slice(0, size).join(", ")}]. Deletion at an arbitrary index is O(n).`,
    action: "remove",
    highlights: [],
    data: {
      array: [...arr],
      capacity,
      size,
      operation: "delete",
      value: deletedVal as number,
      targetIndex: 1,
      highlights: arr.slice(0, size).map((_, i) => ({
        index: i,
        color: i >= 1 ? "#22d3ee" : "#475569",
      })),
    } satisfies ArrayStepData,
    variables: { size, capacity, deleted: deletedVal },
  });

  // Access last element — O(1)
  steps.push({
    id: stepId++,
    description: `access(${size - 1}) → ${arr[size - 1]} — Accessing the last element is still O(1) with direct indexing.`,
    action: "highlight",
    highlights: [{ indices: [size - 1], color: "comparing" }],
    data: {
      array: [...arr],
      capacity,
      size,
      operation: "access",
      value: arr[size - 1] as number,
      targetIndex: size - 1,
      highlights: [{ index: size - 1, color: "#f59e0b" }],
    } satisfies ArrayStepData,
    variables: { size, capacity },
  });

  // Final state
  steps.push({
    id: stepId++,
    description: `Array operations complete. Final array: [${arr.slice(0, size).join(", ")}], size=${size}, capacity=${capacity}. Key takeaway: O(1) access, O(n) insert/delete at arbitrary positions.`,
    action: "complete",
    highlights: [{ indices: Array.from({ length: size }, (_, i) => i), color: "completed" }],
    data: {
      array: [...arr],
      capacity,
      size,
      operation: "complete",
      highlights: Array.from({ length: size }, (_, i) => ({ index: i, color: "#22c55e" })),
    } satisfies ArrayStepData,
    variables: { size, capacity },
  });

  return steps;
}
