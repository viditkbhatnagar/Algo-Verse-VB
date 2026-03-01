# AlgoVerse — Business Requirements Document (BRD)

## 1. Project Overview

**Project Name:** AlgoVerse
**Version:** 1.0
**Date:** March 2026
**Type:** Personal Learning Platform

### 1.1 Vision Statement
A one-stop interactive visual learning platform that teaches every algorithm, data structure, ML technique, NLP concept, and deep learning architecture through animated visualizations, interactive controls, and AI-powered explanations.

### 1.2 Problem Statement
- Learning algorithms from textbooks/articles is abstract and hard to internalize
- Most resources explain algorithms in text; few provide interactive, step-by-step visual walkthroughs
- No single platform covers algorithms + ML + DL + NLP with unified visual teaching
- Technical jargon creates barriers; every unfamiliar term should be instantly explainable

### 1.3 Success Criteria
- Platform covers 200+ algorithms and concepts across all major CS/ML/NLP domains
- Every algorithm has a working animated visualization with step controls
- Every technical term is clickable and explained in plain English + with AI
- Search finds any algorithm or term in under 500ms
- Platform loads in under 3 seconds on standard broadband

---

## 2. User Stories

### 2.1 Algorithm Learning
- **US-01:** As a learner, I want to see an animated step-by-step visualization of any algorithm so I can understand how it works visually.
- **US-02:** As a learner, I want Play/Pause/Step/Reset controls so I can learn at my own pace.
- **US-03:** As a learner, I want to adjust animation speed so I can slow down complex parts and speed through simple ones.
- **US-04:** As a learner, I want to see pseudocode highlighted in sync with the animation so I can connect the visual to the code.
- **US-05:** As a learner, I want to see real Python/JavaScript implementations so I can use them in my own projects.
- **US-06:** As a learner, I want to see time and space complexity with a visual comparison chart so I can understand performance trade-offs.

### 2.2 Search & Discovery
- **US-07:** As a learner, I want a global search bar (Cmd+K) that instantly finds any algorithm, concept, or term.
- **US-08:** As a learner, I want to browse algorithms by category (Sorting, Graph, ML, DL, NLP, etc.) in a sidebar.
- **US-09:** As a learner, I want related algorithms linked on each page so I can explore connections.
- **US-10:** As a learner, I want a breadcrumb trail so I always know where I am in the taxonomy.

### 2.3 Glossary & Explanations
- **US-11:** As a learner, I want every technical term to be clickable so I can get an instant plain-English definition.
- **US-12:** As a learner, I want a glossary page where I can browse all terms A-Z.
- **US-13:** As a learner, I want an "Ask AI" button that gives me a deeper, contextual explanation of any term or algorithm.
- **US-14:** As a learner, I want mathematical notation rendered properly (LaTeX) wherever applicable.

### 2.4 Interactivity
- **US-15:** As a learner, I want to input my own data (arrays, graphs, numbers) and watch the algorithm process it.
- **US-16:** As a learner, I want to adjust ML hyperparameters (learning rate, epochs) and see the training curve change live.
- **US-17:** As a learner, I want to compare two algorithms side-by-side with synchronized animations.

### 2.5 Progress Tracking
- **US-18:** As a learner, I want to mark algorithms as "Not Started", "In Progress", or "Understood".
- **US-19:** As a learner, I want to bookmark algorithms for later review.
- **US-20:** As a learner, I want to write personal notes on any algorithm, saved persistently.
- **US-21:** As a learner, I want a dashboard showing my overall learning progress and stats.

### 2.6 AI Integration
- **US-22:** As a learner, I want a chat assistant that knows which algorithm page I'm on and can answer follow-up questions.
- **US-23:** As a learner, I want the AI to explain concepts using analogies and simple language, not just formal definitions.

---

## 3. Functional Requirements

### FR-01: Algorithm Visualization Engine
- Pre-compute all steps before animation begins
- Support Play, Pause, Step Forward, Step Back, Reset, Speed controls
- Speed range: 0.25x to 4x (default 1x)
- Current step number displayed (e.g., "Step 3 of 15")
- Each step shows: description text, highlighted visual elements, highlighted pseudocode line
- Animation must run at 60fps minimum

### FR-02: Search System
- Global search accessible via Cmd+K (Mac) / Ctrl+K (Windows)
- Search indexes: algorithm names, category names, glossary terms, tags, aliases
- Results appear in <200ms (client-side with Fuse.js)
- Results grouped by type: Algorithms, Glossary Terms, Categories
- Keyboard navigable (arrow keys + Enter)
- Recent searches stored locally

