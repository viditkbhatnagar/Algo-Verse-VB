import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const lcs: AlgorithmMetadata = {
  id: "lcs",
  name: "Longest Common Subsequence (LCS)",
  category: "dynamic-programming",
  subcategory: "String",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(m * n)",
    average: "O(m * n)",
    worst: "O(m * n)",
    note: "Where m and n are the lengths of the two input strings. Each cell in the 2D DP table is filled in O(1) time. Optimized algorithms (Hunt-Szymanski, bit-parallel) can achieve better performance for specific input distributions, but the standard DP approach is O(m * n).",
  },
  spaceComplexity: {
    best: "O(min(m, n))",
    average: "O(m * n)",
    worst: "O(m * n)",
    note: "O(m * n) for the full 2D DP table required for backtracking to reconstruct the LCS string. If only the length is needed, space can be reduced to O(min(m, n)) using a rolling two-row approach, since each row depends only on the previous row.",
  },
  description: `The Longest Common Subsequence (LCS) problem finds the longest subsequence common to two sequences. \
A subsequence is a sequence that appears in the same relative order but not necessarily contiguously. \
For example, "ACE" is a subsequence of "ABCDE" but "AEC" is not. The LCS of "ABCBDAB" and "BDCAB" is \
"BCAB" with length 4.

The DP formulation builds a 2D table dp[i][j] representing the length of the LCS of the first i \
characters of string X and the first j characters of string Y. The recurrence is elegant: if the \
current characters match (X[i-1] == Y[j-1]), then dp[i][j] = dp[i-1][j-1] + 1 (extend the LCS by \
this matching character). If they do not match, dp[i][j] = max(dp[i-1][j], dp[i][j-1]) (the LCS \
either excludes the current character of X or Y, whichever gives the longer result).

The base cases are dp[0][j] = 0 for all j and dp[i][0] = 0 for all i (an empty string has LCS length \
0 with any string). After filling the table, the LCS string itself can be reconstructed by backtracking \
from dp[m][n]: if characters match, include the character and move diagonally; otherwise, move in the \
direction of the larger value (up or left).

The LCS problem is foundational in bioinformatics for DNA/protein sequence alignment, in version control \
systems for computing file diffs (diff, git), in natural language processing for measuring text similarity, \
and in data comparison tools. It is closely related to the edit distance (Levenshtein distance) problem \
and the longest common substring problem. The LCS problem is also used in the computation of the shortest \
common supersequence.`,
  shortDescription:
    "Finds the longest subsequence present in both input sequences using a 2D dynamic programming table with backtracking for reconstruction.",
  pseudocode: `function LCS(X, Y):
    m = length(X)
    n = length(Y)

    // Build DP table
    dp = 2D array of size (m+1) x (n+1), initialized to 0

    for i from 1 to m:
        for j from 1 to n:
            if X[i-1] == Y[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1   // match: extend diagonal
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    // Backtrack to find the LCS string
    lcs = ""
    i = m, j = n
    while i > 0 and j > 0:
        if X[i-1] == Y[j-1]:
            lcs = X[i-1] + lcs   // prepend matching character
            i -= 1
            j -= 1
        else if dp[i-1][j] > dp[i][j-1]:
            i -= 1
        else:
            j -= 1

    return dp[m][n], lcs`,
  implementations: {
    python: `from typing import Tuple


def lcs(x: str, y: str) -> Tuple[int, str]:
    """
    Find the Longest Common Subsequence of two strings.
    Returns (length, lcs_string).
    Bottom-up DP — O(m*n) time, O(m*n) space.
    """
    m, n = len(x), len(y)

    # Build DP table
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if x[i - 1] == y[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    # Backtrack to reconstruct the LCS string
    lcs_str = []
    i, j = m, n
    while i > 0 and j > 0:
        if x[i - 1] == y[j - 1]:
            lcs_str.append(x[i - 1])
            i -= 1
            j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        else:
            j -= 1

    lcs_str.reverse()
    return dp[m][n], "".join(lcs_str)


# Example usage
if __name__ == "__main__":
    x = "ABCBDAB"
    y = "BDCAB"
    length, result = lcs(x, y)
    print(f"X = '{x}', Y = '{y}'")
    print(f"LCS length: {length}")    # 4
    print(f"LCS string: '{result}'")  # "BCAB"`,
    javascript: `/**
 * Find the Longest Common Subsequence of two strings.
 * Bottom-up DP — O(m*n) time, O(m*n) space.
 *
 * @param {string} x - First string
 * @param {string} y - Second string
 * @returns {{ length: number, lcs: string }}
 */
function lcs(x, y) {
  const m = x.length;
  const n = y.length;

  // Build DP table
  const dp = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (x[i - 1] === y[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to reconstruct the LCS string
  const lcsChars = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (x[i - 1] === y[j - 1]) {
      lcsChars.push(x[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  lcsChars.reverse();

  return { length: dp[m][n], lcs: lcsChars.join("") };
}

// Example usage
const x = "ABCBDAB";
const y = "BDCAB";
const result = lcs(x, y);
console.log(\`X = '\${x}', Y = '\${y}'\`);
console.log(\`LCS length: \${result.length}\`);  // 4
console.log(\`LCS string: '\${result.lcs}'\`);    // "BCAB"`,
  },
  useCases: [
    "Bioinformatics: DNA and protein sequence alignment to find evolutionary similarities",
    "Version control: computing file diffs in tools like diff, git, and merge conflict resolution",
    "Natural language processing: measuring text similarity and plagiarism detection",
    "Data comparison: identifying common elements between two datasets in sorted order",
    "Shortest common supersequence: building the shortest string containing both inputs as subsequences",
  ],
  relatedAlgorithms: [
    "edit-distance",
    "longest-common-substring",
    "knapsack",
    "fibonacci",
    "sequence-alignment",
  ],
  glossaryTerms: [
    "dynamic programming",
    "subsequence",
    "optimal substructure",
    "overlapping subproblems",
    "backtracking",
    "memoization",
    "tabulation",
    "edit distance",
  ],
  tags: [
    "dynamic-programming",
    "string",
    "intermediate",
    "2D-table",
    "backtracking-reconstruction",
    "bioinformatics",
    "diff",
  ],
};
