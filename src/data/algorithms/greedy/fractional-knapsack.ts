import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const fractionalKnapsack: AlgorithmMetadata = {
  id: "fractional-knapsack",
  name: "Fractional Knapsack",
  category: "greedy",
  subcategory: "Optimization",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    note: "Dominated by sorting items by value-to-weight ratio. The greedy selection loop is O(n).",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(n)",
    note: "O(1) extra space if sorting in-place. O(n) if creating a sorted copy of the items array.",
  },
  description: `The Fractional Knapsack problem is a classic optimization problem where you are given a set of items, each with a weight and a value, and a knapsack with a maximum weight capacity. Unlike the 0/1 Knapsack (which requires dynamic programming), in the Fractional Knapsack you can take fractions of items, making it solvable by a greedy algorithm.

The greedy strategy is to sort all items by their value-to-weight ratio (value per unit weight) in descending order, then greedily take as much of the highest-ratio item as possible, followed by the next highest, and so on until the knapsack is full. If the remaining capacity cannot fit the entire next item, we take a fraction of it to fill the knapsack exactly.

This greedy approach is provably optimal for the fractional case. The key insight is that the value-to-weight ratio represents the "efficiency" of each item — how much value you get per unit of weight. By always selecting the most efficient item first, we maximize the total value. The mathematical proof uses an exchange argument: if an optimal solution does not include the highest-ratio item fully, we can swap in more of it without reducing the total value.

The Fractional Knapsack problem appears in many real-world optimization scenarios: portfolio optimization (investing in stocks with the best return-to-risk ratio), resource allocation (distributing limited budget across projects), cargo loading (maximizing the value of goods in a weight-limited container), and bandwidth allocation in networks.

Understanding the difference between the Fractional and 0/1 Knapsack problems is essential for algorithm design: the fractional version's greedy solution is O(n log n), while the 0/1 version requires O(nW) dynamic programming because items cannot be divided.`,
  shortDescription:
    "Maximizes the total value in a weight-limited knapsack by greedily selecting items with the highest value-to-weight ratio, allowing fractional amounts.",
  pseudocode: `function FractionalKnapsack(items, capacity):
    // Compute value/weight ratio for each item
    for each item in items:
        item.ratio = item.value / item.weight

    // Sort by ratio in descending order
    sort items by ratio descending

    totalValue = 0
    remainingCapacity = capacity

    for each item in sorted items:
        if remainingCapacity <= 0:
            break

        if item.weight <= remainingCapacity:
            // Take the whole item
            totalValue += item.value
            remainingCapacity -= item.weight
        else:
            // Take a fraction of the item
            fraction = remainingCapacity / item.weight
            totalValue += item.value * fraction
            remainingCapacity = 0

    return totalValue`,
  implementations: {
    python: `from typing import List, Tuple


def fractional_knapsack(
    items: List[Tuple[int, int]],
    capacity: int,
) -> Tuple[float, List[Tuple[int, float]]]:
    """
    Solve the fractional knapsack problem.

    Args:
        items: List of (weight, value) tuples
        capacity: Maximum knapsack weight

    Returns:
        (total_value, selections) where selections is [(item_index, fraction_taken)]
    """
    n = len(items)
    # Compute ratios and sort by ratio descending
    indexed = [(i, items[i][0], items[i][1], items[i][1] / items[i][0])
               for i in range(n)]
    indexed.sort(key=lambda x: x[3], reverse=True)

    total_value = 0.0
    remaining = capacity
    selections = []

    for idx, weight, value, ratio in indexed:
        if remaining <= 0:
            break

        if weight <= remaining:
            total_value += value
            remaining -= weight
            selections.append((idx, 1.0))
        else:
            fraction = remaining / weight
            total_value += value * fraction
            remaining = 0
            selections.append((idx, fraction))

    return total_value, selections


# Example usage
if __name__ == "__main__":
    items = [(10, 60), (20, 100), (30, 120)]  # (weight, value)
    capacity = 50

    total, selections = fractional_knapsack(items, capacity)
    print(f"Maximum value: {total}")        # 240.0
    print(f"Selections: {selections}")       # [(0, 1.0), (1, 1.0), (2, 0.667)]`,
    javascript: `/**
 * Fractional Knapsack — greedy approach.
 *
 * @param {{ weight: number, value: number }[]} items
 * @param {number} capacity - Maximum weight
 * @returns {{ totalValue: number, selections: { index: number, fraction: number }[] }}
 */
function fractionalKnapsack(items, capacity) {
  const indexed = items.map((item, i) => ({
    ...item,
    index: i,
    ratio: item.value / item.weight,
  }));

  // Sort by value/weight ratio descending
  indexed.sort((a, b) => b.ratio - a.ratio);

  let totalValue = 0;
  let remaining = capacity;
  const selections = [];

  for (const item of indexed) {
    if (remaining <= 0) break;

    if (item.weight <= remaining) {
      totalValue += item.value;
      remaining -= item.weight;
      selections.push({ index: item.index, fraction: 1.0 });
    } else {
      const fraction = remaining / item.weight;
      totalValue += item.value * fraction;
      remaining = 0;
      selections.push({ index: item.index, fraction });
    }
  }

  return { totalValue, selections };
}

// Example usage
const items = [
  { weight: 10, value: 60 },
  { weight: 20, value: 100 },
  { weight: 30, value: 120 },
];
const result = fractionalKnapsack(items, 50);
console.log("Max value:", result.totalValue);    // 240
console.log("Selections:", result.selections);`,
  },
  useCases: [
    "Portfolio optimization — allocating investment capital across stocks by expected return-to-risk ratio",
    "Cargo loading — maximizing the value of goods in a weight-limited shipping container",
    "Resource allocation — distributing a limited budget across projects for maximum ROI",
    "Bandwidth allocation — distributing network capacity to maximize throughput value",
    "Cloud computing — allocating fractional compute resources to maximize utility",
  ],
  relatedAlgorithms: [
    "knapsack",
    "activity-selection",
    "huffman-coding",
    "job-scheduling",
  ],
  glossaryTerms: [
    "greedy algorithm",
    "value-to-weight ratio",
    "knapsack problem",
    "exchange argument",
    "optimal substructure",
    "greedy choice property",
  ],
  tags: [
    "greedy",
    "knapsack",
    "optimization",
    "sorting",
    "ratio",
    "classic",
    "intermediate",
  ],
};
