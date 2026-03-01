# Phase 4: Search + Glossary + AI Integration — AlgoVerse

## CRITICAL: Read Memory & Documentation First
Before writing ANY code, read these files in order:
1. **MEMORY.md is auto-loaded** — review phase status and key patterns
2. Read ALL memory files:
   - `phases-progress.md` — what Phases 1-3 built
   - `architecture-decisions.md` — follow established patterns
   - `file-registry.md` — existing file paths
3. Read project documentation:
   - `docs/CLAUDE_CODE_INSTRUCTIONS.md` — Sections 3.2 (search), 3.3 (glossary), 8 (API routes)
   - `docs/TRD.md` — Sections 5 (search), 6 (AI integration)
   - `docs/ALGORITHM_MASTER_LIST.md` — algorithm names for search indexing
4. Read existing code:
   - `src/data/algorithms/index.ts` — the algorithm registry (needed for search index)
   - `src/data/categories/index.ts` — categories (needed for search)
   - `src/components/layout/Navbar.tsx` — to add search trigger
   - `src/hooks/useKeyboardShortcuts.ts` — to wire Cmd+K

## Phase Objective
Add the discovery and learning layers: Cmd+K universal search using Fuse.js, a complete glossary system with 500+ technical terms, and OpenAI-powered AI explanations with a floating chat panel.

## Tasks

### 1. Search System

**`src/lib/search/index.ts`**
- Fuse.js configuration with weighted keys:
  - Algorithm names (weight: 1.0)
  - Algorithm descriptions (weight: 0.5)
  - Tags (weight: 0.8)
  - Glossary term names (weight: 0.9)
  - Category names (weight: 0.7)
- Threshold: 0.3 (fairly fuzzy)
- Build search index from algorithms registry + glossary terms + categories
- Export `searchAll(query)` function returning grouped results

**`src/components/search/SearchModal.tsx`**
- Modal triggered by Cmd+K / Ctrl+K
- Uses shadcn Dialog
- Search input with auto-focus
- Results grouped by: Algorithms, Glossary Terms, Categories
- Keyboard navigation: Arrow up/down to navigate, Enter to select, Escape to close
- Recent searches section (when input is empty)
- "No results" state

**`src/components/search/SearchResults.tsx`**
- Renders grouped results
- Each result shows: icon, name, category/type badge, short description
- Highlighted matching text

**`src/components/search/SearchInput.tsx`**
- Styled search input with search icon and Cmd+K badge
- Debounced input (150ms)

**`src/stores/search.ts`**
- Zustand store: query, results, recentSearches, isOpen
- Actions: search(), openSearch(), closeSearch(), addRecent()
- Recent searches persisted in localStorage

**`src/hooks/useSearch.ts`**
- Wraps Fuse.js search with debounce
- Returns { results, isSearching }

**`src/hooks/useDebounce.ts`**
- Generic debounce hook

**Update `src/components/layout/Navbar.tsx`**
- Make the search button functional — opens SearchModal
- Show Cmd+K hint

**Update `src/hooks/useKeyboardShortcuts.ts`**
- Wire Cmd+K / Ctrl+K to open search

### 2. Glossary System

**`src/data/glossary/terms.ts`**
Generate 500+ glossary terms covering ALL categories. Each term:
```typescript
{
  slug: string,
  name: string,
  definition: string,         // Plain English (2-3 sentences)
  formalDefinition?: string,  // Mathematical/formal (optional)
  formula?: string,           // KaTeX formula (optional, e.g., "$O(n \\log n)$")
  relatedTerms: string[],     // slugs of related terms
  category: string,           // which category this belongs to
  tags: string[]
}
```
Cover terms from ALL 16 categories: Big O notation, Time Complexity, Space Complexity, Array, Linked List, Tree, Graph, Stack, Queue, Hash Function, Collision, Recursion, Divide and Conquer, Greedy, Dynamic Programming, Memoization, Tabulation, Gradient, Loss Function, Activation Function, Backpropagation, Epoch, Batch Size, Learning Rate, Overfitting, Underfitting, Regularization, Dropout, Convolution, Pooling, Attention, Transformer, Embedding, Tokenization, etc.

