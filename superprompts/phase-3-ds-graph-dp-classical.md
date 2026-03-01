# Phase 3: Data Structures + Graph + DP + Classical Algorithms — AlgoVerse

## CRITICAL: Read Memory & Documentation First
Before writing ANY code, read these files in order:
1. **MEMORY.md is auto-loaded** — review phase status and key patterns
2. Read ALL memory files:
   - `phases-progress.md` — see what Phase 2 built (especially the viz pattern)
   - `architecture-decisions.md` — follow the EXACT visualization component pattern
   - `file-registry.md` — existing file paths
3. Read project documentation:
   - `docs/TRD.md` — Section 3.4 (rendering strategies by category)
   - `docs/ALGORITHM_MASTER_LIST.md` — P0 algorithms for DS, Graph, DP, Greedy, String, Math, Backtracking, Misc
4. Read existing visualization code to understand the established pattern:
   - Read ONE sorting visualization (e.g., `src/visualizations/sorting/BubbleSort/`) as the template
   - Read `src/components/visualization/Player.tsx` — the universal player
   - Read `src/stores/visualization.ts` — the playback store
   - Read `src/lib/visualization/types.ts` — the types

## Phase Objective
Implement ~50 more P0 classical algorithm visualizations. Build shared renderers (TreeCanvas, GraphCanvas, MatrixCanvas) first, then use them across categories. Follow the EXACT same pattern from Phase 2.

## IMPORTANT: Follow the Established Pattern
Every algorithm MUST follow the same 3-file pattern from Phase 2:
```
src/visualizations/{category}/{AlgorithmName}/
  ├── index.tsx    — "use client", dynamic player wrapper
  ├── logic.ts     — generateSteps function (pre-compute ALL steps)
  └── Canvas.tsx   — render current step snapshot
```
Plus a data file at `src/data/algorithms/{category}/{slug}.ts`

## Tasks

### 1. Shared Renderers (`src/visualizations/_shared/`)

**`TreeCanvas.tsx`** — Reusable D3 hierarchical tree layout
- Supports binary trees, BST, AVL, Trie, Heap visualization
- Node circles with values, connecting edges
- Color-coded nodes (using viz colors)
- Smooth transition when nodes are added/removed/rotated
- Supports highlighting specific nodes and edges

**`GraphCanvas.tsx`** — Reusable D3 force-directed graph
- Nodes (circles) and edges (lines with optional weights)
- Directional arrows for directed graphs
- Edge weight labels
- Node highlighting and edge highlighting
- Supports showing shortest path, MST, etc.
- Optional fixed layout (for grid-based graphs like A*)

**`MatrixCanvas.tsx`** — Reusable 2D grid/matrix for DP problems
- CSS Grid or SVG-based cell rendering
- Cell highlighting with colors
- Arrow overlays showing optimal path
- Row/column headers
- Animated cell-by-cell fill

**`ArrayCanvas.tsx`** — Reusable linear array block visualization
- Array of blocks with values
- Pointer arrows (top/bottom)
- Window/range highlighting
- Stack/Queue specific variants

### 2. Data Structures (~17 algorithms)
Each gets 3 viz files + 1 data file. Use shared TreeCanvas/ArrayCanvas.

| Algorithm | Visualization | Category Folder |
|-----------|--------------|-----------------|
| Array | Block diagram with index labels, insert/delete | data-structures |
| Dynamic Array | Resize/copy animation | data-structures |
| Singly Linked List | Node-arrow chain, insert/delete/search | data-structures |
| Doubly Linked List | Bidirectional arrows | data-structures |
| Stack | Vertical push/pop with ArrayCanvas | data-structures |
| Queue | Horizontal enqueue/dequeue | data-structures |
| Priority Queue | Heap-backed, tree + array dual view | data-structures |
| Binary Tree | TreeCanvas, traversal order highlighting | data-structures |
| BST | TreeCanvas, insert/delete/search operations | data-structures |
| AVL Tree | TreeCanvas with rotation animations | data-structures |
| Trie | Character-labeled tree, word insertion/search | data-structures |
| Min-Heap | Tree + array dual view | data-structures |
| Max-Heap | Tree + array dual view | data-structures |
| Hash Table (Chaining) | Array of buckets with linked lists | data-structures |
| Hash Table (Open Addressing) | Array with probe sequence highlights | data-structures |
| Adjacency Matrix/List | Graph representation visual | data-structures |
| Union-Find | Forest with path compression animation | data-structures |

