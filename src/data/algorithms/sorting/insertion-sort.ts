import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const insertionSort: AlgorithmMetadata = {
  id: "insertion-sort",
  name: "Insertion Sort",
  category: "sorting",
  subcategory: "Comparison-Based Sorting",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    note: "Best case occurs when the array is already sorted, requiring only one comparison per element with no shifts.",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "In-place algorithm using only a single temporary variable to hold the element being inserted.",
  },
  description: `Insertion Sort builds a sorted array one element at a time by repeatedly picking the next unsorted element and inserting it into its correct position within the already-sorted portion of the array. The algorithm mirrors how most people naturally sort a hand of playing cards: you pick up one card at a time and slide it into the right spot among the cards you are already holding. This intuitive approach makes Insertion Sort one of the easiest sorting algorithms to understand and implement.

The algorithm maintains a sorted subarray at the beginning of the list. Starting with the second element, each new element (called the "key") is compared with the elements in the sorted subarray, moving from right to left. Elements that are greater than the key are shifted one position to the right to make room, and the key is then placed into the vacated position. This shifting process ensures that the sorted subarray remains in order after each insertion.

Insertion Sort is highly adaptive, meaning it performs significantly better on inputs that are already partially sorted. When the input is fully sorted, the algorithm only makes n-1 comparisons and zero shifts, achieving O(n) time complexity. This makes it one of the fastest algorithms for nearly sorted data. Additionally, Insertion Sort is a stable algorithm — elements with equal values maintain their original relative order, which is important when sorting records by multiple keys.

In practice, Insertion Sort is the algorithm of choice for small subarrays in hybrid sorting algorithms. For example, TimSort (used by Python and Java) and optimized versions of Quick Sort switch to Insertion Sort when the subarray size falls below a threshold (typically 16-64 elements), because the overhead of recursive divide-and-conquer algorithms outweighs their theoretical advantage at small sizes. Insertion Sort also excels as an online algorithm, capable of sorting elements as they are received rather than requiring the entire input upfront.`,
  shortDescription:
    "A simple adaptive sorting algorithm that builds the sorted array one element at a time by inserting each into its correct position.",
  pseudocode: `procedure insertionSort(A: list of sortable items)
    n = length(A)
    for i = 1 to n - 1 do
        key = A[i]
        j = i - 1
        while j >= 0 and A[j] > key do
            A[j + 1] = A[j]
            j = j - 1
        end while
        A[j + 1] = key
    end for
end procedure`,
  implementations: {
    python: `def insertion_sort(arr: list) -> list:
    """Sort a list in ascending order using Insertion Sort."""
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr


# Example usage
if __name__ == "__main__":
    data = [12, 11, 13, 5, 6]
    print("Original:", data)
    print("Sorted:  ", insertion_sort(data))`,
    javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

// Example usage
const data = [12, 11, 13, 5, 6];
console.log("Original:", data);
console.log("Sorted:  ", insertionSort([...data]));`,
  },
  useCases: [
    "Sorting small arrays efficiently, often used as a subroutine in hybrid algorithms like TimSort and Introsort",
    "Online sorting where elements arrive one at a time and must be inserted into an already-sorted sequence",
    "Nearly sorted datasets where only a few elements are out of place, achieving near-linear performance",
    "Stable sorting requirement where equal elements must retain their original relative order",
    "Real-time systems where low overhead and predictable performance on small inputs are critical",
  ],
  relatedAlgorithms: [
    "bubble-sort",
    "selection-sort",
    "merge-sort",
    "quick-sort",
    "heap-sort",
  ],
  glossaryTerms: [
    "comparison sort",
    "stable sort",
    "in-place algorithm",
    "adaptive algorithm",
    "online algorithm",
    "time complexity",
    "key",
  ],
  tags: [
    "sorting",
    "comparison-based",
    "stable",
    "in-place",
    "beginner",
    "adaptive",
    "online",
    "quadratic",
  ],
};
