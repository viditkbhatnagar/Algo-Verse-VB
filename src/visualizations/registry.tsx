import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

const visualizationRegistry: Record<string, ComponentType> = {
  // Sorting
  "bubble-sort": dynamic(
    () => import("@/visualizations/sorting/BubbleSort"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "selection-sort": dynamic(
    () => import("@/visualizations/sorting/SelectionSort"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "insertion-sort": dynamic(
    () => import("@/visualizations/sorting/InsertionSort"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "merge-sort": dynamic(
    () => import("@/visualizations/sorting/MergeSort"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "quick-sort": dynamic(
    () => import("@/visualizations/sorting/QuickSort"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "heap-sort": dynamic(
    () => import("@/visualizations/sorting/HeapSort"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "counting-sort": dynamic(
    () => import("@/visualizations/sorting/CountingSort"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "radix-sort": dynamic(
    () => import("@/visualizations/sorting/RadixSort"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Searching
  "linear-search": dynamic(
    () => import("@/visualizations/searching/LinearSearch"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "binary-search": dynamic(
    () => import("@/visualizations/searching/BinarySearch"),
    { ssr: false, loading: LoadingSpinner }
  ),
  dfs: dynamic(
    () => import("@/visualizations/searching/DFS"),
    { ssr: false, loading: LoadingSpinner }
  ),
  bfs: dynamic(
    () => import("@/visualizations/searching/BFS"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Data Structures
  stack: dynamic(
    () => import("@/visualizations/data-structures/Stack"),
    { ssr: false, loading: LoadingSpinner }
  ),
  queue: dynamic(
    () => import("@/visualizations/data-structures/Queue"),
    { ssr: false, loading: LoadingSpinner }
  ),
  array: dynamic(
    () => import("@/visualizations/data-structures/Array"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "dynamic-array": dynamic(
    () => import("@/visualizations/data-structures/DynamicArray"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "doubly-linked-list": dynamic(
    () => import("@/visualizations/data-structures/DoublyLinkedList"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "linked-list": dynamic(
    () => import("@/visualizations/data-structures/LinkedList"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "binary-tree": dynamic(
    () => import("@/visualizations/data-structures/BinaryTree"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "binary-search-tree": dynamic(
    () => import("@/visualizations/data-structures/BST"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "avl-tree": dynamic(
    () => import("@/visualizations/data-structures/AVLTree"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "min-heap": dynamic(
    () => import("@/visualizations/data-structures/MinHeap"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "max-heap": dynamic(
    () => import("@/visualizations/data-structures/MaxHeap"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "priority-queue": dynamic(
    () => import("@/visualizations/data-structures/PriorityQueue"),
    { ssr: false, loading: LoadingSpinner }
  ),
  trie: dynamic(
    () => import("@/visualizations/data-structures/Trie"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "hash-table": dynamic(
    () => import("@/visualizations/data-structures/HashTable"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "hash-table-open-addressing": dynamic(
    () => import("@/visualizations/data-structures/HashTableOpenAddressing"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "union-find": dynamic(
    () => import("@/visualizations/data-structures/UnionFind"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "adjacency-matrix": dynamic(
    () => import("@/visualizations/data-structures/AdjacencyMatrix"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Graph
  dijkstra: dynamic(
    () => import("@/visualizations/graph/Dijkstra"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "bellman-ford": dynamic(
    () => import("@/visualizations/graph/BellmanFord"),
    { ssr: false, loading: LoadingSpinner }
  ),
  kruskal: dynamic(
    () => import("@/visualizations/graph/Kruskal"),
    { ssr: false, loading: LoadingSpinner }
  ),
  prim: dynamic(
    () => import("@/visualizations/graph/Prim"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "topological-sort": dynamic(
    () => import("@/visualizations/graph/TopologicalSort"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "a-star": dynamic(
    () => import("@/visualizations/graph/AStar"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "cycle-detection": dynamic(
    () => import("@/visualizations/graph/CycleDetection"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Greedy
  "activity-selection": dynamic(
    () => import("@/visualizations/greedy/ActivitySelection"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "fractional-knapsack": dynamic(
    () => import("@/visualizations/greedy/FractionalKnapsack"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "huffman-coding": dynamic(
    () => import("@/visualizations/greedy/HuffmanCoding"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Dynamic Programming
  fibonacci: dynamic(
    () => import("@/visualizations/dynamic-programming/Fibonacci"),
    { ssr: false, loading: LoadingSpinner }
  ),
  knapsack: dynamic(
    () => import("@/visualizations/dynamic-programming/Knapsack"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "climbing-stairs": dynamic(
    () => import("@/visualizations/dynamic-programming/ClimbingStairs"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "coin-change": dynamic(
    () => import("@/visualizations/dynamic-programming/CoinChange"),
    { ssr: false, loading: LoadingSpinner }
  ),
  lcs: dynamic(
    () => import("@/visualizations/dynamic-programming/LCS"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "edit-distance": dynamic(
    () => import("@/visualizations/dynamic-programming/EditDistance"),
    { ssr: false, loading: LoadingSpinner }
  ),
  lis: dynamic(
    () => import("@/visualizations/dynamic-programming/LIS"),
    { ssr: false, loading: LoadingSpinner }
  ),
  kadanes: dynamic(
    () => import("@/visualizations/dynamic-programming/Kadanes"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "unique-paths": dynamic(
    () => import("@/visualizations/dynamic-programming/UniquePaths"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Miscellaneous
  "two-pointer": dynamic(
    () => import("@/visualizations/miscellaneous/TwoPointer"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "sliding-window": dynamic(
    () => import("@/visualizations/miscellaneous/SlidingWindow"),
    { ssr: false, loading: LoadingSpinner }
  ),
  recursion: dynamic(
    () => import("@/visualizations/miscellaneous/Recursion"),
    { ssr: false, loading: LoadingSpinner }
  ),
  memoization: dynamic(
    () => import("@/visualizations/miscellaneous/Memoization"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // String
  "naive-string-matching": dynamic(
    () => import("@/visualizations/string/NaiveStringMatching"),
    { ssr: false, loading: LoadingSpinner }
  ),
  kmp: dynamic(
    () => import("@/visualizations/string/KMP"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Mathematical
  "euclidean-gcd": dynamic(
    () => import("@/visualizations/mathematical/EuclideanGCD"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "sieve-of-eratosthenes": dynamic(
    () => import("@/visualizations/mathematical/SieveOfEratosthenes"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "matrix-operations": dynamic(
    () => import("@/visualizations/mathematical/MatrixOperations"),
    { ssr: false, loading: LoadingSpinner }
  ),
  // Backtracking
  "n-queens": dynamic(
    () => import("@/visualizations/backtracking/NQueens"),
    { ssr: false, loading: LoadingSpinner }
  ),
  "sudoku-solver": dynamic(
    () => import("@/visualizations/backtracking/SudokuSolver"),
    { ssr: false, loading: LoadingSpinner }
  ),
};

export function getVisualization(algorithmId: string): ComponentType | null {
  return visualizationRegistry[algorithmId] ?? null;
}
