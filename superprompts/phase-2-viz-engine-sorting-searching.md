# Phase 2: Visualization Engine + Sorting & Searching — AlgoVerse

## CRITICAL: Read Memory & Documentation First
Before writing ANY code, read these files in order:
1. **MEMORY.md is auto-loaded** — review phase status and key patterns
2. Read the memory files:
   - `/Users/viditkbhatnagar/.claude/projects/-Users-viditkbhatnagar-codes-Algo-Verse/memory/phases-progress.md`
   - `/Users/viditkbhatnagar/.claude/projects/-Users-viditkbhatnagar-codes-Algo-Verse/memory/architecture-decisions.md`
   - `/Users/viditkbhatnagar/.claude/projects/-Users-viditkbhatnagar-codes-Algo-Verse/memory/file-registry.md`
3. Read project documentation:
   - `docs/CLAUDE_CODE_INSTRUCTIONS.md` — Section 9 (Viz Engine Architecture)
   - `docs/TRD.md` — Sections 3.1-3.4 (types, component pattern, player spec, rendering strategies)
   - `docs/ALGORITHM_MASTER_LIST.md` — P0 sorting & searching algorithm details
4. Read existing code to understand established patterns:
   - `src/lib/visualization/types.ts` — the types you'll use
   - `src/app/algorithms/[category]/[algorithm]/page.tsx` — the page to wire viz into
   - `src/components/algorithm/AlgorithmDetail.tsx` — detail layout to integrate with
   - `src/data/algorithms/index.ts` — algorithm registry to update

## Phase Objective
Build the universal VisualizationPlayer component (play/pause/step/speed controls) and implement 12 complete, working algorithm visualizations. This phase establishes THE PATTERN that all 300+ algorithms will follow.

## CRITICAL: Visualization Architecture
Every algorithm follows this exact pattern:
```
src/visualizations/{category}/{AlgorithmName}/
  ├── index.tsx    — "use client", imports Player + logic + Canvas, main component
  ├── logic.ts     — exports generate{Name}Steps(input): VisualizationStep[]
  └── Canvas.tsx   — receives { steps, currentStep, data }, renders SVG/D3
```
- **Steps are PRE-COMPUTED** when input changes, NOT during animation
- Canvas receives the current step and renders the snapshot
- Player manages playback state (play/pause/step/speed)
- Visualization components are **dynamically imported** via `next/dynamic` in the algorithm page

## Tasks

### 1. Visualization Engine Components

**`src/components/visualization/Player.tsx`**
Universal wrapper that accepts:
- `steps: VisualizationStep[]` — pre-computed steps
- `children` or `renderCanvas` — the Canvas component
- Manages playback with useVisualization hook
- Renders Controls, StepCounter, StepDescription around the canvas

**`src/components/visualization/Controls.tsx`**
Playback control bar:
- Play/Pause button (Space key)
- Step Back (Left arrow)
- Step Forward (Right arrow)
- Reset (R key)
- Speed slider
- Uses Lucide icons: Play, Pause, SkipBack, SkipForward, RotateCcw

**`src/components/visualization/SpeedSlider.tsx`**
- shadcn Slider for 0.25x to 4x
- Shows current speed label
- Preset buttons: 0.5x, 1x, 2x, 4x

**`src/components/visualization/StepCounter.tsx`**
- "Step 3 of 15" display

**`src/components/visualization/StepDescription.tsx`**
- Shows current step's description text
- Animated text transition between steps

**`src/components/visualization/VisualizationContainer.tsx`**
- Responsive container with min-height
- Consistent padding and border
- surface background with subtle border

### 2. Zustand Store & Hook

**`src/stores/visualization.ts`**
```typescript
// State: steps[], currentStep, isPlaying, speed, intervalId
// Actions: play(), pause(), stepForward(), stepBack(), reset(), setSpeed(), setSteps()
```

**`src/hooks/useVisualization.ts`**
- Wraps the Zustand store
- Handles the playback interval (setInterval based on speed)
- Keyboard shortcuts: Space (play/pause), ArrowRight (step forward), ArrowLeft (step back), R (reset)
- Cleans up interval on unmount

