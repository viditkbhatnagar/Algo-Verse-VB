# AlgoVerse — Interactive Algorithm Learning Platform

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)
![D3.js](https://img.shields.io/badge/D3.js-7-F9A03C?logo=d3.js)
![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-316192?logo=postgresql&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai)

> Learn 300+ algorithms, data structures, ML, deep learning, and NLP concepts through animated step-by-step visualizations and AI-powered explanations.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Visualization Engine](#visualization-engine)
- [Data Flow](#data-flow)
- [API & Database Layer](#api--database-layer)
- [State Management](#state-management)
- [Search System](#search-system)
- [Layout System](#layout-system)
- [Project Structure](#project-structure)
- [Algorithm Categories](#algorithm-categories)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [License](#license)

---

## Features

- **126 animated visualizations** — sorting, searching, graphs, DP, trees, ML, DL, NLP, and RL algorithms with play/pause/step/reset controls and adjustable speed
- **Side-by-side comparison** — compare two algorithms with independent visualizations and complexity analysis
- **AI-powered explanations** — streaming GPT-4o-mini responses with context-aware algorithm explanations and DB-level caching (30-day TTL)
- **446 glossary terms** — CS, ML, and NLP definitions with KaTeX math rendering
- **Universal search** — Cmd+K fuzzy search across algorithms, terms, and categories (Fuse.js)
- **Progress tracking** — mark algorithms as learning/completed, track streaks, and view stats
- **Bookmarks & notes** — save algorithms and write per-algorithm notes with auto-save
- **Learning dashboard** — streak calendar, category progress, and learning stats
- **Dark/Light theme** — toggle between dark and light modes with full visualization support
- **Responsive design** — optimized for desktop, tablet, and mobile with adaptive sidebar/bottom nav

---

## Tech Stack

| Layer | Technology | Role |
|-------|-----------|------|
| Framework | Next.js 14 (App Router) | SSG pages, API routes, file-based routing |
| Language | TypeScript | End-to-end type safety |
| Styling | Tailwind CSS 3 + shadcn/ui | Design system with 11 pre-built components |
| Visualizations | D3.js + Framer Motion | SVG-based algorithm animations |
| State | Zustand (with persist) | Client-side state with localStorage sync |
| Database | Neon PostgreSQL + Drizzle ORM | Serverless Postgres with type-safe ORM |
| AI | OpenAI GPT-4o-mini | Streaming explanations with response caching |
| Search | Fuse.js | Weighted fuzzy search across all content |
| Charts | Recharts | Complexity comparison charts |
| Math | KaTeX | LaTeX math rendering in glossary and AI |

---

## Architecture Overview

```mermaid
graph TB
    subgraph Client["Browser (Client)"]
        UI["React Components"]
        ZS["Zustand Stores<br/>(Progress, Search, UI)"]
        VE["Visualization Engine<br/>(useReducer + setInterval)"]
        FM["Fuse.js Search"]
    end

    subgraph Server["Next.js Server"]
        SSG["Static Pages (SSG)<br/>580 pre-rendered pages"]
        API["API Routes<br/>/api/*"]
    end

    subgraph External["External Services"]
        DB["Neon PostgreSQL<br/>(6 tables)"]
        OAI["OpenAI GPT-4o-mini"]
    end

    subgraph Data["Static Data Layer"]
        AD["Algorithm Data<br/>126 metadata files"]
        GT["Glossary Terms<br/>446 terms"]
        CD["Category Data<br/>16 categories"]
    end

    UI --> ZS
    UI --> VE
    UI --> FM
    UI <-->|"fetch"| API
    SSG -->|"imports at build"| Data
    API <-->|"Drizzle ORM"| DB
    API <-->|"Streaming"| OAI

    style Client fill:#1e1b4b,stroke:#6366f1,color:#fff
    style Server fill:#1a1a2e,stroke:#22d3ee,color:#fff
    style External fill:#1a1a2e,stroke:#22c55e,color:#fff
    style Data fill:#1a1a2e,stroke:#f59e0b,color:#fff
```

---

## Visualization Engine

The core of AlgoVerse is a modular visualization engine that animates algorithms step-by-step. Every visualization follows a strict **3-file pattern**:

### The 3-File Pattern

```mermaid
graph LR
    subgraph VizFolder["Each Visualization Folder"]
        L["logic.ts<br/>─────────<br/>Pure function<br/>Input → Step[]<br/>No React"]
        I["index.tsx<br/>─────────<br/>Orchestrator<br/>State + Player + Canvas<br/>'use client'"]
        C["Canvas.tsx<br/>─────────<br/>Pure renderer<br/>Step → SVG/D3<br/>Delegates to shared"]
    end

    I -->|"calls"| L
    I -->|"passes step to"| C

    subgraph Shared["Shared Renderers (15)"]
        SR["BarCanvas · ArrayCanvas<br/>GraphCanvas · TreeCanvas<br/>MatrixCanvas · LinkedListCanvas<br/>WeightedGraphCanvas · GridCanvas<br/>ScatterCanvas · NeuralNetCanvas<br/>LossChartCanvas · TokenCanvas<br/>HeatmapCanvas · ConvolutionCanvas<br/>FunctionPlotCanvas"]
    end

    C -->|"delegates to"| SR

    style VizFolder fill:#1e1b4b,stroke:#6366f1,color:#fff
    style Shared fill:#1a1a2e,stroke:#22d3ee,color:#fff
```

### Playback Pipeline

```mermaid
sequenceDiagram
    participant User
    participant Index as index.tsx
    participant Logic as logic.ts
    participant Player as Player.tsx
    participant Hook as useVisualization
    participant Reducer as visualizationReducer
    participant Canvas as Canvas.tsx
    participant Renderer as Shared Renderer

    User->>Index: Adjusts input (array size, etc.)
    Index->>Logic: generateSteps(input)
    Logic-->>Index: VisualizationStep[] (pre-computed)
    Index->>Player: <Player steps={steps}>
    Player->>Hook: useVisualization({ steps })
    Hook->>Reducer: useReducer(reducer, initial)

    User->>Player: Clicks Play ▶
    Player->>Hook: play()
    Hook->>Reducer: dispatch(PLAY)

    loop Every 600ms / speed
        Hook->>Reducer: dispatch(TICK)
        Reducer-->>Hook: currentStepIndex++
        Hook-->>Player: currentStep
        Player->>Canvas: children(currentStep)
        Canvas->>Renderer: <BarCanvas data={...} />
        Renderer-->>User: SVG rendered on screen
    end

    Note over Reducer: Auto-pauses at last step
```

### Step Data Type System

Each step carries a typed `data` payload specific to the algorithm domain:

```mermaid
graph TD
    VS["VisualizationStep"]
    VS --> |"step.data"| SD

    subgraph SD["18+ Typed Data Payloads"]
        S1["SortingStepData"]
        S2["GraphStepData"]
        S3["TreeStepData"]
        S4["MatrixStepData"]
        S5["NeuralNetStepData"]
        S6["TokenStepData"]
        S7["HeatmapStepData"]
        S8["ScatterStepData"]
        S9["RLStepData"]
        S10["...and more"]
    end

    VS --> |"step.action"| SA["StepAction union<br/>compare · swap · visit<br/>push · pop · insert<br/>train · predict · attend"]
    VS --> |"step.highlights"| HL["HighlightColor union<br/>active · comparing · completed<br/>neuronInput · attentionHigh<br/>centroid · gradient · token"]

    style VS fill:#6366f1,stroke:#fff,color:#fff
    style SD fill:#1e1b4b,stroke:#6366f1,color:#fff
```

### Registry Pattern

All 126 visualizations are registered in a single file (`src/visualizations/registry.tsx`) with dynamic imports:

```mermaid
graph LR
    Page["Algorithm Page"] -->|"getVisualization(slug)"| Reg["registry.tsx<br/>────────────<br/>Record&lt;string, Component&gt;<br/>126 entries"]
    Reg -->|"dynamic(() => import(...))<br/>ssr: false"| V1["BubbleSort/index.tsx"]
    Reg -->|"dynamic()"| V2["Dijkstra/index.tsx"]
    Reg -->|"dynamic()"| V3["Transformer/index.tsx"]
    Reg -->|"dynamic()"| VN["... 123 more"]

    style Reg fill:#6366f1,stroke:#fff,color:#fff
```

---

## Data Flow

### Algorithm Detail Page — End-to-End

```mermaid
graph TB
    URL["User visits<br/>/algorithms/sorting/bubble-sort"]

    subgraph BuildTime["Build Time (SSG)"]
        GSP["generateStaticParams()<br/>→ 580 param combos"]
        GM["generateMetadata()<br/>→ SEO + OpenGraph"]
        GAI["getAlgorithmById('bubble-sort')<br/>→ AlgorithmMetadata"]
    end

    subgraph ServerRender["Server Render"]
        Bread["&lt;Breadcrumbs /&gt;"]
        AD["&lt;AlgorithmDetail algorithm={...} /&gt;<br/>(client boundary)"]
    end

    subgraph ClientRender["Client Render"]
        VIZ["getVisualization('bubble-sort')<br/>→ BubbleSortVisualization"]
        CC["ComplexityChart (Recharts)"]
        CB["CodeBlock (syntax highlighted)"]
        PC["PseudocodeBlock"]
        AI["AIChatPanel (floating)"]
        PB["ProgressBadge + BookmarkButton"]
    end

    URL --> BuildTime
    BuildTime --> ServerRender
    AD --> ClientRender

    style BuildTime fill:#1a1a2e,stroke:#22d3ee,color:#fff
    style ServerRender fill:#1a1a2e,stroke:#6366f1,color:#fff
    style ClientRender fill:#1e1b4b,stroke:#f59e0b,color:#fff
```

### Algorithm Data Model

```
src/data/algorithms/sorting/bubble-sort.ts
    └── AlgorithmMetadata
         ├── id: "bubble-sort"
         ├── name: "Bubble Sort"
         ├── category: "sorting"
         ├── difficulty: "Beginner"
         ├── timeComplexity: { best, average, worst }
         ├── spaceComplexity: "O(1)"
         ├── description (full markdown)
         ├── pseudocode (line-by-line)
         ├── implementations: { python, javascript }
         ├── useCases[]
         ├── relatedAlgorithms[]
         └── glossaryTerms[]
```

---

## API & Database Layer

### API Routes

```mermaid
graph LR
    subgraph Routes["API Routes (/api)"]
        R1["/ai/explain<br/>POST"]
        R2["/ai/chat<br/>POST"]
        R3["/progress<br/>GET · POST"]
        R4["/bookmarks<br/>GET · POST · DELETE"]
        R5["/notes<br/>GET · POST"]
        R6["/streaks<br/>GET · POST"]
        R7["/stats<br/>GET"]
    end

    subgraph Middleware["Built-in Middleware"]
        RL["Rate Limiter<br/>30 req/min"]
        FD["force-dynamic<br/>(no static cache)"]
    end

    R1 --> RL
    R1 --> FD
    R2 --> FD
    R1 & R2 -->|"streaming"| OAI["OpenAI<br/>GPT-4o-mini"]
    R1 & R3 & R4 & R5 & R6 & R7 -->|"Drizzle ORM"| DB["Neon PostgreSQL"]

    style Routes fill:#1e1b4b,stroke:#6366f1,color:#fff
    style Middleware fill:#1a1a2e,stroke:#f59e0b,color:#fff
```

### AI Explain Flow

```mermaid
flowchart TD
    REQ["POST /api/ai/explain<br/>{ term, context }"] --> RL{Rate limit<br/>≤ 30/min?}
    RL -->|No| ERR["429 Too Many Requests"]
    RL -->|Yes| HASH["SHA-256 hash<br/>'term|context'"]
    HASH --> CACHE{Check ai_cache table<br/>hash match & not expired?}
    CACHE -->|Hit| RET["Return cached response<br/>X-Cache: HIT"]
    CACHE -->|Miss| STREAM["Stream from GPT-4o-mini<br/>(max 1000 tokens)"]
    STREAM --> CLIENT["Stream chunks → Client"]
    STREAM --> SAVE["Save to ai_cache<br/>(30-day TTL, upsert)"]

    style REQ fill:#6366f1,stroke:#fff,color:#fff
    style RET fill:#22c55e,stroke:#fff,color:#fff
    style STREAM fill:#f59e0b,stroke:#fff,color:#000
```

### Database Schema

```mermaid
erDiagram
    user_progress {
        serial id PK
        text algorithmId UK
        enum status "not_started | in_progress | understood"
        int timeSpentSeconds
        timestamp lastVisitedAt
        timestamp completedAt
        timestamp createdAt
        timestamp updatedAt
    }

    bookmarks {
        serial id PK
        text algorithmId UK
        timestamp createdAt
    }

    notes {
        serial id PK
        text algorithmId UK
        text content
        timestamp createdAt
        timestamp updatedAt
    }

    ai_cache {
        serial id PK
        text queryHash UK
        text term
        text context
        text response
        timestamp expiresAt
        timestamp createdAt
    }

    search_history {
        serial id PK
        text query
        text resultType
        text resultId
        timestamp createdAt
    }

    learning_streaks {
        serial id PK
        text date UK "YYYY-MM-DD"
        int algorithmsViewed
        int timeSpentSeconds
        timestamp createdAt
        timestamp updatedAt
    }
```

---

## State Management

### Zustand Progress Store

```mermaid
flowchart TD
    subgraph Mount["App Mount (once per session)"]
        CS["ClientShell mounts"]
        CS --> HF{hasFetched?}
        HF -->|No| FA["fetchAll()<br/>GET /api/progress + /api/bookmarks"]
        FA --> HY["Hydrate progressMap + bookmarks"]
        HF -->|Yes| SKIP["Skip (already hydrated)"]
    end

    subgraph Mutation["User Action (optimistic)"]
        UA["User marks 'Understood'"]
        UA --> OPT["1. Update Zustand immediately"]
        OPT --> API["2. POST /api/progress"]
        API -->|Success| DONE["Synced ✓"]
        API -->|Failure| ROLL["3. Rollback to previous state"]
    end

    subgraph Persist["Persistence"]
        ZS["Zustand Store"]
        ZS <-->|"persist middleware"| LS["localStorage<br/>'algoverse-progress'"]
        ZS <-->|"API calls"| DB["Neon PostgreSQL"]
    end

    style Mount fill:#1a1a2e,stroke:#22d3ee,color:#fff
    style Mutation fill:#1e1b4b,stroke:#6366f1,color:#fff
    style Persist fill:#1a1a2e,stroke:#22c55e,color:#fff
```

### Store Actions

| Action | Behavior |
|--------|----------|
| `fetchAll()` | Parallel GET from `/api/progress` + `/api/bookmarks`, rebuilds state |
| `updateProgress(id, status)` | Optimistic upsert → POST → rollback on failure |
| `addTimeSpent(id, secs)` | Accumulates view time (30s intervals via `useTimeTracking`) |
| `toggleBookmark(id)` | Optimistic insert/delete → POST/DELETE → rollback on failure |
| `getStatus(id)` | O(1) lookup from `progressMap` |
| `isBookmarked(id)` | O(1) lookup from `bookmarks` array |

---

## Search System

```mermaid
flowchart LR
    subgraph Trigger["Trigger"]
        KB["Cmd+K / Ctrl+K"]
        NB["Navbar search icon"]
    end

    subgraph Modal["SearchModal (Radix Dialog)"]
        INP["SearchInput"]
        INP -->|"query"| FUSE
    end

    subgraph FUSE["Fuse.js (lazy singleton)"]
        BUILD["buildDocuments() — first call only"]
        BUILD --> A["126 algorithms"]
        BUILD --> T["446 glossary terms"]
        BUILD --> C["16 categories"]
        A & T & C --> INDEX["Unified SearchDocument[]"]
        INDEX --> SEARCH["Weighted fuzzy search<br/>name: 0.4 · tags: 0.25<br/>category: 0.15 · desc: 0.10"]
    end

    SEARCH --> GROUP["searchGrouped()"]
    GROUP --> R1["Algorithms results"]
    GROUP --> R2["Terms results"]
    GROUP --> R3["Categories results"]

    Trigger --> Modal

    style Trigger fill:#1a1a2e,stroke:#f59e0b,color:#fff
    style Modal fill:#1e1b4b,stroke:#6366f1,color:#fff
    style FUSE fill:#1a1a2e,stroke:#22d3ee,color:#fff
```

---

## Layout System

```mermaid
graph TB
    subgraph RootLayout["Root Layout (Server)"]
        HTML["&lt;html&gt; + ThemeProvider"]
        HTML --> CS["ClientShell<br/>(keyboard shortcuts + progress hydration)"]
        CS --> NB["Navbar (fixed top, h-14)"]
        CS --> SB["Sidebar (fixed left, w-280, desktop)"]
        CS --> SM["SearchModal (always mounted)"]
        CS --> MAIN["&lt;main&gt; (content area)"]
        CS --> MN["MobileNav (bottom tabs, mobile)"]
    end

    subgraph Responsive["Responsive Breakpoints"]
        D["Desktop (lg+)<br/>Sidebar + Navbar + Content"]
        T["Tablet (md-lg)<br/>Navbar + Sheet sidebar + Content"]
        M["Mobile (&lt;md)<br/>Navbar + Content + Bottom tabs"]
    end

    style RootLayout fill:#1e1b4b,stroke:#6366f1,color:#fff
    style Responsive fill:#1a1a2e,stroke:#22d3ee,color:#fff
```

**Content area positioning:** `mt-14` (below navbar) + `lg:ml-[280px]` (beside sidebar on desktop) + `pb-16 md:pb-0` (above mobile nav)

---

## Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout (Navbar, Sidebar, ThemeProvider)
│   ├── page.tsx                   # Home / Dashboard
│   ├── globals.css                # Tailwind + KaTeX CSS imports
│   ├── algorithms/
│   │   ├── page.tsx               # All algorithms grid
│   │   └── [category]/
│   │       ├── page.tsx           # Category overview
│   │       └── [algorithm]/
│   │           └── page.tsx       # Algorithm detail (SSG, 580 pages)
│   ├── glossary/
│   │   ├── page.tsx               # A-Z glossary browse
│   │   └── [term]/page.tsx        # Individual term page
│   ├── compare/page.tsx           # Side-by-side comparison
│   ├── progress/page.tsx          # Learning dashboard
│   ├── bookmarks/page.tsx         # Bookmarked algorithms
│   └── api/
│       ├── ai/explain/route.ts    # AI explanation (cached, streaming)
│       ├── ai/chat/route.ts       # AI chat (streaming)
│       ├── progress/route.ts      # Progress CRUD
│       ├── bookmarks/route.ts     # Bookmarks CRUD
│       ├── notes/route.ts         # Notes CRUD
│       ├── streaks/route.ts       # Daily streak tracking
│       └── stats/route.ts         # Aggregate stats
│
├── components/
│   ├── ui/                        # 11 shadcn/ui components
│   ├── layout/                    # Navbar, Sidebar, MobileNav, ClientShell
│   ├── visualization/             # Player, Controls, StepCounter, StepDescription
│   ├── algorithm/                 # AlgorithmDetail, AlgorithmCard, CodeBlock, etc.
│   ├── search/                    # SearchModal, SearchResults, SearchInput
│   ├── glossary/                  # GlossaryTerm, TermPopover, TermCard, AskAIButton
│   ├── progress/                  # ProgressBadge, StatsCard, StreakCalendar
│   ├── notes/                     # NoteEditor (markdown, auto-save)
│   ├── ai/                        # AIChatPanel, AIExplanation, ChatMessage
│   ├── compare/                   # CompareSelector, ComparisonView
│   └── shared/                    # DifficultyBadge, CategoryIcon, ThemeToggle
│
├── visualizations/
│   ├── _shared/                   # 15 reusable Canvas renderers
│   ├── sorting/                   # 8 visualizations (BubbleSort, QuickSort, ...)
│   ├── searching/                 # 4 visualizations (BinarySearch, BFS, ...)
│   ├── data-structures/           # 16 visualizations (BST, AVL, HashTable, ...)
│   ├── graph/                     # 7 visualizations (Dijkstra, Kruskal, A*, ...)
│   ├── dynamic-programming/       # 9 visualizations (Fibonacci, Knapsack, ...)
│   ├── machine-learning/          # 20 visualizations (LinReg, KMeans, SVM, ...)
│   ├── deep-learning/             # 25 visualizations (CNN, RNN, Transformer, ...)
│   ├── nlp/                       # 17 visualizations (TF-IDF, Word2Vec, ...)
│   ├── reinforcement-learning/    # 5 visualizations (Q-Learning, MDP, ...)
│   └── registry.tsx               # Central registry — all 126 dynamic imports
│
├── data/
│   ├── algorithms/                # 126 metadata files (one per algorithm)
│   │   ├── index.ts               # getAllAlgorithms(), getAlgorithmById()
│   │   └── [category]/[slug].ts   # AlgorithmMetadata exports
│   ├── categories/index.ts        # 16 category definitions
│   └── glossary/                  # 446 glossary terms split by category
│       ├── index.ts               # Map<slug, term> for O(1) lookup
│       └── terms/[category].ts    # Terms grouped by topic
│
├── hooks/
│   ├── useVisualization.ts        # Playback state machine (useReducer)
│   ├── useKeyboardShortcuts.ts    # Global key bindings (Cmd+K, etc.)
│   ├── useProgress.ts             # Progress CRUD hook
│   ├── useBookmarks.ts            # Bookmarks hook
│   ├── useNotes.ts                # Notes with 1s debounce auto-save
│   ├── useTimeTracking.ts         # 30s interval time tracking
│   ├── useSearch.ts               # Search state hook
│   └── useDebounce.ts             # Debounce utility
│
├── stores/
│   ├── visualization.ts           # Playback reducer (PLAY, TICK, RESET, etc.)
│   ├── progress.ts                # Zustand: progressMap + bookmarks (persisted)
│   ├── search.ts                  # Recent searches (persisted)
│   └── ui.ts                      # Theme, sidebar, modal state
│
├── lib/
│   ├── visualization/types.ts     # VisualizationStep, 18+ typed data payloads
│   ├── search/index.ts            # Fuse.js lazy singleton + searchGrouped()
│   ├── ai/openai.ts               # OpenAI client (lazy init)
│   ├── db/index.ts                # Neon + Drizzle connection
│   ├── db/schema.ts               # 6 table definitions
│   ├── utils.ts                   # cn(), formatters
│   └── constants.ts               # Colors, speeds, categories, difficulty levels
│
└── providers/
    └── ThemeProvider.tsx           # next-themes dark/light toggle
```

---

## Algorithm Categories

| Category | Viz Count | Examples |
|----------|-----------|---------|
| Sorting | 8 | Bubble Sort, Quick Sort, Merge Sort, Heap Sort |
| Searching | 4 | Binary Search, Linear Search, BFS, DFS |
| Data Structures | 16 | BST, AVL Tree, Hash Table, Trie, Heap, Stack, Queue |
| Graph | 7 | Dijkstra, Kruskal, Prim, A* Search, Bellman-Ford |
| Dynamic Programming | 9 | Fibonacci, Knapsack, LCS, Edit Distance, Coin Change |
| Greedy | 3 | Huffman Coding, Activity Selection |
| Divide & Conquer | 4 | Strassen, Karatsuba |
| String | 2 | KMP, Rabin-Karp |
| Mathematical | 3 | Sieve of Eratosthenes, Euclidean GCD |
| Backtracking | 2 | N-Queens, Sudoku Solver |
| Machine Learning | 20 | Linear Regression, KNN, SVM, K-Means, PCA, Decision Tree |
| Deep Learning | 25 | CNN, RNN, LSTM, Transformer, Self-Attention, GAN |
| NLP | 17 | TF-IDF, Word2Vec, Attention, BPE, Beam Search |
| Reinforcement Learning | 5 | Q-Learning, MDP, Multi-Armed Bandit |

**Total: 126 interactive visualizations** across 14 categories

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- A [Neon](https://neon.tech) PostgreSQL database (free tier works)
- An [OpenAI](https://platform.openai.com) API key (optional, for AI features)

### Installation

```bash
git clone https://github.com/viditkbhatnagar/Algo-Verse-VB.git
cd Algo-Verse-VB
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AlgoVerse
```

### Database Setup

```bash
# Push the Drizzle schema to your Neon database
export $(grep DATABASE_URL .env.local | xargs) && npx drizzle-kit push
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` / `Ctrl+K` | Open search |
| `Space` | Play / Pause visualization |
| `→` Arrow Right | Step forward |
| `←` Arrow Left | Step back |
| `R` | Reset visualization |

---

## Deployment

### Vercel

1. Import the repository at [vercel.com](https://vercel.com)
2. Framework: Next.js (auto-detected)
3. Add environment variables:
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)
   - `NEXT_PUBLIC_APP_NAME` = AlgoVerse
4. Deploy

---

## Key Numbers

| Metric | Count |
|--------|-------|
| Static pages generated | 580 |
| Algorithm visualizations | 126 |
| Glossary terms | 446 |
| Shared canvas renderers | 15 |
| API endpoints | 7 |
| Database tables | 6 |
| shadcn/ui components | 11 |
| Custom hooks | 8 |
| Algorithm categories | 14 |

---

## License

MIT
