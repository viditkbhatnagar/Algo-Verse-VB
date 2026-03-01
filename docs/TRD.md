# AlgoVerse — Technical Requirements Document (TRD)

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        VERCEL (Edge)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Next.js 14+ (App Router)                 │   │
│  │                                                      │   │
│  │  ┌─────────┐  ┌──────────┐  ┌───────────────────┐   │   │
│  │  │  Pages  │  │   API    │  │  Static Assets    │   │   │
│  │  │ (SSR/   │  │  Routes  │  │  (Algorithms      │   │   │
│  │  │  SSG)   │  │          │  │   JSON data)      │   │   │
│  │  └────┬────┘  └────┬─────┘  └───────────────────┘   │   │
│  │       │            │                                  │   │
│  │       │     ┌──────┴──────┐                          │   │
│  │       │     │             │                          │   │
│  │       │  ┌──▼──┐   ┌─────▼─────┐                    │   │
│  │       │  │Neon │   │ OpenAI    │                    │   │
│  │       │  │ DB  │   │ API       │                    │   │
│  │       │  └─────┘   └───────────┘                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  Client-Side Libraries:                                     │
│  D3.js | Framer Motion | Fuse.js | KaTeX | Recharts        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Decisions

1. **SSG for algorithm pages**: Pre-render all algorithm detail pages at build time using `generateStaticParams`. Content doesn't change — no need for SSR.
2. **Client-side visualizations**: All animations run in the browser. No server computation needed.
3. **API routes only for**: AI explanations, progress tracking (DB reads/writes), notes, bookmarks.
4. **Algorithm data as static files**: Store in `src/data/algorithms/*.ts` — imported at build time, not queried from DB.
5. **DB only for user data**: Progress, bookmarks, notes, search history — small data, fits Neon free tier.

---

## 2. Technology Specifications

### 2.1 Frontend

```json
{
  "next": "^14.2",
  "react": "^18.3",
  "typescript": "^5.4",
  "tailwindcss": "^3.4",
  "@shadcn/ui": "latest",
  "framer-motion": "^11.0",
  "d3": "^7.9",
  "fuse.js": "^7.0",
  "recharts": "^2.12",
  "katex": "^0.16",
  "zustand": "^4.5",
  "react-syntax-highlighter": "^15.5",
  "@monaco-editor/react": "^4.6",
  "lucide-react": "^0.350"
}
```

### 2.2 Backend / Database

```json
{
  "@neondatabase/serverless": "^0.9",
  "drizzle-orm": "^0.30",
  "drizzle-kit": "^0.21",
  "openai": "^4.30"
}
```

### 2.3 Development

```json
{
  "eslint": "^8.57",
  "prettier": "^3.2",
  "drizzle-kit": "for migrations"
}
```

---

## 3. Visualization Engine — Technical Design

### 3.1 Core Types

```typescript
// src/lib/visualization/types.ts

export interface AlgorithmMetadata {
  id: string;                    // unique slug: "bubble-sort"
  name: string;                  // "Bubble Sort"
  category: Category;            // "sorting"
  subcategory: string;           // "comparison-based"
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  timeComplexity: ComplexityInfo;
  spaceComplexity: ComplexityInfo;
  description: string;           // 2-3 paragraph explanation
  pseudocode: string;            // formatted pseudocode
  implementations: {
    python: string;
    javascript: string;
  };
  useCases: string[];
  relatedAlgorithms: string[];   // IDs of related algorithms
  glossaryTerms: string[];       // IDs of terms used
  tags: string[];                // for search
}

export interface ComplexityInfo {
  best: string;      // "O(n)"
  average: string;   // "O(n²)"
  worst: string;     // "O(n²)"
  note?: string;     // "When already sorted"
}

export interface VisualizationStep {
  id: number;
  description: string;            // "Compare elements at index 2 and 3"
  action: StepAction;             // "compare" | "swap" | "visit" | ...
  highlights: HighlightInfo[];    // Which elements to highlight
  data: any;                      // Snapshot of data at this step
  codeLineHighlight?: number;     // Which pseudocode line to highlight
  variables?: Record<string, any>; // Variable values at this step
}

export type StepAction =
  | "compare" | "swap" | "insert" | "remove" | "visit"
  | "enqueue" | "dequeue" | "push" | "pop"
  | "highlight" | "unhighlight" | "complete"
  | "update-weight" | "relax-edge" | "forward-pass" | "backprop";

export interface HighlightInfo {
  indices: number[];
  color: HighlightColor;
  label?: string;
}

export type HighlightColor = "active" | "comparing" | "swapping" | "completed" | "selected" | "path";

export type Category =
  | "data-structures" | "sorting" | "searching" | "graph-algorithms"
  | "dynamic-programming" | "greedy" | "divide-and-conquer"
  | "string-algorithms" | "mathematical" | "machine-learning"
  | "deep-learning" | "nlp" | "reinforcement-learning" | "optimization";
```

