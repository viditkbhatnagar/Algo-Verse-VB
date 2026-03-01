import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const knapsack: AlgorithmMetadata = {
  id: "knapsack",
  name: "0/1 Knapsack Problem",
  category: "dynamic-programming",
  subcategory: "Optimization",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(nW)",
    average: "O(nW)",
    worst: "O(nW)",
    note: "Where n is the number of items and W is the knapsack capacity. This is pseudo-polynomial because the input size of W is log(W) bits, not W itself. The brute-force approach is O(2^n).",
  },
  spaceComplexity: {
    best: "O(W)",
    average: "O(nW)",
    worst: "O(nW)",
    note: "O(nW) for the standard 2D DP table. Can be optimized to O(W) using a single row (rolling array) when only the optimal value is needed, not the item selection.",
  },
  description: `The 0/1 Knapsack Problem is one of the most fundamental optimization problems in computer science \
and operations research. Given a set of n items, each with a weight and a value, and a knapsack with a \
fixed weight capacity W, the goal is to determine which items to include in the knapsack so that the \
total value is maximized without exceeding the weight capacity. The "0/1" constraint means each item \
is either taken entirely or left behind -- fractional quantities are not allowed.

The problem exhibits both optimal substructure and overlapping subproblems, making it a textbook \
candidate for dynamic programming. The DP formulation builds a 2D table dp[i][w] where dp[i][w] \
represents the maximum value achievable using items 1 through i with a capacity of w. For each item, \
we make a binary choice: either include the item (if it fits) and add its value to the best solution \
for the remaining capacity, or exclude it and carry forward the best solution without it. The recurrence \
is dp[i][w] = max(dp[i-1][w], dp[i-1][w - weight[i]] + value[i]) when weight[i] <= w, and dp[i][w] = \
dp[i-1][w] otherwise.

The time complexity is O(nW), which appears polynomial but is actually pseudo-polynomial because the \
capacity W is an integer whose input representation size is log(W) bits. This distinction is important: \
the knapsack problem is NP-complete in the general case, and no truly polynomial-time algorithm is known. \
However, for practical instances where W is reasonably bounded, the DP approach is efficient and widely \
used. Space can be optimized from O(nW) to O(W) by observing that each row depends only on the \
previous row, though this sacrifices the ability to reconstruct which items were selected.

The 0/1 Knapsack Problem has numerous real-world applications including capital budgeting (selecting \
investment projects with limited funds), cargo loading (maximizing the value of goods in a container), \
resource allocation in cloud computing, cutting stock problems in manufacturing, and as a subroutine \
in cryptographic systems (the Merkle-Hellman knapsack cryptosystem). Variants include the unbounded \
knapsack (unlimited copies of each item), the bounded knapsack (limited copies), and the multi-dimensional \
knapsack (multiple capacity constraints).`,
  shortDescription:
    "Determines the most valuable subset of items that fits within a weight-limited knapsack, using a 2D dynamic programming table to explore all take-or-leave decisions efficiently.",
  pseudocode: `function Knapsack01(weights[], values[], n, W):
    // Create DP table: (n+1) rows x (W+1) columns
    dp = 2D array of size (n + 1) x (W + 1), initialized to 0

    // Fill the table bottom-up
    for i from 1 to n:
        for w from 0 to W:
            if weights[i-1] <= w:
                // Max of excluding or including item i
                dp[i][w] = max(
                    dp[i-1][w],
                    dp[i-1][w - weights[i-1]] + values[i-1]
                )
            else:
                dp[i][w] = dp[i-1][w]   // Item too heavy, skip

    // Backtrack to find selected items
    selected = []
    w = W
    for i from n down to 1:
        if dp[i][w] != dp[i-1][w]:
            selected.add(i - 1)   // Item i-1 was included
            w = w - weights[i-1]

    return dp[n][W], selected`,
  implementations: {
    python: `from typing import List, Tuple


def knapsack_01(
    weights: List[int],
    values: List[int],
    capacity: int,
) -> Tuple[int, List[int]]:
    """
    Solve the 0/1 Knapsack Problem using bottom-up dynamic programming.

    Args:
        weights: Weight of each item
        values: Value of each item
        capacity: Maximum weight capacity of the knapsack

    Returns:
        max_value: Maximum achievable value
        selected_items: Indices of items selected (0-based)
    """
    n = len(weights)

    # Build DP table: dp[i][w] = max value using items 0..i-1 with capacity w
    dp: List[List[int]] = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(capacity + 1):
            # Exclude item i-1
            dp[i][w] = dp[i - 1][w]

            # Include item i-1 if it fits
            if weights[i - 1] <= w:
                include_val = dp[i - 1][w - weights[i - 1]] + values[i - 1]
                dp[i][w] = max(dp[i][w], include_val)

    # Backtrack to find which items were selected
    selected: List[int] = []
    w = capacity
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i - 1][w]:
            selected.append(i - 1)
            w -= weights[i - 1]

    selected.reverse()
    return dp[n][capacity], selected


def knapsack_01_optimized(
    weights: List[int],
    values: List[int],
    capacity: int,
) -> int:
    """
    Space-optimized 0/1 Knapsack — O(W) space, no item reconstruction.
    """
    n = len(weights)
    dp = [0] * (capacity + 1)

    for i in range(n):
        # Traverse right to left to avoid using updated values
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])

    return dp[capacity]


# Example usage
if __name__ == "__main__":
    weights = [2, 3, 4, 5]
    values = [3, 4, 5, 6]
    capacity = 8

    max_val, items = knapsack_01(weights, values, capacity)
    print(f"Max value: {max_val}")        # Max value: 10
    print(f"Selected items: {items}")     # Selected items: [1, 3] (items with w=3,v=4 and w=5,v=6)

    max_val_opt = knapsack_01_optimized(weights, values, capacity)
    print(f"Max value (optimized): {max_val_opt}")  # 10`,
    javascript: `/**
 * Solve the 0/1 Knapsack Problem using bottom-up dynamic programming.
 *
 * @param {number[]} weights - Weight of each item
 * @param {number[]} values - Value of each item
 * @param {number} capacity - Maximum weight capacity
 * @returns {{ maxValue: number, selectedItems: number[] }}
 */
function knapsack01(weights, values, capacity) {
  const n = weights.length;

  // Build DP table: dp[i][w] = max value using items 0..i-1 with capacity w
  const dp = Array.from({ length: n + 1 }, () =>
    new Array(capacity + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      // Exclude item i-1
      dp[i][w] = dp[i - 1][w];

      // Include item i-1 if it fits
      if (weights[i - 1] <= w) {
        const includeVal = dp[i - 1][w - weights[i - 1]] + values[i - 1];
        dp[i][w] = Math.max(dp[i][w], includeVal);
      }
    }
  }

  // Backtrack to find which items were selected
  const selectedItems = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedItems.push(i - 1);
      w -= weights[i - 1];
    }
  }
  selectedItems.reverse();

  return { maxValue: dp[n][capacity], selectedItems };
}

/**
 * Space-optimized 0/1 Knapsack — O(W) space, value only (no item reconstruction).
 *
 * @param {number[]} weights
 * @param {number[]} values
 * @param {number} capacity
 * @returns {number} Maximum value
 */
function knapsack01Optimized(weights, values, capacity) {
  const n = weights.length;
  const dp = new Array(capacity + 1).fill(0);

  for (let i = 0; i < n; i++) {
    // Traverse right to left to avoid using updated values
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }

  return dp[capacity];
}

// Example usage
const weights = [2, 3, 4, 5];
const values = [3, 4, 5, 6];
const capacity = 8;

const { maxValue, selectedItems } = knapsack01(weights, values, capacity);
console.log("Max value:", maxValue);          // 10
console.log("Selected items:", selectedItems); // [1, 3]

const maxValueOpt = knapsack01Optimized(weights, values, capacity);
console.log("Max value (optimized):", maxValueOpt); // 10`,
  },
  useCases: [
    "Capital budgeting: selecting investment projects that maximize return within a limited budget",
    "Cargo and container loading: maximizing the value of shipped goods under weight constraints",
    "Resource allocation in cloud computing: assigning virtual machines to physical hosts",
    "Feature selection in machine learning: choosing a subset of features within a complexity budget",
    "Cutting stock problems: optimizing how raw materials are cut to minimize waste",
  ],
  relatedAlgorithms: [
    "unbounded-knapsack",
    "coin-change",
    "subset-sum",
    "longest-common-subsequence",
    "fibonacci",
  ],
  glossaryTerms: [
    "dynamic programming",
    "optimal substructure",
    "overlapping subproblems",
    "pseudo-polynomial",
    "NP-complete",
    "memoization",
    "tabulation",
    "backtracking",
  ],
  tags: [
    "dynamic-programming",
    "optimization",
    "classic",
    "NP-complete",
    "pseudo-polynomial",
    "2D-table",
    "backtracking-reconstruction",
  ],
};
