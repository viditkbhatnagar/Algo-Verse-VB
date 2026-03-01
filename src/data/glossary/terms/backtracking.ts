import type { GlossaryTermData } from "@/lib/visualization/types";

export const backtrackingTerms: GlossaryTermData[] = [
  {
    slug: "backtracking",
    name: "Backtracking",
    definition:
      "Backtracking is a general algorithmic technique for solving problems incrementally by building candidates to the solution and abandoning (backtracking from) a candidate as soon as it is determined that it cannot lead to a valid solution. It systematically explores all possible configurations and is often implemented using recursion, where each recursive call represents a choice.",
    relatedTerms: ["state-space-tree", "pruning", "recursive-backtracking", "constraint-satisfaction", "solution-space"],
    category: "backtracking",
    tags: ["technique", "fundamental", "exhaustive-search", "recursive"],
  },
  {
    slug: "state-space-tree",
    name: "State Space Tree",
    definition:
      "A state space tree is a tree that represents all possible states (partial solutions) of a problem as nodes, and the choices or decisions that transition between states as edges. Backtracking algorithms traverse this tree using depth-first search, building solutions along paths from the root to the leaves and pruning branches that cannot lead to valid solutions.",
    relatedTerms: ["backtracking", "pruning", "solution-space", "implicit-graph", "branch-and-bound"],
    category: "backtracking",
    tags: ["concept", "tree", "search-space"],
  },
  {
    slug: "pruning",
    name: "Pruning",
    definition:
      "Pruning is the process of eliminating portions of the state space tree that cannot lead to a valid or optimal solution. By detecting dead ends early, pruning dramatically reduces the number of nodes explored and makes backtracking practical for many problems. Good pruning strategies can turn an exponential search into something manageable.",
    relatedTerms: ["backtracking", "state-space-tree", "feasibility-check", "branch-and-bound"],
    category: "backtracking",
    tags: ["optimization", "technique", "efficiency"],
  },
  {
    slug: "constraint-satisfaction",
    name: "Constraint Satisfaction",
    definition:
      "A constraint satisfaction problem (CSP) requires finding values for a set of variables such that all given constraints are satisfied simultaneously. Backtracking is the primary technique for solving CSPs: variables are assigned values one at a time, and when a constraint is violated, the algorithm backtracks to try a different value. Examples include Sudoku, graph coloring, and scheduling problems.",
    relatedTerms: ["backtracking", "feasibility-check", "pruning", "sudoku", "graph-coloring"],
    category: "backtracking",
    tags: ["problem-type", "variables", "constraints"],
  },
  {
    slug: "n-queens-problem",
    name: "N-Queens Problem",
    definition:
      "The N-Queens problem asks how to place $N$ queens on an $N \\times N$ chessboard so that no two queens threaten each other (no two share the same row, column, or diagonal). It is the classic example of a backtracking problem: queens are placed one row at a time, and if a placement conflicts, the algorithm backtracks and tries the next column.",
    formula: "Solutions: 1 for $N=1$, 0 for $N=2,3$, 2 for $N=4$, 10 for $N=5$, 92 for $N=8$. Time: $O(N!)$ worst case",
    relatedTerms: ["backtracking", "constraint-satisfaction", "state-space-tree", "feasibility-check", "pruning"],
    category: "backtracking",
    tags: ["classic", "chess", "placement"],
  },
  {
    slug: "sudoku",
    name: "Sudoku",
    definition:
      "Sudoku is a constraint satisfaction puzzle where the goal is to fill a $9 \\times 9$ grid with digits 1 through 9 such that each row, each column, and each of the nine $3 \\times 3$ sub-grids contains all digits exactly once. Backtracking solves Sudoku by placing a digit in the first empty cell, checking constraints, and backtracking if a violation is found.",
    relatedTerms: ["constraint-satisfaction", "backtracking", "feasibility-check", "pruning"],
    category: "backtracking",
    tags: ["classic", "puzzle", "grid"],
  },
  {
    slug: "hamiltonian-cycle",
    name: "Hamiltonian Cycle",
    definition:
      "A Hamiltonian cycle is a cycle in a graph that visits every vertex exactly once and returns to the starting vertex. Determining whether a Hamiltonian cycle exists is an NP-complete problem, so no known polynomial-time algorithm exists. Backtracking explores all possible orderings of vertices, pruning paths that revisit a vertex or cannot be completed.",
    relatedTerms: ["backtracking", "graph-coloring", "implicit-graph", "state-space-tree", "pruning"],
    category: "backtracking",
    tags: ["graph", "np-complete", "cycle"],
  },
  {
    slug: "graph-coloring",
    name: "Graph Coloring",
    definition:
      "The graph coloring problem asks whether the vertices of a graph can be colored using at most $k$ colors such that no two adjacent vertices share the same color. The minimum number of colors needed is called the chromatic number. Backtracking assigns colors to vertices one at a time, backtracking when a color conflict is detected.",
    formula: "Chromatic number $\\chi(G)$ = minimum $k$ such that a valid $k$-coloring exists",
    relatedTerms: ["constraint-satisfaction", "backtracking", "feasibility-check", "n-queens-problem"],
    category: "backtracking",
    tags: ["graph", "coloring", "np-complete"],
  },
  {
    slug: "subset-generation",
    name: "Subset Generation",
    definition:
      "Subset generation is the problem of enumerating all subsets (the power set) of a given set. Using backtracking, each element is either included or excluded, generating a binary state space tree of depth $n$. This approach naturally extends to problems like the subset sum problem, where only subsets satisfying a constraint are sought.",
    formula: "Total subsets of a set with $n$ elements: $2^n$. Time: $O(2^n)$",
    relatedTerms: ["permutation-generation", "backtracking", "solution-space", "state-space-tree"],
    category: "backtracking",
    tags: ["enumeration", "power-set", "combinatorial"],
  },
  {
    slug: "permutation-generation",
    name: "Permutation Generation",
    definition:
      "Permutation generation is the problem of producing all possible orderings of a set of elements. Backtracking generates permutations by fixing one element at a time in each position and recursively generating permutations of the remaining elements. It is used in brute-force solutions for problems like the traveling salesman problem.",
    formula: "Total permutations of $n$ elements: $n!$. Time: $O(n \\cdot n!)$",
    relatedTerms: ["subset-generation", "backtracking", "solution-space", "state-space-tree"],
    category: "backtracking",
    tags: ["enumeration", "ordering", "combinatorial"],
  },
  {
    slug: "branch-and-bound",
    name: "Branch and Bound",
    definition:
      "Branch and bound is an optimization technique that extends backtracking by maintaining a bound on the best possible solution achievable from a given node. If the bound indicates that no solution in a subtree can improve upon the best solution found so far, the entire subtree is pruned. It is widely used for solving NP-hard optimization problems like the traveling salesman and integer programming.",
    relatedTerms: ["backtracking", "pruning", "state-space-tree", "solution-space"],
    category: "backtracking",
    tags: ["optimization", "technique", "bounding"],
  },
  {
    slug: "feasibility-check",
    name: "Feasibility Check",
    definition:
      "A feasibility check (also called a constraint check or promising function) determines whether a partial solution can potentially lead to a valid complete solution. In backtracking, this check is performed at each node of the state space tree before extending the partial solution further. An efficient feasibility check is key to effective pruning.",
    relatedTerms: ["backtracking", "pruning", "constraint-satisfaction", "state-space-tree"],
    category: "backtracking",
    tags: ["technique", "validation", "constraint"],
  },
  {
    slug: "solution-space",
    name: "Solution Space",
    definition:
      "The solution space is the set of all possible complete candidates (potential solutions) for a problem. For a problem with $n$ binary choices, the solution space contains $2^n$ candidates; for $n$ items to be permuted, it contains $n!$ candidates. Backtracking systematically searches this space, using pruning to avoid exploring regions that cannot contain valid solutions.",
    formula: "Size depends on the problem: $2^n$ for subsets, $n!$ for permutations, $k^n$ for $k$-ary choices",
    relatedTerms: ["state-space-tree", "backtracking", "subset-generation", "permutation-generation"],
    category: "backtracking",
    tags: ["concept", "search-space", "enumeration"],
  },
  {
    slug: "implicit-graph",
    name: "Implicit Graph",
    definition:
      "An implicit graph is a graph that is not stored explicitly in memory but is generated on-the-fly during exploration. In backtracking, the state space tree is an implicit graph: each state and its successors are computed only when visited. This allows backtracking to handle enormous search spaces that could never be stored in memory.",
    relatedTerms: ["state-space-tree", "backtracking", "solution-space", "hamiltonian-cycle"],
    category: "backtracking",
    tags: ["concept", "graph", "memory-efficient"],
  },
  {
    slug: "recursive-backtracking",
    name: "Recursive Backtracking",
    definition:
      "Recursive backtracking is the standard implementation pattern for backtracking algorithms. Each recursive call represents extending the current partial solution by one decision. If the extended solution violates constraints, the function returns (backtracks) and the caller tries the next option. The call stack naturally manages the undo history, making the code elegant and concise.",
    relatedTerms: ["backtracking", "state-space-tree", "feasibility-check", "pruning"],
    category: "backtracking",
    tags: ["implementation", "recursion", "pattern"],
  },
];
