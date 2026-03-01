# AlgoVerse — AI-Powered Algorithm & ML Visual Learning Platform

## MASTER INSTRUCTION FILE FOR CLAUDE CODE

> **Read this file first, then read all other .md files in this directory before writing any code.**

---

## 1. PROJECT SUMMARY

Build **AlgoVerse** — a personal, interactive, visual learning platform that teaches EVERY algorithm, ML technique, NLP concept, and deep learning architecture through animated step-by-step visualizations, live interactive controls, and AI-powered explanations.

**Target User:** Single user (the developer themselves) — no multi-tenancy needed.

**Deployment:** Vercel (frontend + API routes)
**Database:** Neon (free-tier PostgreSQL)
**AI:** OpenAI API (GPT-4o-mini for explanations)
**Domain:** Custom or Vercel subdomain

---

## 2. TECH STACK (MANDATORY)

| Layer | Technology | Reason |
|---|---|---|
| Framework | **Next.js 14+ (App Router)** | SSR, API routes, Vercel-native |
| Language | **TypeScript** | Type safety across codebase |
| Styling | **Tailwind CSS + shadcn/ui** | Rapid UI development |
| Animations/Viz | **Framer Motion + D3.js** | Smooth animations + data viz |
| Canvas/WebGL | **P5.js or Three.js** (where needed) | Complex visualizations |
| State Mgmt | **Zustand** | Lightweight global state |
| Database | **Neon (PostgreSQL)** | Free-tier serverless Postgres |
| ORM | **Drizzle ORM** | Type-safe, lightweight |
| AI | **OpenAI API (GPT-4o-mini)** | Term explanations, Q&A |
| Search | **Fuse.js** | Client-side fuzzy search |
| Charts | **Recharts** | ML training graphs |
| Code Display | **Prism.js or Shiki** | Syntax-highlighted code blocks |
| Deployment | **Vercel** | Zero-config Next.js hosting |

---

## 3. CORE FEATURES (Priority Order)

### P0 — Must Have (MVP)

1. **Animated Step-by-Step Visualizations**
   - Every algorithm has a dedicated visualization page
   - Play/Pause/Step-Forward/Step-Back/Reset controls
   - Speed control slider (0.25x to 4x)
   - Current step highlighted with explanation text below
   - Visual elements: bars for sorting, nodes/edges for graphs, matrices for DP, neurons for neural nets
   - Color coding: active elements (blue), compared elements (yellow), sorted/completed (green), swapped (red)

2. **Universal Search Bar**
   - Always visible in the top navbar (Cmd+K / Ctrl+K shortcut)
   - Fuzzy search across: algorithm names, category names, glossary terms, tags
   - Instant results dropdown with categorized sections
   - Search powered by Fuse.js (client-side, fast)

3. **Glossary / "Explain Every Word" System**
   - Every technical term in the app is clickable
   - Clicking opens a side panel or modal with:
     - Plain English definition
     - Mathematical notation (if applicable, rendered with KaTeX)
     - Visual diagram/animation
     - Related terms (linked)
     - "Ask AI" button for deeper explanation via OpenAI
   - Glossary is also browsable as a standalone page (A-Z)

4. **Algorithm Detail Pages**
   - Each algorithm/concept gets its own page with:
     - Title, category, difficulty badge
     - Plain English explanation (3-4 paragraphs)
     - Visual animation (the core viz)
     - Pseudocode (syntax highlighted)
     - Real code (Python + JavaScript toggleable)
     - Time & space complexity (Big O) with visual comparison chart
     - Use cases / real-world applications
     - Related algorithms (linked)
     - "Explain with AI" button

5. **Category Navigation**
   - Sidebar with collapsible categories
   - Categories: see ALGORITHM_MASTER_LIST.md for full taxonomy
   - Each category has an overview page explaining the category
   - Breadcrumb navigation

### P1 — Important

6. **Live Interactive Controls**
   - For applicable algorithms: users can modify inputs and watch the algorithm react in real-time
   - Examples:
     - Sorting: enter custom array, drag to rearrange
     - Graph: click to add/remove nodes and edges
     - ML: adjust learning rate, epochs, see loss curve update
     - Neural net: change layer sizes, activation functions, watch forward pass
   - Input panel on the left, visualization on the right

7. **Progress Tracking**
   - Mark algorithms as: Not Started / In Progress / Understood
   - Progress bar per category and overall
   - Bookmarks (save any algorithm to favorites)
   - Personal notes per algorithm (stored in DB)
   - Dashboard showing learning stats

