import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const heapSort: AlgorithmMetadata = {
  id: "heap-sort",
  name: "Heap Sort",
  category: "sorting",
  subcategory: "Comparison-Based Sorting",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    note: "Guaranteed O(n log n) in all cases. The heapify step takes O(n) and then n extract-max operations each take O(log n).",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "Fully in-place sorting algorithm. The heap is built within the original array and no auxiliary arrays are needed.",
  },
  description: `Heap Sort is a comparison-based sorting algorithm that leverages the binary heap data structure to efficiently sort an array in-place. It was proposed by J. W. J. Williams in 1964 and later improved by Robert W. Floyd. The algorithm works in two main phases: first, it transforms the input array into a max-heap (a complete binary tree where every parent node is greater than or equal to its children), and then it repeatedly extracts the maximum element from the heap and places it at the end of the array, progressively building the sorted output from right to left.

The heap construction phase uses Floyd's bottom-up heap building algorithm, which runs in O(n) time — a non-obvious result that comes from the fact that most nodes in a complete binary tree are near the leaves and require very little sifting. Starting from the last non-leaf node and working backward to the root, each node is "sifted down" to its correct position in the heap. Once the max-heap is built, the sort phase begins: the root (the maximum element) is swapped with the last element of the unsorted portion, the heap size is reduced by one, and the new root is sifted down to restore the heap property. This process repeats until only one element remains.

Heap Sort combines the best attributes of Selection Sort and Merge Sort: like Selection Sort, it repeatedly selects the maximum element, but it uses a heap to find the maximum in O(log n) time instead of O(n). Like Merge Sort, it achieves O(n log n) worst-case time complexity, but it does so entirely in-place with O(1) auxiliary space. This makes Heap Sort the only comparison-based sorting algorithm that simultaneously guarantees O(n log n) time and O(1) space in all cases, a property that makes it uniquely valuable in memory-constrained environments.

However, Heap Sort has some practical disadvantages. It is not stable — the heap operations can rearrange equal elements. More significantly, its access pattern is not cache-friendly: the sift-down operation jumps between parent and child nodes that may be far apart in the array, resulting in many cache misses. This means that despite having the same asymptotic time complexity, Heap Sort is typically 2-5 times slower than Quick Sort on modern hardware with memory hierarchies. In practice, Heap Sort is most commonly used as a fallback in hybrid algorithms like Introsort, which switches from Quick Sort to Heap Sort when the recursion depth exceeds a threshold, guaranteeing O(n log n) worst-case performance while maintaining Quick Sort's practical speed for typical inputs.`,
  shortDescription:
    "An in-place sorting algorithm that builds a max-heap from the array and repeatedly extracts the maximum element, guaranteeing O(n log n) time with O(1) extra space.",
  pseudocode: `procedure heapSort(A: list of sortable items)
    n = length(A)

    // Phase 1: Build max-heap (Floyd's algorithm)
    for i = n / 2 - 1 down to 0 do
        siftDown(A, n, i)
    end for

    // Phase 2: Extract elements from heap one by one
    for i = n - 1 down to 1 do
        swap(A[0], A[i])       // Move current max to end
        siftDown(A, i, 0)     // Restore heap on reduced array
    end for
end procedure

procedure siftDown(A: list, heapSize: int, root: int)
    largest = root
    left = 2 * root + 1
    right = 2 * root + 2

    if left < heapSize and A[left] > A[largest] then
        largest = left
    end if

    if right < heapSize and A[right] > A[largest] then
        largest = right
    end if

    if largest != root then
        swap(A[root], A[largest])
        siftDown(A, heapSize, largest)
    end if
end procedure`,
  implementations: {
    python: `def heap_sort(arr: list) -> list:
    """Sort a list in ascending order using Heap Sort."""
    n = len(arr)

    # Phase 1: Build max-heap using Floyd's bottom-up algorithm
    for i in range(n // 2 - 1, -1, -1):
        sift_down(arr, n, i)

    # Phase 2: Extract elements one by one
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]  # Move max to end
        sift_down(arr, i, 0)             # Restore heap

    return arr


def sift_down(arr: list, heap_size: int, root: int) -> None:
    """Sift a node down to its correct position in the heap."""
    largest = root
    left = 2 * root + 1
    right = 2 * root + 2

    if left < heap_size and arr[left] > arr[largest]:
        largest = left

    if right < heap_size and arr[right] > arr[largest]:
        largest = right

    if largest != root:
        arr[root], arr[largest] = arr[largest], arr[root]
        sift_down(arr, heap_size, largest)


# Example usage
if __name__ == "__main__":
    data = [12, 11, 13, 5, 6, 7]
    print("Original:", data)
    print("Sorted:  ", heap_sort(data))`,
    javascript: `function heapSort(arr) {
  const n = arr.length;

  // Phase 1: Build max-heap using Floyd's bottom-up algorithm
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(arr, n, i);
  }

  // Phase 2: Extract elements one by one
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]]; // Move max to end
    siftDown(arr, i, 0);                 // Restore heap
  }

  return arr;
}

function siftDown(arr, heapSize, root) {
  let largest = root;
  const left = 2 * root + 1;
  const right = 2 * root + 2;

  if (left < heapSize && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < heapSize && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== root) {
    [arr[root], arr[largest]] = [arr[largest], arr[root]];
    siftDown(arr, heapSize, largest);
  }
}

// Example usage
const data = [12, 11, 13, 5, 6, 7];
console.log("Original:", data);
console.log("Sorted:  ", heapSort([...data]));`,
  },
  useCases: [
    "Memory-constrained environments requiring guaranteed O(n log n) sorting with no extra space",
    "Fallback algorithm in Introsort to prevent Quick Sort's O(n²) worst case",
    "Real-time systems where worst-case performance guarantees are critical and O(n²) is unacceptable",
    "Implementing efficient priority queues, where partial sorting via the heap structure is the primary operation",
    "Embedded systems and kernel-level code where dynamic memory allocation is restricted or unavailable",
  ],
  relatedAlgorithms: [
    "merge-sort",
    "quick-sort",
    "selection-sort",
    "bubble-sort",
    "insertion-sort",
  ],
  glossaryTerms: [
    "binary heap",
    "max-heap",
    "comparison sort",
    "in-place algorithm",
    "sift down",
    "heapify",
    "complete binary tree",
    "priority queue",
  ],
  tags: [
    "sorting",
    "comparison-based",
    "in-place",
    "unstable",
    "intermediate",
    "heap",
    "linearithmic",
    "non-adaptive",
  ],
};