### 3. Graph Algorithms (~7 algorithms)
Use shared GraphCanvas.

| Algorithm | Visualization |
|-----------|--------------|
| Dijkstra | Weighted graph, distance table updates, shortest path highlight |
| Bellman-Ford | Edge relaxation iterations, negative weight handling |
| A* Search | Grid with heuristic values, open/closed sets |
| Kruskal's MST | Sort edges, add to MST if no cycle |
| Prim's MST | Growing MST from start node |
| Topological Sort | DAG with ordering numbers |
| Cycle Detection | Graph with cycle highlighted |

### 4. Dynamic Programming (~9 algorithms)
Use shared MatrixCanvas for table-based problems.

| Algorithm | Visualization |
|-----------|--------------|
| Fibonacci (DP) | Table fill + optional recursion tree comparison |
| Climbing Stairs | Step diagram + DP table |
| Coin Change | DP table with coin selection arrows |
| 0/1 Knapsack | 2D table with item selection |
| LCS | 2D matrix with arrows showing path |
| LIS | Array with subsequence highlighting |
| Edit Distance | 2D matrix with operations (insert/delete/replace) |
| Kadane's (Max Subarray) | Array with running sum visualization |
| Unique Paths | Grid with path counting, cell-by-cell fill |

### 5. Other Categories

**Greedy (~3):**
- Activity Selection — timeline with intervals
- Fractional Knapsack — ratio sorting + progressive filling
- Huffman Coding — tree construction from frequency table

**String (~2):**
- Naive String Matching — sliding pattern window over text
- KMP — prefix table construction + matching

**Mathematical (~3):**
- Euclidean GCD — number reduction steps
- Sieve of Eratosthenes — number grid with crossing out
- Matrix Operations — matrix animations (add/multiply)

**Backtracking (~2):**
- N-Queens — chessboard with queen placement/backtrack
- Sudoku Solver — grid filling with backtracking

**Miscellaneous (~4):**
- Two Pointer — converging pointers on sorted array
- Sliding Window — moving window with sum/count
- Recursion Visualization — call stack tree
- Memoization — cached recursion tree (grayed cached calls)

### 6. Data Files
Create complete data files for ALL ~50 algorithms in `src/data/algorithms/{category}/`.
Update `src/data/algorithms/index.ts` to include all new algorithms.

### 7. Dynamic Import Updates
Update the algorithm detail page to handle dynamic imports for all new categories.

## CRITICAL: After Completion
1. Run `npm run build` — verify clean build
2. Test at least 5-10 representative algorithms across different categories:
   - A data structure (BST insert)
   - A graph algorithm (Dijkstra)
   - A DP problem (Knapsack or LCS)
   - A backtracking (N-Queens)
   - A misc (Two Pointer)
3. Update ALL memory files:
   - `MEMORY.md` — Phase 3 COMPLETED, update stats (~62 total algorithms)
   - `phases-progress.md` — Phase 3 deliverables, all file paths
   - `architecture-decisions.md` — Document shared renderer patterns
   - `file-registry.md` — Add all new files
   - `current-phase.md` — Point to Phase 4
4. Git commit and push:
   ```bash
   git add -A
   git commit -m "Phase 3: Data structures, graph, DP, and classical algorithm visualizations (~50 algorithms)"
   git push origin main
   ```
