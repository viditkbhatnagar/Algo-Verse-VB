import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const binarySearch: AlgorithmMetadata = {
  id: "binary-search",
  name: "Binary Search",
  category: "searching",
  subcategory: "Binary Search",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)",
    note: "Best case occurs when the middle element is the target on the first check.",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "Iterative implementation uses constant extra space. A recursive version would use O(log n) stack space.",
  },
  description: `Binary search is a highly efficient algorithm for finding a target value within a sorted array. It works by repeatedly dividing the search interval in half: at each step the algorithm compares the target with the middle element of the current interval and eliminates the half that cannot contain the target. This divide-and-conquer strategy reduces the problem size by half on every iteration, yielding a logarithmic time complexity that makes it dramatically faster than linear search for large datasets.

The algorithm maintains two pointers — low and high — that define the current search range. It computes the midpoint, then compares the element at that position with the target. If they match, the search is complete. If the target is less than the middle element, the search continues in the left half by moving the high pointer to mid - 1. If the target is greater, the search continues in the right half by moving the low pointer to mid + 1. The process repeats until the target is found or the low pointer exceeds the high pointer, indicating the target is not present.

A critical prerequisite for binary search is that the input array must be sorted. If the array is not sorted, binary search will produce incorrect results because the elimination logic depends on the sorted ordering invariant. In practice, this means you either maintain a sorted structure (such as a balanced BST or a sorted array with insertion sort) or perform a one-time sort before searching. When multiple searches are performed on the same dataset, the upfront O(n log n) sorting cost is amortized across many O(log n) lookups, making binary search extremely cost-effective.

Binary search is foundational to computer science and appears in many guises: it underlies tree-based data structures like AVL trees and red-black trees, powers standard library functions such as Python's bisect module and C++'s std::lower_bound, and forms the basis of advanced techniques like exponential search and fractional cascading. Mastering binary search — including its subtle off-by-one pitfalls — is essential for solving a wide range of algorithmic problems from simple lookups to complex optimization via binary search on the answer.`,
  shortDescription:
    "Efficiently finds a target in a sorted array by repeatedly halving the search interval.",
  pseudocode: `BINARY-SEARCH(A, target)
  low = 0
  high = length(A) - 1
  while low <= high
    mid = low + floor((high - low) / 2)
    if A[mid] == target
      return mid
    else if A[mid] < target
      low = mid + 1
    else
      high = mid - 1
  return -1`,
  implementations: {
    python: `def binary_search(arr: list, target) -> int:
    """
    Perform iterative binary search on a sorted list.

    Args:
        arr: A sorted list to search through.
        target: The value to search for.

    Returns:
        The index of the target if found, otherwise -1.
    """
    low = 0
    high = len(arr) - 1

    while low <= high:
        mid = low + (high - low) // 2

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1

    return -1


# --- Example usage ---
if __name__ == "__main__":
    data = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
    target = 11
    result = binary_search(data, target)
    if result != -1:
        print(f"Found {target} at index {result}")
    else:
        print(f"{target} not found in the list")`,
    javascript: `/**
 * Perform iterative binary search on a sorted array.
 *
 * @param {Array} arr - A sorted array to search through.
 * @param {*} target - The value to search for.
 * @returns {number} The index of the target if found, otherwise -1.
 */
function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
}

// --- Example usage ---
const data = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
const target = 11;
const result = binarySearch(data, target);
if (result !== -1) {
  console.log(\`Found \${target} at index \${result}\`);
} else {
  console.log(\`\${target} not found in the array\`);
}`,
  },
  useCases: [
    "Searching for a value in a sorted array or list with random access",
    "Implementing dictionary or phone-book style lookups on ordered data",
    "Finding insertion points to maintain sorted order (e.g., bisect/lower_bound)",
    "Solving optimization problems via binary search on the answer space",
    "Powering database index lookups using B-tree or B+ tree structures",
  ],
  relatedAlgorithms: [
    "linear-search",
    "interpolation-search",
    "exponential-search",
    "jump-search",
    "ternary-search",
  ],
  glossaryTerms: [
    "divide and conquer",
    "sorted array",
    "logarithmic time",
    "midpoint",
    "search interval",
    "off-by-one error",
  ],
  tags: [
    "searching",
    "binary",
    "divide-and-conquer",
    "sorted",
    "logarithmic",
    "beginner",
    "array",
  ],
};
