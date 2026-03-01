import type { VisualizationStep } from "@/lib/visualization/types";

export interface KnapsackItem {
  id: number;
  weight: number;
  value: number;
  ratio: number;
}

export interface FractionalKnapsackStepData {
  items: KnapsackItem[];
  sortedItems: KnapsackItem[];
  currentIndex: number;
  capacity: number;
  remainingCapacity: number;
  totalValue: number;
  selections: { itemId: number; fraction: number; valueTaken: number; weightTaken: number }[];
  phase: "initial" | "computing-ratios" | "sorted" | "selecting" | "done";
  knapsackFill: number; // 0 to 1
}

export interface DefaultInput {
  items: { weight: number; value: number }[];
  capacity: number;
}

export const DEFAULT_INPUT: DefaultInput = {
  items: [
    { weight: 10, value: 60 },
    { weight: 20, value: 100 },
    { weight: 30, value: 120 },
  ],
  capacity: 50,
};

export function generateFractionalKnapsackSteps(
  input: DefaultInput = DEFAULT_INPUT,
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  let stepId = 0;

  const items: KnapsackItem[] = input.items.map((item, i) => ({
    id: i,
    weight: item.weight,
    value: item.value,
    ratio: item.value / item.weight,
  }));

  const capacity = input.capacity;

  // Step 1: Show items
  steps.push({
    id: stepId++,
    description: `We have ${items.length} items and a knapsack with capacity ${capacity}. Goal: maximize total value. We can take fractions of items.`,
    action: "highlight",
    highlights: [],
    data: {
      items,
      sortedItems: items,
      currentIndex: -1,
      capacity,
      remainingCapacity: capacity,
      totalValue: 0,
      selections: [],
      phase: "initial",
      knapsackFill: 0,
    } satisfies FractionalKnapsackStepData,
  });

  // Step 2: Compute ratios
  steps.push({
    id: stepId++,
    description: `Compute value/weight ratio for each item: ${items.map((item) => `Item ${item.id}: ${item.value}/${item.weight} = ${item.ratio.toFixed(1)}`).join(", ")}. The ratio tells us the value per unit weight.`,
    action: "compare",
    highlights: [],
    data: {
      items,
      sortedItems: items,
      currentIndex: -1,
      capacity,
      remainingCapacity: capacity,
      totalValue: 0,
      selections: [],
      phase: "computing-ratios",
      knapsackFill: 0,
    } satisfies FractionalKnapsackStepData,
  });

  // Step 3: Sort by ratio
  const sorted = [...items].sort((a, b) => b.ratio - a.ratio);

  steps.push({
    id: stepId++,
    description: `Sort items by ratio (descending): ${sorted.map((item) => `Item ${item.id} (ratio=${item.ratio.toFixed(1)})`).join(", ")}. We will greedily take items with the highest ratio first.`,
    action: "compare",
    highlights: [],
    data: {
      items,
      sortedItems: sorted,
      currentIndex: -1,
      capacity,
      remainingCapacity: capacity,
      totalValue: 0,
      selections: [],
      phase: "sorted",
      knapsackFill: 0,
    } satisfies FractionalKnapsackStepData,
  });

  // Step 4+: Greedy selection
  let remaining = capacity;
  let totalValue = 0;
  const selections: { itemId: number; fraction: number; valueTaken: number; weightTaken: number }[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const item = sorted[i];

    if (remaining <= 0) {
      steps.push({
        id: stepId++,
        description: `Knapsack is full! Remaining capacity = 0. Skip Item ${item.id} (w=${item.weight}, v=${item.value}).`,
        action: "compare",
        highlights: [],
        data: {
          items,
          sortedItems: sorted,
          currentIndex: i,
          capacity,
          remainingCapacity: remaining,
          totalValue,
          selections: [...selections],
          phase: "selecting",
          knapsackFill: (capacity - remaining) / capacity,
        } satisfies FractionalKnapsackStepData,
      });
      continue;
    }

    if (item.weight <= remaining) {
      // Take whole item
      selections.push({
        itemId: item.id,
        fraction: 1.0,
        valueTaken: item.value,
        weightTaken: item.weight,
      });
      totalValue += item.value;
      remaining -= item.weight;

      steps.push({
        id: stepId++,
        description: `Item ${item.id} (w=${item.weight}, v=${item.value}, ratio=${item.ratio.toFixed(1)}): Weight ${item.weight} <= remaining capacity ${remaining + item.weight}. Take the WHOLE item! Value += ${item.value}. Remaining capacity: ${remaining}.`,
        action: "select",
        highlights: [],
        data: {
          items,
          sortedItems: sorted,
          currentIndex: i,
          capacity,
          remainingCapacity: remaining,
          totalValue,
          selections: [...selections],
          phase: "selecting",
          knapsackFill: (capacity - remaining) / capacity,
        } satisfies FractionalKnapsackStepData,
      });
    } else {
      // Take fraction
      const fraction = remaining / item.weight;
      const valueTaken = item.value * fraction;

      selections.push({
        itemId: item.id,
        fraction,
        valueTaken,
        weightTaken: remaining,
      });
      totalValue += valueTaken;
      remaining = 0;

      steps.push({
        id: stepId++,
        description: `Item ${item.id} (w=${item.weight}, v=${item.value}, ratio=${item.ratio.toFixed(1)}): Weight ${item.weight} > remaining capacity ${remaining + selections[selections.length - 1].weightTaken}. Take ${(fraction * 100).toFixed(0)}% of the item (${selections[selections.length - 1].weightTaken}/${item.weight} weight). Value += ${valueTaken.toFixed(1)}. Knapsack is now full!`,
        action: "select",
        highlights: [],
        data: {
          items,
          sortedItems: sorted,
          currentIndex: i,
          capacity,
          remainingCapacity: remaining,
          totalValue,
          selections: [...selections],
          phase: "selecting",
          knapsackFill: 1,
        } satisfies FractionalKnapsackStepData,
      });
    }
  }

  // Final step
  steps.push({
    id: stepId++,
    description: `Done! Maximum value = ${totalValue.toFixed(1)} with capacity ${capacity}. Items taken: ${selections.map((s) => `Item ${s.itemId} (${(s.fraction * 100).toFixed(0)}%)`).join(", ")}.`,
    action: "complete",
    highlights: [],
    data: {
      items,
      sortedItems: sorted,
      currentIndex: sorted.length,
      capacity,
      remainingCapacity: remaining,
      totalValue,
      selections: [...selections],
      phase: "done",
      knapsackFill: (capacity - remaining) / capacity,
    } satisfies FractionalKnapsackStepData,
  });

  return steps;
}
