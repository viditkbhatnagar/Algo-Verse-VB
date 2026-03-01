# AlgoVerse — Interactive Algorithm Learning Platform

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)
![D3.js](https://img.shields.io/badge/D3.js-7-F9A03C?logo=d3.js)

> Learn 300+ algorithms, data structures, ML, deep learning, and NLP concepts through animated step-by-step visualizations and AI-powered explanations.

## Features

- **126 animated visualizations** — sorting, searching, graphs, DP, trees, ML, DL, NLP, and RL algorithms with play/pause/step/reset controls and adjustable speed
- **Side-by-side comparison** — compare two algorithms with independent visualizations and complexity analysis
- **AI-powered explanations** — streaming GPT-4o-mini responses with context-aware algorithm explanations
- **446 glossary terms** — CS, ML, and NLP definitions with KaTeX math rendering
- **Universal search** — Cmd+K fuzzy search across algorithms, terms, and categories (Fuse.js)
- **Progress tracking** — mark algorithms as learning/completed, track streaks, and view stats
- **Bookmarks & notes** — save algorithms and write per-algorithm notes with auto-save
- **Learning dashboard** — streak calendar, category progress, and learning stats
- **Dark/Light theme** — toggle between dark and light modes with full visualization support
- **Responsive design** — optimized for desktop, tablet, and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 + shadcn/ui |
| Visualizations | D3.js + Framer Motion |
| State | Zustand |
| Database | Neon PostgreSQL + Drizzle ORM |
| AI | OpenAI GPT-4o-mini |
| Search | Fuse.js |
| Charts | Recharts |
| Math | KaTeX |

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- A Neon PostgreSQL database (free tier works)
- An OpenAI API key (optional, for AI features)

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

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── algorithms/         # Algorithm listing and detail pages
│   ├── glossary/           # Glossary pages
│   ├── compare/            # Side-by-side comparison
│   ├── progress/           # Learning dashboard
│   ├── bookmarks/          # Bookmarked algorithms
│   └── api/                # API routes (AI, progress, etc.)
├── components/
│   ├── layout/             # Navbar, Sidebar, MobileNav, ClientShell
│   ├── algorithm/          # AlgorithmDetail, AlgorithmCard, etc.
│   ├── compare/            # CompareSelector, ComparisonView
│   ├── visualization/      # Player, Controls, StepCounter
│   ├── search/             # SearchModal
│   ├── progress/           # ProgressBadge, StatsCard, etc.
│   └── ui/                 # shadcn/ui components
├── visualizations/
│   ├── _shared/            # 15 reusable Canvas renderers
│   ├── sorting/            # Sorting algorithm visualizations
│   ├── searching/          # Search algorithm visualizations
│   ├── graph/              # Graph algorithm visualizations
│   ├── ml/                 # Machine learning visualizations
│   ├── dl/                 # Deep learning visualizations
│   └── nlp/                # NLP visualizations
├── data/
│   ├── algorithms/         # Algorithm metadata (126 files)
│   ├── categories/         # Category definitions
│   └── glossary/           # Glossary terms (446 terms)
├── hooks/                  # Custom hooks
├── stores/                 # Zustand stores
├── lib/                    # Utilities, constants, DB, AI
└── providers/              # ThemeProvider
```

## Algorithm Categories

| Category | Count | Examples |
|----------|-------|---------|
| Sorting | 8 | Bubble Sort, Quick Sort, Merge Sort |
| Searching | 4 | Binary Search, BFS, DFS |
| Data Structures | 17 | BST, AVL Tree, Hash Table, Trie |
| Graph | 7 | Dijkstra, Kruskal, A* Search |
| Dynamic Programming | 10 | Fibonacci, Knapsack, LCS |
| Greedy | 5 | Huffman Coding, Activity Selection |
| Divide & Conquer | 4 | Strassen, Karatsuba |
| String | 4 | KMP, Rabin-Karp |
| Mathematical | 5 | Sieve, Euclidean GCD |
| Backtracking | 4 | N-Queens, Sudoku Solver |
| Machine Learning | 20 | Linear Regression, KNN, SVM, K-Means |
| Deep Learning | 25 | CNN, RNN, LSTM, Transformer |
| NLP | 17 | TF-IDF, Word2Vec, Attention |

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

## License

MIT
