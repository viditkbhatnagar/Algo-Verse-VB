import type { AlgorithmMetadata, Category } from "@/lib/visualization/types";

// Sorting
import { bubbleSort } from "./sorting/bubble-sort";
import { selectionSort } from "./sorting/selection-sort";
import { insertionSort } from "./sorting/insertion-sort";
import { mergeSort } from "./sorting/merge-sort";
import { quickSort } from "./sorting/quick-sort";
import { heapSort } from "./sorting/heap-sort";

// Searching
import { linearSearch } from "./searching/linear-search";
import { binarySearch } from "./searching/binary-search";
import { dfs } from "./searching/dfs";
import { bfs } from "./searching/bfs";

// Data Structures
import { stack } from "./data-structures/stack";
import { queue } from "./data-structures/queue";
import { linkedList } from "./data-structures/linked-list";
import { binarySearchTree } from "./data-structures/binary-search-tree";
import { hashTable } from "./data-structures/hash-table";

// Graph
import { dijkstra } from "./graph/dijkstra";
import { kruskal } from "./graph/kruskal";
import { prim } from "./graph/prim";

// Dynamic Programming
import { fibonacci } from "./dynamic-programming/fibonacci";
import { knapsack } from "./dynamic-programming/knapsack";

const algorithms: AlgorithmMetadata[] = [
  // Sorting
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  // Searching
  linearSearch,
  binarySearch,
  dfs,
  bfs,
  // Data Structures
  stack,
  queue,
  linkedList,
  binarySearchTree,
  hashTable,
  // Graph
  dijkstra,
  kruskal,
  prim,
  // Dynamic Programming
  fibonacci,
  knapsack,
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