### 3.2 Visualization Component Pattern

Every algorithm visualization follows this structure:

```typescript
// src/visualizations/sorting/bubble-sort/index.tsx

"use client";

import { useState, useCallback, useRef } from "react";
import { VisualizationPlayer } from "@/components/visualization/Player";
import { generateBubbleSortSteps } from "./logic";
import { BubbleSortCanvas } from "./Canvas";

export default function BubbleSortVisualization() {
  const [input, setInput] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const steps = useMemo(() => generateBubbleSortSteps(input), [input]);

  return (
    <VisualizationPlayer steps={steps}>
      {(currentStep, data) => (
        <BubbleSortCanvas step={currentStep} data={data} />
      )}
    </VisualizationPlayer>
  );
}
```

### 3.3 VisualizationPlayer Component

Shared component that handles all playback logic:

```typescript
// src/components/visualization/Player.tsx

interface PlayerProps {
  steps: VisualizationStep[];
  children: (currentStep: VisualizationStep, data: any) => React.ReactNode;
  defaultSpeed?: number;
}

// Features:
// - Play/Pause toggle
// - Step forward / Step back buttons
// - Reset button
// - Speed slider (0.25x - 4x)
// - Progress bar (clickable to jump to step)
// - Step counter "Step 3 of 15"
// - Current step description text
// - Keyboard shortcuts: Space (play/pause), Arrow keys (step), R (reset)
```

### 3.4 Rendering Strategies by Category

```typescript
// Sorting: SVG bars via D3
// - Each array element = rect with height proportional to value
// - Bars animate position (swap) and color (highlight)
// - Use Framer Motion's `layout` for smooth position transitions

// Graph: SVG force layout via D3
// - Nodes = circles, Edges = lines/paths
// - D3 force simulation for layout
// - Animate node/edge colors for traversal
// - Arrow markers for directed graphs

// Trees: SVG hierarchical layout via D3
// - d3.tree() for layout computation
// - Animate node visits (BFS/DFS order)
// - Show values in nodes

// Dynamic Programming: HTML grid/table
// - CSS Grid for DP tables
// - Cells highlight as they're computed
// - Show recurrence relation being evaluated

// Neural Networks: SVG layered diagram
// - Circles for neurons, lines for connections
// - Animate forward pass (data flowing left to right)
// - Show weight values on connections
// - Highlight active neurons

// ML Training: Recharts animated line chart
// - X-axis: epoch, Y-axis: loss/accuracy
// - Data points appear one by one as "training progresses"
// - Show decision boundary changing on 2D scatter plot

// NLP: Custom SVG/HTML
// - Token boxes with connecting lines
// - Attention heatmap using D3 color scales
// - Embedding space as 2D scatter (reduced via t-SNE viz)
```

---

## 4. Data Architecture

### 4.1 Static Data (Algorithm Content)

