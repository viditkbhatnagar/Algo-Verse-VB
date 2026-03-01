import type { AlgorithmMetadata } from "@/lib/visualization/types";

export const sudokuSolver: AlgorithmMetadata = {
  id: "sudoku-solver",
  name: "Sudoku Solver",
  category: "backtracking",
  subcategory: "Puzzle Solving",
  difficulty: "intermediate",
  timeComplexity: {
    best: "O(1)",
    average: "O(9^m)",
    worst: "O(9^m)",
    note: "m is the number of empty cells. Best case when the puzzle is already solved. In practice, constraint propagation drastically reduces the search space.",
  },
  spaceComplexity: {
    best: "O(1)",
    average: "O(m)",
    worst: "O(m)",
    note: "O(m) recursion stack depth where m is the number of empty cells. The 9x9 board uses O(81) = O(1) space.",
  },
  description: `A Sudoku solver using backtracking is one of the most elegant applications of recursive search with constraint checking. The puzzle consists of a 9x9 grid divided into nine 3x3 sub-grids (boxes). Some cells contain given numbers (clues), and the goal is to fill every empty cell with a digit from 1 to 9 such that each row, column, and 3x3 box contains all digits exactly once.

The backtracking algorithm works by scanning the grid to find the next empty cell, then trying each digit from 1 to 9. For each candidate digit, it checks whether placing that digit violates any Sudoku constraints (duplicate in the same row, column, or 3x3 box). If the placement is valid, the algorithm places the digit and recursively attempts to solve the rest of the puzzle. If the recursion reaches a dead end (no valid digit for some cell), the algorithm backtracks by removing the digit and trying the next candidate.

The theoretical worst case for a pure backtracking approach is O(9^m) where m is the number of empty cells. However, several optimizations make the solver dramatically faster in practice. Constraint propagation (eliminating candidates based on existing digits in the same row, column, and box) prunes the search tree significantly. Choosing the cell with the fewest candidates (Most Constrained Variable heuristic or Minimum Remaining Values) further reduces exploration.

For standard 17-clue puzzles (the minimum number of clues for a unique solution), a well-implemented backtracking solver typically processes only a few hundred to a few thousand nodes before finding the solution. More advanced techniques like naked pairs, hidden singles, and X-wing eliminate candidates without guessing.

Sudoku solving is an NP-complete problem (for generalized n^2 x n^2 boards), making it an important problem in computational complexity theory. It has direct connections to constraint satisfaction problems, graph coloring (each cell is a node with constraints to its row, column, and box neighbors), and exact cover problems (solved efficiently by Knuth's Algorithm X with Dancing Links).`,
  shortDescription:
    "Solves a 9x9 Sudoku puzzle using backtracking, trying digits 1-9 in each empty cell and backtracking when constraints are violated.",
  pseudocode: `procedure solveSudoku(board[9][9])
    cell = findEmpty(board)
    if cell is null then
        return true     // Puzzle solved
    end if
    row, col = cell
    for num = 1 to 9 do
        if isValid(board, row, col, num) then
            board[row][col] = num
            if solveSudoku(board) then
                return true
            end if
            board[row][col] = 0   // Backtrack
        end if
    end for
    return false   // Trigger backtracking

procedure isValid(board, row, col, num)
    // Check row
    for j = 0 to 8 do
        if board[row][j] == num then return false
    // Check column
    for i = 0 to 8 do
        if board[i][col] == num then return false
    // Check 3x3 box
    boxRow = (row / 3) * 3
    boxCol = (col / 3) * 3
    for i = boxRow to boxRow + 2 do
        for j = boxCol to boxCol + 2 do
            if board[i][j] == num then return false
    return true`,
  implementations: {
    python: `def solve_sudoku(board: list[list[int]]) -> bool:
    """Solve a Sudoku puzzle in-place using backtracking. 0 = empty cell."""
    cell = find_empty(board)
    if cell is None:
        return True  # Solved

    row, col = cell
    for num in range(1, 10):
        if is_valid(board, row, col, num):
            board[row][col] = num
            if solve_sudoku(board):
                return True
            board[row][col] = 0  # Backtrack

    return False


def find_empty(board: list[list[int]]) -> tuple[int, int] | None:
    for i in range(9):
        for j in range(9):
            if board[i][j] == 0:
                return (i, j)
    return None


def is_valid(board: list[list[int]], row: int, col: int, num: int) -> bool:
    # Check row
    if num in board[row]:
        return False
    # Check column
    if any(board[i][col] == num for i in range(9)):
        return False
    # Check 3x3 box
    box_r, box_c = 3 * (row // 3), 3 * (col // 3)
    for i in range(box_r, box_r + 3):
        for j in range(box_c, box_c + 3):
            if board[i][j] == num:
                return False
    return True


# Example usage
if __name__ == "__main__":
    puzzle = [
        [5,3,0,0,7,0,0,0,0],
        [6,0,0,1,9,5,0,0,0],
        [0,9,8,0,0,0,0,6,0],
        [8,0,0,0,6,0,0,0,3],
        [4,0,0,8,0,3,0,0,1],
        [7,0,0,0,2,0,0,0,6],
        [0,6,0,0,0,0,2,8,0],
        [0,0,0,4,1,9,0,0,5],
        [0,0,0,0,8,0,0,7,9],
    ]
    solve_sudoku(puzzle)
    for row in puzzle:
        print(row)`,
    javascript: `function solveSudoku(board) {
  const cell = findEmpty(board);
  if (!cell) return true; // Solved

  const [row, col] = cell;
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (solveSudoku(board)) return true;
      board[row][col] = 0; // Backtrack
    }
  }
  return false;
}

function findEmpty(board) {
  for (let i = 0; i < 9; i++)
    for (let j = 0; j < 9; j++)
      if (board[i][j] === 0) return [i, j];
  return null;
}

function isValid(board, row, col, num) {
  // Check row
  if (board[row].includes(num)) return false;
  // Check column
  for (let i = 0; i < 9; i++)
    if (board[i][col] === num) return false;
  // Check 3x3 box
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let i = br; i < br + 3; i++)
    for (let j = bc; j < bc + 3; j++)
      if (board[i][j] === num) return false;
  return true;
}

// Example usage
const puzzle = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9],
];
solveSudoku(puzzle);
puzzle.forEach(row => console.log(row.join(" ")));`,
  },
  useCases: [
    "Automated puzzle solving for games and puzzle generators",
    "Teaching backtracking, constraint propagation, and recursive search",
    "Benchmarking constraint satisfaction and SAT solving algorithms",
    "Generating valid Sudoku puzzles with unique solutions",
    "Studying NP-completeness through a concrete, intuitive problem",
  ],
  relatedAlgorithms: [
    "n-queens",
    "graph-coloring",
    "exact-cover",
    "constraint-propagation",
  ],
  glossaryTerms: [
    "backtracking",
    "constraint satisfaction",
    "pruning",
    "search tree",
    "NP-complete",
    "exact cover",
  ],
  tags: [
    "backtracking",
    "puzzle-solving",
    "intermediate",
    "sudoku",
    "constraint-satisfaction",
    "recursion",
  ],
};
