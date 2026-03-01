import type {
  VisualizationStep,
  ArrayWithPointersStepData,
} from "@/lib/visualization/types";

export function generateTwoPointerSteps(
  input: number[],
  target: number
): VisualizationStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  // Initial state
  steps.push({
    id: stepId++,
    description: `Two Pointer technique: find a pair in the sorted array [${arr.join(", ")}] that sums to ${target}. We place one pointer at the start (left=0) and one at the end (right=${n - 1}).`,
    action: "highlight",
    highlights: [],
    data: {
      array: [...arr],
      pointers: { left: 0, right: n - 1 },
      highlights: [],
      currentValue: target,
    } satisfies ArrayWithPointersStepData,
    variables: { target, left: 0, right: n - 1 },
  });

  let left = 0;
  let right = n - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];

    // Show current pair being evaluated
    steps.push({
      id: stepId++,
      description: `Compute sum: arr[${left}] + arr[${right}] = ${arr[left]} + ${arr[right]} = ${sum}. Target is ${target}.`,
      action: "compare",
      highlights: [{ indices: [left, right], color: "comparing" }],
      data: {
        array: [...arr],
        pointers: { left, right },
        highlights: [{ indices: [left, right], color: "comparing" }],
        currentValue: sum,
      } satisfies ArrayWithPointersStepData,
      variables: { target, left, right, sum },
    });

    if (sum === target) {
      // Found the pair
      steps.push({
        id: stepId++,
        description: `Sum ${sum} equals target ${target}! Pair found: (${arr[left]}, ${arr[right]}) at indices [${left}, ${right}].`,
        action: "complete",
        highlights: [{ indices: [left, right], color: "completed" }],
        data: {
          array: [...arr],
          pointers: { left, right },
          highlights: [{ indices: [left, right], color: "completed" }],
          result: [arr[left], arr[right]],
          currentValue: sum,
        } satisfies ArrayWithPointersStepData,
        variables: { target, left, right, sum, found: true },
      });
      return steps;
    } else if (sum < target) {
      // Sum too small, move left pointer right
      steps.push({
        id: stepId++,
        description: `Sum ${sum} < target ${target}. We need a larger sum, so move the left pointer right: left ${left} -> ${left + 1}.`,
        action: "move-pointer",
        highlights: [{ indices: [left], color: "active", label: "move right" }],
        data: {
          array: [...arr],
          pointers: { left, right },
          highlights: [{ indices: [left], color: "active" }],
          currentValue: sum,
        } satisfies ArrayWithPointersStepData,
        variables: { target, left, right, sum, action: "move left pointer right" },
      });
      left++;
    } else {
      // Sum too large, move right pointer left
      steps.push({
        id: stepId++,
        description: `Sum ${sum} > target ${target}. We need a smaller sum, so move the right pointer left: right ${right} -> ${right - 1}.`,
        action: "move-pointer",
        highlights: [{ indices: [right], color: "swapping", label: "move left" }],
        data: {
          array: [...arr],
          pointers: { left, right },
          highlights: [{ indices: [right], color: "swapping" }],
          currentValue: sum,
        } satisfies ArrayWithPointersStepData,
        variables: { target, left, right, sum, action: "move right pointer left" },
      });
      right--;
    }
  }

  // No pair found
  steps.push({
    id: stepId++,
    description: `Pointers have crossed (left=${left} >= right=${right}). No pair sums to ${target} in this array.`,
    action: "complete",
    highlights: [],
    data: {
      array: [...arr],
      pointers: { left, right },
      highlights: [],
      currentValue: target,
    } satisfies ArrayWithPointersStepData,
    variables: { target, left, right, found: false },
  });

  return steps;
}
