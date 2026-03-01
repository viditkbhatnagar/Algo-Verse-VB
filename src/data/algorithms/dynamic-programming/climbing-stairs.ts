import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const climbingStairs: AlgorithmMetadata = {
  id: "climbing-stairs",
  name: "Climbing Stairs",
  category: "dynamic-programming",
  subcategory: "Classic",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "O(n) with dynamic programming (tabulation or memoization). Each subproblem is computed exactly once. The naive recursive approach without memoization is O(2^n) due to overlapping subproblems. A space-optimized iterative solution achieves O(n) time with O(1) space.",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    note: "O(n) for the full tabulation table. O(1) with the space-optimized approach that only stores the two most recent values, since dp[i] depends only on dp[i-1] and dp[i-2].",
  },
  description: `The Climbing Stairs problem is a classic dynamic programming exercise: given a staircase with n steps, \
and the ability to climb either 1 or 2 steps at a time, how many distinct ways can you reach the top? \
This seemingly simple question elegantly demonstrates the core principles of dynamic programming — \
optimal substructure and overlapping subproblems.

The key insight is that the number of ways to reach step i equals the sum of the ways to reach step \
(i-1) and step (i-2), because from those positions you can take a single step of 1 or 2 respectively \
to arrive at step i. This gives us the recurrence dp[i] = dp[i-1] + dp[i-2], with base cases dp[0] = 1 \
(one way to stay at the ground — do nothing) and dp[1] = 1 (one way to reach step 1 — take one step).

This recurrence is identical in structure to the Fibonacci sequence, shifted by one index. The number \
of ways to climb n stairs is exactly the (n+1)th Fibonacci number. The naive recursive solution without \
memoization recomputes the same subproblems exponentially many times, leading to O(2^n) time complexity. \
Dynamic programming — either top-down memoization or bottom-up tabulation — reduces this to O(n) time \
and O(n) space, with a further optimization to O(1) space.

The problem generalizes naturally: if you can take 1, 2, or 3 steps at a time, the recurrence becomes \
dp[i] = dp[i-1] + dp[i-2] + dp[i-3]. More broadly, if the allowed step sizes form a set S, then \
dp[i] = sum of dp[i-s] for all s in S where i-s >= 0. This connects the climbing stairs problem to \
the coin change problem and combinatorics on integer compositions.`,
  shortDescription:
    "Counts the distinct ways to climb n stairs by taking 1 or 2 steps at a time, using dynamic programming to avoid redundant computation.",
  pseudocode: `function ClimbingStairs(n):
    if n <= 1: return 1

    dp = array of size (n + 1)
    dp[0] = 1   // one way to stay at ground
    dp[1] = 1   // one way to reach step 1

    for i from 2 to n:
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp[n]

// Space-optimized version
function ClimbingStairs_Opt(n):
    if n <= 1: return 1

    prev2 = 1   // dp[i-2]
    prev1 = 1   // dp[i-1]

    for i from 2 to n:
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current

    return prev1`,
  implementations: {
    python: `from typing import List


def climbing_stairs(n: int) -> int:
    """
    Count distinct ways to climb n stairs (1 or 2 steps at a time).
    Bottom-up tabulation — O(n) time, O(n) space.
    """
    if n <= 1:
        return 1

    dp: List[int] = [0] * (n + 1)
    dp[0] = 1  # one way to stay at ground
    dp[1] = 1  # one way to reach step 1

    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp[n]


def climbing_stairs_optimized(n: int) -> int:
    """Space-optimized — O(n) time, O(1) space."""
    if n <= 1:
        return 1

    prev2, prev1 = 1, 1
    for _ in range(2, n + 1):
        prev2, prev1 = prev1, prev2 + prev1

    return prev1


# Example usage
if __name__ == "__main__":
    for n in [1, 2, 3, 5, 10]:
        print(f"Stairs({n}) = {climbing_stairs(n)}")
    # Stairs(1)=1, Stairs(2)=2, Stairs(3)=3, Stairs(5)=8, Stairs(10)=89`,
    javascript: `/**
 * Count distinct ways to climb n stairs (1 or 2 steps at a time).
 * Bottom-up tabulation — O(n) time, O(n) space.
 * @param {number} n
 * @returns {number}
 */
function climbingStairs(n) {
  if (n <= 1) return 1;

  const dp = new Array(n + 1);
  dp[0] = 1; // one way to stay at ground
  dp[1] = 1; // one way to reach step 1

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

/**
 * Space-optimized — O(n) time, O(1) space.
 * @param {number} n
 * @returns {number}
 */
function climbingStairsOptimized(n) {
  if (n <= 1) return 1;

  let prev2 = 1;
  let prev1 = 1;

  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

// Example usage
for (const n of [1, 2, 3, 5, 10]) {
  console.log(\`Stairs(\${n}) = \${climbingStairs(n)}\`);
}
// Stairs(1)=1, Stairs(2)=2, Stairs(3)=3, Stairs(5)=8, Stairs(10)=89`,
  },
  useCases: [
    "Teaching dynamic programming fundamentals: overlapping subproblems and optimal substructure",
    "Combinatorics: counting integer compositions (ordered partitions of n into parts of size 1 and 2)",
    "Path counting problems in grid-based games and robotics",
    "Modeling step-by-step decision processes with limited choices per stage",
    "Interview preparation: one of the most commonly asked DP questions",
  ],
  relatedAlgorithms: [
    "fibonacci",
    "coin-change",
    "minimum-path-sum",
    "unique-paths",
  ],
  glossaryTerms: [
    "dynamic programming",
    "memoization",
    "tabulation",
    "overlapping subproblems",
    "optimal substructure",
    "recurrence relation",
    "Fibonacci sequence",
  ],
  tags: [
    "dynamic-programming",
    "classic",
    "beginner",
    "memoization",
    "tabulation",
    "recursion",
    "combinatorics",
  ],
};