8. **Comparison Mode**
   - Side-by-side visualization of 2 algorithms
   - Useful for: Bubble Sort vs Quick Sort, BFS vs DFS, CNN vs RNN
   - Synchronized playback

### P2 — Nice to Have

9. **AI Chat Assistant**
   - Floating chat button (bottom-right)
   - Context-aware: knows which algorithm page you're on
   - Can answer questions like "Why is quicksort faster than bubble sort?"
   - Uses OpenAI API with system prompt containing algorithm context

10. **Code Playground**
    - Embedded code editor (Monaco Editor)
    - Run Python/JS code in browser (via Pyodide for Python)
    - Pre-loaded with algorithm implementations
    - Users can modify and see results

11. **Dark/Light Mode**
    - System preference detection + manual toggle
    - All visualizations must work in both modes

12. **Quiz Mode**
    - Quick quizzes per algorithm: "What's the time complexity?" multiple choice
    - Visual quizzes: "Which sorting algorithm is this animation showing?"

---

## 4. FILE/FOLDER STRUCTURE

See **FOLDER_STRUCTURE.md** for the complete directory tree.

---

## 5. DATABASE SCHEMA

See **DATABASE_SCHEMA.md** for complete Drizzle ORM schema.

---

## 6. ALGORITHM CONTENT

See **ALGORITHM_MASTER_LIST.md** for the complete list of 200+ algorithms and concepts to implement.

---

## 7. UI/UX SPECIFICATIONS

### Layout
```
┌──────────────────────────────────────────────────┐
│  Top Navbar: Logo | Search Bar (Cmd+K) | Theme   │
├──────────┬───────────────────────────────────────┤
│          │                                       │
│ Sidebar  │         Main Content Area             │
│          │                                       │
│ - Cats   │  ┌─────────────────────────────────┐  │
│ - Algos  │  │    Visualization Canvas          │  │
│ - Search │  │    (D3/Framer Motion/P5)         │  │
│          │  └─────────────────────────────────┘  │
│          │  ┌─────────────────────────────────┐  │
│          │  │    Controls: Play|Pause|Step     │  │
│          │  └─────────────────────────────────┘  │
│          │  ┌─────────────────────────────────┐  │
│          │  │    Explanation + Code + Notes    │  │
│          │  └─────────────────────────────────┘  │
├──────────┴───────────────────────────────────────┤
│  AI Chat Button (floating, bottom-right)         │
└──────────────────────────────────────────────────┘
```

### Design System
- **Font:** Inter (headings) + JetBrains Mono (code)
- **Colors (Dark Mode Primary):**
  - Background: `#0a0a0a`
  - Surface: `#1a1a2e`
  - Primary: `#6366f1` (Indigo)
  - Accent: `#22d3ee` (Cyan)
  - Success: `#22c55e`
  - Warning: `#f59e0b`
  - Error: `#ef4444`
  - Text: `#e2e8f0`
- **Border Radius:** 8px (cards), 12px (modals), 6px (buttons)
- **Shadows:** Subtle glow effects on active elements

### Visualization Color Scheme
- **Default/Inactive:** `#475569` (slate)
- **Active/Current:** `#6366f1` (indigo)
- **Comparing:** `#f59e0b` (amber)
- **Swapping/Changing:** `#ef4444` (red)
- **Completed/Sorted:** `#22c55e` (green)
- **Highlighted/Selected:** `#22d3ee` (cyan)

### Responsive Behavior
- Desktop (>1024px): Sidebar + main content side by side
- Tablet (768-1024px): Collapsible sidebar (hamburger menu)
- Mobile (<768px): Bottom tab navigation, full-width content

---

## 8. API ROUTES

```
/api/ai/explain       POST  — Get AI explanation for a term
/api/ai/chat          POST  — AI chat with algorithm context
/api/progress         GET   — Get user's progress data
/api/progress         POST  — Update progress for an algorithm
/api/bookmarks        GET   — Get bookmarked algorithms
/api/bookmarks        POST  — Add/remove bookmark
/api/notes            GET   — Get notes for an algorithm
/api/notes            POST  — Save/update notes
/api/search           GET   — Server-side search (fallback)
```

---

## 9. VISUALIZATION ENGINE ARCHITECTURE

Each algorithm visualization should follow this pattern:

```typescript
// src/lib/visualizations/types.ts
interface VisualizationState {
  steps: Step[];           // Pre-computed steps
  currentStep: number;     // Current step index
  isPlaying: boolean;
  speed: number;           // Playback speed multiplier
  data: any;               // Algorithm-specific data
}

interface Step {
  description: string;     // Human-readable explanation
  highlights: number[];    // Indices of highlighted elements
  action: string;          // "compare" | "swap" | "visit" | "insert" | etc.
  codeLineHighlight: number; // Line of pseudocode to highlight
}

// Each algorithm exports:
// 1. generateSteps(input) → Step[]    (pre-compute all steps)
// 2. VisualizationComponent            (React component)
// 3. metadata (name, category, complexity, etc.)
```

