import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const countingSort: AlgorithmMetadata = {
  id: "counting-sort",
  name: "Counting Sort",
  category: "sorting",
  subcategory: "Non-Comparison Sorting",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n + k)",
    average: "O(n + k)",
    worst: "O(n + k)",
    note: "Where k is the range of input values. Most efficient when k = O(n).",
  },
  spaceComplexity: {
    best: "O(n + k)",
    average: "O(n + k)",
    worst: "O(n + k)",
    note: "Requires auxiliary arrays for counting and output.",
  },
  description:
    "Counting Sort is a non-comparison-based sorting algorithm that works by counting the number of occurrences of each distinct element in the input array. It then uses arithmetic to determine the position of each element in the sorted output. Unlike comparison-based sorts that are bounded by O(n log n), Counting Sort achieves linear time complexity.\n\nThe algorithm first determines the range of input values (from 0 to max), creates a count array of that size, and tallies the frequency of each value. It then computes a cumulative sum of the count array so that each entry indicates the number of elements less than or equal to that value. Finally, it traverses the input array in reverse order (to maintain stability), placing each element at its correct position in the output array.\n\nCounting Sort is particularly effective when the range of input values (k) is not significantly larger than the number of elements (n). It is a stable sort, meaning equal elements maintain their relative order from the input. However, it requires extra space proportional to the range of values, making it impractical for data with a very large range.",
  shortDescription:
    "A non-comparison sorting algorithm that counts occurrences of each value to determine sorted positions.",
  pseudocode: `procedure countingSort(A: array of integers, k: max value)
    count = array of zeros, size k + 1
    output = array of zeros, size length(A)

    // Count occurrences
    for each element x in A do
        count[x] = count[x] + 1
    end for

    // Compute cumulative count
    for i = 1 to k do
        count[i] = count[i] + count[i - 1]
    end for

    // Build output array (traverse in reverse for stability)
    for i = length(A) - 1 downto 0 do
        output[count[A[i]] - 1] = A[i]
        count[A[i]] = count[A[i]] - 1
    end for

    return output
end procedure`,
  implementations: {
    python: `def counting_sort(arr: list[int]) -> list[int]:
    if not arr:
        return arr

    max_val = max(arr)
    count = [0] * (max_val + 1)
    output = [0] * len(arr)

    # Count occurrences
    for x in arr:
        count[x] += 1

    # Cumulative count
    for i in range(1, max_val + 1):
        count[i] += count[i - 1]

    # Build output (reverse for stability)
    for i in range(len(arr) - 1, -1, -1):
        output[count[arr[i]] - 1] = arr[i]
        count[arr[i]] -= 1

    return output


# Example usage
arr = [4, 2, 2, 8, 3, 3, 1]
print(counting_sort(arr))  # [1, 2, 2, 3, 3, 4, 8]`,
    javascript: `function countingSort(arr) {
  if (arr.length === 0) return arr;

  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);
  const output = new Array(arr.length).fill(0);

  // Count occurrences
  for (const x of arr) {
    count[x]++;
  }

  // Cumulative count
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }

  // Build output (reverse for stability)
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i]] - 1] = arr[i];
    count[arr[i]]--;
  }

  return output;
}

// Example usage
const arr = [4, 2, 2, 8, 3, 3, 1];
console.log(countingSort(arr)); // [1, 2, 2, 3, 3, 4, 8]`,
  },
  useCases: [
    "Sorting integers with a known, small range (e.g., ages, grades, ASCII characters)",
    "As a subroutine in Radix Sort for sorting digit by digit",
    "When stability is required and values are non-negative integers",
    "Histogram or frequency analysis tasks",
  ],
  relatedAlgorithms: ["radix-sort", "bubble-sort", "merge-sort", "heap-sort"],
  glossaryTerms: [
    "non-comparison sort",
    "stable sort",
    "counting array",
    "cumulative sum",
    "linear time",
    "auxiliary space",
  ],
  tags: [
    "sorting",
    "non-comparison",
    "stable",
    "linear-time",
    "intermediate",
    "integer-sort",
  ],
};
