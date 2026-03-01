import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const bubbleSort: AlgorithmMetadata = {
  id: "bubble-sort",
  name: "Bubble Sort",
  category: "sorting",
  subcategory: "Comparison-Based Sorting",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    note: "Best case occurs when the array is already sorted and the optimized version with a swap flag is used.",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "In-place sorting algorithm requiring only a constant amount of additional memory for the swap variable.",
  },
  description: `Bubble Sort is one of the simplest sorting algorithms and serves as an excellent introduction to the concept of comparison-based sorting. The algorithm works by repeatedly stepping through the list, comparing each pair of adjacent elements, and swapping them if they are in the wrong order. This process is repeated until no more swaps are needed, indicating that the list is fully sorted. The name "Bubble Sort" comes from the way smaller or larger elements gradually "bubble" to their correct position in the array with each pass.

During each pass through the array, the largest unsorted element moves to its final position at the end of the unsorted portion. This means that after the first pass, the largest element is in its correct position; after the second pass, the two largest elements are in place; and so on. An important optimization is to track whether any swaps were made during a pass — if no swaps occurred, the array is already sorted and the algorithm can terminate early. This optimization gives Bubble Sort its best-case time complexity of O(n) for already-sorted input.

Despite its simplicity, Bubble Sort is rarely used in practice for large datasets because of its O(n²) average and worst-case time complexity. For an array of even a few thousand elements, more efficient algorithms like Merge Sort or Quick Sort will dramatically outperform it. However, Bubble Sort has some practical advantages: it is easy to understand and implement, it is stable (equal elements maintain their relative order), and it works well for small datasets or nearly sorted data.

Bubble Sort is also notable for being an adaptive algorithm when the early-termination optimization is applied. Adaptive algorithms perform better when the input has some existing order, making Bubble Sort a reasonable choice for scenarios where data arrives in a nearly sorted state and only minor adjustments are needed. It is frequently taught in computer science courses as a pedagogical tool for understanding sorting, algorithm analysis, and the importance of algorithmic efficiency.`,
  shortDescription:
    "A simple comparison-based sorting algorithm that repeatedly swaps adjacent elements until the entire array is sorted.",
  pseudocode: `procedure bubbleSort(A: list of sortable items)
    n = length(A)
    for i = 0 to n - 1 do
        swapped = false
        for j = 0 to n - i - 2 do
            if A[j] > A[j + 1] then
                swap(A[j], A[j + 1])
                swapped = true
            end if
        end for
        if not swapped then
            break   // Array is already sorted
        end if
    end for
end procedure`,
  implementations: {
    python: `def bubble_sort(arr: list) -> list:
    """Sort a list in ascending order using Bubble Sort."""
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr


# Example usage
if __name__ == "__main__":
    data = [64, 34, 25, 12, 22, 11, 90]
    print("Original:", data)
    print("Sorted:  ", bubble_sort(data))`,
    javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}

// Example usage
const data = [64, 34, 25, 12, 22, 11, 90];
console.log("Original:", data);
console.log("Sorted:  ", bubbleSort([...data]));`,
  },
  useCases: [
    "Educational tool for teaching fundamental sorting concepts and algorithm analysis",
    "Sorting very small datasets (fewer than 20 elements) where simplicity is preferred over efficiency",
    "Detecting whether a list is already sorted with the early-termination optimization",
    "Situations where nearly sorted data needs minor corrections with minimal code complexity",
  ],
  relatedAlgorithms: [
    "selection-sort",
    "insertion-sort",
    "merge-sort",
    "quick-sort",
    "heap-sort",
  ],
  glossaryTerms: [
    "comparison sort",
    "stable sort",
    "in-place algorithm",
    "adaptive algorithm",
    "time complexity",
    "space complexity",
    "swap",
  ],
  tags: [
    "sorting",
    "comparison-based",
    "stable",
    "in-place",
    "beginner",
    "quadratic",
    "adaptive",
  ],
};
