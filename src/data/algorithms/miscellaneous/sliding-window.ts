import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const slidingWindow: AlgorithmMetadata = {
  id: "sliding-window",
  name: "Sliding Window",
  category: "miscellaneous",
  subcategory: "Techniques",
  difficulty: "beginner",
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Each element is added to the window once and removed once, giving O(n) total operations. The window size k does not affect the time complexity since we process each element in constant time.",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(k)",
    note: "For the fixed-size maximum sum subarray problem, only O(1) extra space is needed (window sum variable). Variable-size windows may require O(k) space for storing window contents or frequency maps.",
  },
  description: `The Sliding Window technique is a powerful algorithmic pattern for efficiently processing contiguous \
subarrays or substrings of a fixed or variable size. Instead of recalculating results from scratch for \
each subarray, the window "slides" across the data by removing the element leaving the window and adding \
the new element entering it, maintaining a running computation in O(1) per slide.

For fixed-size windows, the classic example is finding the maximum sum subarray of size k. First, compute \
the sum of the initial window (first k elements). Then, for each subsequent position, subtract the element \
that exits the window on the left and add the element that enters on the right. Compare each window sum \
with the current maximum and update accordingly. This transforms an O(n*k) brute-force approach into O(n).

Variable-size sliding windows handle problems where the window size is not predetermined. The window \
expands by moving the right pointer to include more elements and contracts by moving the left pointer to \
exclude elements when a constraint is violated. Examples include finding the smallest subarray with a sum \
greater than a target, the longest substring without repeating characters, and the minimum window substring.

The sliding window technique is closely related to the two pointer technique. In fact, a variable-size \
sliding window is essentially a two pointer approach where both pointers move in the same direction. The \
key insight is that as the right pointer advances, the left pointer never needs to move backward, ensuring \
that each element is processed at most twice (once when entering, once when leaving the window), giving \
amortized O(n) time complexity.

Common patterns include maintaining frequency counts (using hash maps), tracking window sums, monitoring \
minimum/maximum values (sometimes using deques for O(1) min/max), and checking validity conditions. The \
technique is ubiquitous in string and array problems in competitive programming and technical interviews.`,
  shortDescription:
    "Efficiently processes contiguous subarrays by sliding a fixed or variable-size window across the data, updating results incrementally in O(n) time.",
  pseudocode: `function MaxSumSubarray(array, k):
    // Step 1: Compute the sum of the first window
    windowSum = 0
    for i from 0 to k - 1:
        windowSum = windowSum + array[i]

    maxSum = windowSum
    maxStart = 0

    // Step 2: Slide the window across the array
    for i from k to length(array) - 1:
        windowSum = windowSum - array[i - k]   // Remove element leaving window
        windowSum = windowSum + array[i]        // Add element entering window

        if windowSum > maxSum:
            maxSum = windowSum
            maxStart = i - k + 1

    return maxSum, maxStart`,
  implementations: {
    python: `from typing import List, Tuple


def max_sum_subarray(arr: List[int], k: int) -> Tuple[int, int]:
    """
    Find the maximum sum subarray of size k.
    Returns (max_sum, start_index).
    Time: O(n), Space: O(1)
    """
    n = len(arr)
    if n < k:
        return (0, -1)

    # Compute sum of first window
    window_sum = sum(arr[:k])
    max_sum = window_sum
    max_start = 0

    # Slide the window
    for i in range(k, n):
        window_sum += arr[i] - arr[i - k]  # Add new, remove old

        if window_sum > max_sum:
            max_sum = window_sum
            max_start = i - k + 1

    return (max_sum, max_start)


def longest_substring_no_repeat(s: str) -> int:
    """
    Find the length of the longest substring without repeating characters.
    Uses a variable-size sliding window.
    Time: O(n), Space: O(min(n, alphabet_size))
    """
    char_index = {}
    max_length = 0
    left = 0

    for right, char in enumerate(s):
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        char_index[char] = right
        max_length = max(max_length, right - left + 1)

    return max_length


# Example usage
if __name__ == "__main__":
    arr = [2, 1, 5, 1, 3, 2, 8, 1, 3]
    k = 3
    max_sum, start = max_sum_subarray(arr, k)
    print(f"Max sum subarray of size {k}: {arr[start:start+k]}, sum = {max_sum}")
    # Output: Max sum subarray of size 3: [2, 8, 1], sum = 11  (wait -- [3, 2, 8] = 13)
    # Actually: [3, 2, 8] starting at index 4, sum = 13`,
    javascript: `/**
 * Find the maximum sum subarray of size k.
 * @param {number[]} arr - Array of numbers
 * @param {number} k - Window size
 * @returns {{ maxSum: number, startIndex: number }}
 */
function maxSumSubarray(arr, k) {
  const n = arr.length;
  if (n < k) return { maxSum: 0, startIndex: -1 };

  // Compute sum of first window
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }

  let maxSum = windowSum;
  let startIndex = 0;

  // Slide the window
  for (let i = k; i < n; i++) {
    windowSum += arr[i] - arr[i - k]; // Add new, remove old

    if (windowSum > maxSum) {
      maxSum = windowSum;
      startIndex = i - k + 1;
    }
  }

  return { maxSum, startIndex };
}

/**
 * Longest substring without repeating characters.
 * @param {string} s
 * @returns {number}
 */
function longestSubstringNoRepeat(s) {
  const charIndex = new Map();
  let maxLength = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (charIndex.has(char) && charIndex.get(char) >= left) {
      left = charIndex.get(char) + 1;
    }
    charIndex.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

// Example usage
const arr = [2, 1, 5, 1, 3, 2, 8, 1, 3];
const k = 3;
const { maxSum, startIndex } = maxSumSubarray(arr, k);
console.log(\`Max sum subarray of size \${k}: [\${arr.slice(startIndex, startIndex + k)}], sum = \${maxSum}\`);`,
  },
  useCases: [
    "Finding maximum or minimum sum subarray of a fixed size k",
    "Longest substring without repeating characters (variable window)",
    "Minimum window substring containing all characters of a pattern",
    "Maximum number of consecutive ones after flipping at most k zeros",
    "Real-time stream processing: moving averages, rate limiting, and throughput monitoring",
  ],
  relatedAlgorithms: [
    "two-pointer",
    "linear-search",
    "fibonacci",
    "knapsack",
  ],
  glossaryTerms: [
    "sliding window",
    "subarray",
    "contiguous",
    "window sum",
    "amortized",
    "fixed window",
    "variable window",
  ],
  tags: [
    "miscellaneous",
    "technique",
    "beginner",
    "array",
    "sliding-window",
    "subarray",
    "optimization",
  ],
};
