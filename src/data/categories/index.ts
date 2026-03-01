import type { CategoryInfo } from "@/lib/visualization/types";

export const categories: CategoryInfo[] = [
  {
    id: "data-structures",
    slug: "data-structures",
    name: "Data Structures",
    description:
      "Fundamental building blocks for organizing and storing data efficiently. Covers arrays, linked lists, trees, hash tables, heaps, graphs, and advanced structures like tries and disjoint sets.",
    icon: "Database",
    subcategories: ["Linear", "Trees", "Hash-Based", "Graph Structures", "Advanced"],
    algorithmCount: 42,
  },
  {
    id: "sorting",
    slug: "sorting",
    name: "Sorting",
    description:
      "Algorithms that arrange elements in a specific order. Includes comparison-based sorts like merge sort and quicksort, as well as non-comparison sorts like counting sort and radix sort.",
    icon: "ArrowUpDown",
    subcategories: ["Comparison-Based", "Non-Comparison", "Special Purpose"],
    algorithmCount: 19,
  },
  {
    id: "searching",
    slug: "searching",
    name: "Searching",
    description:
      "Techniques for finding specific elements within data structures. Ranges from simple linear search to binary search and graph traversal algorithms like BFS and DFS.",
    icon: "Search",
    subcategories: ["Linear", "Binary", "Graph Traversals"],
    algorithmCount: 11,
  },
  {
    id: "graph",
    slug: "graph",
    name: "Graph Algorithms",
    description:
      "Algorithms for solving problems on graph structures. Includes shortest path finding, minimum spanning trees, network flow, topological sorting, and connectivity analysis.",
    icon: "GitBranch",
    subcategories: ["Shortest Path", "Minimum Spanning Tree", "Network Flow", "Connectivity"],
    algorithmCount: 21,
  },
  {
    id: "dynamic-programming",
    slug: "dynamic-programming",
    name: "Dynamic Programming",
    description:
      "Optimization technique that breaks complex problems into overlapping subproblems. Covers classic problems like knapsack, longest common subsequence, and grid-based path finding.",
    icon: "Table2",
    subcategories: ["Classic", "Sequences", "Grid Problems", "Optimization"],
    algorithmCount: 25,
  },
  {
    id: "greedy",
    slug: "greedy",
    name: "Greedy Algorithms",
    description:
      "Algorithms that make locally optimal choices at each step to find global solutions. Includes activity selection, Huffman coding, and scheduling problems.",
    icon: "Zap",
    subcategories: ["Selection", "Scheduling", "Compression"],
    algorithmCount: 7,
  },
  {
    id: "divide-and-conquer",
    slug: "divide-and-conquer",
    name: "Divide & Conquer",
    description:
      "Strategy of breaking problems into smaller subproblems, solving them independently, and combining results. Foundation for merge sort, quicksort, and geometric algorithms.",
    icon: "Split",
    subcategories: ["Sorting", "Searching", "Geometric"],
    algorithmCount: 7,
  },
  {
    id: "string",
    slug: "string",
    name: "String Algorithms",
    description:
      "Algorithms for processing and analyzing text data. Covers pattern matching, substring search, and string distance metrics including KMP, Rabin-Karp, and Z-algorithm.",
    icon: "Type",
    subcategories: ["Pattern Matching", "Distance Metrics", "Compression"],
    algorithmCount: 9,
  },
  {
    id: "mathematical",
    slug: "mathematical",
    name: "Mathematical",
    description:
      "Number theory, computational geometry, and algebraic algorithms. Includes GCD computation, prime sieves, fast Fourier transforms, and matrix operations.",
    icon: "Calculator",
    subcategories: ["Number Theory", "Geometry", "Linear Algebra"],
    algorithmCount: 11,
  },
  {
    id: "backtracking",
    slug: "backtracking",
    name: "Backtracking",
    description:
      "Systematic approach to exploring all possible solutions by building candidates incrementally and abandoning paths that fail constraints. Classic problems include N-Queens and Sudoku.",
    icon: "Undo2",
    subcategories: ["Constraint Satisfaction", "Combinatorial", "Puzzle Solving"],
    algorithmCount: 7,
  },
  {
    id: "machine-learning",
    slug: "machine-learning",
    name: "Machine Learning",
    description:
      "Statistical learning algorithms that improve through experience. Covers regression, classification, clustering, ensemble methods, dimensionality reduction, and evaluation techniques.",
    icon: "Brain",
    subcategories: ["Regression", "Classification", "Clustering", "Ensemble Methods", "Evaluation"],
    algorithmCount: 36,
  },
  {
    id: "deep-learning",
    slug: "deep-learning",
    name: "Deep Learning",
    description:
      "Neural network architectures and training techniques. Includes perceptrons, CNNs, RNNs, LSTMs, transformers, attention mechanisms, optimizers, and regularization methods.",
    icon: "Cpu",
    subcategories: ["Fundamentals", "CNN", "RNN", "Transformer", "Optimization", "Regularization"],
    algorithmCount: 42,
  },
  {
    id: "nlp",
    slug: "nlp",
    name: "Natural Language Processing",
    description:
      "Algorithms for understanding and generating human language. Covers tokenization, embeddings, attention mechanisms, BERT/GPT architectures, and NLP tasks like NER and sentiment analysis.",
    icon: "MessageSquare",
    subcategories: ["Preprocessing", "Embeddings", "Architectures", "Tasks", "Decoding"],
    algorithmCount: 39,
  },
  {
    id: "reinforcement-learning",
    slug: "reinforcement-learning",
    name: "Reinforcement Learning",
    description:
      "Learning through interaction with an environment to maximize cumulative reward. Covers Markov decision processes, Q-learning, policy gradients, and exploration strategies.",
    icon: "Gamepad2",
    subcategories: ["Value-Based", "Policy-Based", "Exploration"],
    algorithmCount: 10,
  },
  {
    id: "optimization",
    slug: "optimization",
    name: "Optimization",
    description:
      "Algorithms for finding the best solution from a set of feasible solutions. Includes gradient descent variants, simulated annealing, genetic algorithms, and convex optimization.",
    icon: "TrendingUp",
    subcategories: ["Gradient-Based", "Metaheuristic", "Convex"],
    algorithmCount: 8,
  },
  {
    id: "miscellaneous",
    slug: "miscellaneous",
    name: "Miscellaneous",
    description:
      "Essential algorithmic techniques and patterns that span multiple categories. Includes two pointers, sliding window, recursion visualization, memoization, and bit manipulation.",
    icon: "Puzzle",
    subcategories: ["Techniques", "Patterns"],
    algorithmCount: 6,
  },
];

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getAllCategories(): CategoryInfo[] {
  return categories;
}
