import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const quickSort: AlgorithmMetadata = {
  id: "quick-sort",
  name: "Quick Sort",
  category: "sorting",
  subcategory: "Comparison-Based Sorting",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    note: "Worst case occurs when the pivot is consistently the smallest or largest element (e.g., already sorted input with naive pivot selection). Randomized or median-of-three pivot strategies make the worst case extremely unlikely.",
  },
  spaceComplexity: {
    best: "O(log n)",
    average: "O(log n)",
    worst: "O(n)",
    note: "Space is used by the recursion stack. Worst-case O(n) stack depth occurs with highly unbalanced partitions; tail-call optimization can mitigate this.",
  },
  description: `Quick Sort is a highly efficient divide-and-conquer sorting algorithm developed by Tony Hoare in 1959. It works by selecting a "pivot" element from the array and partitioning the remaining elements into two groups: those less than the pivot and those greater than the pivot. The pivot is then placed in its final sorted position, and the algorithm recursively sorts the two partitions. Quick Sort is widely regarded as the fastest general-purpose sorting algorithm in practice, despite its O(n²) worst-case time complexity, because its average-case performance of O(n log n) comes with very low constant factors.

The partitioning step is the heart of Quick Sort. The most common partitioning schemes are the Lomuto partition (which scans from left to right using a single pointer) and the Hoare partition (which uses two pointers scanning from both ends toward the middle). The Hoare partition scheme is generally more efficient, performing fewer swaps on average. The choice of pivot significantly affects performance: a poor pivot choice leads to unbalanced partitions and degraded performance, while a good pivot (close to the median) yields well-balanced partitions and optimal O(n log n) behavior. Common pivot selection strategies include choosing the first element, the last element, a random element, or the median of three elements.

Quick Sort sorts in-place, requiring only O(log n) additional space for the recursion stack in the average case. This is a significant advantage over Merge Sort, which requires O(n) auxiliary space. However, Quick Sort is not stable — equal elements may be rearranged during the partitioning process. The algorithm is also not adaptive; it does not inherently benefit from existing order in the input data, though the randomized pivot variant effectively eliminates the risk of worst-case behavior for any particular input distribution.

In practice, Quick Sort is the basis for many standard library sorting implementations. C's qsort, C++'s std::sort (which uses Introsort, a hybrid of Quick Sort, Heap Sort, and Insertion Sort), and .NET's Array.Sort all rely on Quick Sort as their primary strategy. The algorithm's cache-friendly access patterns — it primarily accesses elements sequentially in memory — contribute to its excellent real-world performance. For small subarrays (typically fewer than 16 elements), production implementations switch to Insertion Sort to avoid the overhead of recursive function calls.`,
  shortDescription:
    "A fast divide-and-conquer sorting algorithm that partitions elements around a pivot, achieving O(n log n) average-case performance with in-place operation.",
  pseudocode: `procedure quickSort(A: list of sortable items, low: int, high: int)
    if low < high then
        pivotIndex = partition(A, low, high)
        quickSort(A, low, pivotIndex - 1)
        quickSort(A, pivotIndex + 1, high)
    end if
end procedure

procedure partition(A: list, low: int, high: int) -> int
    pivot = A[high]        // Choose last element as pivot
    i = low - 1            // Index of smaller element boundary

    for j = low to high - 1 do
        if A[j] <= pivot then
            i = i + 1
            swap(A[i], A[j])
        end if
    end for

    swap(A[i + 1], A[high])
    return i + 1           // Return pivot's final position
end procedure`,
  implementations: {
    python: `def quick_sort(arr: list) -> list:
    """Sort a list in ascending order using Quick Sort."""
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)


def quick_sort_in_place(arr: list, low: int = 0, high: int = None) -> list:
    """In-place Quick Sort using Lomuto partition scheme."""
    if high is None:
        high = len(arr) - 1

    if low < high:
        pivot_index = partition(arr, low, high)
        quick_sort_in_place(arr, low, pivot_index - 1)
        quick_sort_in_place(arr, pivot_index + 1, high)

    return arr


def partition(arr: list, low: int, high: int) -> int:
    """Lomuto partition scheme: pivot is the last element."""
    pivot = arr[high]
    i = low - 1

    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1


# Example usage
if __name__ == "__main__":
    data = [10, 7, 8, 9, 1, 5]
    print("Original:", data)
    print("Sorted (functional):", quick_sort(data))
    print("Sorted (in-place):  ", quick_sort_in_place(data[:]))`,
    javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

// Example usage
const data = [10, 7, 8, 9, 1, 5];
console.log("Original:", data);
console.log("Sorted:  ", quickSort([...data]));`,
  },
  useCases: [
    "General-purpose sorting in standard libraries where average-case speed is the top priority",
    "In-memory sorting of large arrays where cache-friendly sequential access patterns matter",
    "Systems where O(n) auxiliary space for Merge Sort is too expensive and in-place sorting is required",
    "As the foundation of hybrid algorithms like Introsort that fall back to Heap Sort to avoid worst-case scenarios",
    "Competitive programming and interview problems where a fast O(n log n) sort is needed",
  ],
  relatedAlgorithms: [
    "merge-sort",
    "heap-sort",
    "insertion-sort",
    "bubble-sort",
    "selection-sort",
  ],
  glossaryTerms: [
    "divide and conquer",
    "partition",
    "pivot",
    "in-place algorithm",
    "comparison sort",
    "recursion",
    "unstable sort",
    "Lomuto partition",
    "Hoare partition",
  ],
  tags: [
    "sorting",
    "comparison-based",
    "in-place",
    "unstable",
    "intermediate",
    "divide-and-conquer",
    "recursive",
    "cache-friendly",
  ],
};
