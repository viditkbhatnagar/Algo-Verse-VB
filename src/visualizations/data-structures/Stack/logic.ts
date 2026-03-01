import type { VisualizationStep } from "@/lib/visualization/types";

export interface StackStepData {
  stack: number[];
  operation: string;
  value?: number;
  highlights: { index: number; color: string }[];
}

export function generateStackSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const stack: number[] = [];

  // Initial state
  steps.push({
    id: stepId++,
    description: "Starting with an empty stack. We will demonstrate push, pop, and peek operations.",
    action: "highlight",
    highlights: [],
    data: {
      stack: [...stack],
      operation: "init",
      highlights: [],
    } satisfies StackStepData,
    variables: { size: 0 },
  });

  // Push 10
  stack.push(10);
  steps.push({
    id: stepId++,
    description: "push(10) — Element 10 is added to the top of the stack.",
    action: "push",
    highlights: [{ indices: [0], color: "active" }],
    data: {
      stack: [...stack],
      operation: "push",
      value: 10,
      highlights: [{ index: stack.length - 1, color: "#6366f1" }],
    } satisfies StackStepData,
    variables: { size: stack.length, top: 10 },
  });

  // Push 20
  stack.push(20);
  steps.push({
    id: stepId++,
    description: "push(20) — Element 20 is placed on top of 10. Stack grows upward (LIFO).",
    action: "push",
    highlights: [{ indices: [1], color: "active" }],
    data: {
      stack: [...stack],
      operation: "push",
      value: 20,
      highlights: [{ index: stack.length - 1, color: "#6366f1" }],
    } satisfies StackStepData,
    variables: { size: stack.length, top: 20 },
  });

  // Push 30
  stack.push(30);
  steps.push({
    id: stepId++,
    description: "push(30) — Element 30 is now on top. The stack contains [10, 20, 30] from bottom to top.",
    action: "push",
    highlights: [{ indices: [2], color: "active" }],
    data: {
      stack: [...stack],
      operation: "push",
      value: 30,
      highlights: [{ index: stack.length - 1, color: "#6366f1" }],
    } satisfies StackStepData,
    variables: { size: stack.length, top: 30 },
  });

  // Push 40
  stack.push(40);
  steps.push({
    id: stepId++,
    description: "push(40) — Element 40 is added on top. Four elements are now in the stack.",
    action: "push",
    highlights: [{ indices: [3], color: "active" }],
    data: {
      stack: [...stack],
      operation: "push",
      value: 40,
      highlights: [{ index: stack.length - 1, color: "#6366f1" }],
    } satisfies StackStepData,
    variables: { size: stack.length, top: 40 },
  });

  // Pop → 40
  const popped1 = stack.pop()!;
  steps.push({
    id: stepId++,
    description: `pop() → ${popped1} — The top element (${popped1}) is removed. LIFO means the last pushed element is the first to leave.`,
    action: "pop",
    highlights: [],
    data: {
      stack: [...stack],
      operation: "pop",
      value: popped1,
      highlights: stack.length > 0 ? [{ index: stack.length - 1, color: "#22c55e" }] : [],
    } satisfies StackStepData,
    variables: { size: stack.length, top: stack[stack.length - 1], returned: popped1 },
  });

  // Peek → 30
  const peekVal = stack[stack.length - 1];
  steps.push({
    id: stepId++,
    description: `peek() → ${peekVal} — Peek returns the top element without removing it. The stack is unchanged.`,
    action: "highlight",
    highlights: [{ indices: [stack.length - 1], color: "comparing" }],
    data: {
      stack: [...stack],
      operation: "peek",
      value: peekVal,
      highlights: [{ index: stack.length - 1, color: "#f59e0b" }],
    } satisfies StackStepData,
    variables: { size: stack.length, top: peekVal },
  });

  // Pop → 30
  const popped2 = stack.pop()!;
  steps.push({
    id: stepId++,
    description: `pop() → ${popped2} — Element ${popped2} is removed from the top. Two elements remain.`,
    action: "pop",
    highlights: [],
    data: {
      stack: [...stack],
      operation: "pop",
      value: popped2,
      highlights: stack.length > 0 ? [{ index: stack.length - 1, color: "#22c55e" }] : [],
    } satisfies StackStepData,
    variables: { size: stack.length, top: stack[stack.length - 1], returned: popped2 },
  });

  // Push 50
  stack.push(50);
  steps.push({
    id: stepId++,
    description: "push(50) — Element 50 is pushed onto the stack. The stack now holds [10, 20, 50].",
    action: "push",
    highlights: [{ indices: [stack.length - 1], color: "active" }],
    data: {
      stack: [...stack],
      operation: "push",
      value: 50,
      highlights: [{ index: stack.length - 1, color: "#6366f1" }],
    } satisfies StackStepData,
    variables: { size: stack.length, top: 50 },
  });

  // Pop → 50
  const popped3 = stack.pop()!;
  steps.push({
    id: stepId++,
    description: `pop() → ${popped3} — The most recently pushed element (${popped3}) is removed first — that is LIFO in action.`,
    action: "pop",
    highlights: [],
    data: {
      stack: [...stack],
      operation: "pop",
      value: popped3,
      highlights: stack.length > 0 ? [{ index: stack.length - 1, color: "#22c55e" }] : [],
    } satisfies StackStepData,
    variables: { size: stack.length, top: stack[stack.length - 1], returned: popped3 },
  });

  // Final state
  steps.push({
    id: stepId++,
    description: `Stack operations complete. Final stack: [${stack.join(", ")}] with ${stack.length} element(s). All push/pop operations run in O(1) time.`,
    action: "complete",
    highlights: [{ indices: stack.map((_, i) => i), color: "completed" }],
    data: {
      stack: [...stack],
      operation: "complete",
      highlights: stack.map((_, i) => ({ index: i, color: "#22c55e" })),
    } satisfies StackStepData,
    variables: { size: stack.length },
  });

  return steps;
}
