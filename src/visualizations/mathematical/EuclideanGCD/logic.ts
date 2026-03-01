import type { VisualizationStep } from "@/lib/visualization/types";

export interface GCDStepData {
  a: number;
  b: number;
  quotient: number;
  remainder: number;
  stepRows: { a: number; b: number; quotient: number; remainder: number }[];
  currentRow: number;
  phase: "compute" | "done";
  result: number;
}

export function generateEuclideanGCDSteps(
  initialA: number,
  initialB: number
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  let a = Math.abs(initialA);
  let b = Math.abs(initialB);

  // Ensure a >= b
  if (a < b) [a, b] = [b, a];

  const stepRows: { a: number; b: number; quotient: number; remainder: number }[] = [];

  steps.push({
    id: stepId++,
    description: `Computing gcd(${a}, ${b}) using the Euclidean algorithm`,
    action: "highlight",
    highlights: [],
    data: {
      a,
      b,
      quotient: 0,
      remainder: 0,
      stepRows: [],
      currentRow: -1,
      phase: "compute",
      result: 0,
    } satisfies GCDStepData,
  });

  while (b !== 0) {
    const quotient = Math.floor(a / b);
    const remainder = a % b;

    stepRows.push({ a, b, quotient, remainder });

    steps.push({
      id: stepId++,
      description: `${a} = ${b} x ${quotient} + ${remainder}  =>  gcd(${a}, ${b}) = gcd(${b}, ${remainder})`,
      action: "compare",
      highlights: [{ indices: [stepRows.length - 1], color: "active" }],
      data: {
        a,
        b,
        quotient,
        remainder,
        stepRows: [...stepRows],
        currentRow: stepRows.length - 1,
        phase: "compute",
        result: 0,
      } satisfies GCDStepData,
    });

    a = b;
    b = remainder;
  }

  // Final step: b is 0, a is the GCD
  steps.push({
    id: stepId++,
    description: `Remainder is 0. GCD = ${a}`,
    action: "complete",
    highlights: [],
    data: {
      a,
      b: 0,
      quotient: 0,
      remainder: 0,
      stepRows: [...stepRows],
      currentRow: stepRows.length - 1,
      phase: "done",
      result: a,
    } satisfies GCDStepData,
  });

  return steps;
}