### Visualization Categories & Rendering:
| Category | Rendering Approach |
|---|---|
| Sorting | Bar chart (D3) — bar heights represent values |
| Searching | Array blocks with pointer arrows |
| Graph/Tree | Force-directed or hierarchical layout (D3) |
| Dynamic Programming | 2D grid/matrix with cell highlighting |
| Neural Networks | Layer diagram with animated data flow |
| NLP | Token flow diagrams, attention heatmaps |
| ML Training | Animated line charts (loss, accuracy) |
| Clustering | 2D scatter plot with animated cluster assignment |

---

## 10. IMPLEMENTATION ORDER

Follow this exact order:

### Phase 1: Foundation (Week 1)
1. Initialize Next.js project with TypeScript, Tailwind, shadcn/ui
2. Set up Neon database + Drizzle ORM
3. Create the layout: Navbar (with search), Sidebar, Main content area
4. Build the category/algorithm navigation structure
5. Implement the algorithm detail page template
6. Set up the visualization engine base (types, controls, player)

### Phase 2: Core Visualizations (Week 2-3)
7. Build sorting visualizations (Bubble, Selection, Insertion, Merge, Quick, Heap)
8. Build searching visualizations (Linear, Binary, BFS, DFS)
9. Build basic data structure visualizations (Stack, Queue, Linked List, BST, Hash Table)
10. Build graph algorithm visualizations (Dijkstra, A*, Kruskal, Prim)

### Phase 3: Search & Glossary (Week 3)
11. Implement Fuse.js search with Cmd+K modal
12. Build the glossary system (clickable terms, side panel)
13. Integrate OpenAI API for "Explain with AI" feature
14. Build the glossary browse page (A-Z)

### Phase 4: ML & Deep Learning Vizs (Week 4-5)
15. Linear/Logistic regression visualization
16. Decision tree visualization
17. K-Means clustering animation
18. Neural network forward/backward pass
19. CNN feature map visualization
20. Transformer/Attention visualization

### Phase 5: Interactive Controls & Progress (Week 5-6)
21. Add interactive input panels to visualizations
22. Implement progress tracking (DB + UI)
23. Build bookmarks and notes features
24. Build the dashboard/stats page

### Phase 6: Polish & Deploy (Week 6-7)
25. Dark/Light mode
26. Responsive design pass
27. Comparison mode
28. Performance optimization (lazy loading, code splitting)
29. Deploy to Vercel
30. Add remaining algorithms from ALGORITHM_MASTER_LIST.md

---

## 11. ENVIRONMENT VARIABLES

```env
# .env.local
DATABASE_URL=postgresql://...@ep-xxx.us-east-2.aws.neon.tech/algodb?sslmode=require
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_NAME=AlgoVerse
```

---

## 12. KEY IMPLEMENTATION NOTES

1. **Pre-compute steps**: All visualization steps should be pre-computed when input changes, NOT computed during animation. This ensures smooth playback and step-back functionality.

2. **Lazy load visualizations**: Each algorithm's visualization component should be dynamically imported (`next/dynamic`) to keep bundle size small.

3. **Algorithm data as JSON**: Store algorithm metadata (name, description, complexity, category, related algorithms, glossary terms) in structured JSON/TS files under `src/data/algorithms/`. The DB is only for user data (progress, notes, bookmarks).

4. **Glossary terms as a flat map**: Create a single `glossary.ts` file mapping term slugs to definitions. Wrap terms in the UI with a `<GlossaryTerm>` component that makes them clickable.

5. **Mobile-first animations**: Use `requestAnimationFrame` and CSS transforms for 60fps. Avoid layout-triggering properties.

6. **Accessible**: All visualizations should have aria-labels and screen-reader descriptions of what's happening at each step.

---

## 13. REFERENCE FILES TO READ

Before starting, read these files in order:
1. `CLAUDE_CODE_INSTRUCTIONS.md` (this file)
2. `BRD.md` — Business requirements and user stories
3. `TRD.md` — Technical requirements and architecture
4. `DATABASE_SCHEMA.md` — Complete database design
5. `ALGORITHM_MASTER_LIST.md` — Full list of 200+ algorithms to implement
6. `FOLDER_STRUCTURE.md` — Directory structure to create
