import type { VisualizationStep } from "@/lib/visualization/types";

export interface DynamicArrayStepData {
  array: (number | null)[];
  size: number;
  capacity: number;
  operation: string;
  value?: number;
  highlights: { index: number; color: string }[];
  /** During resize, the old array is shown alongside the new */
  oldArray?: (number | null)[];
  oldCapacity?: number;
  /** Index being copied during resize animation */
  copyIndex?: number;
  isResizing?: boolean;
}

export function generateDynamicArraySteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  let capacity = 4;
  let arr: (number | null)[] = new Array(capacity).fill(null);
  let size = 0;

  // Initial state
  steps.push({
    id: stepId++,
    description: `Starting with a dynamic array of initial capacity ${capacity}. When full, the array will automatically resize by doubling.`,
    action: "highlight",
    highlights: [],
    data: {
      array: [...arr],
      size,
      capacity,
      operation: "init",
      highlights: [],
    } satisfies DynamicArrayStepData,
    variables: { size, capacity },
  });

  // Push 10
  arr[size] = 10;
  size++;
  steps.push({
    id: stepId++,
    description: "push(10) — Element 10 added. Size: 1, Capacity: 4. Plenty of room, no resize needed.",
    action: "push",
    highlights: [{ indices: [0], color: "active" }],
    data: {
      array: [...arr],
      size,
      capacity,
      operation: "push",
      value: 10,
      highlights: [{ index: 0, color: "#6366f1" }],
    } satisfies DynamicArrayStepData,
    variables: { size, capacity },
  });

  // Push 20
  arr[size] = 20;
  size++;
  steps.push({
    id: stepId++,
    description: "push(20) — Element 20 added. Size: 2, Capacity: 4. Still have room.",
    action: "push",
    highlights: [{ indices: [1], color: "active" }],
    data: {
      array: [...arr],
      size,
      capacity,
      operation: "push",
      value: 20,
      highlights: [{ index: 1, color: "#6366f1" }],
    } satisfies DynamicArrayStepData,
    variables: { size, capacity },
  });

  // Push 30
  arr[size] = 30;
  size++;
  steps.push({
    id: stepId++,
    description: "push(30) — Element 30 added. Size: 3, Capacity: 4. One slot remaining.",
    action: "push",
    highlights: [{ indices: [2], color: "active" }],
    data: {
      array: [...arr],
      size,
      capacity,
      operation: "push",
      value: 30,
      highlights: [{ index: 2, color: "#6366f1" }],
    } satisfies DynamicArrayStepData,
    variables: { size, capacity },
  });

  // Push 40 — fills the array
  arr[size] = 40;
  size++;
  steps.push({
    id: stepId++,
    description: "push(40) — Element 40 added. Size: 4, Capacity: 4. The array is now FULL! Next push will trigger a resize.",
    action: "push",
    highlights: [{ indices: [3], color: "active" }],
    data: {
      array: [...arr],
      size,
      capacity,
      operation: "push",
      value: 40,
      highlights: [
        { index: 0, color: "#f59e0b" },
        { index: 1, color: "#f59e0b" },
        { index: 2, color: "#f59e0b" },
        { index: 3, color: "#f59e0b" },
      ],
    } satisfies DynamicArrayStepData,
    variables: { size, capacity, full: true },
  });

  // Push 50 — triggers resize!
  // Step 1: Show the need to resize
  const oldArr = [...arr];
  const oldCapacity = capacity;
  steps.push({
    id: stepId++,
    description: "push(50) — Array is full (size == capacity). Must resize! Creating new array with double the capacity (4 → 8).",
    action: "highlight",
    highlights: [],
    data: {
      array: [...arr],
      size,
      capacity,
      operation: "resize-start",
      value: 50,
      highlights: arr.slice(0, size).map((_, i) => ({ index: i, color: "#f59e0b" })),
      isResizing: true,
      oldArray: [...oldArr],
      oldCapacity,
    } satisfies DynamicArrayStepData,
    variables: { size, capacity, newCapacity: capacity * 2 },
  });

  // Step 2: Copying elements (show copy in progress)
  steps.push({
    id: stepId++,
    description: "Resize: Copying all 4 elements from old array to new array of capacity 8. This copy is O(n).",
    action: "highlight",
    highlights: [],
    data: {
      array: [...arr],
      size,
      capacity: capacity * 2,
      operation: "resize-copy",
      highlights: arr.slice(0, size).map((_, i) => ({ index: i, color: "#22d3ee" })),
      isResizing: true,
      oldArray: [...oldArr],
      oldCapacity,
      copyIndex: 3,
    } satisfies DynamicArrayStepData,
    variables: { size, oldCapacity: capacity, newCapacity: capacity * 2, elementsCopied: size },
  });

  // Step 3: Resize complete, push 50
  capacity = capacity * 2;
  arr = new Array(capacity).fill(null);
  for (let i = 0; i < size; i++) {
    arr[i] = oldArr[i];
  }
  arr[size] = 50;
  size++;
  steps.push({
    id: stepId++,
    description: `Resize complete! Old array discarded. 50 added at index 4. Size: ${size}, Capacity: ${capacity}. Amortized cost of push is still O(1).`,
    action: "push",
    highlights: [{ indices: [4], color: "active" }],
    data: {
      array: [...arr],
      size,
      capacity,
      operation: "push",
      value: 50,
      highlights: [{ index: 4, color: "#6366f1" }],
    } satisfies DynamicArrayStepData,
    variables: { size, capacity },
  });

  // Push 60
  arr[size] = 60;
  size++;
  steps.push({
    id: stepId++,
    description: `push(60) — Added normally, no resize. Size: ${size}, Capacity: ${capacity}. Two empty slots remain.`,
    action: "push",
    highlights: [{ indices: [5], color: "active" }],
    data: {
      array: [...arr],
      size,
      capacity,
      operation: "push",
      value: 60,
      highlights: [{ index: 5, color: "#6366f1" }],
    } satisfies DynamicArrayStepData,
    variables: { size, capacity },
  });

  // Push 70
  arr[size] = 70;
  size++;
  steps.push({
    id: stepId++,
    description: `push(70) — Added. Size: ${size}, Capacity: ${capacity}. One slot left before another resize.`,
    action: "push",
    highlights: [{ indices: [6], color: "active" }],
    data: {
      array: [...arr],
      size,
      capacity,
      operation: "push",
      value: 70,
      highlights: [{ index: 6, color: "#6366f1" }],
    } satisfies DynamicArrayStepData,
    variables: { size, capacity },
  });

  // Push 80 — fills again
  arr[size] = 80;
  size++;
  steps.push({
    id: stepId++,
    description: `push(80) — Array full again! Size: ${size}, Capacity: ${capacity}. Next push would trigger resize to 16.`,
    action: "push",
    highlights: [{ indices: [7], color: "active" }],
    data: {
      array: [...arr],
      size,
      capacity,
      operation: "push",
      value: 80,
      highlights: arr.slice(0, size).map((_, i) => ({ index: i, color: "#f59e0b" })),
    } satisfies DynamicArrayStepData,
    variables: { size, capacity, full: true },
  });

  // Pop
  size--;
  const popped = arr[size];
  arr[size] = null;
  steps.push({
    id: stepId++,
    description: `pop() → ${popped} — Last element removed. Size: ${size}, Capacity: ${capacity}. Pop is always O(1).`,
    action: "pop",
    highlights: [],
    data: {
      array: [...arr],
      size,
      capacity,
      operation: "pop",
      value: popped as number,
      highlights: size > 0 ? [{ index: size - 1, color: "#22c55e" }] : [],
    } satisfies DynamicArrayStepData,
    variables: { size, capacity, returned: popped },
  });

  // Final state
  steps.push({
    id: stepId++,
    description: `Dynamic array demo complete. Final: [${arr.slice(0, size).join(", ")}], size=${size}, capacity=${capacity}. Key insight: doubling strategy gives O(1) amortized push despite occasional O(n) resizes.`,
    action: "complete",
    highlights: [{ indices: Array.from({ length: size }, (_, i) => i), color: "completed" }],
    data: {
      array: [...arr],
      size,
      capacity,
      operation: "complete",
      highlights: Array.from({ length: size }, (_, i) => ({ index: i, color: "#22c55e" })),
    } satisfies DynamicArrayStepData,
    variables: { size, capacity },
  });

  return steps;
}
