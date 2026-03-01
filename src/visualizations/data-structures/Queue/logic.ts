import type { VisualizationStep } from "@/lib/visualization/types";

export interface QueueStepData {
  queue: number[];
  operation: string;
  value?: number;
  highlights: { index: number; color: string }[];
}

export function generateQueueSteps(): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const queue: number[] = [];

  // Initial state
  steps.push({
    id: stepId++,
    description: "Starting with an empty queue. We will demonstrate enqueue, dequeue, and peek operations.",
    action: "highlight",
    highlights: [],
    data: {
      queue: [...queue],
      operation: "init",
      highlights: [],
    } satisfies QueueStepData,
    variables: { size: 0 },
  });

  // Enqueue 10
  queue.push(10);
  steps.push({
    id: stepId++,
    description: "enqueue(10) — Element 10 is added to the rear of the queue.",
    action: "enqueue",
    highlights: [{ indices: [0], color: "active" }],
    data: {
      queue: [...queue],
      operation: "enqueue",
      value: 10,
      highlights: [{ index: queue.length - 1, color: "#6366f1" }],
    } satisfies QueueStepData,
    variables: { size: queue.length, front: queue[0], rear: queue[queue.length - 1] },
  });

  // Enqueue 20
  queue.push(20);
  steps.push({
    id: stepId++,
    description: "enqueue(20) — Element 20 is added to the rear. Queue: [10, 20] (front to rear).",
    action: "enqueue",
    highlights: [{ indices: [1], color: "active" }],
    data: {
      queue: [...queue],
      operation: "enqueue",
      value: 20,
      highlights: [{ index: queue.length - 1, color: "#6366f1" }],
    } satisfies QueueStepData,
    variables: { size: queue.length, front: queue[0], rear: queue[queue.length - 1] },
  });

  // Enqueue 30
  queue.push(30);
  steps.push({
    id: stepId++,
    description: "enqueue(30) — Element 30 joins at the rear. Queue: [10, 20, 30]. FIFO order is maintained.",
    action: "enqueue",
    highlights: [{ indices: [2], color: "active" }],
    data: {
      queue: [...queue],
      operation: "enqueue",
      value: 30,
      highlights: [{ index: queue.length - 1, color: "#6366f1" }],
    } satisfies QueueStepData,
    variables: { size: queue.length, front: queue[0], rear: queue[queue.length - 1] },
  });

  // Enqueue 40
  queue.push(40);
  steps.push({
    id: stepId++,
    description: "enqueue(40) — Element 40 added. Queue now has 4 elements: [10, 20, 30, 40].",
    action: "enqueue",
    highlights: [{ indices: [3], color: "active" }],
    data: {
      queue: [...queue],
      operation: "enqueue",
      value: 40,
      highlights: [{ index: queue.length - 1, color: "#6366f1" }],
    } satisfies QueueStepData,
    variables: { size: queue.length, front: queue[0], rear: queue[queue.length - 1] },
  });

  // Dequeue → 10
  const dequeued1 = queue.shift()!;
  steps.push({
    id: stepId++,
    description: `dequeue() → ${dequeued1} — The front element (${dequeued1}) is removed. FIFO means the first enqueued element leaves first.`,
    action: "dequeue",
    highlights: [],
    data: {
      queue: [...queue],
      operation: "dequeue",
      value: dequeued1,
      highlights: queue.length > 0 ? [{ index: 0, color: "#22c55e" }] : [],
    } satisfies QueueStepData,
    variables: { size: queue.length, front: queue[0], rear: queue[queue.length - 1], returned: dequeued1 },
  });

  // Peek → 20
  const peekVal = queue[0];
  steps.push({
    id: stepId++,
    description: `peek() → ${peekVal} — Peek returns the front element without removing it. Queue remains [${queue.join(", ")}].`,
    action: "highlight",
    highlights: [{ indices: [0], color: "comparing" }],
    data: {
      queue: [...queue],
      operation: "peek",
      value: peekVal,
      highlights: [{ index: 0, color: "#f59e0b" }],
    } satisfies QueueStepData,
    variables: { size: queue.length, front: peekVal, rear: queue[queue.length - 1] },
  });

  // Dequeue → 20
  const dequeued2 = queue.shift()!;
  steps.push({
    id: stepId++,
    description: `dequeue() → ${dequeued2} — Element ${dequeued2} removed from front. Queue: [${queue.join(", ")}].`,
    action: "dequeue",
    highlights: [],
    data: {
      queue: [...queue],
      operation: "dequeue",
      value: dequeued2,
      highlights: queue.length > 0 ? [{ index: 0, color: "#22c55e" }] : [],
    } satisfies QueueStepData,
    variables: { size: queue.length, front: queue[0], rear: queue[queue.length - 1], returned: dequeued2 },
  });

  // Enqueue 50
  queue.push(50);
  steps.push({
    id: stepId++,
    description: `enqueue(50) — Element 50 is added to the rear. Queue: [${queue.join(", ")}].`,
    action: "enqueue",
    highlights: [{ indices: [queue.length - 1], color: "active" }],
    data: {
      queue: [...queue],
      operation: "enqueue",
      value: 50,
      highlights: [{ index: queue.length - 1, color: "#6366f1" }],
    } satisfies QueueStepData,
    variables: { size: queue.length, front: queue[0], rear: queue[queue.length - 1] },
  });

  // Dequeue → 30
  const dequeued3 = queue.shift()!;
  steps.push({
    id: stepId++,
    description: `dequeue() → ${dequeued3} — Element ${dequeued3} leaves from the front. Even though 50 was added most recently, ${dequeued3} (added earlier) leaves first.`,
    action: "dequeue",
    highlights: [],
    data: {
      queue: [...queue],
      operation: "dequeue",
      value: dequeued3,
      highlights: queue.length > 0 ? [{ index: 0, color: "#22c55e" }] : [],
    } satisfies QueueStepData,
    variables: { size: queue.length, front: queue[0], rear: queue[queue.length - 1], returned: dequeued3 },
  });

  // Final state
  steps.push({
    id: stepId++,
    description: `Queue operations complete. Final queue: [${queue.join(", ")}] with ${queue.length} element(s). All enqueue/dequeue operations run in O(1) time.`,
    action: "complete",
    highlights: [{ indices: queue.map((_, i) => i), color: "completed" }],
    data: {
      queue: [...queue],
      operation: "complete",
      highlights: queue.map((_, i) => ({ index: i, color: "#22c55e" })),
    } satisfies QueueStepData,
    variables: { size: queue.length },
  });

  return steps;
}
