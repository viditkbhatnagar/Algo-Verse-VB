import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const selectionSort: AlgorithmMetadata = {
  id: "selection-sort",
  name: "Selection Sort",
  category: "sorting",
  subcategory: "Comparison-Based Sorting",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    note: "Always performs the same number of comparisons regardless of input order, making it non-adaptive.",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "In-place sorting algorithm that only requires a constant amount of extra memory for index tracking.",
  },
  description: `Selection Sort is a straightforward comparison-based sorting algorithm that divides the input array into two conceptual regions: a sorted portion at the beginning and an unsorted portion occupying the rest. The algorithm repeatedly finds the minimum element from the unsorted region and places it at the end of the sorted region. This process continues until the unsorted region is empty and the entire array is sorted.

The algorithm operates by iterating through the array with an outer loop that tracks the boundary between the sorted and unsorted regions. For each position in the outer loop, the inner loop scans the entire unsorted region to find the index of the minimum element. Once found, that minimum element is swapped with the element at the current boundary position, effectively growing the sorted region by one element. After n-1 passes, every element has been placed in its correct position.

One distinctive property of Selection Sort is that it always performs exactly n(n-1)/2 comparisons, regardless of whether the input is already sorted, reverse sorted, or randomly ordered. This makes it non-adaptive — it cannot take advantage of existing order in the data. However, Selection Sort does have an advantage over Bubble Sort in terms of the number of swaps: it performs at most n-1 swaps (one per pass), compared to Bubble Sort which may perform O(n²) swaps in the worst case. This makes Selection Sort preferable when the cost of writing to memory is significantly higher than the cost of comparisons.

Selection Sort is not stable in its standard implementation because the swap operation can change the relative order of equal elements. For example, if the array contains two equal elements and the first one is swapped past the second during a minimum-finding pass, their original order is lost. Despite its O(n²) time complexity making it impractical for large datasets, Selection Sort is valued for its simplicity, minimal memory usage, and predictable performance characteristics, making it useful in embedded systems and educational contexts.`,
  shortDescription:
    "An in-place sorting algorithm that repeatedly selects the minimum element from the unsorted portion and moves it to the sorted portion.",
  pseudocode: `procedure selectionSort(A: list of sortable items)
    n = length(A)
    for i = 0 to n - 2 do
        minIndex = i
        for j = i + 1 to n - 1 do
            if A[j] < A[minIndex] then
                minIndex = j
            end if
        end for
        if minIndex != i then
            swap(A[i], A[minIndex])
        end if
    end for
end procedure`,
  implementations: {
    python: `def selection_sort(arr: list) -> list:
    """Sort a list in ascending order using Selection Sort."""
    n = len(arr)
    for i in range(n - 1):
        min_index = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_index]:
                min_index = j
        if min_index != i:
            arr[i], arr[min_index] = arr[min_index], arr[i]
    return arr


# Example usage
if __name__ == "__main__":
    data = [64, 25, 12, 22, 11]
    print("Original:", data)
    print("Sorted:  ", selection_sort(data))`,
    javascript: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}

// Example usage
const data = [64, 25, 12, 22, 11];
console.log("Original:", data);
console.log("Sorted:  ", selectionSort([...data]));`,
  },
  useCases: [
    "Sorting small arrays where simplicity and minimal code are more important than performance",
    "Environments where memory writes are expensive, since Selection Sort minimizes the number of swaps",
    "Embedded systems with strict memory constraints requiring an in-place algorithm with no extra allocations",
    "Educational demonstrations of basic sorting strategy and algorithm analysis",
  ],
  relatedAlgorithms: [
    "bubble-sort",
    "insertion-sort",
    "merge-sort",
    "quick-sort",
    "heap-sort",
  ],
  glossaryTerms: [
    "comparison sort",
    "in-place algorithm",
    "unstable sort",
    "non-adaptive algorithm",
    "time complexity",
    "swap",
    "minimum element",
  ],
  tags: [
    "sorting",
    "comparison-based",
    "in-place",
    "unstable",
    "beginner",
    "quadratic",
    "non-adaptive",
  ],
};
