import type { AlgorithmMetadata, Category } from "@/lib/visualization/types";

// Sorting
import { bubbleSort } from "./sorting/bubble-sort";
import { selectionSort } from "./sorting/selection-sort";
import { insertionSort } from "./sorting/insertion-sort";
import { mergeSort } from "./sorting/merge-sort";
import { quickSort } from "./sorting/quick-sort";
import { heapSort } from "./sorting/heap-sort";
import { countingSort } from "./sorting/counting-sort";
import { radixSort } from "./sorting/radix-sort";

// Searching
import { linearSearch } from "./searching/linear-search";
import { binarySearch } from "./searching/binary-search";
import { dfs } from "./searching/dfs";
import { bfs } from "./searching/bfs";

// Data Structures
import { stack } from "./data-structures/stack";
import { queue } from "./data-structures/queue";
import { array } from "./data-structures/array";
import { dynamicArray } from "./data-structures/dynamic-array";
import { doublyLinkedList } from "./data-structures/doubly-linked-list";
import { linkedList } from "./data-structures/linked-list";
import { binaryTree } from "./data-structures/binary-tree";
import { binarySearchTree } from "./data-structures/binary-search-tree";
import { avlTree } from "./data-structures/avl-tree";
import { hashTable } from "./data-structures/hash-table";
import { hashTableOpenAddressing } from "./data-structures/hash-table-open-addressing";
import { unionFind } from "./data-structures/union-find";
import { adjacencyMatrix } from "./data-structures/adjacency-matrix";
import { minHeap } from "./data-structures/min-heap";
import { maxHeap } from "./data-structures/max-heap";
import { priorityQueue } from "./data-structures/priority-queue";
import { trie } from "./data-structures/trie";

// Graph
import { dijkstra } from "./graph/dijkstra";
import { bellmanFord } from "./graph/bellman-ford";
import { kruskal } from "./graph/kruskal";
import { prim } from "./graph/prim";
import { topologicalSort } from "./graph/topological-sort";
import { aStar } from "./graph/a-star";
import { cycleDetection } from "./graph/cycle-detection";

// Greedy
import { activitySelection } from "./greedy/activity-selection";
import { fractionalKnapsack } from "./greedy/fractional-knapsack";
import { huffmanCoding } from "./greedy/huffman-coding";

// Dynamic Programming
import { fibonacci } from "./dynamic-programming/fibonacci";
import { knapsack } from "./dynamic-programming/knapsack";
import { climbingStairs } from "./dynamic-programming/climbing-stairs";
import { coinChange } from "./dynamic-programming/coin-change";
import { lcs } from "./dynamic-programming/lcs";
import { editDistance } from "./dynamic-programming/edit-distance";
import { lis } from "./dynamic-programming/lis";
import { kadanes } from "./dynamic-programming/kadanes";
import { uniquePaths } from "./dynamic-programming/unique-paths";

// String
import { naiveStringMatching } from "./string/naive-string-matching";
import { kmp } from "./string/kmp";

// Mathematical
import { euclideanGcd } from "./mathematical/euclidean-gcd";
import { sieveOfEratosthenes } from "./mathematical/sieve-of-eratosthenes";
import { matrixOperations } from "./mathematical/matrix-operations";

// Backtracking
import { nQueens } from "./backtracking/n-queens";
import { sudokuSolver } from "./backtracking/sudoku-solver";

// Miscellaneous
import { twoPointer } from "./miscellaneous/two-pointer";
import { slidingWindow } from "./miscellaneous/sliding-window";
import { recursion } from "./miscellaneous/recursion";
import { memoization } from "./miscellaneous/memoization";

const algorithms: AlgorithmMetadata[] = [
  // Sorting
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  countingSort,
  radixSort,
  // Searching
  linearSearch,
  binarySearch,
  dfs,
  bfs,
  // Data Structures
  stack,
  queue,
  array,
  dynamicArray,
  doublyLinkedList,
  linkedList,
  binaryTree,
  binarySearchTree,
  avlTree,
  hashTable,
  hashTableOpenAddressing,
  unionFind,
  adjacencyMatrix,
  minHeap,
  maxHeap,
  priorityQueue,
  trie,
  // Graph
  dijkstra,
  bellmanFord,
  kruskal,
  prim,
  topologicalSort,
  aStar,
  cycleDetection,
  // Greedy
  activitySelection,
  fractionalKnapsack,
  huffmanCoding,
  // Dynamic Programming
  fibonacci,
  knapsack,
  climbingStairs,
  coinChange,
  lcs,
  editDistance,
  lis,
  kadanes,
  uniquePaths,
  // String
  naiveStringMatching,
  kmp,
  // Mathematical
  euclideanGcd,
  sieveOfEratosthenes,
  matrixOperations,
  // Backtracking
  nQueens,
  sudokuSolver,
  // Miscellaneous
  twoPointer,
  slidingWindow,
  recursion,
  memoization,
];

export function getAllAlgorithms(): AlgorithmMetadata[] {
  return algorithms;
}

export function getAlgorithmById(id: string): AlgorithmMetadata | undefined {
  return algorithms.find((a) => a.id === id);
}

export function getAlgorithmsByCategory(category: Category | string): AlgorithmMetadata[] {
  return algorithms.filter((a) => a.category === category);
}
