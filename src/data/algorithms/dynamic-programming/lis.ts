import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const lis: AlgorithmMetadata = {
  id: "lis",
  name: "Longest Increasing Subsequence",
  category: "dynamic-programming",
  subcategory: "Subsequence DP",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n^2)",
    average: "O(n^2)",
    worst: "O(n^2)",
    note: "The standard DP approach is O(n^2) where n is the array length. An optimized O(n log n) solution exists using binary search with a patience sorting-inspired auxiliary array, but the O(n^2) version is more intuitive for learning.",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Requires a 1D dp array of size n to store the LIS length ending at each index. An additional predecessor array of size n is used if we need to reconstruct the actual subsequence.",
  },
  description: `The Longest Increasing Subsequence (LIS) problem asks for the length of the longest subsequence \
of a given array such that all elements of the subsequence are sorted in strictly increasing order. A \
subsequence is derived from the original array by deleting some (or no) elements without changing the \
relative order of the remaining elements. This is one of the most well-known dynamic programming problems \
and appears frequently in coding interviews and competitive programming.

The O(n^2) DP approach defines dp[i] as the length of the longest increasing subsequence ending at index \
i. For each element arr[i], we examine all previous elements arr[j] where j < i. If arr[j] < arr[i], \
then arr[i] can extend the LIS ending at j, giving dp[i] = max(dp[i], dp[j] + 1). The base case is \
dp[i] = 1 for all i, since every element forms a subsequence of length 1 by itself.

To reconstruct the actual subsequence, we maintain a predecessor array prev[i] that records which \
index j was used to extend to i. After computing all dp values, we find the index with the maximum \
dp value and backtrack through the predecessor chain to build the subsequence.

An improved O(n log n) algorithm uses a clever observation: we maintain an auxiliary array tails where \
tails[k] holds the smallest tail element of all increasing subsequences of length k+1 found so far. \
For each new element, we use binary search to determine where it fits in this array. This approach is \
faster but harder to understand, making the O(n^2) version preferable for learning DP concepts.

The LIS problem has connections to many other areas: it is equivalent to finding the longest chain in a \
DAG, and the patience sorting algorithm naturally computes the LIS length. Applications include \
bioinformatics (gene sequence analysis), data compression, version control systems, and scheduling \
problems where tasks have ordering constraints.`,
  shortDescription:
    "Finds the length of the longest subsequence where elements are in strictly increasing order using a 1D DP table.",
  pseudocode: `function LIS(arr):
    n = length(arr)
    dp = array of size n, all initialized to 1
    prev = array of size n, all initialized to -1

    for i from 1 to n-1:
        for j from 0 to i-1:
            if arr[j] < arr[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
                prev[i] = j

    // Find maximum length and its index
    maxLen = max(dp)
    maxIdx = index of maxLen in dp

    // Reconstruct subsequence
    subsequence = []
    idx = maxIdx
    while idx != -1:
        subsequence.prepend(arr[idx])
        idx = prev[idx]

    return maxLen, subsequence`,
  implementations: {
    python: `from typing import List, Tuple


def lis(arr: List[int]) -> Tuple[int, List[int]]:
    """Find the length and actual longest increasing subsequence."""
    n = len(arr)
    if n == 0:
        return 0, []

    dp = [1] * n
    prev = [-1] * n

    for i in range(1, n):
        for j in range(i):
            if arr[j] < arr[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
                prev[i] = j

    # Find the maximum
    max_len = max(dp)
    max_idx = dp.index(max_len)

    # Reconstruct
    subseq = []
    idx = max_idx
    while idx != -1:
        subseq.append(arr[idx])
        idx = prev[idx]

    return max_len, list(reversed(subseq))


def lis_binary_search(arr: List[int]) -> int:
    """O(n log n) LIS using binary search (length only)."""
    from bisect import bisect_left

    tails = []
    for x in arr:
        pos = bisect_left(tails, x)
        if pos == len(tails):
            tails.append(x)
        else:
            tails[pos] = x
    return len(tails)


# Example
if __name__ == "__main__":
    arr = [10, 9, 2, 5, 3, 7, 101, 18]
    length, subseq = lis(arr)
    print(f"Array: {arr}")
    print(f"LIS length: {length}")
    print(f"LIS: {subseq}")`,
    javascript: `/**
 * Find the longest increasing subsequence (O(n^2) DP).
 * @param {number[]} arr
 * @returns {{ length: number, subsequence: number[] }}
 */
function lis(arr) {
  const n = arr.length;
  if (n === 0) return { length: 0, subsequence: [] };

  const dp = new Array(n).fill(1);
  const prev = new Array(n).fill(-1);

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        prev[i] = j;
      }
    }
  }

  // Find maximum
  let maxLen = 0;
  let maxIdx = 0;
  for (let i = 0; i < n; i++) {
    if (dp[i] > maxLen) {
      maxLen = dp[i];
      maxIdx = i;
    }
  }

  // Reconstruct
  const subseq = [];
  let idx = maxIdx;
  while (idx !== -1) {
    subseq.unshift(arr[idx]);
    idx = prev[idx];
  }

  return { length: maxLen, subsequence: subseq };
}

/**
 * O(n log n) LIS using binary search (length only).
 * @param {number[]} arr
 * @returns {number}
 */
function lisBinarySearch(arr) {
  const tails = [];
  for (const x of arr) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = x;
  }
  return tails.length;
}

// Example
const arr = [10, 9, 2, 5, 3, 7, 101, 18];
const result = lis(arr);
console.log(\`Array: [\${arr}]\`);
console.log(\`LIS length: \${result.length}\`);
console.log(\`LIS: [\${result.subsequence}]\`);`,
  },
  useCases: [
    "Gene sequence analysis — finding longest conserved subsequences in DNA",
    "Data compression — identifying patterns of monotonically increasing data",
    "Box stacking problems — selecting the maximum number of stackable boxes by dimension",
    "Version control — computing minimal diff sequences between file revisions",
    "Task scheduling with precedence constraints — finding the longest dependency chain",
  ],
  relatedAlgorithms: [
    "edit-distance",
    "longest-common-subsequence",
    "knapsack",
    "fibonacci",
  ],
  glossaryTerms: [
    "dynamic programming",
    "subsequence",
    "optimal substructure",
    "patience sorting",
    "binary search",
    "tabulation",
  ],
  tags: [
    "dynamic-programming",
    "classic",
    "intermediate",
    "subsequence",
    "1D-table",
    "binary-search",
  ],
};