**`src/data/glossary/index.ts`**
- Master export: `allTerms`, `getTermBySlug()`, `getTermsByCategory()`, `searchTerms()`

**`src/components/glossary/GlossaryTerm.tsx`**
- Inline wrapper component that makes any text clickable
- On click, opens TermPopover
- Styled with dashed underline and accent color on hover

**`src/components/glossary/TermPopover.tsx`**
- Popover or Sheet showing term definition
- Sections: Plain English definition, Formal definition (if exists), Formula (KaTeX rendered), Related terms (linked)
- "Ask AI" button at bottom
- Uses shadcn Sheet or Dialog

**`src/components/glossary/TermCard.tsx`**
- Card for glossary browse page
- Shows: name, definition preview, category badge

**`src/components/glossary/AskAIButton.tsx`**
- Button that triggers AI explanation for this term
- Shows loading state while streaming

**`src/app/glossary/page.tsx`**
- Glossary browse page
- A-Z letter filter tabs
- Search within glossary
- Grid of TermCards
- Filter by category

**`src/app/glossary/[term]/page.tsx`**
- Individual term page with full details
- Related terms linked
- "Ask AI for deeper explanation" section
- Uses `generateStaticParams()` from glossary terms

### 3. AI Integration

**`src/lib/ai/openai.ts`**
```typescript
// OpenAI client setup
// explainTerm(termName, termDefinition): AsyncGenerator<string> — streaming
// chatWithContext(messages, algorithmContext?): AsyncGenerator<string> — streaming
// System prompts for each use case
```

**`src/app/api/ai/explain/route.ts`**
- POST endpoint
- Body: `{ term: string, definition: string }`
- Streams response using OpenAI streaming API
- Returns: ReadableStream
- Rate limit: simple in-memory counter (30 req/min)

**`src/app/api/ai/chat/route.ts`**
- POST endpoint
- Body: `{ messages: Message[], algorithmContext?: { name, category, description } }`
- System prompt includes algorithm context for relevant answers
- Streams response
- Rate limit: 30 req/min

**`src/components/ai/AIExplanation.tsx`**
- Displays streaming AI response
- Renders Markdown
- Loading skeleton while waiting
- Error state handling

**`src/components/ai/AIChatPanel.tsx`**
- Floating chat panel (bottom-right corner)
- Toggle button with chat icon
- Chat history (in-memory, not persisted)
- Input field with send button
- Context-aware: knows which algorithm page you're on
- Animated open/close

**`src/components/ai/ChatMessage.tsx`**
- Individual message component
- User messages (right-aligned, primary bg)
- AI messages (left-aligned, surface bg)
- Markdown rendering for AI responses

### 4. KaTeX Integration
- Create a `KaTeXRenderer` component or utility
- Render `$...$` inline math and `$$...$$` block math in:
  - Glossary term formulas
  - AI explanation responses
  - Algorithm complexity displays

## Environment Variable Needed
The user has an OpenAI API key. Remind them to add it to `.env.local`:
```
OPENAI_API_KEY=sk-...
```

## CRITICAL: After Completion
1. Run `npm run build` — verify clean build
2. Test:
   - Cmd+K opens search modal
   - Typing shows fuzzy results across algorithms, terms, categories
   - Clicking a result navigates to the right page
   - Glossary browse page shows all terms
   - Clicking a term shows the popover/definition
   - "Ask AI" button streams an explanation (requires OPENAI_API_KEY in .env.local)
   - Chat panel opens on algorithm pages
   - KaTeX formulas render correctly
3. Update ALL memory files:
   - `MEMORY.md` — Phase 4 COMPLETED, add search/glossary/AI patterns, update stats
   - `phases-progress.md` — Phase 4 deliverables, all files
   - `architecture-decisions.md` — Document search config, API route pattern, AI streaming pattern
   - `file-registry.md` — Add all new files
   - `current-phase.md` — Point to Phase 5
4. Git commit and push:
   ```bash
   git add -A
   git commit -m "Phase 4: Universal search, glossary system (500+ terms), OpenAI AI integration"
   git push origin main
   ```
