import type { VisualizationStep, HighlightInfo } from "@/lib/visualization/types";

export interface NaiveStringMatchStepData {
  text: string;
  pattern: string;
  offset: number; // current alignment position
  compareIndex: number; // which char in pattern we're comparing (-1 = not comparing)
  matchedIndices: number[]; // indices in text where pattern was found
  charStates: Record<number, "match" | "mismatch" | "comparing" | "idle">;
  phase: "shift" | "compare" | "match-found" | "no-match" | "done";
}

export function generateNaiveStringMatchSteps(
  text: string,
  pattern: string
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;
  const n = text.length;
  const m = pattern.length;
  const matchedIndices: number[] = [];

  if (m === 0 || n === 0 || m > n) {
    steps.push({
      id: stepId++,
      description: "Invalid input: pattern is empty or longer than text",
      action: "highlight",
      highlights: [],
      data: {
        text,
        pattern,
        offset: 0,
        compareIndex: -1,
        matchedIndices: [],
        charStates: {},
        phase: "done",
      } satisfies NaiveStringMatchStepData,
    });
    return steps;
  }

  // Initial step
  steps.push({
    id: stepId++,
    description: `Starting Naive String Matching: find "${pattern}" in "${text}"`,
    action: "highlight",
    highlights: [],
    data: {
      text,
      pattern,
      offset: 0,
      compareIndex: -1,
      matchedIndices: [],
      charStates: {},
      phase: "shift",
    } satisfies NaiveStringMatchStepData,
  });

  for (let i = 0; i <= n - m; i++) {
    // Shift step
    steps.push({
      id: stepId++,
      description: `Align pattern at position ${i} in text`,
      action: "highlight",
      highlights: [{ indices: [i], color: "active" }],
      data: {
        text,
        pattern,
        offset: i,
        compareIndex: -1,
        matchedIndices: [...matchedIndices],
        charStates: {},
        phase: "shift",
      } satisfies NaiveStringMatchStepData,
    });

    let j = 0;
    let fullMatch = true;

    while (j < m) {
      const charStates: Record<number, "match" | "mismatch" | "comparing" | "idle"> = {};

      // Mark all previously compared chars as match
      for (let k = 0; k < j; k++) {
        charStates[i + k] = "match";
      }
      charStates[i + j] = "comparing";

      if (text[i + j] === pattern[j]) {
        // Compare — match
        steps.push({
          id: stepId++,
          description: `Position ${i}+${j}: text[${i + j}]='${text[i + j]}' = pattern[${j}]='${pattern[j]}' — Match!`,
          action: "compare",
          highlights: [{ indices: [i + j], color: "completed" }],
          data: {
            text,
            pattern,
            offset: i,
            compareIndex: j,
            matchedIndices: [...matchedIndices],
            charStates: { ...charStates, [i + j]: "match" },
            phase: "compare",
          } satisfies NaiveStringMatchStepData,
        });
        j++;
      } else {
        // Compare — mismatch
        steps.push({
          id: stepId++,
          description: `Position ${i}+${j}: text[${i + j}]='${text[i + j]}' != pattern[${j}]='${pattern[j]}' — Mismatch! Slide pattern right.`,
          action: "compare",
          highlights: [{ indices: [i + j], color: "swapping" }],
          data: {
            text,
            pattern,
            offset: i,
            compareIndex: j,
            matchedIndices: [...matchedIndices],
            charStates: { ...charStates, [i + j]: "mismatch" },
            phase: "no-match",
          } satisfies NaiveStringMatchStepData,
        });
        fullMatch = false;
        break;
      }
    }

    if (fullMatch && j === m) {
      matchedIndices.push(i);
      steps.push({
        id: stepId++,
        description: `Pattern found at index ${i}! All ${m} characters matched.`,
        action: "complete",
        highlights: [
          {
            indices: Array.from({ length: m }, (_, k) => i + k),
            color: "completed",
          },
        ],
        data: {
          text,
          pattern,
          offset: i,
          compareIndex: m - 1,
          matchedIndices: [...matchedIndices],
          charStates: Object.fromEntries(
            Array.from({ length: m }, (_, k) => [i + k, "match" as const])
          ),
          phase: "match-found",
        } satisfies NaiveStringMatchStepData,
      });
    }
  }

  // Final step
  steps.push({
    id: stepId++,
    description:
      matchedIndices.length > 0
        ? `Naive String Matching complete! Found ${matchedIndices.length} match(es) at index(es): ${matchedIndices.join(", ")}`
        : `Naive String Matching complete! No matches found.`,
    action: "complete",
    highlights: [],
    data: {
      text,
      pattern,
      offset: n - m,
      compareIndex: -1,
      matchedIndices: [...matchedIndices],
      charStates: {},
      phase: "done",
    } satisfies NaiveStringMatchStepData,
  });

  return steps;
}
