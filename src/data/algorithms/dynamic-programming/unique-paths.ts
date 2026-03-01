import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const uniquePaths: AlgorithmMetadata = {
  id: "unique-paths",
  name: "Unique Paths",
  category: "dynamic-programming",
  subcategory: "Grid DP",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(m * n)",
    average: "O(m * n)",
    worst: "O(m * n)",
    note: "Where m and n are the grid dimensions. Every cell must be computed exactly once. A combinatorial approach can compute the answer in O(m + n) time using the formula C(m+n-2, m-1), but the DP approach is more generalizable.",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(m * n)",
    worst: "O(m * n)",
    note: "The full 2D table uses O(m * n) space. Space can be optimized to O(n) by keeping only the current and previous rows, since each cell depends only on the cell above and to the left.",
  },
  description: `The Unique Paths problem asks: given an m x n grid, how many distinct paths exist from the top-left \
corner to the bottom-right corner, where movement is restricted to only right or down? This classic \
dynamic programming problem is a staple of coding interviews and serves as an excellent introduction \
to grid-based DP.

The DP solution builds a table dp[i][j] where each cell represents the number of unique paths from \
the top-left corner (0,0) to cell (i,j). The base cases are straightforward: there is exactly one way \
to reach any cell in the first row (keep moving right) and one way to reach any cell in the first \
column (keep moving down), so dp[0][j] = 1 and dp[i][0] = 1 for all valid i and j.

For the general case, any cell (i,j) can be reached from either the cell above (i-1,j) or the cell \
to the left (i,j-1), so dp[i][j] = dp[i-1][j] + dp[i][j-1]. This additive recurrence reflects the \
fundamental counting principle: the total paths to a cell equals the sum of paths to its two \
predecessors. The final answer is found at dp[m-1][n-1].

This problem also has an elegant combinatorial solution: every path consists of exactly (m-1) downward \
moves and (n-1) rightward moves, for a total of (m+n-2) moves. The answer is C(m+n-2, m-1), the \
binomial coefficient representing the number of ways to choose which moves go downward. While the \
combinatorial approach is O(m+n), the DP approach is preferred for teaching because it naturally \
extends to variants like grids with obstacles, weighted cells, or minimum-cost paths.

Extensions of this problem include Unique Paths II (with obstacles), Minimum Path Sum (weighted cells), \
and the general grid DP paradigm used in image processing, robot navigation, and lattice path counting \
in combinatorics.`,
  shortDescription:
    "Counts the number of unique paths from the top-left to the bottom-right of an m x n grid, moving only right or down.",
  pseudocode: `function UniquePaths(m, n):
    dp = 2D array of size m x n

    // Base cases: first row and first column
    for j from 0 to n-1:
        dp[0][j] = 1
    for i from 0 to m-1:
        dp[i][0] = 1

    // Fill table row by row
    for i from 1 to m-1:
        for j from 1 to n-1:
            dp[i][j] = dp[i-1][j] + dp[i][j-1]

    return dp[m-1][n-1]`,
  implementations: {
    python: `def unique_paths(m: int, n: int) -> int:
    """Count unique paths in an m x n grid (right/down only)."""
    dp = [[1] * n for _ in range(m)]

    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]

    return dp[m - 1][n - 1]


def unique_paths_optimized(m: int, n: int) -> int:
    """Space-optimized version using a single row."""
    row = [1] * n
    for i in range(1, m):
        for j in range(1, n):
            row[j] += row[j - 1]
    return row[n - 1]


def unique_paths_combinatorial(m: int, n: int) -> int:
    """Combinatorial solution: C(m+n-2, m-1)."""
    from math import comb
    return comb(m + n - 2, m - 1)


# Example
if __name__ == "__main__":
    m, n = 4, 5
    print(f"Grid: {m}x{n}")
    print(f"Unique paths (DP): {unique_paths(m, n)}")
    print(f"Unique paths (optimized): {unique_paths_optimized(m, n)}")
    print(f"Unique paths (combinatorial): {unique_paths_combinatorial(m, n)}")`,
    javascript: `/**
 * Count unique paths in an m x n grid.
 * @param {number} m - Number of rows
 * @param {number} n - Number of columns
 * @returns {number}
 */
function uniquePaths(m, n) {
  const dp = Array.from({ length: m }, () => Array(n).fill(1));

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }

  return dp[m - 1][n - 1];
}

/**
 * Space-optimized version using a single row.
 * @param {number} m
 * @param {number} n
 * @returns {number}
 */
function uniquePathsOptimized(m, n) {
  const row = new Array(n).fill(1);
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      row[j] += row[j - 1];
    }
  }
  return row[n - 1];
}

// Example
const m = 4, n = 5;
console.log(\`Grid: \${m}x\${n}\`);
console.log(\`Unique paths (DP): \${uniquePaths(m, n)}\`);
console.log(\`Unique paths (optimized): \${uniquePathsOptimized(m, n)}\`);`,
  },
  useCases: [
    "Robot navigation — counting possible routes through a grid-based environment",
    "Lattice path counting in combinatorics and probability theory",
    "Network routing — counting the number of shortest paths in a grid network",
    "Image processing — traversal patterns for pixel-based algorithms",
    "Game development — pathfinding and movement in tile-based games",
  ],
  relatedAlgorithms: [
    "kadanes",
    "knapsack",
    "edit-distance",
    "fibonacci",
  ],
  glossaryTerms: [
    "dynamic programming",
    "grid DP",
    "binomial coefficient",
    "combinatorics",
    "optimal substructure",
    "tabulation",
  ],
  tags: [
    "dynamic-programming",
    "grid",
    "intermediate",
    "classic",
    "2D-table",
    "combinatorics",
  ],
};