```
src/data/
├── algorithms/
│   ├── index.ts              # Master registry: exports all algorithms
│   ├── sorting/
│   │   ├── bubble-sort.ts    # AlgorithmMetadata + step generator
│   │   ├── merge-sort.ts
│   │   └── ...
│   ├── graph/
│   ├── ml/
│   └── ...
├── glossary/
│   ├── index.ts              # Master glossary map
│   └── terms.ts              # All 500+ terms
├── categories/
│   └── index.ts              # Category metadata and hierarchy
└── search-index.ts           # Pre-built Fuse.js index data
```

Each algorithm file exports:

```typescript
// src/data/algorithms/sorting/bubble-sort.ts
export const bubbleSort: AlgorithmMetadata = {
  id: "bubble-sort",
  name: "Bubble Sort",
  category: "sorting",
  subcategory: "comparison-based",
  difficulty: "beginner",
  timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
  spaceComplexity: { best: "O(1)", average: "O(1)", worst: "O(1)" },
  description: "...",
  pseudocode: "...",
  implementations: { python: "...", javascript: "..." },
  useCases: ["Educational", "Small datasets", "Nearly sorted data"],
  relatedAlgorithms: ["selection-sort", "insertion-sort", "cocktail-sort"],
  glossaryTerms: ["comparison-sort", "in-place", "stable-sort", "time-complexity"],
  tags: ["sorting", "comparison", "beginner", "stable", "in-place"]
};

export function generateBubbleSortSteps(arr: number[]): VisualizationStep[] {
  // Returns array of steps with snapshots at each comparison/swap
}
```

### 4.2 Dynamic Data (User Data in Neon)

See **DATABASE_SCHEMA.md** for complete schema.

Summary of tables:
- `user_progress` — status per algorithm
- `bookmarks` — bookmarked algorithm IDs
- `notes` — markdown notes per algorithm
- `ai_cache` — cached AI responses
- `search_history` — recent searches

---

## 5. Search Architecture

### 5.1 Client-Side Search (Primary)

```typescript
// src/lib/search/index.ts
import Fuse from "fuse.js";
import { allAlgorithms } from "@/data/algorithms";
import { allGlossaryTerms } from "@/data/glossary";

const searchIndex = new Fuse(
  [
    ...allAlgorithms.map(a => ({
      type: "algorithm" as const,
      id: a.id,
      name: a.name,
      category: a.category,
      tags: a.tags,
      description: a.description.substring(0, 200),
    })),
    ...allGlossaryTerms.map(t => ({
      type: "term" as const,
      id: t.id,
      name: t.name,
      definition: t.shortDefinition,
      category: t.category,
    })),
  ],
  {
    keys: [
      { name: "name", weight: 0.4 },
      { name: "tags", weight: 0.25 },
      { name: "category", weight: 0.15 },
      { name: "description", weight: 0.1 },
      { name: "definition", weight: 0.1 },
    ],
    threshold: 0.3,
    includeScore: true,
  }
);
```

### 5.2 Search UI (Cmd+K Modal)

```
┌────────────────────────────────────────┐
│ 🔍  Search algorithms, terms...        │
├────────────────────────────────────────┤
│                                        │
│ ALGORITHMS                             │
│  📊 Bubble Sort — Sorting              │
│  📊 Binary Search — Searching          │
│                                        │
│ GLOSSARY                               │
│  📖 Big O Notation — Complexity        │
│  📖 Backpropagation — Deep Learning    │
│                                        │
│ CATEGORIES                             │
│  📁 Machine Learning                   │
│                                        │
│ ↑↓ Navigate  ↵ Select  Esc Close      │
└────────────────────────────────────────┘
```

---

## 6. AI Integration

### 6.1 OpenAI Configuration

```typescript
// src/lib/ai/openai.ts
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function explainTerm(term: string, context?: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    max_tokens: 1000,
    messages: [
      {
        role: "system",
        content: `You are AlgoVerse, an expert CS/ML teacher. Explain concepts in simple, clear language.
