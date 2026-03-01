import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const memoization: AlgorithmMetadata = {
  id: "memoization",
  name: "Memoization",
  category: "miscellaneous",
  subcategory: "Techniques",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "For Fibonacci with memoization, each unique subproblem fib(0) through fib(n) is computed exactly once, giving O(n) total. Without memoization, the naive recursive approach is O(2^n) due to redundant recomputation of overlapping subproblems.",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "O(n) for the memoization cache storing n+1 results, plus O(n) for the recursive call stack depth. Total: O(n). The cache eliminates redundant computation at the cost of additional memory.",
  },
  description: `Memoization is a top-down dynamic programming technique that optimizes recursive algorithms by caching \
the results of expensive function calls and returning the cached result when the same inputs occur again. \
The term was coined by Donald Michie in 1968 and derives from "memorandum" (something to be remembered). \
It is one of the most impactful optimizations in computer science, often transforming exponential-time \
algorithms into polynomial-time ones.

The classic demonstration of memoization is the Fibonacci sequence. The naive recursive implementation \
of fib(n) has O(2^n) time complexity because it recomputes the same subproblems exponentially many times. \
For example, computing fib(6) requires computing fib(4) three times, fib(3) five times, fib(2) eight \
times, and so on. By storing each computed result in a cache (dictionary/hash map), memoization ensures \
each unique subproblem is solved exactly once, reducing time complexity to O(n).

The memoization process works as follows: before computing a result, check if it already exists in the \
cache. If yes, return the cached value immediately (a "cache hit"). If no, compute the result recursively, \
store it in the cache, and then return it. This transforms the recursive call tree from a full binary tree \
(exponential nodes) into a linear chain of unique computations, with cached lookups short-circuiting \
redundant branches.

Memoization is distinguished from tabulation (bottom-up DP) in that memoization preserves the natural \
recursive structure and only computes subproblems that are actually needed (lazy evaluation), while \
tabulation iteratively fills a table from smallest to largest subproblems. Both achieve the same \
asymptotic complexity, but memoization can be more memory-efficient when not all subproblems need to \
be solved.

Applications extend well beyond Fibonacci: longest common subsequence, edit distance, matrix chain \
multiplication, coin change, knapsack problems, game theory (minimax with memoization), parsing \
(Earley parser), and any problem exhibiting overlapping subproblems. In practice, many languages provide \
built-in memoization decorators (Python's @lru_cache) or libraries that automate the caching process.`,
  shortDescription:
    "Caches results of recursive calls to eliminate redundant computation, transforming exponential-time recursive solutions into efficient polynomial-time algorithms.",
  pseudocode: `function Fibonacci_Memoized(n, cache = {}):
    // Check cache first (cache hit)
    if n in cache:
        return cache[n]        // Return cached result immediately

    // Base cases
    if n <= 0: return 0
    if n == 1: return 1

    // Compute recursively and store in cache
    result = Fibonacci_Memoized(n - 1, cache) + Fibonacci_Memoized(n - 2, cache)
    cache[n] = result          // Store for future lookups

    return result

// Without memoization: fib(6) makes 25 recursive calls
// With memoization:    fib(6) makes 11 calls, 5 are cache hits`,
  implementations: {
    python: `from functools import lru_cache
from typing import Dict


def fib_memo_manual(n: int, cache: Dict[int, int] = None) -> int:
    """
    Fibonacci with manual memoization.
    Time: O(n), Space: O(n).
    """
    if cache is None:
        cache = {}

    if n in cache:
        return cache[n]

    if n <= 0:
        return 0
    if n == 1:
        return 1

    result = fib_memo_manual(n - 1, cache) + fib_memo_manual(n - 2, cache)
    cache[n] = result
    return result


@lru_cache(maxsize=None)
def fib_memo_decorator(n: int) -> int:
    """
    Fibonacci with Python's built-in memoization decorator.
    Time: O(n), Space: O(n).
    """
    if n <= 0:
        return 0
    if n == 1:
        return 1
    return fib_memo_decorator(n - 1) + fib_memo_decorator(n - 2)


def demonstrate_cache_hits(n: int) -> None:
    """Show which calls are cache hits vs fresh computations."""
    cache: Dict[int, int] = {}
    call_log = []

    def fib(k: int) -> int:
        if k in cache:
            call_log.append(f"fib({k}) -> CACHE HIT = {cache[k]}")
            return cache[k]

        if k <= 0:
            cache[k] = 0
        elif k == 1:
            cache[k] = 1
        else:
            call_log.append(f"fib({k}) -> computing...")
            cache[k] = fib(k - 1) + fib(k - 2)

        call_log.append(f"fib({k}) = {cache[k]}")
        return cache[k]

    result = fib(n)
    for log in call_log:
        print(log)
    print(f"\\nResult: fib({n}) = {result}")


# Example usage
if __name__ == "__main__":
    for i in range(8):
        print(f"fib({i}) = {fib_memo_manual(i)}")
    print()
    demonstrate_cache_hits(6)`,
    javascript: `/**
 * Fibonacci with manual memoization.
 * Time: O(n), Space: O(n).
 * @param {number} n
 * @param {Map<number, number>} cache
 * @returns {number}
 */
function fibMemo(n, cache = new Map()) {
  if (cache.has(n)) return cache.get(n);

  if (n <= 0) return 0;
  if (n === 1) return 1;

  const result = fibMemo(n - 1, cache) + fibMemo(n - 2, cache);
  cache.set(n, result);
  return result;
}

/**
 * Generic memoize wrapper for any single-argument function.
 * @param {Function} fn
 * @returns {Function}
 */
function memoize(fn) {
  const cache = new Map();
  return function (arg) {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

/**
 * Demonstrate cache hits for Fibonacci.
 * @param {number} n
 */
function demonstrateCacheHits(n) {
  const cache = new Map();
  const log = [];

  function fib(k) {
    if (cache.has(k)) {
      log.push(\`fib(\${k}) -> CACHE HIT = \${cache.get(k)}\`);
      return cache.get(k);
    }

    let result;
    if (k <= 0) result = 0;
    else if (k === 1) result = 1;
    else {
      log.push(\`fib(\${k}) -> computing...\`);
      result = fib(k - 1) + fib(k - 2);
    }

    cache.set(k, result);
    log.push(\`fib(\${k}) = \${result}\`);
    return result;
  }

  const result = fib(n);
  log.forEach((l) => console.log(l));
  console.log(\`\\nResult: fib(\${n}) = \${result}\`);
}

// Example usage
for (let i = 0; i < 8; i++) {
  console.log(\`fib(\${i}) = \${fibMemo(i)}\`);
}
demonstrateCacheHits(6);`,
  },
  useCases: [
    "Optimizing recursive Fibonacci and other sequence computations from O(2^n) to O(n)",
    "Dynamic programming problems: longest common subsequence, edit distance, coin change",
    "Game theory: minimax algorithm with alpha-beta pruning and state caching",
    "Parsing algorithms: memoized recursive descent (packrat parsing)",
    "API response caching and function result caching in web applications",
  ],
  relatedAlgorithms: [
    "recursion",
    "fibonacci",
    "knapsack",
    "dfs",
  ],
  glossaryTerms: [
    "memoization",
    "cache",
    "cache hit",
    "overlapping subproblems",
    "dynamic programming",
    "top-down",
    "tabulation",
    "lazy evaluation",
  ],
  tags: [
    "miscellaneous",
    "technique",
    "intermediate",
    "memoization",
    "dynamic-programming",
    "optimization",
    "caching",
  ],
};
