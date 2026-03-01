# Phase 1: Shell & Navigation — AlgoVerse

## CRITICAL: Read Memory & Documentation First
Before writing ANY code, read these files in order:
1. **MEMORY.md is auto-loaded** — review phase status and key patterns
2. Read the memory files:
   - `/Users/viditkbhatnagar/.claude/projects/-Users-viditkbhatnagar-codes-Algo-Verse/memory/phases-progress.md`
   - `/Users/viditkbhatnagar/.claude/projects/-Users-viditkbhatnagar-codes-Algo-Verse/memory/architecture-decisions.md`
   - `/Users/viditkbhatnagar/.claude/projects/-Users-viditkbhatnagar-codes-Algo-Verse/memory/file-registry.md`
3. Read project documentation:
   - `docs/CLAUDE_CODE_INSTRUCTIONS.md` — especially Sections 3, 7, 9, 10
   - `docs/TRD.md` — especially Sections 3.1 (types), 7 (routes)
   - `docs/FOLDER_STRUCTURE.md` — directory tree to follow
   - `docs/ALGORITHM_MASTER_LIST.md` — full category taxonomy and P0 algorithm names

## Phase Objective
Build the complete application shell (Navbar, Sidebar, Breadcrumbs, mobile nav), the category data system with all 16 categories, algorithm data stubs for P0 algorithms, all navigation pages, and the algorithm detail page template. By the end, users can navigate the full taxonomy and see placeholder algorithm pages.

## Tasks

### 1. Visualization Types (`src/lib/visualization/types.ts`)
Create the core TypeScript types that ALL future visualization components depend on:
```typescript
// Key types to define:
// - VisualizationStep { id, description, action, highlights, data, codeLineHighlight?, variables? }
// - StepAction = "compare" | "swap" | "visit" | "insert" | "delete" | "highlight" | "complete" | "select" | "merge" | "split"
// - HighlightColor = "active" | "comparing" | "swapping" | "completed" | "highlighted" | "default"
// - HighlightInfo { index: number, color: HighlightColor }
// - AlgorithmMetadata { id, slug, name, category, subcategory?, difficulty, description, shortDescription, pseudocode, implementations: { python, javascript }, complexity: ComplexityInfo, useCases, relatedAlgorithms, tags, glossaryTerms? }
// - ComplexityInfo { time: { best, average, worst }, space }
// - Category { id, slug, name, description, icon, subcategories, algorithmCount }
```

### 2. Category Data (`src/data/categories/index.ts`)
Create the full category hierarchy for ALL 16 categories from ALGORITHM_MASTER_LIST.md:
- Data Structures, Sorting, Searching, Graph Algorithms, Dynamic Programming, Greedy, Divide & Conquer, String Algorithms, Mathematical, Backtracking, Machine Learning, Deep Learning, NLP, Reinforcement Learning, Optimization, Miscellaneous
- Each has: id, slug, name, description, icon (Lucide icon name), subcategories list, algorithmCount
- Export as `categories` array and a `getCategoryBySlug()` function

### 3. Algorithm Data Stubs
Create `src/data/algorithms/index.ts` as master registry that re-exports all algorithms.
Create stub data files for the first ~20 P0 algorithms (metadata only, NO step generators yet):
- **Sorting (6):** `sorting/bubble-sort.ts`, `sorting/selection-sort.ts`, `sorting/insertion-sort.ts`, `sorting/merge-sort.ts`, `sorting/quick-sort.ts`, `sorting/heap-sort.ts`
- **Searching (4):** `searching/linear-search.ts`, `searching/binary-search.ts`, `searching/dfs.ts`, `searching/bfs.ts`
- **Data Structures (5):** `data-structures/stack.ts`, `data-structures/queue.ts`, `data-structures/linked-list.ts`, `data-structures/binary-search-tree.ts`, `data-structures/hash-table.ts`
- **Graph (3):** `graph/dijkstra.ts`, `graph/kruskal.ts`, `graph/prim.ts`
- **DP (2):** `dynamic-programming/fibonacci.ts`, `dynamic-programming/knapsack.ts`

Each stub exports an `AlgorithmMetadata` object with: name, slug, category, subcategory, difficulty, description (3-4 paragraphs), shortDescription (1 sentence), pseudocode, implementations (Python + JS), complexity (Big O), useCases, relatedAlgorithms (slugs), tags.

### 4. Layout Components

**`src/components/layout/Navbar.tsx`**
- Fixed top bar with: AlgoVerse logo (text-based), search trigger button (non-functional — just opens placeholder for now, Cmd+K hint), theme toggle placeholder button
- Uses shadcn Button, Tooltip
- Responsive: full on desktop, compact on mobile

**`src/components/layout/Sidebar.tsx`**
- Collapsible sidebar (left side, 280px width)
- Shows all 16 categories as expandable sections
- Each category shows: icon, name, algorithm count badge
- Expanding a category shows its subcategories/algorithms
- Current page highlighted
- Uses Lucide icons for each category
- Scroll for overflow with custom scrollbar
- Responsive: hidden on mobile, toggle on tablet