Use analogies and real-world examples. Format with markdown.
If math is needed, use LaTeX notation wrapped in $...$ for inline and $$...$$ for block.
Keep explanations concise but thorough — aim for 150-300 words.
${context ? `The user is currently studying: ${context}` : ""}`
      },
      {
        role: "user",
        content: `Explain: "${term}"`
      }
    ]
  });
  return response;
}
```

### 6.2 AI Chat Configuration

```typescript
// Context-aware chat that knows current algorithm
export async function chatWithContext(
  message: string,
  algorithmId: string,
  history: Message[]
) {
  const algorithm = getAlgorithmById(algorithmId);
  // System prompt includes algorithm details for context
  // Chat history maintained for multi-turn conversation
}
```

### 6.3 Caching Strategy
- Cache AI responses in Neon `ai_cache` table
- Key: hash of (term + context + detail_level)
- TTL: 30 days
- Saves API costs for repeated queries

---

## 7. Routing Structure

```
/                                    → Dashboard / Home
/algorithms                          → All algorithms grid
/algorithms/[category]               → Category overview
/algorithms/[category]/[algorithm]   → Algorithm detail + visualization
/glossary                            → Glossary browse (A-Z)
/glossary/[term]                     → Term detail page
/search                              → Search results page (fallback)
/progress                            → Progress dashboard
/bookmarks                           → Bookmarked algorithms
/compare                             → Comparison mode
/compare/[algo1]/[algo2]             → Side-by-side comparison
```

---

## 8. State Management

### 8.1 Zustand Stores

```typescript
// src/stores/visualization.ts — Current visualization state
// src/stores/search.ts — Search state, recent searches
// src/stores/progress.ts — User progress (synced with DB)
// src/stores/ui.ts — Theme, sidebar state, modal state
```

### 8.2 Data Flow
```
User Input → Zustand Store → React Component → D3/Canvas Render
                ↓
            API Route → Neon DB (persist)
```

---

## 9. Performance Optimization

1. **Code Splitting**: Each visualization dynamically imported via `next/dynamic`
2. **Static Generation**: All algorithm pages pre-rendered at build time
3. **Image Optimization**: Next.js Image component for any diagrams
4. **Bundle Analysis**: Keep client JS under 200KB initial load
5. **Lazy Glossary**: Load glossary terms on-demand, not all at once
6. **Debounced Search**: 150ms debounce on search input
7. **Animation Performance**: Use CSS transforms, `will-change`, `requestAnimationFrame`
8. **Virtualized Lists**: For long algorithm lists, use `react-window`

---

## 10. Deployment Configuration

### 10.1 Vercel Settings
```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "nodeVersion": "20.x",
  "regions": ["iad1"]
}
```

### 10.2 Environment Variables (Vercel Dashboard)
```
DATABASE_URL        → Neon connection string
OPENAI_API_KEY      → OpenAI API key
NEXT_PUBLIC_APP_URL → https://algoverse.vercel.app
```

### 10.3 Neon Setup
```sql
-- Create database: algodb
-- Region: us-east-2 (close to Vercel iad1)
-- Compute: Free tier (0.25 CU)
-- Branch: main
```

---

## 11. Security Considerations

1. **API Key Protection**: OpenAI key only in server-side API routes, never exposed to client
2. **Rate Limiting**: Implement rate limiting on AI endpoints (30 req/min)
3. **Input Sanitization**: Sanitize user inputs in notes (prevent XSS)
4. **CORS**: Default Next.js CORS (same-origin only for API routes)
5. **No Auth Needed**: Single user, no login — but if added later, use NextAuth.js

---

## 12. Testing Strategy

1. **Visualization Logic**: Unit tests for step generators (ensure correct steps for known inputs)
2. **Search**: Test Fuse.js config returns relevant results for known queries
3. **API Routes**: Integration tests for progress/notes/bookmarks CRUD
4. **Components**: Snapshot tests for key UI components
5. **E2E**: Playwright tests for critical paths (search → navigate → play visualization)
