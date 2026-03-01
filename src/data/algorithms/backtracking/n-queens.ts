import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const nQueens: AlgorithmMetadata = {
  id: "n-queens",
  name: "N-Queens",
  category: "backtracking",
  subcategory: "Constraint Satisfaction",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(n!)",
    average: "O(n!)",
    worst: "O(n!)",
    note: "The branching factor decreases at each level. Approximately n * (n-2) * (n-4) * ... choices. Exact analysis is complex but bounded by O(n!).",
  },
  spaceComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "O(n) for the board representation plus O(n) for the recursion stack depth, since we place one queen per row.",
  },
  description: `The N-Queens problem is a classic constraint satisfaction problem in which n chess queens must be placed on an n x n chessboard so that no two queens threaten each other. This means no two queens can share the same row, column, or diagonal. The problem is a quintessential example of backtracking and is one of the most studied puzzles in computer science.

The backtracking approach works by placing queens one row at a time. For each row, the algorithm tries each column position and checks whether placing a queen there conflicts with any previously placed queen. If the position is safe (no conflicts on the same column or diagonals), the queen is placed and the algorithm moves to the next row. If no safe position exists in the current row, the algorithm backtracks to the previous row and tries the next available column.

For the standard 8-queens problem, there are 92 distinct solutions (or 12 fundamental solutions when accounting for symmetry). The problem was first posed in 1848 by chess player Max Bezzel and has since become a benchmark for constraint-solving algorithms and a teaching tool for recursion and backtracking.

The conflict detection can be made efficient using three boolean arrays (or bit vectors): one for columns, one for the main diagonals (row - col is constant), and one for the anti-diagonals (row + col is constant). This allows O(1) conflict checking at each step, making the per-node cost constant and the overall complexity dominated by the tree exploration.

Beyond its educational value, the N-Queens problem has connections to combinatorial optimization, constraint programming, and even quantum computing research. It is used to benchmark SAT solvers, study parallel search strategies, and explore the limits of combinatorial explosion.`,
  shortDescription:
    "Place N queens on an N x N chessboard so that no two queens attack each other, using backtracking to explore and prune the search space.",
  pseudocode: `procedure solveNQueens(n)
    board = n x n grid initialized to empty
    solve(board, 0, n)

procedure solve(board, row, n)
    if row == n then
        // All queens placed successfully
        record solution
        return true
    end if
    for col = 0 to n - 1 do
        if isSafe(board, row, col, n) then
            board[row][col] = QUEEN
            if solve(board, row + 1, n) then
                return true  // Found a solution
            end if
            board[row][col] = EMPTY  // Backtrack
        end if
    end for
    return false  // No valid placement in this row

procedure isSafe(board, row, col, n)
    // Check column
    for i = 0 to row - 1 do
        if board[i][col] == QUEEN then return false
    // Check upper-left diagonal
    for i,j = row-1,col-1 while i >= 0 and j >= 0 do
        if board[i][j] == QUEEN then return false
    // Check upper-right diagonal
    for i,j = row-1,col+1 while i >= 0 and j < n do
        if board[i][j] == QUEEN then return false
    return true`,
  implementations: {
    python: `def solve_n_queens(n: int) -> list[list[int]]:
    """Solve N-Queens and return all solutions as lists of column positions."""
    solutions = []
    cols = set()
    diag1 = set()  # row - col
    diag2 = set()  # row + col
    placement = []

    def backtrack(row: int):
        if row == n:
            solutions.append(placement[:])
            return

        for col in range(n):
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue
            placement.append(col)
            cols.add(col)
            diag1.add(row - col)
            diag2.add(row + col)

            backtrack(row + 1)

            placement.pop()
            cols.remove(col)
            diag1.remove(row - col)
            diag2.remove(row + col)

    backtrack(0)
    return solutions


# Example usage
if __name__ == "__main__":
    solutions = solve_n_queens(8)
    print(f"Number of solutions for 8-Queens: {len(solutions)}")  # 92
    print("First solution (column indices):", solutions[0])`,
    javascript: `function solveNQueens(n) {
  const solutions = [];
  const cols = new Set();
  const diag1 = new Set(); // row - col
  const diag2 = new Set(); // row + col
  const placement = [];

  function backtrack(row) {
    if (row === n) {
      solutions.push([...placement]);
      return;
    }

    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
        continue;
      }
      placement.push(col);
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);

      backtrack(row + 1);

      placement.pop();
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
    }
  }

  backtrack(0);
  return solutions;
}

// Example usage
const solutions = solveNQueens(8);
console.log("Number of solutions:", solutions.length); // 92
console.log("First solution:", solutions[0]);`,
  },
  useCases: [
    "Teaching backtracking and constraint satisfaction programming",
    "Benchmarking SAT solvers and constraint propagation engines",
    "Parallel computing research for tree-based search strategies",
    "VLSI testing for independent set coverage patterns",
    "Mathematical study of permutations with restricted positions",
  ],
  relatedAlgorithms: [
    "sudoku-solver",
    "graph-coloring",
    "hamiltonian-path",
    "subset-sum",
  ],
  glossaryTerms: [
    "backtracking",
    "constraint satisfaction",
    "pruning",
    "search tree",
    "queen placement",
    "diagonal conflict",
  ],
  tags: [
    "backtracking",
    "constraint-satisfaction",
    "intermediate",
    "classic",
    "chess",
    "recursion",
  ],
};
