import type { GlossaryTermData } from "@/lib/visualization/types";

export const dynamicProgrammingTerms: GlossaryTermData[] = [
  {
    slug: "dynamic-programming",
    name: "Dynamic Programming",
    definition:
      "Dynamic programming (DP) is an algorithmic technique that solves complex problems by breaking them into simpler overlapping subproblems and storing their solutions to avoid redundant computation. It is applicable when a problem has optimal substructure and overlapping subproblems.",
    relatedTerms: ["memoization", "tabulation", "optimal-substructure", "overlapping-subproblems"],
    category: "dynamic-programming",
    tags: ["dp", "optimization", "technique"],
  },
  {
    slug: "memoization",
    name: "Memoization",
    definition:
      "Memoization is a top-down technique where you solve a problem recursively and cache the results of subproblems so that each subproblem is computed only once. It transforms an exponential-time recursive solution into a polynomial-time one by trading space for time.",
    relatedTerms: ["dynamic-programming", "top-down-approach", "tabulation", "overlapping-subproblems"],
    category: "dynamic-programming",
    tags: ["dp", "caching", "recursion", "top-down"],
  },
  {
    slug: "tabulation",
    name: "Tabulation",
    definition:
      "Tabulation is a bottom-up technique where you fill in a table (usually an array) iteratively, starting from the smallest subproblems and building up to the final answer. Unlike memoization, it avoids recursion overhead and is often more cache-friendly.",
    relatedTerms: ["dynamic-programming", "bottom-up-approach", "memoization", "state"],
    category: "dynamic-programming",
    tags: ["dp", "iterative", "bottom-up", "table"],
  },
  {
    slug: "optimal-substructure",
    name: "Optimal Substructure",
    definition:
      "A problem has optimal substructure if an optimal solution to the whole problem can be constructed from optimal solutions to its subproblems. This property is required for both dynamic programming and greedy algorithms to produce correct results.",
    relatedTerms: ["dynamic-programming", "overlapping-subproblems", "recurrence-relation"],
    category: "dynamic-programming",
    tags: ["dp", "property", "optimization"],
  },
  {
    slug: "overlapping-subproblems",
    name: "Overlapping Subproblems",
    definition:
      "A problem has overlapping subproblems when the same subproblems are solved multiple times during a naive recursive approach. Dynamic programming exploits this by computing each subproblem once and reusing the stored result.",
    relatedTerms: ["dynamic-programming", "memoization", "optimal-substructure"],
    category: "dynamic-programming",
    tags: ["dp", "property", "recursion"],
  },
  {
    slug: "state",
    name: "State",
    definition:
      "In dynamic programming, a state is a set of parameters that uniquely identifies a subproblem. Choosing the right state representation is crucial: it must capture enough information to make decisions while keeping the state space small enough to be tractable.",
    relatedTerms: ["state-transition", "recurrence-relation", "dynamic-programming"],
    category: "dynamic-programming",
    tags: ["dp", "design", "subproblem"],
  },
  {
    slug: "state-transition",
    name: "State Transition",
    definition:
      "A state transition defines how the solution to one state (subproblem) relates to the solutions of other states. It is expressed as a recurrence relation and dictates how the DP table is filled, either top-down or bottom-up.",
    relatedTerms: ["state", "recurrence-relation", "tabulation", "memoization"],
    category: "dynamic-programming",
    tags: ["dp", "design", "recurrence"],
  },
  {
    slug: "recurrence-relation",
    name: "Recurrence Relation",
    definition:
      "A recurrence relation is a mathematical equation that defines each state of a DP problem in terms of previously computed states. Writing the correct recurrence is the core intellectual challenge of dynamic programming.",
    formalDefinition:
      "A recurrence relation expresses $f(n)$ as a function of $f(n-1), f(n-2), \\ldots$ (or other subproblem indices), together with base cases.",
    relatedTerms: ["state-transition", "base-case", "dynamic-programming"],
    category: "dynamic-programming",
    tags: ["dp", "math", "equation"],
  },
  {
    slug: "base-case",
    name: "Base Case",
    definition:
      "A base case is the simplest subproblem whose answer is known directly without further recursion. Every DP solution requires at least one base case to terminate the recursion (top-down) or to seed the table (bottom-up).",
    relatedTerms: ["recurrence-relation", "memoization", "tabulation"],
    category: "dynamic-programming",
    tags: ["dp", "recursion", "initialization"],
  },
  {
    slug: "top-down-approach",
    name: "Top-Down Approach",
    definition:
      "The top-down approach solves a DP problem by starting from the original problem and recursively breaking it into subproblems, caching results along the way (memoization). It is often more intuitive to write but may incur recursion stack overhead.",
    relatedTerms: ["memoization", "bottom-up-approach", "dynamic-programming"],
    category: "dynamic-programming",
    tags: ["dp", "recursion", "strategy"],
  },
  {
    slug: "bottom-up-approach",
    name: "Bottom-Up Approach",
    definition:
      "The bottom-up approach solves a DP problem by iterating from the smallest subproblems to the largest, filling a table in a systematic order. It eliminates recursion overhead and makes space optimization techniques like rolling arrays easier to apply.",
    relatedTerms: ["tabulation", "top-down-approach", "dynamic-programming", "rolling-array"],
    category: "dynamic-programming",
    tags: ["dp", "iterative", "strategy"],
  },
  {
    slug: "knapsack-problem",
    name: "Knapsack Problem",
    definition:
      "The 0/1 knapsack problem asks: given a set of items with weights and values, and a capacity limit, what is the maximum value you can carry? Each item can be taken or left (0 or 1). It is a classic DP problem with a two-dimensional state of item index and remaining capacity.",
    formula: "$dp[i][w] = \\max(dp[i-1][w],\\; dp[i-1][w - w_i] + v_i)$",
    relatedTerms: ["dynamic-programming", "subset-sum", "state", "optimal-substructure"],
    category: "dynamic-programming",
    tags: ["dp", "classic", "optimization", "knapsack"],
  },
  {
    slug: "longest-common-subsequence",
    name: "Longest Common Subsequence",
    definition:
      "The longest common subsequence (LCS) problem finds the longest sequence of characters that appears in the same relative order in two strings, but not necessarily contiguously. It is widely used in diff tools, bioinformatics, and version control systems.",
    formula: "$dp[i][j] = \\begin{cases} dp[i-1][j-1] + 1 & \\text{if } a_i = b_j \\\\ \\max(dp[i-1][j],\\; dp[i][j-1]) & \\text{otherwise} \\end{cases}$",
    relatedTerms: ["edit-distance", "dynamic-programming", "longest-increasing-subsequence"],
    category: "dynamic-programming",
    tags: ["dp", "classic", "string", "subsequence"],
  },
  {
    slug: "edit-distance",
    name: "Edit Distance",
    definition:
      "Edit distance (Levenshtein distance) measures the minimum number of single-character operations (insert, delete, replace) needed to transform one string into another. It is used in spell checkers, DNA sequence alignment, and natural language processing.",
    formula: "$dp[i][j] = \\min(dp[i-1][j] + 1,\\; dp[i][j-1] + 1,\\; dp[i-1][j-1] + \\mathbb{1}_{a_i \\neq b_j})$",
    relatedTerms: ["longest-common-subsequence", "dynamic-programming", "recurrence-relation"],
    category: "dynamic-programming",
    tags: ["dp", "classic", "string", "distance"],
  },
  {
    slug: "coin-change-problem",
    name: "Coin Change Problem",
    definition:
      "The coin change problem asks for the minimum number of coins needed to make a given amount, given a set of coin denominations (with unlimited supply of each). It is a classic unbounded knapsack-style DP problem that demonstrates the power of bottom-up tabulation.",
    formula: "$dp[a] = \\min_{c \\in \\text{coins}}(dp[a - c] + 1)$",
    relatedTerms: ["dynamic-programming", "knapsack-problem", "tabulation"],
    category: "dynamic-programming",
    tags: ["dp", "classic", "optimization", "coins"],
  },
  {
    slug: "matrix-chain-multiplication",
    name: "Matrix Chain Multiplication",
    definition:
      "Matrix chain multiplication finds the most efficient way to parenthesize a sequence of matrices to minimize the total number of scalar multiplications. It is a classic interval DP problem where the state represents a contiguous sub-chain of matrices.",
    formula: "$dp[i][j] = \\min_{i \\leq k < j}(dp[i][k] + dp[k+1][j] + p_{i-1} \\cdot p_k \\cdot p_j)$",
    relatedTerms: ["interval-dp", "dynamic-programming", "optimal-substructure"],
    category: "dynamic-programming",
    tags: ["dp", "classic", "interval", "optimization"],
  },
  {
    slug: "fibonacci-sequence",
    name: "Fibonacci Sequence",
    definition:
      "The Fibonacci sequence is the classic introductory DP example where each number is the sum of the two preceding ones. A naive recursive solution has exponential time, but memoization or tabulation reduces it to linear time, beautifully illustrating the benefit of DP.",
    formula: "$F(n) = F(n-1) + F(n-2)$, with $F(0) = 0$, $F(1) = 1$",
    relatedTerms: ["memoization", "tabulation", "recurrence-relation", "base-case"],
    category: "dynamic-programming",
    tags: ["dp", "introductory", "sequence", "math"],
  },
  {
    slug: "longest-increasing-subsequence",
    name: "Longest Increasing Subsequence",
    definition:
      "The longest increasing subsequence (LIS) problem finds the longest subsequence of a given array where elements are in strictly increasing order. The classic DP solution runs in $O(n^2)$, but a patience-sorting approach with binary search achieves $O(n \\log n)$.",
    formula: "$dp[i] = \\max_{j < i,\\; a_j < a_i}(dp[j] + 1)$",
    relatedTerms: ["dynamic-programming", "longest-common-subsequence", "state"],
    category: "dynamic-programming",
    tags: ["dp", "classic", "subsequence", "array"],
  },
  {
    slug: "rod-cutting",
    name: "Rod Cutting",
    definition:
      "The rod cutting problem asks how to cut a rod of length $n$ into pieces to maximize revenue, given a price table for each possible piece length. It is a classic unbounded knapsack variant and an excellent introduction to DP with one-dimensional state.",
    formula: "$dp[n] = \\max_{1 \\leq i \\leq n}(p_i + dp[n - i])$",
    relatedTerms: ["dynamic-programming", "knapsack-problem", "optimal-substructure"],
    category: "dynamic-programming",
    tags: ["dp", "classic", "optimization"],
  },
  {
    slug: "subset-sum",
    name: "Subset Sum",
    definition:
      "The subset sum problem asks whether there exists a subset of a given set of integers that sums to a target value. It is a decision problem that can be solved with DP in pseudo-polynomial time and is closely related to the 0/1 knapsack problem.",
    formula: "$dp[i][s] = dp[i-1][s] \\lor dp[i-1][s - a_i]$",
    relatedTerms: ["knapsack-problem", "dynamic-programming", "bitmask-dp"],
    category: "dynamic-programming",
    tags: ["dp", "classic", "decision", "subset"],
  },
  {
    slug: "bellman-equation",
    name: "Bellman Equation",
    definition:
      "The Bellman equation is the fundamental recursive decomposition used in dynamic programming and reinforcement learning. It expresses the value of a state as the immediate reward plus the discounted value of the next state, forming the basis for computing optimal policies.",
    formula: "$V(s) = \\max_a \\left[ R(s, a) + \\gamma \\sum_{s'} P(s' | s, a) V(s') \\right]$",
    relatedTerms: ["value-function", "policy", "dynamic-programming"],
    category: "dynamic-programming",
    tags: ["dp", "reinforcement-learning", "equation", "optimization"],
  },
  {
    slug: "value-function",
    name: "Value Function",
    definition:
      "A value function assigns a numerical value to each state (or state-action pair), representing the expected cumulative reward from that state onward under a given policy. In DP, the value function is what we compute to find optimal solutions.",
    relatedTerms: ["bellman-equation", "policy", "dynamic-programming"],
    category: "dynamic-programming",
    tags: ["dp", "reinforcement-learning", "function"],
  },
  {
    slug: "policy",
    name: "Policy",
    definition:
      "A policy defines the action to take in each state. In the context of DP and reinforcement learning, an optimal policy maximizes the expected cumulative reward. The policy is derived from the value function by choosing the action that leads to the highest-valued next state.",
    relatedTerms: ["bellman-equation", "value-function", "dynamic-programming"],
    category: "dynamic-programming",
    tags: ["dp", "reinforcement-learning", "decision"],
  },
  {
    slug: "catalan-number",
    name: "Catalan Number",
    definition:
      "Catalan numbers are a sequence of natural numbers that appear in many counting problems: the number of valid parenthesizations, binary search tree shapes, triangulations of polygons, and more. They can be computed using DP.",
    formula: "$C_n = \\frac{1}{n+1}\\binom{2n}{n} = \\sum_{i=0}^{n-1} C_i \\cdot C_{n-1-i}$",
    relatedTerms: ["dynamic-programming", "matrix-chain-multiplication", "recurrence-relation"],
    category: "dynamic-programming",
    tags: ["dp", "combinatorics", "counting", "math"],
  },
  {
    slug: "bitmask-dp",
    name: "Bitmask DP",
    definition:
      "Bitmask DP uses a bitmask (an integer where each bit represents whether an element is included) to represent subsets as DP states. It is useful for problems involving subsets of a small set (typically up to 20-25 elements), such as the Traveling Salesman Problem.",
    formula: "$dp[\\text{mask}]$ where mask encodes a subset; $O(2^n \\cdot n)$ states",
    relatedTerms: ["dynamic-programming", "subset-sum", "state"],
    category: "dynamic-programming",
    tags: ["dp", "bitmask", "subset", "advanced"],
  },
  {
    slug: "digit-dp",
    name: "Digit DP",
    definition:
      "Digit DP is a technique for counting numbers in a range that satisfy certain digit-level constraints (e.g., sum of digits, specific digit patterns). The state tracks the current digit position, a tight constraint flag, and any problem-specific parameters.",
    relatedTerms: ["dynamic-programming", "state", "recurrence-relation"],
    category: "dynamic-programming",
    tags: ["dp", "digits", "counting", "advanced"],
  },
  {
    slug: "tree-dp",
    name: "Tree DP",
    definition:
      "Tree DP applies dynamic programming on tree structures, where each node's value depends on the solutions computed for its children. Common examples include finding the diameter of a tree, maximum independent set on a tree, and tree re-rooting techniques.",
    relatedTerms: ["dynamic-programming", "state", "recurrence-relation"],
    category: "dynamic-programming",
    tags: ["dp", "tree", "graph", "advanced"],
  },
  {
    slug: "interval-dp",
    name: "Interval DP",
    definition:
      "Interval DP solves problems where the state represents a contiguous interval (subarray or substring). It typically splits the interval at every possible point and combines the results. Classic examples include matrix chain multiplication and optimal binary search trees.",
    relatedTerms: ["matrix-chain-multiplication", "dynamic-programming", "state"],
    category: "dynamic-programming",
    tags: ["dp", "interval", "range", "advanced"],
  },
  {
    slug: "space-optimization",
    name: "Space Optimization",
    definition:
      "Space optimization in DP reduces memory usage by observing that only a few previous rows or states are needed at any time. For example, a 2D DP table can often be reduced to one or two 1D arrays, turning $O(n \\cdot m)$ space into $O(m)$.",
    relatedTerms: ["rolling-array", "tabulation", "bottom-up-approach"],
    category: "dynamic-programming",
    tags: ["dp", "optimization", "memory", "technique"],
  },
  {
    slug: "rolling-array",
    name: "Rolling Array",
    definition:
      "A rolling array is a space optimization technique where you reuse a small number of arrays (often two or even one) instead of storing the entire DP table. By alternating between arrays using modular indexing, you keep only the rows needed for the current computation.",
    relatedTerms: ["space-optimization", "tabulation", "bottom-up-approach"],
    category: "dynamic-programming",
    tags: ["dp", "optimization", "memory", "technique"],
  },
];
