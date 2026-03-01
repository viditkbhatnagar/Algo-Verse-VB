# Phase 6: Database + Progress + Bookmarks + Notes + Dashboard — AlgoVerse

## CRITICAL: Read Memory & Documentation First
Before writing ANY code, read these files in order:
1. **MEMORY.md is auto-loaded** — review phase status and key patterns
2. Read ALL memory files:
   - `phases-progress.md` — what Phases 1-5 built
   - `architecture-decisions.md` — follow established patterns
   - `file-registry.md` — existing file paths
3. Read project documentation:
   - `docs/DATABASE_SCHEMA.md` — **CRITICAL** — complete Drizzle ORM schema
   - `docs/CLAUDE_CODE_INSTRUCTIONS.md` — Sections 3.7 (progress tracking), 5 (database), 8 (API routes)
   - `docs/TRD.md` — Section 4 (data architecture)

## Phase Objective
Set up Neon PostgreSQL database, implement the Drizzle ORM schema, build all CRUD API routes, and implement user-facing features: progress tracking, bookmarks, notes editor, and the learning dashboard with stats.

## IMPORTANT: Neon DB Setup (Guide the User)
The user needs help setting up Neon. Include these instructions:

### Step-by-step Neon Setup:
1. Go to https://neon.tech and sign up (free tier)
2. Create a new project:
   - Name: "algoverse"
   - Region: closest to user (e.g., us-east-2)
   - Postgres version: 16
3. After creation, copy the connection string from the dashboard
   - It looks like: `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
4. Create `.env.local` in the project root:
   ```
   DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   OPENAI_API_KEY=sk-...  (already have this)
   NEXT_PUBLIC_APP_NAME=AlgoVerse
   ```
5. Run the Drizzle migration to push schema

**Ask the user to confirm they've set up Neon and added the DATABASE_URL before proceeding with the code.**

## Tasks

### 1. Database Schema (`src/lib/db/schema.ts`)
Implement the EXACT schema from DATABASE_SCHEMA.md using Drizzle ORM:

```typescript
// Tables:
// - user_progress: algorithmId, status (not_started/in_progress/understood), lastVisited, timeSpent
// - bookmarks: algorithmId, createdAt
// - notes: algorithmId, content (text/markdown), updatedAt
// - ai_cache: promptHash, response, createdAt, expiresAt (30 days TTL)
// - search_history: query, resultCount, createdAt
// - learning_streaks: date (unique), algorithmsStudied, minutesSpent
```

### 2. Database Connection (`src/lib/db/index.ts`)
```typescript
// Use @neondatabase/serverless for HTTP-based connection
// Export drizzle instance
// Use connection pooling (Neon serverless driver handles this)
```

### 3. Push Schema
```bash
npx drizzle-kit push
```

### 4. API Routes

**`src/app/api/progress/route.ts`**
- GET: Return all progress records
- POST: Create or update progress for an algorithm
  - Body: `{ algorithmId, status, timeSpent? }`
  - Upsert logic

**`src/app/api/bookmarks/route.ts`**
- GET: Return all bookmarks
- POST: Add bookmark `{ algorithmId }`
- DELETE: Remove bookmark `{ algorithmId }`

**`src/app/api/notes/route.ts`**
- GET: `?algorithmId=xxx` — return note for algorithm
- POST: Save/update note `{ algorithmId, content }`

**`src/app/api/search/route.ts`**
- POST: Save search to history `{ query, resultCount }`

**Update `src/app/api/ai/explain/route.ts`**
- Add caching: before calling OpenAI, check ai_cache
- After response, save to ai_cache with 30-day TTL
- Hash the prompt for cache key

### 5. State Management & Hooks

**`src/stores/progress.ts`**
Zustand store synced with database:
- `progressMap: Record<string, ProgressStatus>`
- `bookmarks: Set<string>`
- `fetchProgress()`, `updateProgress()`, `toggleBookmark()`, `isBookmarked()`
- Fetch on app initialization

**`src/hooks/useProgress.ts`**
- CRUD operations for progress
- Optimistic updates (update UI immediately, sync to DB)

**`src/hooks/useBookmarks.ts`**
- Add/remove bookmarks
- Check if bookmarked
- Optimistic updates

**`src/hooks/useNotes.ts`**
- Load note for algorithm
- Auto-save with debounce (1 second)
- Save indicator ("Saving..." → "Saved")

### 6. Progress UI Components

**`src/components/progress/ProgressBadge.tsx`**
- Three-state toggle badge: Not Started (gray) → In Progress (amber) → Understood (green)
- Click to cycle through states
- Compact variant for cards, full variant for detail pages

**`src/components/progress/ProgressBar.tsx`**
- Horizontal progress bar with percentage
- Category-level and overall-level variants
- Color gradient based on completion

**`src/components/progress/StatsCard.tsx`**
- Stat display card: icon, label, value
- For: total algorithms studied, % complete, streak days, time spent

**`src/components/progress/StreakCalendar.tsx`**
- GitHub-style activity heatmap
- Shows last 52 weeks
- Color intensity based on algorithms studied that day
- Tooltip showing date and count on hover

### 7. Notes Component

**`src/components/notes/NoteEditor.tsx`**
- Textarea or rich Markdown editor
- Auto-save with 1s debounce
- Shows save status: "Saving...", "Saved ✓", "Error"
- Placeholder: "Write your notes about this algorithm..."
- Min height: 150px

### 8. Dashboard Page (`src/app/progress/page.tsx`)
- Overall completion percentage (big number)
- Per-category progress bars (all 16 categories)
- Stats cards: total studied, understood, bookmarked, notes written
- Streak calendar (last 52 weeks)
- Recently visited algorithms (last 10)
- Time spent summary

### 9. Bookmarks Page (`src/app/bookmarks/page.tsx`)
- Grid of bookmarked algorithm cards
- Remove bookmark button
- Empty state: "No bookmarks yet"

### 10. Integration Updates
Update the algorithm detail page (`src/app/algorithms/[category]/[algorithm]/page.tsx`):
- Add ProgressBadge in the header (toggleable)
- Add Bookmark button (star icon, toggleable)
- Add NoteEditor section at the bottom
- Track time spent on page (increment every 30s while visible)

Update `src/components/layout/Sidebar.tsx`:
- Show progress indicators per category (small progress bar or dot)

Update `src/components/algorithm/AlgorithmCard.tsx`:
- Show ProgressBadge (compact) on each card

Update root layout to initialize progress store on app load.

## CRITICAL: After Completion
1. Verify Neon DB is connected: `npx drizzle-kit push` succeeds
2. Run `npm run build` — verify clean build
3. Test:
   - Click progress badge on algorithm page → cycles through states
   - Click bookmark → saves and shows on bookmarks page
   - Write a note → auto-saves (refresh page, note persists)
   - Dashboard shows correct stats
   - Streak calendar shows today's activity
   - Sidebar shows category progress
4. Update ALL memory files
5. Git commit and push:
   ```bash
   git add -A
   git commit -m "Phase 6: Neon database, progress tracking, bookmarks, notes, and learning dashboard"
   git push origin main
   ```
