import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const fibonacci: AlgorithmMetadata = {
  id: "fibonacci",
  name: "Fibonacci (Dynamic Programming)",
  category: "dynamic-programming",
  subcategory: "Classic",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "O(n) with dynamic programming (tabulation or memoization). The naive recursive approach is O(2^n) due to overlapping subproblems. Space-optimized iterative version is also O(n) time with O(1) space.",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    note: "O(n) for tabulation (storing the full table) or memoization (recursive call stack + cache). O(1) with the space-optimized iterative approach that only keeps the last two values.",
  },
  description: `The Fibonacci sequence is one of the most famous sequences in mathematics, where each number \
is the sum of the two preceding ones: F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2). While computing \
Fibonacci numbers may seem trivial, it serves as the quintessential introduction to dynamic programming \
because the naive recursive solution has exponential time complexity due to massively overlapping \
subproblems, and applying DP techniques reduces this to linear time.

The naive recursive approach computes the same subproblems repeatedly. For example, computing F(5) \
requires computing F(3) twice, F(2) three times, and so on. The recursion tree grows exponentially, \
resulting in O(2^n) time complexity. Dynamic programming eliminates this redundancy through two \
equivalent strategies: top-down memoization (caching results of recursive calls) and bottom-up \
tabulation (iteratively building a table of results from smallest subproblems to largest).

With memoization, we store each computed F(k) in a lookup table so it is never recomputed. This \
transforms the recursion into O(n) time with O(n) space for the cache and call stack. Bottom-up \
tabulation fills an array from F(0) to F(n) iteratively, also achieving O(n) time and O(n) space. \
A further space optimization recognizes that only the two most recent values are needed at each step, \
reducing space to O(1) while maintaining O(n) time.

Beyond its educational value, the Fibonacci sequence appears throughout computer science and nature. \
It is used in the analysis of Euclid's GCD algorithm (Fibonacci numbers produce the worst case), \
Fibonacci heaps, the golden ratio and its applications in search algorithms (Fibonacci search), \
financial modeling, and biological patterns such as branching in trees and the arrangement of leaves. \
Matrix exponentiation can compute F(n) in O(log n) time, and Binet's formula provides a closed-form \
solution, though it suffers from floating-point precision issues for large n.`,
  shortDescription:
    "Computes the nth Fibonacci number efficiently using dynamic programming to eliminate the exponential redundancy of the naive recursive approach.",
  pseudocode: `// Approach 1: Top-Down Memoization
function Fibonacci_Memo(n, memo = {}):
    if n <= 0: return 0
    if n == 1: return 1
    if n in memo: return memo[n]

    memo[n] = Fibonacci_Memo(n - 1, memo) + Fibonacci_Memo(n - 2, memo)
    return memo[n]

// Approach 2: Bottom-Up Tabulation
function Fibonacci_Tab(n):
    if n <= 0: return 0
    if n == 1: return 1

    dp = array of size (n + 1)
    dp[0] = 0
    dp[1] = 1

    for i from 2 to n:
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp[n]

// Approach 3: Space-Optimized Iterative
function Fibonacci_Opt(n):
    if n <= 0: return 0
    if n == 1: return 1

    prev2 = 0
    prev1 = 1

    for i from 2 to n:
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current

    return prev1`,
  implementations: {
    python: `from functools import lru_cache
from typing import List


def fibonacci_naive(n: int) -> int:
    """Naive recursive Fibonacci — O(2^n) time, O(n) stack space."""
    if n <= 0:
        return 0
    if n == 1:
        return 1
    return fibonacci_naive(n - 1) + fibonacci_naive(n - 2)


@lru_cache(maxsize=None)
def fibonacci_memo(n: int) -> int:
    """Top-down memoized Fibonacci — O(n) time, O(n) space."""
    if n <= 0:
        return 0
    if n == 1:
        return 1
    return fibonacci_memo(n - 1) + fibonacci_memo(n - 2)


def fibonacci_tabulation(n: int) -> int:
    """Bottom-up tabulated Fibonacci — O(n) time, O(n) space."""
    if n <= 0:
        return 0
    if n == 1:
        return 1

    dp: List[int] = [0] * (n + 1)
    dp[0] = 0
    dp[1] = 1

    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp[n]


def fibonacci_optimized(n: int) -> int:
    """Space-optimized iterative Fibonacci — O(n) time, O(1) space."""
    if n <= 0:
        return 0
    if n == 1:
        return 1

    prev2, prev1 = 0, 1
    for _ in range(2, n + 1):
        prev2, prev1 = prev1, prev2 + prev1

    return prev1


# Example usage
if __name__ == "__main__":
    for n in [0, 1, 5, 10, 20, 30]:
        result = fibonacci_optimized(n)
        print(f"F({n}) = {result}")
    # F(0) = 0, F(1) = 1, F(5) = 5, F(10) = 55, F(20) = 6765, F(30) = 832040`,
    javascript: `/**
 * Naive recursive Fibonacci — O(2^n) time.
 * @param {number} n
 * @returns {number}
 */
function fibonacciNaive(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return fibonacciNaive(n - 1) + fibonacciNaive(n - 2);
}

/**
 * Top-down memoized Fibonacci — O(n) time, O(n) space.
 * @param {number} n
 * @param {Map<number, number>} memo
 * @returns {number}
 */
function fibonacciMemo(n, memo = new Map()) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (memo.has(n)) return memo.get(n);

  const result = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}

/**
 * Bottom-up tabulated Fibonacci — O(n) time, O(n) space.
 * @param {number} n
 * @returns {number}
 */
function fibonacciTabulation(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

/**
 * Space-optimized iterative Fibonacci — O(n) time, O(1) space.
 * @param {number} n
 * @returns {number}
 */
function fibonacciOptimized(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let prev2 = 0;
  let prev1 = 1;

  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

// Example usage
for (const n of [0, 1, 5, 10, 20, 30]) {
  console.log(\`F(\${n}) = \${fibonacciOptimized(n)}\`);
}
// F(0) = 0, F(1) = 1, F(5) = 5, F(10) = 55, F(20) = 6765, F(30) = 832040`,
  },
  useCases: [
    "Teaching dynamic programming concepts: overlapping subproblems and optimal substructure",
    "Analyzing worst-case behavior of Euclid's GCD algorithm (consecutive Fibonacci numbers)",
    "Fibonacci search technique for searching sorted arrays with minimal comparisons",
    "Fibonacci heaps — a priority queue data structure with excellent amortized bounds",
    "Modeling natural growth patterns in biology, finance, and fractal geometry",
  ],
  relatedAlgorithms: [
    "climbing-stairs",
    "coin-change",
    "longest-common-subsequence",
    "matrix-chain-multiplication",
  ],
  glossaryTerms: [
    "dynamic programming",
    "memoization",
    "tabulation",
    "overlapping subproblems",
    "optimal substructure",
    "recursion",
    "golden ratio",
    "recurrence relation",
  ],
  tags: [
    "dynamic-programming",
    "classic",
    "beginner",
    "memoization",
    "tabulation",
    "recursion",
    "mathematics",
  ],
};
