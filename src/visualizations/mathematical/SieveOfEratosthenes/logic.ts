import type { VisualizationStep, HighlightColor } from "@/lib/visualization/types";

export interface SieveStepData {
  n: number;
  grid: (number | string | null)[][];
  cellHighlights: Record<string, HighlightColor>;
  currentPrime: number;
  currentMultiple: number;
  primes: number[];
  composites: Set<number>;
  phase: "start" | "mark-prime" | "mark-composite" | "next-prime" | "done";
}

function numToGridPos(num: number, cols: number): [number, number] {
  const idx = num - 2; // 0-indexed starting from 2
  return [Math.floor(idx / cols), idx % cols];
}

function cellKey(r: number, c: number): string {
  return `${r}-${c}`;
}

export function generateSieveSteps(n: number): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const cols = Math.ceil(Math.sqrt(n - 1));
  const totalNumbers = n - 1; // numbers 2 to n
  const rows = Math.ceil(totalNumbers / cols);

  // Build grid: numbers 2 to n
  const grid: (number | string | null)[][] = [];
  let num = 2;
  for (let r = 0; r < rows; r++) {
    const row: (number | null)[] = [];
    for (let c = 0; c < cols; c++) {
      if (num <= n) {
        row.push(num);
        num++;
      } else {
        row.push(null);
      }
    }
    grid.push(row);
  }

  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  const composites = new Set<number>();
  const primes: number[] = [];

  // Build highlights helper
  function buildHighlights(): Record<string, HighlightColor> {
    const h: Record<string, HighlightColor> = {};
    for (let i = 2; i <= n; i++) {
      const [r, c] = numToGridPos(i, cols);
      if (composites.has(i)) {
        h[cellKey(r, c)] = "swapping"; // red for composite
      } else if (primes.includes(i)) {
        h[cellKey(r, c)] = "completed"; // green for confirmed prime
      }
    }
    return h;
  }

  // Initial step
  steps.push({
    id: stepId++,
    description: `Sieve of Eratosthenes: find all primes up to ${n}. All numbers start as potential primes.`,
    action: "highlight",
    highlights: [],
    data: {
      n,
      grid,
      cellHighlights: {},
      currentPrime: 0,
      currentMultiple: 0,
      primes: [],
      composites: new Set(),
      phase: "start",
    } satisfies SieveStepData,
  });

  for (let p = 2; p * p <= n; p++) {
    if (!isPrime[p]) continue;

    primes.push(p);
    const [pr, pc] = numToGridPos(p, cols);

    // Mark p as prime
    const hlPrime = buildHighlights();
    hlPrime[cellKey(pr, pc)] = "completed";

    steps.push({
      id: stepId++,
      description: `${p} is prime! Now mark all multiples of ${p} as composite.`,
      action: "select",
      highlights: [{ indices: [p], color: "completed" }],
      data: {
        n,
        grid,
        cellHighlights: { ...hlPrime },
        currentPrime: p,
        currentMultiple: 0,
        primes: [...primes],
        composites: new Set(composites),
        phase: "mark-prime",
      } satisfies SieveStepData,
    });

    // Mark multiples
    const newComposites: number[] = [];
    for (let mult = p * p; mult <= n; mult += p) {
      if (!composites.has(mult)) {
        composites.add(mult);
        isPrime[mult] = false;
        newComposites.push(mult);
      }
    }

    if (newComposites.length > 0) {
      // Show marking composites in batches (group them to avoid too many steps)
      const batchSize = Math.max(1, Math.floor(newComposites.length / 3));
      for (let bi = 0; bi < newComposites.length; bi += batchSize) {
        const batch = newComposites.slice(bi, bi + batchSize);
        const hlComp = buildHighlights();

        // Highlight current batch being marked
        for (const mult of batch) {
          const [mr, mc] = numToGridPos(mult, cols);
          hlComp[cellKey(mr, mc)] = "comparing"; // yellow for currently being marked
        }

        steps.push({
          id: stepId++,
          description: `Marking multiples of ${p}: ${batch.join(", ")} as composite`,
          action: "remove",
          highlights: [{ indices: batch, color: "swapping" }],
          data: {
            n,
            grid,
            cellHighlights: hlComp,
            currentPrime: p,
            currentMultiple: batch[batch.length - 1],
            primes: [...primes],
            composites: new Set(composites),
            phase: "mark-composite",
          } satisfies SieveStepData,
        });
      }
    }
  }

  // Collect remaining primes
  for (let i = 2; i <= n; i++) {
    if (isPrime[i] && !primes.includes(i)) {
      primes.push(i);
    }
  }

  // Final highlights: all primes green
  const finalHL: Record<string, HighlightColor> = {};
  for (let i = 2; i <= n; i++) {
    const [r, c] = numToGridPos(i, cols);
    if (isPrime[i]) {
      finalHL[cellKey(r, c)] = "completed";
    } else {
      finalHL[cellKey(r, c)] = "swapping";
    }
  }

  steps.push({
    id: stepId++,
    description: `Sieve complete! Found ${primes.length} primes up to ${n}: ${primes.join(", ")}`,
    action: "complete",
    highlights: [],
    data: {
      n,
      grid,
      cellHighlights: finalHL,
      currentPrime: 0,
      currentMultiple: 0,
      primes: [...primes],
      composites: new Set(composites),
      phase: "done",
    } satisfies SieveStepData,
  });

  return steps;
}
