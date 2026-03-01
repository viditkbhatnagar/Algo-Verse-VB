import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const recursion: AlgorithmMetadata = {
  id: "recursion",
  name: "Recursion",
  category: "miscellaneous",
  subcategory: "Techniques",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "For factorial(n), there are exactly n recursive calls, each doing O(1) work. Other recursive algorithms vary: binary search is O(log n), Fibonacci without memoization is O(2^n), and merge sort is O(n log n).",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "The call stack depth equals n for factorial(n). Each stack frame stores the current parameter and return address. Tail-recursive versions can theoretically use O(1) space if the compiler/interpreter optimizes tail calls.",
  },
  description: `Recursion is a fundamental programming technique where a function calls itself to solve smaller instances \
of the same problem. Every recursive solution has two essential components: the base case (the simplest \
instance that can be solved directly without further recursion) and the recursive case (where the function \
reduces the problem and calls itself with a smaller input).

The factorial function is the canonical example of recursion. Factorial(n) = n * factorial(n-1), with the \
base case factorial(0) = factorial(1) = 1. When we call factorial(5), it creates a chain of calls: \
fact(5) -> fact(4) -> fact(3) -> fact(2) -> fact(1). The call stack builds up as each call waits for its \
sub-call to return. Once the base case returns 1, the results propagate back up: 1, 2, 6, 24, 120.

Understanding the call stack is crucial for mastering recursion. Each recursive call pushes a new frame \
onto the call stack, containing the function's local variables and return address. The stack grows until \
the base case is reached, then unwinds as each frame computes its result and returns. Stack overflow \
occurs when the recursion depth exceeds the system's stack size limit, which is why base cases are critical.

Recursion appears throughout computer science: tree and graph traversals (DFS is inherently recursive), \
divide-and-conquer algorithms (merge sort, quicksort), dynamic programming (top-down memoization), \
backtracking (N-Queens, Sudoku), parsing (recursive descent parsers), and mathematical computations \
(Fibonacci, power, GCD). While any recursive solution can be converted to an iterative one using an \
explicit stack, recursive solutions are often more elegant, readable, and closely mirror the mathematical \
definition of the problem.

Common pitfalls include forgetting the base case (leading to infinite recursion), not making progress \
toward the base case, redundant computation (Fibonacci without memoization), and excessive stack depth. \
Tail recursion, where the recursive call is the last operation, allows some languages to optimize away \
the stack growth, effectively converting recursion to iteration.`,
  shortDescription:
    "A technique where a function calls itself to solve smaller subproblems, building and unwinding a call stack until reaching a base case.",
  pseudocode: `function Factorial(n):
    // Base case
    if n <= 1:
        return 1

    // Recursive case: reduce problem and call self
    return n * Factorial(n - 1)

// Call stack visualization for Factorial(5):
//   Factorial(5)                          → returns 5 * 24 = 120
//     Factorial(4)                        → returns 4 * 6  = 24
//       Factorial(3)                      → returns 3 * 2  = 6
//         Factorial(2)                    → returns 2 * 1  = 2
//           Factorial(1)                  → returns 1 (base case)`,
  implementations: {
    python: `from typing import List


def factorial(n: int) -> int:
    """
    Compute n! recursively.
    Time: O(n), Space: O(n) call stack.
    """
    if n <= 1:
        return 1
    return n * factorial(n - 1)


def factorial_tail(n: int, accumulator: int = 1) -> int:
    """
    Tail-recursive factorial.
    Note: Python does not optimize tail calls, but this illustrates the pattern.
    """
    if n <= 1:
        return accumulator
    return factorial_tail(n - 1, n * accumulator)


def power(base: float, exp: int) -> float:
    """
    Compute base^exp using recursion (fast exponentiation).
    Time: O(log exp), Space: O(log exp).
    """
    if exp == 0:
        return 1
    if exp < 0:
        return 1 / power(base, -exp)
    if exp % 2 == 0:
        half = power(base, exp // 2)
        return half * half
    return base * power(base, exp - 1)


def sum_list(arr: List[int]) -> int:
    """Sum elements of a list recursively."""
    if not arr:
        return 0
    return arr[0] + sum_list(arr[1:])


# Example usage
if __name__ == "__main__":
    for n in range(1, 8):
        print(f"{n}! = {factorial(n)}")
    # 1! = 1, 2! = 2, 3! = 6, 4! = 24, 5! = 120, 6! = 720, 7! = 5040`,
    javascript: `/**
 * Compute n! recursively.
 * Time: O(n), Space: O(n) call stack.
 * @param {number} n
 * @returns {number}
 */
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

/**
 * Tail-recursive factorial.
 * @param {number} n
 * @param {number} accumulator
 * @returns {number}
 */
function factorialTail(n, accumulator = 1) {
  if (n <= 1) return accumulator;
  return factorialTail(n - 1, n * accumulator);
}

/**
 * Compute base^exp using fast exponentiation.
 * Time: O(log exp), Space: O(log exp).
 * @param {number} base
 * @param {number} exp
 * @returns {number}
 */
function power(base, exp) {
  if (exp === 0) return 1;
  if (exp < 0) return 1 / power(base, -exp);
  if (exp % 2 === 0) {
    const half = power(base, exp / 2);
    return half * half;
  }
  return base * power(base, exp - 1);
}

/**
 * Sum elements of an array recursively.
 * @param {number[]} arr
 * @returns {number}
 */
function sumList(arr) {
  if (arr.length === 0) return 0;
  return arr[0] + sumList(arr.slice(1));
}

// Example usage
for (let n = 1; n <= 7; n++) {
  console.log(\`\${n}! = \${factorial(n)}\`);
}
// 1! = 1, 2! = 2, 3! = 6, 4! = 24, 5! = 120, 6! = 720, 7! = 5040`,
  },
  useCases: [
    "Tree and graph traversals (DFS, in-order, pre-order, post-order)",
    "Divide-and-conquer algorithms (merge sort, quicksort, binary search)",
    "Backtracking problems (N-Queens, Sudoku, permutation generation)",
    "Mathematical computations (factorial, Fibonacci, GCD, power)",
    "Parsing and language processing (recursive descent parsers, expression evaluation)",
  ],
  relatedAlgorithms: [
    "memoization",
    "fibonacci",
    "dfs",
    "merge-sort",
    "quick-sort",
  ],
  glossaryTerms: [
    "recursion",
    "base case",
    "recursive case",
    "call stack",
    "stack frame",
    "tail recursion",
    "stack overflow",
  ],
  tags: [
    "miscellaneous",
    "technique",
    "beginner",
    "recursion",
    "call-stack",
    "fundamental",
  ],
};
