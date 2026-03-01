import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const linearSearch: AlgorithmMetadata = {
  id: "linear-search",
  name: "Linear Search",
  category: "searching",
  subcategory: "Linear Search",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    note: "Best case occurs when the target is the first element.",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "Only a constant amount of extra memory is used regardless of input size.",
  },
  description: `Linear search, also known as sequential search, is the simplest searching algorithm. It works by examining each element in a collection one by one, from the beginning to the end, until the target value is found or the entire collection has been traversed. Because it makes no assumptions about the ordering of the data, linear search can be applied to any list — sorted or unsorted — making it one of the most versatile search techniques available.

The algorithm starts at the first element and compares it with the target. If the current element matches the target, the search terminates and returns the index. If not, the algorithm moves to the next element and repeats the comparison. This continues until either the target is found or every element has been checked without a match, in which case the algorithm returns a sentinel value (typically -1) to indicate the target is absent.

Despite its simplicity, linear search has important practical applications. For very small datasets (fewer than roughly 20-30 elements), linear search can outperform more sophisticated algorithms like binary search because it avoids the overhead of maintaining sorted order and computing midpoints. It is also the only viable option when the data structure does not support random access — for example, when searching through a linked list or a stream of incoming data where elements arrive one at a time.

From a theoretical standpoint, linear search serves as a baseline against which other searching algorithms are measured. Its O(n) average and worst-case time complexity demonstrates why pre-processing steps like sorting are worthwhile for large datasets: they enable logarithmic-time searches. Understanding linear search deeply is an essential first step before studying binary search, hash-based lookups, or tree-based searches.`,
  shortDescription:
    "Sequentially checks each element in a list until the target is found or the list is exhausted.",
  pseudocode: `LINEAR-SEARCH(A, target)
  for i = 0 to length(A) - 1
    if A[i] == target
      return i
  return -1`,
  implementations: {
    python: `def linear_search(arr: list, target) -> int:
    """
    Perform linear search on a list.

    Args:
        arr: The list to search through.
        target: The value to search for.

    Returns:
        The index of the target if found, otherwise -1.
    """
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1


# --- Example usage ---
if __name__ == "__main__":
    data = [4, 2, 7, 1, 9, 3, 6]
    target = 9
    result = linear_search(data, target)
    if result != -1:
        print(f"Found {target} at index {result}")
    else:
        print(f"{target} not found in the list")`,
    javascript: `/**
 * Perform linear search on an array.
 *
 * @param {Array} arr - The array to search through.
 * @param {*} target - The value to search for.
 * @returns {number} The index of the target if found, otherwise -1.
 */
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}

// --- Example usage ---
const data = [4, 2, 7, 1, 9, 3, 6];
const target = 9;
const result = linearSearch(data, target);
if (result !== -1) {
  console.log(\`Found \${target} at index \${result}\`);
} else {
  console.log(\`\${target} not found in the array\`);
}`,
  },
  useCases: [
    "Searching through unsorted or unindexed collections where no ordering is guaranteed",
    "Finding an element in a small dataset where the overhead of sorting is not justified",
    "Scanning linked lists or data streams that do not support random access",
    "Serving as a fallback when more advanced search structures have not been built",
    "Searching for the first occurrence of a value when duplicates may exist in an unordered list",
  ],
  relatedAlgorithms: [
    "binary-search",
    "jump-search",
    "interpolation-search",
    "sentinel-linear-search",
  ],
  glossaryTerms: [
    "sequential search",
    "brute force",
    "time complexity",
    "sentinel value",
    "random access",
  ],
  tags: [
    "searching",
    "linear",
    "sequential",
    "brute-force",
    "beginner",
    "unsorted",
    "array",
  ],
};
