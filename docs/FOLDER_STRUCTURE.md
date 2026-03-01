# AlgoVerse — Project Folder Structure

```
algoverse/
├── .env.local                          # Environment variables (DATABASE_URL, OPENAI_API_KEY)
├── .env.example                        # Example env file for documentation
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── drizzle.config.ts                   # Drizzle ORM config
├── postcss.config.js
│
├── drizzle/                            # Generated migrations
│   └── *.sql
│
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── og-image.png                    # Open Graph image
│
├── src/
│   ├── app/                            # Next.js App Router
│   │   ├── layout.tsx                  # Root layout (Navbar, Sidebar, Providers)
│   │   ├── page.tsx                    # Home / Dashboard
│   │   ├── globals.css                 # Global styles + Tailwind
│   │   │
│   │   ├── algorithms/
│   │   │   ├── page.tsx                # All algorithms grid view
│   │   │   ├── [category]/
│   │   │   │   ├── page.tsx            # Category overview page
│   │   │   │   └── [algorithm]/
│   │   │   │       └── page.tsx        # Algorithm detail page (viz + explanation)
│   │   │
│   │   ├── glossary/
│   │   │   ├── page.tsx                # Glossary browse page (A-Z)
│   │   │   └── [term]/
│   │   │       └── page.tsx            # Individual term page
│   │   │
│   │   ├── progress/
│   │   │   └── page.tsx                # Progress dashboard
│   │   │
│   │   ├── bookmarks/
│   │   │   └── page.tsx                # Bookmarked algorithms
│   │   │
│   │   ├── compare/
│   │   │   └── page.tsx                # Comparison mode (select 2 algorithms)
│   │   │
│   │   └── api/
│   │       ├── ai/
│   │       │   ├── explain/
│   │       │   │   └── route.ts        # POST: AI explanation for a term
│   │       │   └── chat/
│   │       │       └── route.ts        # POST: AI chat with context
│   │       ├── progress/
│   │       │   └── route.ts            # GET/POST: progress CRUD
│   │       ├── bookmarks/
│   │       │   └── route.ts            # GET/POST/DELETE: bookmarks
│   │       ├── notes/
│   │       │   └── route.ts            # GET/POST: notes CRUD
│   │       └── search/
│   │           └── route.ts            # GET: server-side search fallback
│   │
│   ├── components/
│   │   ├── ui/                         # shadcn/ui components (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.tsx              # Top nav with search trigger + theme toggle
│   │   │   ├── Sidebar.tsx             # Category tree sidebar
│   │   │   ├── MobileNav.tsx           # Bottom tabs for mobile
│   │   │   └── Breadcrumbs.tsx         # Breadcrumb trail
│   │   │
│   │   ├── search/
│   │   │   ├── SearchModal.tsx         # Cmd+K search modal
│   │   │   ├── SearchResults.tsx       # Grouped search results
│   │   │   └── SearchInput.tsx         # Search input component
│   │   │
│   │   ├── visualization/
│   │   │   ├── Player.tsx              # Universal viz player (play/pause/step/speed)
│   │   │   ├── Controls.tsx            # Playback controls bar
│   │   │   ├── SpeedSlider.tsx         # Speed control
│   │   │   ├── StepCounter.tsx         # "Step 3 of 15"
│   │   │   ├── StepDescription.tsx     # Current step explanation
│   │   │   └── VisualizationContainer.tsx  # Wrapper with responsive sizing
│   │   │
│   │   ├── algorithm/
│   │   │   ├── AlgorithmCard.tsx       # Card for grid view
│   │   │   ├── AlgorithmDetail.tsx     # Full detail layout
│   │   │   ├── ComplexityChart.tsx     # Big-O comparison chart
│   │   │   ├── CodeBlock.tsx           # Syntax-highlighted code with language tabs
│   │   │   ├── PseudocodeBlock.tsx     # Pseudocode with line highlighting
│   │   │   ├── RelatedAlgorithms.tsx   # Related algorithm links
│   │   │   └── UseCases.tsx            # Use cases list
│   │   │
│   │   ├── glossary/
│   │   │   ├── GlossaryTerm.tsx        # Inline clickable term (wraps any text)
│   │   │   ├── TermPopover.tsx         # Popover/side panel for term definition
│   │   │   ├── TermCard.tsx            # Card for glossary browse page
│   │   │   └── AskAIButton.tsx         # "Explain with AI" button
│   │   │
│   │   ├── progress/
│   │   │   ├── ProgressBadge.tsx       # Status badge (Not Started/In Progress/Understood)
│   │   │   ├── ProgressBar.tsx         # Category/overall progress bar
│   │   │   ├── StatsCard.tsx           # Stat card for dashboard
│   │   │   └── StreakCalendar.tsx      # GitHub-style activity calendar
│   │   │
│   │   ├── notes/
│   │   │   └── NoteEditor.tsx          # Markdown note editor with auto-save
│   │   │
│   │   ├── ai/
│   │   │   ├── AIChatPanel.tsx         # Floating AI chat panel
│   │   │   ├── AIExplanation.tsx       # AI explanation display (streaming)
│   │   │   └── ChatMessage.tsx         # Individual chat message
│   │   │
│   │   └── shared/
│   │       ├── DifficultyBadge.tsx     # Beginner/Intermediate/Advanced/Expert
│   │       ├── CategoryIcon.tsx        # Icon per category
│   │       ├── ThemeToggle.tsx         # Dark/Light toggle
│   │       └── LoadingSpinner.tsx      # Loading states
│   │
│   ├── visualizations/                 # Algorithm-specific visualization components
│   │   ├── sorting/
│   │   │   ├── BubbleSort/
│   │   │   │   ├── index.tsx           # Main visualization component
│   │   │   │   ├── logic.ts            # Step generation logic
│   │   │   │   └── Canvas.tsx          # D3/SVG rendering
│   │   │   ├── MergeSort/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── logic.ts
│   │   │   │   └── Canvas.tsx
│   │   │   ├── QuickSort/
│   │   │   ├── InsertionSort/
│   │   │   ├── SelectionSort/
│   │   │   ├── HeapSort/
│   │   │   └── ... (one folder per sorting algorithm)
│   │   │
│   │   ├── searching/
│   │   │   ├── BinarySearch/
│   │   │   ├── LinearSearch/
│   │   │   ├── BFS/
│   │   │   ├── DFS/
│   │   │   └── ...
│   │   │
│   │   ├── data-structures/
│   │   │   ├── BST/
│   │   │   ├── AVLTree/
│   │   │   ├── HashTable/
│   │   │   ├── LinkedList/
│   │   │   ├── Stack/
│   │   │   ├── Queue/
│   │   │   ├── Heap/
│   │   │   ├── Trie/
│   │   │   └── ...
│   │   │
│   │   ├── graph/
│   │   │   ├── Dijkstra/
│   │   │   ├── AStar/
│   │   │   ├── Kruskal/
│   │   │   ├── Prim/
│   │   │   ├── BellmanFord/
│   │   │   └── ...
│   │   │
│   │   ├── dynamic-programming/
│   │   │   ├── Fibonacci/
│   │   │   ├── Knapsack/
│   │   │   ├── LCS/
│   │   │   ├── EditDistance/
│   │   │   ├── CoinChange/
│   │   │   └── ...
│   │   │
│   │   ├── machine-learning/
│   │   │   ├── LinearRegression/
│   │   │   ├── LogisticRegression/
│   │   │   ├── KMeans/
│   │   │   ├── DecisionTree/
│   │   │   ├── SVM/
│   │   │   ├── KNN/
│   │   │   ├── PCA/
│   │   │   ├── GradientDescent/
│   │   │   └── ...
│   │   │
│   │   ├── deep-learning/
│   │   │   ├── Perceptron/
│   │   │   ├── MLP/
│   │   │   ├── Backpropagation/
│   │   │   ├── CNN/
│   │   │   ├── RNN/
│   │   │   ├── LSTM/
│   │   │   ├── Transformer/
│   │   │   ├── SelfAttention/
│   │   │   └── ...
│   │   │
│   │   ├── nlp/
│   │   │   ├── Tokenization/
│   │   │   ├── TFIDF/
│   │   │   ├── Word2Vec/
│   │   │   ├── AttentionViz/
│   │   │   ├── BPE/
│   │   │   ├── BeamSearch/
│   │   │   └── ...
│   │   │
│   │   └── reinforcement-learning/
│   │       ├── QLearning/
│   │       ├── MDP/
│   │       ├── MultiArmedBandit/
│   │       └── ...
│   │
│   ├── data/                           # Static algorithm & glossary data
│   │   ├── algorithms/
│   │   │   ├── index.ts                # Master registry (exports everything)
│   │   │   ├── sorting/
│   │   │   │   ├── bubble-sort.ts      # Metadata + descriptions
│   │   │   │   ├── merge-sort.ts
│   │   │   │   └── ...
│   │   │   ├── searching/
│   │   │   ├── graph/
│   │   │   ├── dynamic-programming/
│   │   │   ├── machine-learning/
│   │   │   ├── deep-learning/
│   │   │   ├── nlp/
│   │   │   └── ...
│   │   │
│   │   ├── glossary/
│   │   │   ├── index.ts                # Master glossary export
│   │   │   └── terms.ts                # All 500+ glossary terms
│   │   │
│   │   └── categories/
│   │       └── index.ts                # Category hierarchy and metadata
│   │
│   ├── lib/                            # Utilities and shared logic
│   │   ├── visualization/
│   │   │   └── types.ts                # Core types (Step, Metadata, etc.)
│   │   ├── search/
│   │   │   └── index.ts                # Fuse.js search configuration
│   │   ├── ai/
│   │   │   └── openai.ts               # OpenAI client + helper functions
│   │   ├── db/
│   │   │   ├── index.ts                # Neon + Drizzle connection
│   │   │   └── schema.ts               # Drizzle schema definitions
│   │   ├── utils.ts                    # General utilities (cn, formatters, etc.)
│   │   └── constants.ts                # App-wide constants
│   │
│   ├── stores/                         # Zustand stores
│   │   ├── visualization.ts            # Visualization playback state
│   │   ├── search.ts                   # Search state
│   │   ├── progress.ts                 # User progress state
│   │   └── ui.ts                       # Theme, sidebar, modals
│   │
│   ├── hooks/                          # Custom React hooks
│   │   ├── useVisualization.ts         # Viz playback hook
│   │   ├── useSearch.ts                # Search hook
│   │   ├── useProgress.ts             # Progress CRUD hook
│   │   ├── useNotes.ts                # Notes auto-save hook
│   │   ├── useBookmarks.ts            # Bookmarks hook
│   │   ├── useKeyboardShortcuts.ts    # Global keyboard shortcuts
│   │   └── useDebounce.ts             # Debounce utility hook
│   │
│   └── providers/
│       ├── ThemeProvider.tsx            # Dark/Light theme provider
│       └── QueryProvider.tsx            # React Query provider (if used)
│
└── docs/                               # Project documentation (these files)
    ├── CLAUDE_CODE_INSTRUCTIONS.md
    ├── BRD.md
    ├── TRD.md
    ├── DATABASE_SCHEMA.md
    ├── ALGORITHM_MASTER_LIST.md
    └── FOLDER_STRUCTURE.md
```
