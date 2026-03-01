import type { GlossaryTermData } from "@/lib/visualization/types";

export const searchingTerms: GlossaryTermData[] = [
  {
    slug: "linear-search",
    name: "Linear Search",
    definition:
      "The simplest searching algorithm that checks every element in the list one by one from the beginning until the target is found or the list is exhausted. Linear search works on both sorted and unsorted data and is the only option when the data has no particular ordering.",
    formula: "Time: $O(n)$ worst and average. $O(1)$ best. Space: $O(1)$",
    relatedTerms: ["binary-search", "sentinel-search", "sequential-access", "search-key"],
    category: "searching",
    tags: ["basic", "sequential", "unsorted"],
  },
  {
    slug: "binary-search",
    name: "Binary Search",
    definition:
      "An efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half. It compares the target to the middle element and eliminates half of the remaining elements each step. Binary search is one of the most important algorithms in computer science.",
    formalDefinition:
      "Given a sorted array $A[0..n-1]$ and target $t$, binary search maintains invariant $A[lo] \\leq t \\leq A[hi]$ and recurses on the appropriate half.",
    formula: "Time: $O(\\log n)$. Space: $O(1)$ iterative, $O(\\log n)$ recursive",
    relatedTerms: [
      "linear-search",
      "interpolation-search",
      "exponential-search",
      "ternary-search",
      "lower-bound",
      "upper-bound",
      "search-space",
    ],
    category: "searching",
    tags: ["divide-and-conquer", "sorted", "efficient", "logarithmic"],
  },
  {
    slug: "interpolation-search",
    name: "Interpolation Search",
    definition:
      "An improved variant of binary search for uniformly distributed sorted data. Instead of always checking the middle element, it estimates the target's position based on the value distribution, similar to how humans search a phone book. For uniformly distributed data it achieves O(log log n) average time.",
    formula:
      "Probe position: $pos = lo + \\frac{(t - A[lo]) \\cdot (hi - lo)}{A[hi] - A[lo]}$. Average: $O(\\log \\log n)$. Worst: $O(n)$",
    relatedTerms: ["binary-search", "linear-search", "search-space"],
    category: "searching",
    tags: ["sorted", "adaptive", "distribution-aware"],
  },
  {
    slug: "exponential-search",
    name: "Exponential Search",
    definition:
      "A search algorithm that first finds a range where the target might exist by exponentially increasing the index (1, 2, 4, 8, ...), then performs binary search within that range. It is particularly useful for unbounded or infinite lists and when the target is near the beginning.",
    formula: "Time: $O(\\log i)$ where $i$ is the position of the target. Space: $O(1)$",
    relatedTerms: ["binary-search", "jump-search", "search-space"],
    category: "searching",
    tags: ["sorted", "unbounded", "exponential"],
  },
  {
    slug: "jump-search",
    name: "Jump Search",
    definition:
      "A search algorithm for sorted arrays that works by jumping ahead by fixed steps (typically the square root of the array size) until it overshoots the target, then performing a linear search backward within the last block. Jump search strikes a balance between linear and binary search.",
    formula: "Optimal step size: $\\sqrt{n}$. Time: $O(\\sqrt{n})$. Space: $O(1)$",
    relatedTerms: ["binary-search", "linear-search", "exponential-search"],
    category: "searching",
    tags: ["sorted", "block-based", "simple"],
  },
  {
    slug: "ternary-search",
    name: "Ternary Search",
    definition:
      "A divide-and-conquer search algorithm that divides the search space into three parts instead of two. While it can be used on sorted arrays, it is most commonly used to find the maximum or minimum of a unimodal function (a function that increases then decreases, or vice versa).",
    formula: "Time: $O(\\log_3 n) = O(\\log n)$. More comparisons per step than binary search",
    relatedTerms: ["binary-search", "search-space"],
    category: "searching",
    tags: ["divide-and-conquer", "unimodal", "optimization"],
  },
  {
    slug: "depth-first-search",
    name: "Depth-First Search",
    definition:
      "A graph traversal algorithm that explores as far as possible along each branch before backtracking. DFS uses a stack (or recursion) and is fundamental for detecting cycles, topological sorting, finding connected components, and solving maze problems.",
    formula: "Time: $O(V + E)$. Space: $O(V)$",
    relatedTerms: ["breadth-first-search", "graph", "search-space"],
    category: "searching",
    tags: ["graph", "traversal", "stack-based", "recursive"],
  },
  {
    slug: "breadth-first-search",
    name: "Breadth-First Search",
    definition:
      "A graph traversal algorithm that explores all neighbors at the current depth before moving to the next level. BFS uses a queue and guarantees finding the shortest path in unweighted graphs. It is used for level-order traversal, shortest path, and social network analysis.",
    formula: "Time: $O(V + E)$. Space: $O(V)$",
    relatedTerms: ["depth-first-search", "graph", "queue", "search-space"],
    category: "searching",
    tags: ["graph", "traversal", "queue-based", "shortest-path"],
  },
  {
    slug: "search-space",
    name: "Search Space",
    definition:
      "The set of all possible candidates or solutions that a search algorithm must explore to find the target. Efficient algorithms reduce the search space at each step: binary search halves it, while brute force examines the entire space. Understanding search space is key to analyzing algorithm efficiency.",
    relatedTerms: ["binary-search", "linear-search", "depth-first-search", "breadth-first-search"],
    category: "searching",
    tags: ["concept", "theoretical", "analysis"],
  },
  {
    slug: "search-key",
    name: "Search Key",
    definition:
      "The specific value or attribute being looked for during a search operation. The search key is compared against elements in the data structure to determine matches. In a database context, it is the field used to locate a record; in an array, it is the value being sought.",
    relatedTerms: ["linear-search", "binary-search", "hash-based-search", "index"],
    category: "searching",
    tags: ["concept", "fundamental", "query"],
  },
  {
    slug: "sequential-access",
    name: "Sequential Access",
    definition:
      "A method of accessing data where elements must be read in order, from the first element to the desired position. Linked lists and tape drives provide sequential access. Searching sequentially-accessed data structures requires linear search, as you cannot jump directly to an arbitrary position.",
    relatedTerms: ["random-access", "linear-search", "linked-list"],
    category: "searching",
    tags: ["access-pattern", "linear", "ordered"],
  },
  {
    slug: "random-access",
    name: "Random Access",
    definition:
      "The ability to access any element in a data structure directly in constant time, regardless of its position. Arrays and hash tables provide random access. This property enables efficient algorithms like binary search, which requires jumping to arbitrary positions in the data.",
    formula: "Access time: $O(1)$ regardless of position",
    relatedTerms: ["sequential-access", "binary-search", "array", "hash-table"],
    category: "searching",
    tags: ["access-pattern", "constant-time", "direct"],
  },
  {
    slug: "sentinel-search",
    name: "Sentinel Search",
    definition:
      "An optimization of linear search that places the target value (the sentinel) at the end of the array, eliminating the need to check the array boundary on every iteration. This reduces the number of comparisons per iteration from two to one, providing a small but consistent speedup.",
    formula: "Time: $O(n)$ (same order as linear search, but fewer comparisons per step)",
    relatedTerms: ["linear-search", "search-key"],
    category: "searching",
    tags: ["optimization", "linear", "sentinel"],
  },
  {
    slug: "fibonacci-search",
    name: "Fibonacci Search",
    definition:
      "A comparison-based search algorithm for sorted arrays that uses Fibonacci numbers to divide the array into unequal parts. Like binary search, it eliminates a portion of the array at each step, but it only uses addition and subtraction (no division), making it efficient on systems where division is costly.",
    formula: "Time: $O(\\log n)$. Uses Fibonacci numbers $F_k$ to determine split points",
    relatedTerms: ["binary-search", "jump-search", "interpolation-search"],
    category: "searching",
    tags: ["sorted", "fibonacci", "comparison"],
  },
  {
    slug: "hash-based-search",
    name: "Hash-Based Search",
    definition:
      "A search technique that uses a hash function to compute the location of an element directly from its key, enabling near-constant-time lookups. Hash-based search is the foundation of hash tables, dictionaries, and sets, and is the fastest general-purpose search method for exact match queries.",
    formula: "Average: $O(1)$. Worst (all collisions): $O(n)$",
    relatedTerms: ["hash-table", "hash-function", "search-key", "random-access"],
    category: "searching",
    tags: ["hashing", "constant-time", "exact-match"],
  },
  {
    slug: "index",
    name: "Index",
    definition:
      "A data structure that improves the speed of data retrieval by providing a fast lookup path to the actual data. Like an index in a book that maps topics to page numbers, a database index maps key values to their locations. Indexes trade extra storage space for dramatically faster search performance.",
    relatedTerms: ["hash-table", "binary-search-tree", "b-tree", "lookup-table"],
    category: "searching",
    tags: ["data-structure", "optimization", "database"],
  },
  {
    slug: "lookup-table",
    name: "Lookup Table",
    definition:
      "A precomputed table of values that replaces runtime computation with a simple array or hash table access. By storing answers to known inputs, lookup tables trade memory for speed. They are used in cryptography, trigonometry calculations, and dynamic programming to avoid recomputing results.",
    formula: "Lookup time: $O(1)$. Space: $O(n)$ where $n$ is the number of precomputed entries",
    relatedTerms: ["hash-table", "index", "random-access"],
    category: "searching",
    tags: ["precomputed", "optimization", "caching"],
  },
  {
    slug: "lower-bound",
    name: "Lower Bound",
    definition:
      "In searching, the lower bound of a target value in a sorted array is the position of the first element that is not less than the target. The lower_bound operation is commonly used in binary search variants and range queries, and is a standard function in C++ STL and similar libraries.",
    formalDefinition:
      "Given sorted array $A$ and target $t$, lower_bound returns the smallest index $i$ such that $A[i] \\geq t$.",
    formula: "Time: $O(\\log n)$ via binary search",
    relatedTerms: ["upper-bound", "binary-search", "search-space"],
    category: "searching",
    tags: ["binary-search", "range", "bound"],
  },
  {
    slug: "upper-bound",
    name: "Upper Bound",
    definition:
      "In searching, the upper bound of a target value in a sorted array is the position of the first element that is strictly greater than the target. Together with lower_bound, it defines the range of elements equal to the target, which is useful for counting occurrences and range queries.",
    formalDefinition:
      "Given sorted array $A$ and target $t$, upper_bound returns the smallest index $i$ such that $A[i] > t$.",
    formula: "Time: $O(\\log n)$ via binary search. Count of $t$: upper_bound $-$ lower_bound",
    relatedTerms: ["lower-bound", "binary-search", "search-space"],
    category: "searching",
    tags: ["binary-search", "range", "bound"],
  },
  {
    slug: "two-pointer-technique",
    name: "Two Pointer Technique",
    definition:
      "A searching and traversal pattern that uses two pointers (or indices) to scan through a data structure, typically from both ends toward the center or both from the start at different speeds. It is widely used for problems on sorted arrays and linked lists, such as finding pairs with a given sum, detecting cycles, and removing duplicates.",
    formula: "Typically reduces $O(n^2)$ brute force to $O(n)$ time",
    relatedTerms: ["binary-search", "linear-search", "search-space"],
    category: "searching",
    tags: ["technique", "pattern", "optimization", "pointers"],
  },
];
