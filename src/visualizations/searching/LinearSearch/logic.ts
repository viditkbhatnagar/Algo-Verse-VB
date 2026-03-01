import type { VisualizationStep, SearchStepData } from "@/lib/visualization/types";

export function generateLinearSearchSteps(
  input: number[],
  target: number
): VisualizationStep[] {
  const arr = [...input];
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  steps.push({
    id: stepId++,
    description: `Starting Linear Search for ${target} in array of ${arr.length} elements`,
    action: "highlight",
    highlights: [],
    data: {
      array: [...arr],
      target,
      currentIndex: -1,
      eliminated: [],
      found: false,
      checked: [],
    } satisfies SearchStepData,
  });

  const checked: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    steps.push({
      id: stepId++,
      description: `Checking index ${i}: ${arr[i]} ${arr[i] === target ? "==" : "!="} ${target}`,
      action: "compare",
      highlights: [{ indices: [i], color: "active" }],
      data: {
        array: [...arr],
        target,
        currentIndex: i,
        eliminated: [],
        found: false,
        checked: [...checked],
      } satisfies SearchStepData,
    });

    if (arr[i] === target) {
      steps.push({
        id: stepId++,
        description: `Found ${target} at index ${i}!`,
        action: "complete",
        highlights: [{ indices: [i], color: "completed" }],
        data: {
          array: [...arr],
          target,
          currentIndex: i,
          eliminated: [],
          found: true,
          checked: [...checked, i],
        } satisfies SearchStepData,
      });
      return steps;
    }

    checked.push(i);
  }

  steps.push({
    id: stepId++,
    description: `${target} not found in the array`,
    action: "complete",
    highlights: [],
    data: {
      array: [...arr],
      target,
      currentIndex: -1,
      eliminated: [],
      found: false,
      checked: [...checked],
    } satisfies SearchStepData,
  });

  return steps;
}