**`src/components/layout/MobileNav.tsx`**
- Bottom tab bar for mobile (<768px)
- 4 tabs: Home, Algorithms, Glossary, Progress
- Uses Lucide icons
- Active tab highlighted with primary color

**`src/components/layout/Breadcrumbs.tsx`**
- Dynamic breadcrumb trail based on URL segments
- Home > Category > Algorithm
- Clickable links
- Uses ChevronRight separator

### 5. Algorithm UI Components

**`src/components/algorithm/AlgorithmCard.tsx`**
- Card for grid views: name, category badge, difficulty badge, short description, complexity preview
- Clickable — links to algorithm detail page
- Uses shadcn Card, Badge

**`src/components/algorithm/AlgorithmDetail.tsx`**
- Full detail layout with sections:
  1. Header (name, category, difficulty, tags)
  2. Description (3-4 paragraphs)
  3. Visualization placeholder ("Visualization coming in Phase 2")
  4. Pseudocode
  5. Code (Python/JS tabs)
  6. Complexity analysis
  7. Use cases
  8. Related algorithms

**`src/components/algorithm/CodeBlock.tsx`**
- Syntax-highlighted code using react-syntax-highlighter
- Language tabs (Python / JavaScript)
- Copy button
- Uses Prism theme (dark)

**`src/components/algorithm/PseudocodeBlock.tsx`**
- Pseudocode display with monospace font
- Line numbers
- Optional line highlighting (for future viz sync)

**`src/components/algorithm/ComplexityChart.tsx`**
- Visual Big-O comparison chart using Recharts
- Shows best/average/worst time + space
- Color-coded bars

**`src/components/algorithm/RelatedAlgorithms.tsx`**
- Grid of linked algorithm cards (compact)

**`src/components/algorithm/UseCases.tsx`**
- Bulleted list of real-world use cases

### 6. Shared Components

**`src/components/shared/DifficultyBadge.tsx`**
- Color-coded badge: Beginner (green), Intermediate (yellow), Advanced (orange), Expert (red)

**`src/components/shared/CategoryIcon.tsx`**
- Maps category slug to Lucide icon component

**`src/components/shared/LoadingSpinner.tsx`**
- Simple loading spinner with primary color

### 7. Pages

**`src/app/page.tsx`** (modify existing)
- Hero section with title and description
- Category grid (4 columns desktop, 2 tablet, 1 mobile) with cards linking to each category
- "Recently Viewed" section (placeholder for now)

**`src/app/algorithms/page.tsx`**
- All algorithms grid view
- Filter by category dropdown
- Sort by name/difficulty
- Shows AlgorithmCard for each algorithm

**`src/app/algorithms/[category]/page.tsx`**
- Category overview: title, description, subcategories
- Algorithm list for this category
- Uses `generateStaticParams()` from categories array

**`src/app/algorithms/[category]/[algorithm]/page.tsx`**
- Algorithm detail page using AlgorithmDetail component
- Uses `generateStaticParams()` from algorithms registry
- Has visualization placeholder area

### 8. Root Layout Update (`src/app/layout.tsx`)
- Import and render Navbar, Sidebar
- Main content area with proper margins (ml-[280px] on desktop)
- MobileNav at bottom on mobile

### 9. State Management
**`src/stores/ui.ts`**
- Zustand store: sidebarOpen (boolean), toggleSidebar(), theme placeholder

### 10. Hooks
**`src/hooks/useKeyboardShortcuts.ts`**
- Foundation hook for global keyboard shortcuts
- Register Cmd+K (placeholder — no search yet)

## Design Guidelines
- Background: `#0a0a0a`, Surface cards: `#1a1a2e`, Primary: `#6366f1`, Accent: `#22d3ee`
- Font: Inter for text, JetBrains Mono for code
- Border radius: 8px cards, 6px buttons
- Border color: `#334155`
- All components should be dark-mode styled (the app is dark-mode by default)

## CRITICAL: After Completion
1. Run `npm run build` — verify clean build with no errors
2. Run `npm run dev` and verify:
   - Home page shows category grid
   - Clicking a category navigates to category page
   - Clicking an algorithm navigates to detail page
   - Sidebar shows all 16 categories
   - Breadcrumbs work
   - Mobile nav appears on small screens
3. Update memory files:
   - `MEMORY.md` — Change Phase 1 to COMPLETED, add key patterns, update stats
   - `phases-progress.md` — Fill Phase 1 deliverables and file list
   - `architecture-decisions.md` — Document component patterns, layout pattern, data file pattern
   - `file-registry.md` — Add all new files
   - `current-phase.md` — Update to point to Phase 2
4. Git commit and push:
   ```bash
   git add -A
   git commit -m "Phase 1: Shell & navigation — layout, category tree, algorithm detail template"
   git push origin main
   ```