### 3. Sorting Visualizations (8 algorithms)
Each gets `src/visualizations/sorting/{Name}/index.tsx`, `logic.ts`, `Canvas.tsx`

**Shared component:** `src/visualizations/sorting/_shared/BarCanvas.tsx`
- D3-based SVG bar chart
- Each bar: height proportional to value, width = containerWidth/arrayLength
- Colors from VIZ_COLORS: default (slate), active (indigo), comparing (amber), swapping (red), completed (green)
- Smooth transitions with Framer Motion or D3 transitions
- Shows value labels on bars
- Responsive to container size

**Algorithms to implement:**
1. **Bubble Sort** — adjacent comparisons, swap animation
2. **Selection Sort** — find minimum, swap to front
3. **Insertion Sort** — shift elements, insert in place
4. **Merge Sort** — divide phase (split bars), merge phase (combine sorted)
5. **Quick Sort** — pivot selection, partition animation
6. **Heap Sort** — dual view: heap tree + array bars
7. **Counting Sort** — frequency array visualization + output construction
8. **Radix Sort** — digit-by-digit bucket sorting animation

### 4. Searching Visualizations (4 algorithms)

1. **Linear Search** (`src/visualizations/searching/LinearSearch/`)
   - Array of blocks, pointer scans left to right
   - Found element highlighted in green, visited in blue

2. **Binary Search** (`src/visualizations/searching/BinarySearch/`)
   - Sorted array with low/mid/high pointers
   - Narrowing bounds animation
   - Eliminated sections grayed out

3. **DFS** (`src/visualizations/searching/DFS/`)
   - Graph with nodes and edges (simple D3 force layout or fixed positions)
   - Stack shown on side
   - Visited nodes colored, current node highlighted
   - Backtracking shown with color change

4. **BFS** (`src/visualizations/searching/BFS/`)
   - Same graph rendering as DFS
   - Queue shown on side
   - Level-by-level coloring

### 5. Full Algorithm Data Files
Update ALL 12 algorithm data files in `src/data/algorithms/` with complete content:
- 3-4 paragraph descriptions
- Pseudocode
- Python implementation (complete, runnable)
- JavaScript implementation (complete, runnable)
- Complexity: best/average/worst time + space
- 3-5 use cases
- Related algorithms (slugs that link)
- Tags for search

### 6. Wire Up Dynamic Import
Update `src/app/algorithms/[category]/[algorithm]/page.tsx`:
- Dynamically import the visualization component based on algorithm slug
- Use `next/dynamic` with `{ ssr: false }` since viz components use D3/browser APIs
- Show loading spinner while viz loads
- Pass algorithm metadata to AlgorithmDetail

## Design Guidelines for Visualizations
- Canvas background: `surface` (#1a1a2e)
- Bar/element default: `viz-default` (#475569)
- Active/current: `viz-active` (#6366f1)
- Comparing: `viz-comparing` (#f59e0b)
- Swapping: `viz-swapping` (#ef4444)
- Completed: `viz-completed` (#22c55e)
- Highlighted: `viz-highlighted` (#22d3ee)
- Canvas min-height: 300px, responsive width
- Animation duration: 300ms default, scaled by speed multiplier
- Font in canvas: JetBrains Mono for values

## CRITICAL: After Completion
1. Run `npm run build` — verify clean build
2. Run `npm run dev` and verify ALL 12 algorithms:
   - Navigate to each algorithm page
   - Play button starts animation
   - Pause stops at current step
   - Step forward/back work
   - Speed slider changes speed
   - Reset returns to initial state
   - Keyboard shortcuts work (Space, arrows, R)
   - Bar charts animate smoothly
   - DFS/BFS graph rendering works
3. Update memory files:
   - `MEMORY.md` — Phase 2 COMPLETED, add viz component pattern, update stats (12 algorithms)
   - `phases-progress.md` — Phase 2 deliverables, all file paths
   - `architecture-decisions.md` — Document the EXACT visualization pattern (this is the template for 300+ algos)
   - `file-registry.md` — Add all viz component files, store, hooks
   - `current-phase.md` — Point to Phase 3
4. Git commit and push:
   ```bash
   git add -A
   git commit -m "Phase 2: Visualization engine + 12 sorting/searching algorithm visualizations"
   git push origin main
   ```