### FR-03: Glossary System
- Minimum 500 glossary terms covering all CS/ML/NLP terminology
- Each term has: plain English definition, formal definition, category, related terms
- Optional fields: mathematical notation (KaTeX), diagram, example
- Terms are linkable — clicking a related term navigates to it
- "Ask AI" button on each term sends to OpenAI for deeper explanation
- Glossary browsable as standalone page with A-Z filter and search

### FR-04: Algorithm Detail Page
- Sections: Overview, Visualization, Pseudocode, Implementation (Python + JS tabs), Complexity Analysis, Use Cases, Related Algorithms, Notes
- Each section collapsible
- Visualization is the hero element (largest, top of page)
- Complexity shown as both Big-O notation and comparison chart

### FR-05: Category System
- Hierarchical: Category > Subcategory > Algorithm
- Each category has an overview page with description and algorithm listing
- Sidebar shows full taxonomy, collapsible
- Category pages show progress stats

### FR-06: Progress Tracking
- Three states per algorithm: Not Started (gray), In Progress (yellow), Understood (green)
- One-click status toggle on algorithm pages and in sidebar
- Progress persisted to Neon database
- Dashboard: overall %, per-category %, recently visited, streak counter

### FR-07: Notes & Bookmarks
- Rich text notes per algorithm (Markdown supported)
- Auto-save with debounce (save 1 second after last keystroke)
- Bookmarks list accessible from sidebar and dashboard
- Export notes as Markdown

### FR-08: AI Explain Feature
- POST to /api/ai/explain with: term, context (current algorithm), detail_level
- System prompt: "You are a CS/ML teacher. Explain in simple terms with analogies. Use markdown formatting."
- Response streamed to UI
- Rate limited: max 30 requests/minute
- Cache responses for same term+context combo

### FR-09: Comparison Mode
- Select 2 algorithms from same category
- Side-by-side visualization with synchronized controls
- Shared input data (same array sorted by both algorithms simultaneously)
- Step counter for each, showing which finishes first

### FR-10: Responsive Design
- Desktop: full sidebar + content
- Tablet: collapsible sidebar
- Mobile: bottom tabs, full-width visualizations
- Touch-friendly controls (larger buttons, swipe gestures for steps)

---

## 4. Non-Functional Requirements

### NFR-01: Performance
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Visualization frame rate: 60fps
- Search results: <200ms
- Page transitions: <300ms

### NFR-02: Accessibility
- WCAG 2.1 AA compliant
- All visualizations have text descriptions
- Keyboard navigable
- Color contrast ratio ≥ 4.5:1

### NFR-03: SEO
- Each algorithm page has unique meta title/description
- Open Graph tags for social sharing
- Sitemap generated automatically

### NFR-04: Cost
- Database: Neon free tier (0.5GB, sufficient for user data)
- AI: OpenAI API pay-per-use (~$5-10/month for personal use)
- Hosting: Vercel free tier (hobby plan)
- Total: Under $15/month

---

## 5. Content Scope

See **ALGORITHM_MASTER_LIST.md** for the full breakdown. Summary:

| Category | Subcategories | Est. Algorithms |
|---|---|---|
| Data Structures | Arrays, Linked Lists, Trees, Graphs, Heaps, Hash Tables, Advanced | ~30 |
| Sorting | Comparison, Non-Comparison, Hybrid | ~15 |
| Searching | Linear, Tree-based, Graph-based, String | ~15 |
| Graph Algorithms | Traversal, Shortest Path, MST, Flow, Topological | ~20 |
| Dynamic Programming | Classic, String, Matrix, Optimization | ~25 |
| Greedy Algorithms | Classic Problems | ~10 |
| Divide & Conquer | Classic Applications | ~8 |
| String Algorithms | Pattern Matching, Processing | ~10 |
| Mathematical | Number Theory, Computational Geometry | ~10 |
| Machine Learning | Supervised, Unsupervised, Ensemble | ~25 |
| Deep Learning | Architectures, Training, Components | ~20 |
| NLP | Classical, Neural, Transformers, Tasks | ~25 |
| Reinforcement Learning | Core Concepts | ~8 |
| Optimization | Gradient-based, Metaheuristic | ~10 |
| **TOTAL** | | **~230+** |

---

## 6. Out of Scope (v1)

- Multi-user / authentication (single user, no login needed)
- Backend-executed code (all viz runs client-side)
- Video content or recorded lectures
- Certification or grading system
- Mobile native app (web responsive is sufficient)
- Real-time collaboration
