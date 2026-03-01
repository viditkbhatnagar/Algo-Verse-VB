import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const twoPointer: AlgorithmMetadata = {
  id: "two-pointer",
  name: "Two Pointer Technique",
  category: "miscellaneous",
  subcategory: "Techniques",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Each pointer traverses the array at most once, giving O(n) total. Requires the input to be sorted (or a structure that supports directional movement). If the array is not pre-sorted, sorting adds O(n log n).",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "Only two pointer variables and a few auxiliary variables are needed. No extra data structures required beyond the input array.",
  },
  description: `The Two Pointer technique is a fundamental algorithmic pattern that uses two references (indices or \
iterators) to traverse a data structure, typically an array, in a coordinated manner. The pointers usually \
start at opposite ends (left and right) or at the same position and move towards each other or in the same \
direction based on specific conditions. This approach is remarkably efficient for problems involving pairs, \
subarrays, or partitioning.

The most classic application is finding a pair of elements in a sorted array that sum to a given target. \
By placing one pointer at the beginning (left) and one at the end (right), we compute their sum. If the \
sum equals the target, we have found our pair. If the sum is too small, we move the left pointer right to \
increase the sum. If the sum is too large, we move the right pointer left to decrease the sum. This \
eliminates the need for nested loops, reducing time complexity from O(n^2) to O(n).

The technique extends far beyond pair sums. It is used in removing duplicates from sorted arrays, merging \
two sorted arrays, the container with most water problem, trapping rain water, palindrome checking, \
partitioning arrays (as in quicksort's partition step), and the Dutch National Flag problem. Variations \
include the fast-slow pointer (Floyd's cycle detection), where one pointer moves twice as fast as the \
other to detect cycles in linked lists.

Key prerequisites for the two pointer technique: the data must usually be sorted or have some monotonic \
property that allows the pointers to make definitive progress. The correctness relies on the invariant \
that at each step, the movement of a pointer eliminates a set of candidates that cannot possibly be part \
of the solution. This greedy elimination is what gives the technique its linear time complexity.`,
  shortDescription:
    "Uses two pointers traversing a sorted array from opposite ends to efficiently find pairs or solve partitioning problems in O(n) time.",
  pseudocode: `function TwoPointerPairSum(array, target):
    left = 0
    right = length(array) - 1

    while left < right:
        currentSum = array[left] + array[right]

        if currentSum == target:
            return (left, right)    // Found the pair!
        else if currentSum < target:
            left = left + 1         // Need larger sum, move left pointer right
        else:
            right = right - 1       // Need smaller sum, move right pointer left

    return null                     // No pair found`,
  implementations: {
    python: `from typing import List, Optional, Tuple


def two_pointer_pair_sum(arr: List[int], target: int) -> Optional[Tuple[int, int]]:
    """
    Find a pair of elements in a sorted array that sum to the target.
    Returns a tuple of indices, or None if no pair exists.
    Time: O(n), Space: O(1)
    """
    left = 0
    right = len(arr) - 1

    while left < right:
        current_sum = arr[left] + arr[right]

        if current_sum == target:
            return (left, right)
        elif current_sum < target:
            left += 1    # Need a larger sum
        else:
            right -= 1   # Need a smaller sum

    return None


def remove_duplicates(arr: List[int]) -> int:
    """
    Remove duplicates from a sorted array in-place.
    Returns the new length. Time: O(n), Space: O(1)
    """
    if not arr:
        return 0

    write = 1  # slow pointer (write position)
    for read in range(1, len(arr)):  # fast pointer
        if arr[read] != arr[read - 1]:
            arr[write] = arr[read]
            write += 1

    return write


# Example usage
if __name__ == "__main__":
    arr = [1, 2, 4, 6, 8, 9, 14, 15]
    target = 13
    result = two_pointer_pair_sum(arr, target)
    if result:
        i, j = result
        print(f"Pair found: arr[{i}]={arr[i]} + arr[{j}]={arr[j]} = {target}")
    else:
        print("No pair found")
    # Output: Pair found: arr[1]=2 + arr[5]=9 = 13  (wait -- 4+9=13)
    # Actually: arr[2]=4 + arr[5]=9 = 13`,
    javascript: `/**
 * Find a pair in a sorted array that sums to the target.
 * @param {number[]} arr - Sorted array of numbers
 * @param {number} target - Target sum
 * @returns {[number, number] | null} - Indices of the pair, or null
 */
function twoPointerPairSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const currentSum = arr[left] + arr[right];

    if (currentSum === target) {
      return [left, right];
    } else if (currentSum < target) {
      left++;      // Need a larger sum
    } else {
      right--;     // Need a smaller sum
    }
  }

  return null;     // No pair found
}

/**
 * Remove duplicates from a sorted array in-place.
 * @param {number[]} arr - Sorted array
 * @returns {number} - New length after removing duplicates
 */
function removeDuplicates(arr) {
  if (arr.length === 0) return 0;

  let write = 1; // slow pointer
  for (let read = 1; read < arr.length; read++) { // fast pointer
    if (arr[read] !== arr[read - 1]) {
      arr[write] = arr[read];
      write++;
    }
  }

  return write;
}

// Example usage
const arr = [1, 2, 4, 6, 8, 9, 14, 15];
const target = 13;
const result = twoPointerPairSum(arr, target);
if (result) {
  const [i, j] = result;
  console.log(\`Pair found: arr[\${i}]=\${arr[i]} + arr[\${j}]=\${arr[j]} = \${target}\`);
} else {
  console.log("No pair found");
}`,
  },
  useCases: [
    "Finding pairs in sorted arrays that satisfy a sum condition (two-sum on sorted input)",
    "Removing duplicates from sorted arrays in-place with O(1) extra space",
    "Container with most water and trapping rain water problems",
    "Palindrome verification by comparing characters from both ends",
    "Partitioning arrays in quicksort and the Dutch National Flag problem",
  ],
  relatedAlgorithms: [
    "sliding-window",
    "binary-search",
    "quick-sort",
    "merge-sort",
  ],
  glossaryTerms: [
    "two pointer",
    "sorted array",
    "pair sum",
    "in-place",
    "linear scan",
    "partitioning",
  ],
  tags: [
    "miscellaneous",
    "technique",
    "beginner",
    "array",
    "two-pointer",
    "sorting",
    "searching",
  ],
};
