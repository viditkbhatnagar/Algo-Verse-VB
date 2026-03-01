import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const kadanes: AlgorithmMetadata = {
  id: "kadanes",
  name: "Kadane's Algorithm",
  category: "dynamic-programming",
  subcategory: "Subarray DP",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Makes a single pass through the array, examining each element exactly once. This is optimal since every element must be examined at least once.",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "Uses only a constant number of variables (currentSum, maxSum, start, end) regardless of input size. No additional arrays or data structures are needed.",
  },
  description: `Kadane's Algorithm efficiently solves the Maximum Subarray Problem: given an array of integers (which \
may include negative numbers), find the contiguous subarray with the largest sum. This problem was first \
posed by Ulf Grenander in 1977 for pattern matching in digitized images, and Jay Kadane devised the \
elegant O(n) solution in 1984.

The key insight behind Kadane's Algorithm is a simple but powerful DP recurrence. At each position i, \
we decide whether to extend the current subarray or start a new one: currentSum = max(arr[i], \
currentSum + arr[i]). If adding arr[i] to the current subarray yields a sum less than arr[i] alone, \
it is better to discard the previous subarray and start fresh at position i. We simultaneously track \
the global maximum: maxSum = max(maxSum, currentSum).

This can be understood as a dynamic programming formulation where dp[i] represents the maximum sum \
subarray ending at index i. The recurrence dp[i] = max(arr[i], dp[i-1] + arr[i]) captures the \
extend-or-restart decision. Since dp[i] only depends on dp[i-1], we can optimize space to O(1) by \
keeping just the current and maximum sums.

To track the actual subarray boundaries (not just the maximum sum), we maintain start and end indices. \
When we restart the subarray (arr[i] > currentSum + arr[i]), we update the temporary start index. When \
we find a new maximum, we record the start and end indices of the current best subarray.

Kadane's Algorithm has been extended in many ways: to 2D arrays (maximum sum rectangle), circular \
arrays, finding the k largest subarray sums, and online streaming settings where data arrives \
incrementally. It is widely used in financial analysis for identifying the best period to buy and sell \
stocks, signal processing for finding high-energy segments, and genomics for identifying regions of \
unusual composition in DNA sequences.`,
  shortDescription:
    "Finds the contiguous subarray with the maximum sum in O(n) time using a single-pass dynamic programming approach.",
  pseudocode: `function Kadanes(arr):
    n = length(arr)
    currentSum = arr[0]
    maxSum = arr[0]
    start = 0
    end = 0
    tempStart = 0

    for i from 1 to n-1:
        if arr[i] > currentSum + arr[i]:
            currentSum = arr[i]     // start new subarray
            tempStart = i
        else:
            currentSum = currentSum + arr[i]  // extend

        if currentSum > maxSum:
            maxSum = currentSum
            start = tempStart
            end = i

    return maxSum, arr[start..end]`,
  implementations: {
    python: `from typing import List, Tuple


def kadanes(arr: List[int]) -> Tuple[int, int, int]:
    """
    Kadane's Algorithm — find maximum subarray sum.
    Returns (max_sum, start_index, end_index).
    """
    n = len(arr)
    if n == 0:
        return 0, -1, -1

    current_sum = arr[0]
    max_sum = arr[0]
    start = 0
    end = 0
    temp_start = 0

    for i in range(1, n):
        if arr[i] > current_sum + arr[i]:
            current_sum = arr[i]
            temp_start = i
        else:
            current_sum += arr[i]

        if current_sum > max_sum:
            max_sum = current_sum
            start = temp_start
            end = i

    return max_sum, start, end


# Example
if __name__ == "__main__":
    arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
    max_sum, start, end = kadanes(arr)
    print(f"Array: {arr}")
    print(f"Maximum subarray sum: {max_sum}")
    print(f"Subarray: {arr[start:end + 1]} (indices {start} to {end})")`,
    javascript: `/**
 * Kadane's Algorithm — find the maximum subarray sum.
 * @param {number[]} arr
 * @returns {{ maxSum: number, start: number, end: number }}
 */
function kadanes(arr) {
  const n = arr.length;
  if (n === 0) return { maxSum: 0, start: -1, end: -1 };

  let currentSum = arr[0];
  let maxSum = arr[0];
  let start = 0;
  let end = 0;
  let tempStart = 0;

  for (let i = 1; i < n; i++) {
    if (arr[i] > currentSum + arr[i]) {
      currentSum = arr[i];
      tempStart = i;
    } else {
      currentSum += arr[i];
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
      start = tempStart;
      end = i;
    }
  }

  return { maxSum, start, end };
}

// Example
const arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
const result = kadanes(arr);
console.log(\`Array: [\${arr}]\`);
console.log(\`Maximum subarray sum: \${result.maxSum}\`);
console.log(\`Subarray: [\${arr.slice(result.start, result.end + 1)}] (indices \${result.start} to \${result.end})\`);`,
  },
  useCases: [
    "Stock trading — finding the best contiguous period to maximize profit",
    "Signal processing — identifying the strongest continuous signal segment",
    "Genomics — locating DNA regions with unusual nucleotide composition",
    "Image processing — finding the brightest rectangular region (2D extension)",
    "Financial analysis — identifying the most profitable consecutive time period",
  ],
  relatedAlgorithms: [
    "fibonacci",
    "lis",
    "knapsack",
    "unique-paths",
  ],
  glossaryTerms: [
    "dynamic programming",
    "subarray",
    "contiguous",
    "greedy",
    "optimal substructure",
    "maximum subarray",
  ],
  tags: [
    "dynamic-programming",
    "classic",
    "intermediate",
    "subarray",
    "greedy",
    "linear-time",
  ],
};
