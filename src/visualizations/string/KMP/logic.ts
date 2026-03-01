import type { VisualizationStep } from "@/lib/visualization/types";

export interface KMPStepData {
  text: string;
  pattern: string;
  lps: number[];
  lpsBuilt: boolean; // whether we're still building lps or matching
  // LPS building phase
  lpsI?: number; // current i in lps computation
  lpsLen?: number; // current length in lps computation
  // Matching phase
  textIndex: number; // i — position in text
  patternIndex: number; // j — position in pattern
  offset: number; // alignment of pattern in text (i - j)
  charStates: Record<number, "match" | "mismatch" | "comparing" | "skip">;
  matchedIndices: number[];
  phase: "lps-build" | "lps-match" | "lps-mismatch" | "shift" | "compare" | "match-found" | "skip" | "done";
}

export function generateKMPSteps(
  text: string,
  pattern: string
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const n = text.length;
  const m = pattern.length;

  if (m === 0 || n === 0 || m > n) {
    steps.push({
      id: stepId++,
      description: "Invalid input",
      action: "highlight",
      highlights: [],
      data: {
        text, pattern, lps: [], lpsBuilt: true,
        textIndex: 0, patternIndex: 0, offset: 0,
        charStates: {}, matchedIndices: [], phase: "done",
      } satisfies KMPStepData,
    });
    return steps;
  }

  // --- Phase 1: Build LPS array ---
  const lps = new Array(m).fill(0);

  steps.push({
    id: stepId++,
    description: `Phase 1: Build the LPS (Longest Proper Prefix which is also Suffix) table for pattern "${pattern}"`,
    action: "highlight",
    highlights: [],
    data: {
      text, pattern, lps: [...lps], lpsBuilt: false,
      lpsI: 1, lpsLen: 0,
      textIndex: 0, patternIndex: 0, offset: 0,
      charStates: {}, matchedIndices: [], phase: "lps-build",
    } satisfies KMPStepData,
  });

  let len = 0;
  let i = 1;

  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;

      steps.push({
        id: stepId++,
        description: `LPS: pattern[${i}]='${pattern[i]}' == pattern[${len - 1}]='${pattern[len - 1]}' => lps[${i}] = ${len}`,
        action: "compare",
        highlights: [{ indices: [i], color: "completed" }],
        data: {
          text, pattern, lps: [...lps], lpsBuilt: false,
          lpsI: i, lpsLen: len,
          textIndex: 0, patternIndex: 0, offset: 0,
          charStates: {}, matchedIndices: [], phase: "lps-match",
        } satisfies KMPStepData,
      });

      i++;
    } else {
      if (len !== 0) {
        steps.push({
          id: stepId++,
          description: `LPS: pattern[${i}]='${pattern[i]}' != pattern[${len}]='${pattern[len]}' => fall back: len = lps[${len - 1}] = ${lps[len - 1]}`,
          action: "compare",
          highlights: [{ indices: [i], color: "swapping" }],
          data: {
            text, pattern, lps: [...lps], lpsBuilt: false,
            lpsI: i, lpsLen: len,
            textIndex: 0, patternIndex: 0, offset: 0,
            charStates: {}, matchedIndices: [], phase: "lps-mismatch",
          } satisfies KMPStepData,
        });
        len = lps[len - 1];
      } else {
        lps[i] = 0;

        steps.push({
          id: stepId++,
          description: `LPS: pattern[${i}]='${pattern[i]}' != pattern[0]='${pattern[0]}' => lps[${i}] = 0`,
          action: "compare",
          highlights: [{ indices: [i], color: "swapping" }],
          data: {
            text, pattern, lps: [...lps], lpsBuilt: false,
            lpsI: i, lpsLen: 0,
            textIndex: 0, patternIndex: 0, offset: 0,
            charStates: {}, matchedIndices: [], phase: "lps-mismatch",
          } satisfies KMPStepData,
        });

        i++;
      }
    }
  }

  steps.push({
    id: stepId++,
    description: `LPS table complete: [${lps.join(", ")}]. Starting Phase 2: Search.`,
    action: "complete",
    highlights: [],
    data: {
      text, pattern, lps: [...lps], lpsBuilt: true,
      textIndex: 0, patternIndex: 0, offset: 0,
      charStates: {}, matchedIndices: [], phase: "shift",
    } satisfies KMPStepData,
  });

  // --- Phase 2: KMP matching ---
  const matchedIndices: number[] = [];
  let ti = 0; // text index
  let pi = 0; // pattern index

  while (ti < n) {
    const charStates: Record<number, "match" | "mismatch" | "comparing" | "skip"> = {};

    // Mark previously matched chars
    const currentOffset = ti - pi;
    for (let k = 0; k < pi; k++) {
      charStates[currentOffset + k] = "match";
    }

    if (text[ti] === pattern[pi]) {
      charStates[ti] = "match";

      steps.push({
        id: stepId++,
        description: `text[${ti}]='${text[ti]}' == pattern[${pi}]='${pattern[pi]}' — Match! Advance both pointers.`,
        action: "compare",
        highlights: [{ indices: [ti], color: "completed" }],
        data: {
          text, pattern, lps: [...lps], lpsBuilt: true,
          textIndex: ti, patternIndex: pi, offset: currentOffset,
          charStates, matchedIndices: [...matchedIndices], phase: "compare",
        } satisfies KMPStepData,
      });

      ti++;
      pi++;

      if (pi === m) {
        matchedIndices.push(ti - m);

        const matchStates: Record<number, "match"> = {};
        for (let k = 0; k < m; k++) {
          matchStates[ti - m + k] = "match";
        }

        steps.push({
          id: stepId++,
          description: `Pattern found at index ${ti - m}! Using LPS: jump pattern index to lps[${m - 1}]=${lps[m - 1]}`,
          action: "complete",
          highlights: [
            {
              indices: Array.from({ length: m }, (_, k) => ti - m + k),
              color: "completed",
            },
          ],
          data: {
            text, pattern, lps: [...lps], lpsBuilt: true,
            textIndex: ti, patternIndex: m, offset: ti - m,
            charStates: matchStates, matchedIndices: [...matchedIndices],
            phase: "match-found",
          } satisfies KMPStepData,
        });

        pi = lps[m - 1];
      }
    } else {
      charStates[ti] = "mismatch";

      if (pi !== 0) {
        const skipTo = lps[pi - 1];

        steps.push({
          id: stepId++,
          description: `text[${ti}]='${text[ti]}' != pattern[${pi}]='${pattern[pi]}' — Mismatch! Use LPS: jump to lps[${pi - 1}]=${skipTo} (skip ${pi - skipTo} positions)`,
          action: "compare",
          highlights: [{ indices: [ti], color: "swapping" }],
          data: {
            text, pattern, lps: [...lps], lpsBuilt: true,
            textIndex: ti, patternIndex: pi, offset: currentOffset,
            charStates, matchedIndices: [...matchedIndices], phase: "skip",
          } satisfies KMPStepData,
        });

        pi = skipTo;
      } else {
        steps.push({
          id: stepId++,
          description: `text[${ti}]='${text[ti]}' != pattern[0]='${pattern[0]}' — Mismatch at start. Move text pointer.`,
          action: "compare",
          highlights: [{ indices: [ti], color: "swapping" }],
          data: {
            text, pattern, lps: [...lps], lpsBuilt: true,
            textIndex: ti, patternIndex: 0, offset: ti,
            charStates, matchedIndices: [...matchedIndices], phase: "compare",
          } satisfies KMPStepData,
        });

        ti++;
      }
    }
  }

  // Final
  steps.push({
    id: stepId++,
    description:
      matchedIndices.length > 0
        ? `KMP complete! Found ${matchedIndices.length} match(es) at: [${matchedIndices.join(", ")}]`
        : `KMP complete! No matches found.`,
    action: "complete",
    highlights: [],
    data: {
      text, pattern, lps: [...lps], lpsBuilt: true,
      textIndex: n, patternIndex: 0, offset: 0,
      charStates: {}, matchedIndices: [...matchedIndices], phase: "done",
    } satisfies KMPStepData,
  });

  return steps;
}
