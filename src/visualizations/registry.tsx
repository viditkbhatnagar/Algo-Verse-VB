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
};

export function getVisualization(algorithmId: string): ComponentType | null {
  return visualizationRegistry[algorithmId] ?? null;
}
