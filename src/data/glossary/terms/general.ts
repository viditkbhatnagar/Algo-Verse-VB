import type { GlossaryTermData } from "@/lib/visualization/types";

export const generalTerms: GlossaryTermData[] = [
  // ── Asymptotic Analysis ──────────────────────────────────────────────
  {
    slug: "big-o-notation",
    name: "Big O Notation",
    definition:
      "Big O notation describes the upper bound of an algorithm's growth rate, representing the worst-case scenario for how time or space scales with input size. It drops constants and lower-order terms so you can compare algorithms at large scale.",
    formalDefinition:
      "f(n) = O(g(n)) if there exist positive constants c and n0 such that 0 <= f(n) <= c * g(n) for all n >= n0.",
    formula: "$O(f(n))$",
    relatedTerms: [
      "big-theta-notation",
      "big-omega-notation",
      "time-complexity",
      "space-complexity",
      "asymptotic-analysis",
    ],
    category: "general",
    tags: ["complexity", "asymptotic", "analysis", "notation"],
  },
  {
    slug: "big-theta-notation",
    name: "Big Theta Notation",
    definition:
      "Big Theta notation gives a tight bound on an algorithm's growth rate, meaning the function grows at exactly that rate (up to constant factors). It is used when the upper and lower bounds match.",
    formalDefinition:
      "f(n) = Theta(g(n)) if there exist positive constants c1, c2, and n0 such that c1 * g(n) <= f(n) <= c2 * g(n) for all n >= n0.",
    formula: "$\\Theta(f(n))$",
    relatedTerms: [
      "big-o-notation",
      "big-omega-notation",
      "asymptotic-analysis",
    ],
    category: "general",
    tags: ["complexity", "asymptotic", "analysis", "notation"],
  },
  {
    slug: "big-omega-notation",
    name: "Big Omega Notation",
    definition:
      "Big Omega notation describes the lower bound of an algorithm's growth rate, representing the best-case scenario for how time or space scales. It tells you the minimum resources an algorithm will need.",
    formalDefinition:
      "f(n) = Omega(g(n)) if there exist positive constants c and n0 such that 0 <= c * g(n) <= f(n) for all n >= n0.",
    formula: "$\\Omega(f(n))$",
    relatedTerms: [
      "big-o-notation",
      "big-theta-notation",
      "asymptotic-analysis",
      "best-case",
    ],
    category: "general",
    tags: ["complexity", "asymptotic", "analysis", "notation"],
  },
  {
    slug: "time-complexity",
    name: "Time Complexity",
    definition:
      "Time complexity measures how the running time of an algorithm grows as the input size increases. It is typically expressed using Big O notation and helps predict performance at scale.",
    relatedTerms: [
      "big-o-notation",
      "space-complexity",
      "best-case",
      "average-case",
      "worst-case",
    ],
    category: "general",
    tags: ["complexity", "performance", "analysis"],
  },
  {
    slug: "space-complexity",
    name: "Space Complexity",
    definition:
      "Space complexity measures how much additional memory an algorithm needs as the input size grows. It includes both auxiliary space (extra memory) and the space used by the input itself.",
    relatedTerms: [
      "big-o-notation",
      "time-complexity",
      "in-place-algorithm",
    ],
    category: "general",
    tags: ["complexity", "memory", "analysis"],
  },
  {
    slug: "asymptotic-analysis",
    name: "Asymptotic Analysis",
    definition:
      "Asymptotic analysis studies algorithm efficiency by examining behavior as input size approaches infinity. It ignores constant factors and focuses on the dominant growth term, making it hardware-independent.",
    relatedTerms: [
      "big-o-notation",
      "big-theta-notation",
      "big-omega-notation",
      "time-complexity",
      "space-complexity",
    ],
    category: "general",
    tags: ["analysis", "complexity", "theory"],
  },

  // ── Core Concepts ────────────────────────────────────────────────────
  {
    slug: "algorithm",
    name: "Algorithm",
    definition:
      "An algorithm is a finite, well-defined sequence of steps that solves a specific problem or performs a computation. Every algorithm must terminate after a finite number of steps and produce a correct output for valid inputs.",
    relatedTerms: [
      "data-structure",
      "time-complexity",
      "deterministic",
      "heuristic",
    ],
    category: "general",
    tags: ["fundamentals", "definition"],
  },
  {
    slug: "data-structure",
    name: "Data Structure",
    definition:
      "A data structure is a way of organizing and storing data so that it can be accessed and modified efficiently. The choice of data structure directly impacts the time and space complexity of the algorithms that operate on it.",
    relatedTerms: ["algorithm", "abstract-data-type", "traversal"],
    category: "general",
    tags: ["fundamentals", "definition", "storage"],
  },
  {
    slug: "recursion",
    name: "Recursion",
    definition:
      "Recursion is a technique where a function calls itself to solve smaller instances of the same problem. Every recursive function needs at least one base case to stop the recursion and avoid infinite loops.",
    relatedTerms: [
      "base-case",
      "recursive-case",
      "iteration",
      "divide-and-conquer",
      "memoization",
    ],
    category: "general",
    tags: ["fundamentals", "technique", "function"],
  },
  {
    slug: "iteration",
    name: "Iteration",
    definition:
      "Iteration is the process of repeating a set of instructions using loops (for, while, do-while) until a condition is met. It is often an alternative to recursion and typically uses less memory since it avoids call-stack overhead.",
    relatedTerms: ["recursion", "traversal", "algorithm"],
    category: "general",
    tags: ["fundamentals", "technique", "loop"],
  },
  {
    slug: "base-case",
    name: "Base Case",
    definition:
      "A base case is the simplest instance of a recursive problem that can be solved directly without further recursion. It acts as the stopping condition that prevents infinite recursion.",
    relatedTerms: ["recursion", "recursive-case"],
    category: "general",
    tags: ["recursion", "fundamentals"],
  },
  {
    slug: "recursive-case",
    name: "Recursive Case",
    definition:
      "The recursive case is the part of a recursive function where the problem is broken into smaller sub-problems and the function calls itself. Each recursive call should make progress toward the base case.",
    relatedTerms: ["recursion", "base-case", "divide-and-conquer"],
    category: "general",
    tags: ["recursion", "fundamentals"],
  },

  // ── Algorithm Design Paradigms ───────────────────────────────────────
  {
    slug: "divide-and-conquer",
    name: "Divide and Conquer",
    definition:
      "Divide and conquer is a strategy that splits a problem into smaller independent sub-problems, solves each recursively, and combines their results. Classic examples include merge sort, quicksort, and binary search.",
    relatedTerms: [
      "recursion",
      "dynamic-programming",
      "optimal-substructure",
    ],
    category: "general",
    tags: ["paradigm", "strategy", "recursion"],
  },
  {
    slug: "greedy-algorithm",
    name: "Greedy Algorithm",
    definition:
      "A greedy algorithm makes the locally optimal choice at each step with the hope of finding a global optimum. Greedy approaches work well when the problem has the greedy-choice property, but they do not always produce the best solution.",
    relatedTerms: [
      "dynamic-programming",
      "optimal-substructure",
      "heuristic",
    ],
    category: "general",
    tags: ["paradigm", "strategy", "optimization"],
  },
  {
    slug: "dynamic-programming",
    name: "Dynamic Programming",
    definition:
      "Dynamic programming solves complex problems by breaking them into overlapping sub-problems and storing their solutions to avoid redundant computation. It requires both optimal substructure and overlapping sub-problems.",
    relatedTerms: [
      "memoization",
      "tabulation",
      "optimal-substructure",
      "overlapping-subproblems",
      "divide-and-conquer",
    ],
    category: "general",
    tags: ["paradigm", "strategy", "optimization"],
  },
  {
    slug: "brute-force",
    name: "Brute Force",
    definition:
      "Brute force is a straightforward approach that tries every possible solution and picks the best one. It guarantees correctness but is often impractical for large inputs due to exponential or factorial time complexity.",
    relatedTerms: [
      "algorithm",
      "time-complexity",
      "heuristic",
      "np-hard",
    ],
    category: "general",
    tags: ["paradigm", "strategy", "exhaustive"],
  },

  // ── Algorithm Properties ─────────────────────────────────────────────
  {
    slug: "in-place-algorithm",
    name: "In-Place Algorithm",
    definition:
      "An in-place algorithm transforms its input using only a constant amount of extra memory ($O(1)$ auxiliary space). Examples include insertion sort and heapsort, which sort the array without needing a full copy.",
    formula: "$O(1)$ auxiliary space",
    relatedTerms: ["space-complexity", "stable-sort", "swap"],
    category: "general",
    tags: ["property", "memory", "sorting"],
  },
  {
    slug: "stable-sort",
    name: "Stable Sort",
    definition:
      "A stable sorting algorithm preserves the relative order of elements that have equal keys. This matters when data has been previously sorted by another criterion and you want to maintain that secondary ordering.",
    relatedTerms: [
      "comparison-sort",
      "in-place-algorithm",
      "adaptive-algorithm",
    ],
    category: "general",
    tags: ["property", "sorting", "ordering"],
  },
  {
    slug: "comparison-sort",
    name: "Comparison Sort",
    definition:
      "A comparison sort determines element order solely by comparing pairs of elements. The theoretical lower bound for any comparison-based sort is $O(n \\log n)$, which merge sort and heapsort achieve.",
    formula: "$\\Omega(n \\log n)$ lower bound",
    relatedTerms: ["stable-sort", "time-complexity", "algorithm"],
    category: "general",
    tags: ["sorting", "theory", "lower-bound"],
  },
  {
    slug: "adaptive-algorithm",
    name: "Adaptive Algorithm",
    definition:
      "An adaptive algorithm takes advantage of existing order in its input to run faster. For example, insertion sort runs in $O(n)$ on nearly sorted data instead of its usual $O(n^2)$.",
    formula: "$O(n)$ best case for adaptive sorts",
    relatedTerms: ["stable-sort", "best-case", "comparison-sort"],
    category: "general",
    tags: ["property", "sorting", "performance"],
  },

  // ── Case Analysis ────────────────────────────────────────────────────
  {
    slug: "amortized-analysis",
    name: "Amortized Analysis",
    definition:
      "Amortized analysis averages the cost of operations over a sequence, even if individual operations are occasionally expensive. It proves that the average cost per operation is small when spread across many calls.",
    relatedTerms: [
      "time-complexity",
      "worst-case",
      "big-o-notation",
    ],
    category: "general",
    tags: ["analysis", "complexity", "advanced"],
  },
  {
    slug: "best-case",
    name: "Best Case",
    definition:
      "The best case is the minimum number of steps an algorithm takes for any input of size n. It represents the most favorable arrangement of data but is rarely used alone to judge algorithm quality.",
    relatedTerms: [
      "worst-case",
      "average-case",
      "big-omega-notation",
      "time-complexity",
    ],
    category: "general",
    tags: ["analysis", "complexity", "case"],
  },
  {
    slug: "average-case",
    name: "Average Case",
    definition:
      "The average case is the expected number of steps an algorithm takes over all possible inputs of size n, often assuming uniform distribution. It gives a more realistic performance estimate than best or worst case alone.",
    relatedTerms: [
      "best-case",
      "worst-case",
      "big-theta-notation",
      "time-complexity",
    ],
    category: "general",
    tags: ["analysis", "complexity", "case"],
  },
  {
    slug: "worst-case",
    name: "Worst Case",
    definition:
      "The worst case is the maximum number of steps an algorithm takes for any input of size n. It provides a guaranteed upper bound on running time and is the most commonly reported complexity measure.",
    relatedTerms: [
      "best-case",
      "average-case",
      "big-o-notation",
      "time-complexity",
    ],
    category: "general",
    tags: ["analysis", "complexity", "case"],
  },

  // ── Mathematical Concepts ────────────────────────────────────────────
  {
    slug: "logarithm",
    name: "Logarithm",
    definition:
      "A logarithm is the inverse of exponentiation: $\\log_b(n)$ asks \"to what power must b be raised to get n?\" In CS, $\\log_2(n)$ appears frequently because many algorithms (like binary search) halve the input at each step.",
    formula: "$\\log_2(n)$",
    relatedTerms: [
      "exponential-growth",
      "time-complexity",
      "big-o-notation",
    ],
    category: "general",
    tags: ["math", "fundamentals", "complexity"],
  },
  {
    slug: "exponential-growth",
    name: "Exponential Growth",
    definition:
      "Exponential growth means the output doubles (or multiplies by a constant) for each unit increase in input. Algorithms with $O(2^n)$ time are impractical for large inputs because the running time explodes rapidly.",
    formula: "$O(2^n)$",
    relatedTerms: [
      "polynomial-time",
      "logarithm",
      "brute-force",
      "np-hard",
    ],
    category: "general",
    tags: ["math", "complexity", "growth-rate"],
  },
  {
    slug: "polynomial-time",
    name: "Polynomial Time",
    definition:
      "An algorithm runs in polynomial time if its running time is bounded by $O(n^k)$ for some constant k. Polynomial-time algorithms are generally considered efficient and form the complexity class P.",
    formula: "$O(n^k)$",
    relatedTerms: [
      "exponential-growth",
      "np-hard",
      "np-complete",
      "time-complexity",
    ],
    category: "general",
    tags: ["complexity", "theory", "class"],
  },
  {
    slug: "np-hard",
    name: "NP-Hard",
    definition:
      "A problem is NP-hard if every problem in NP can be reduced to it in polynomial time. NP-hard problems are at least as hard as the hardest problems in NP, and no known polynomial-time algorithm solves them.",
    relatedTerms: [
      "np-complete",
      "polynomial-time",
      "heuristic",
      "brute-force",
    ],
    category: "general",
    tags: ["complexity", "theory", "class", "intractability"],
  },
  {
    slug: "np-complete",
    name: "NP-Complete",
    definition:
      "A problem is NP-complete if it is both in NP (a solution can be verified in polynomial time) and NP-hard. If any NP-complete problem could be solved in polynomial time, then every problem in NP could be as well (P = NP).",
    relatedTerms: ["np-hard", "polynomial-time", "heuristic"],
    category: "general",
    tags: ["complexity", "theory", "class", "intractability"],
  },

  // ── Algorithm Behavior ───────────────────────────────────────────────
  {
    slug: "heuristic",
    name: "Heuristic",
    definition:
      "A heuristic is a practical approach that finds a good-enough solution quickly when finding the optimal solution is too expensive. Heuristics trade guaranteed optimality for speed and are common in NP-hard problems.",
    relatedTerms: [
      "greedy-algorithm",
      "np-hard",
      "brute-force",
      "algorithm",
    ],
    category: "general",
    tags: ["strategy", "approximation", "optimization"],
  },
  {
    slug: "invariant",
    name: "Invariant",
    definition:
      "An invariant is a condition that remains true throughout the execution of an algorithm or loop. Loop invariants are commonly used to prove correctness: they hold before, during, and after each iteration.",
    relatedTerms: ["algorithm", "iteration", "deterministic"],
    category: "general",
    tags: ["correctness", "proof", "theory"],
  },
  {
    slug: "deterministic",
    name: "Deterministic",
    definition:
      "A deterministic algorithm always produces the same output and follows the same sequence of steps for a given input. Most classical algorithms (sorting, searching, graph traversal) are deterministic.",
    relatedTerms: ["non-deterministic", "algorithm", "invariant"],
    category: "general",
    tags: ["property", "behavior", "theory"],
  },
  {
    slug: "non-deterministic",
    name: "Non-Deterministic",
    definition:
      "A non-deterministic algorithm can make arbitrary choices at certain steps and may produce different results on different runs with the same input. Randomized algorithms and theoretical NP machines are examples.",
    relatedTerms: ["deterministic", "np-complete", "heuristic"],
    category: "general",
    tags: ["property", "behavior", "theory"],
  },

  // ── Dynamic Programming Concepts ─────────────────────────────────────
  {
    slug: "memoization",
    name: "Memoization",
    definition:
      "Memoization is a top-down optimization technique that caches the results of expensive function calls and returns the cached result when the same inputs occur again. It is the recursive approach to dynamic programming.",
    relatedTerms: [
      "tabulation",
      "dynamic-programming",
      "overlapping-subproblems",
      "recursion",
    ],
    category: "general",
    tags: ["optimization", "dynamic-programming", "caching"],
  },
  {
    slug: "tabulation",
    name: "Tabulation",
    definition:
      "Tabulation is a bottom-up dynamic programming technique that fills a table iteratively starting from the smallest sub-problems. Unlike memoization, it avoids recursion overhead and processes sub-problems in a predetermined order.",
    relatedTerms: [
      "memoization",
      "dynamic-programming",
      "iteration",
      "overlapping-subproblems",
    ],
    category: "general",
    tags: ["optimization", "dynamic-programming", "iterative"],
  },
  {
    slug: "optimal-substructure",
    name: "Optimal Substructure",
    definition:
      "A problem has optimal substructure if its optimal solution can be constructed from optimal solutions of its sub-problems. This property is required for both dynamic programming and greedy algorithms to work correctly.",
    relatedTerms: [
      "dynamic-programming",
      "greedy-algorithm",
      "overlapping-subproblems",
      "divide-and-conquer",
    ],
    category: "general",
    tags: ["property", "dynamic-programming", "theory"],
  },
  {
    slug: "overlapping-subproblems",
    name: "Overlapping Subproblems",
    definition:
      "A problem has overlapping sub-problems when the same smaller sub-problems are solved multiple times during recursion. Dynamic programming exploits this by storing results so each sub-problem is computed only once.",
    relatedTerms: [
      "dynamic-programming",
      "memoization",
      "tabulation",
      "optimal-substructure",
    ],
    category: "general",
    tags: ["property", "dynamic-programming", "redundancy"],
  },

  // ── Miscellaneous Fundamentals ───────────────────────────────────────
  {
    slug: "abstract-data-type",
    name: "Abstract Data Type",
    definition:
      "An abstract data type (ADT) defines a set of operations and their behavior without specifying how they are implemented. Stacks, queues, and priority queues are ADTs that can be backed by arrays, linked lists, or heaps.",
    relatedTerms: ["data-structure", "algorithm", "traversal"],
    category: "general",
    tags: ["fundamentals", "abstraction", "interface"],
  },
  {
    slug: "swap",
    name: "Swap",
    definition:
      "A swap exchanges the values of two variables or array elements. It is a fundamental operation in many sorting algorithms and typically requires a temporary variable or destructuring assignment.",
    relatedTerms: [
      "in-place-algorithm",
      "comparison-sort",
      "algorithm",
    ],
    category: "general",
    tags: ["operation", "sorting", "fundamentals"],
  },
  {
    slug: "traversal",
    name: "Traversal",
    definition:
      "Traversal is the process of visiting every element in a data structure exactly once in a systematic order. Common examples include in-order/pre-order/post-order for trees and BFS/DFS for graphs.",
    relatedTerms: ["iteration", "recursion", "data-structure"],
    category: "general",
    tags: ["operation", "fundamentals", "visiting"],
  },
  {
    slug: "sentinel-value",
    name: "Sentinel Value",
    definition:
      "A sentinel value is a special value placed in a data structure to simplify boundary conditions or signal termination. For example, placing the search target at the end of an array eliminates the need for a bounds check in linear search.",
    relatedTerms: ["algorithm", "iteration", "invariant"],
    category: "general",
    tags: ["technique", "optimization", "boundary"],
  },
];
