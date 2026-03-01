# Phase 7: Polish + Responsive + Comparison + Deploy — AlgoVerse

## CRITICAL: Read Memory & Documentation First
Before writing ANY code, read these files in order:
1. **MEMORY.md is auto-loaded** — review phase status and key patterns
2. Read ALL memory files:
   - `phases-progress.md` — everything built in Phases 1-6
   - `architecture-decisions.md` — all established patterns
   - `file-registry.md` — complete file inventory
3. Read project documentation:
   - `docs/CLAUDE_CODE_INSTRUCTIONS.md` — Sections 3.8 (comparison), 3.11 (dark/light), 7 (responsive)
   - `docs/BRD.md` — NFR-01 (performance), NFR-02 (accessibility)
   - `docs/TRD.md` — Section 10 (deployment)

## Phase Objective
Final polish pass: implement functional dark/light mode toggle, ensure responsive design across all breakpoints, build comparison mode for side-by-side algorithm visualization, optimize performance (code splitting, lazy loading), add SEO metadata, and deploy to Vercel.

## Tasks

### 1. Dark/Light Mode

**Install `next-themes`:**
```bash
npm install next-themes
```

**Update `src/providers/ThemeProvider.tsx`**
```typescript
// Wrap app with NextThemesProvider
// attribute="class", defaultTheme="dark"
```

**Update `src/app/layout.tsx`**
- Wrap children with ThemeProvider

**`src/components/shared/ThemeToggle.tsx`**
- Functional toggle: Sun/Moon icon
- Uses `useTheme()` from next-themes
- Smooth transition between modes

**Update `tailwind.config.js`**
- Ensure `darkMode: "class"` is set (already is)

**Update `src/app/globals.css`**
- Add CSS variables for BOTH themes:
  ```css
  :root { /* light mode colors */ }
  .dark { /* dark mode colors — current values */ }
  ```

**Audit ALL visualization canvases**
- Every Canvas.tsx must read theme and adjust colors:
  - Dark mode: current colors (dark backgrounds, bright elements)
  - Light mode: light backgrounds, darker elements
- Files to update: BarCanvas, TreeCanvas, GraphCanvas, MatrixCanvas, ArrayCanvas, ScatterCanvas, NeuralNetCanvas, HeatmapCanvas, TokenCanvas, LossChartCanvas
- Use CSS variables or a `useThemeColors()` hook

### 2. Responsive Design Pass

**Breakpoints:**
- Desktop (>1024px): Sidebar + main content side by side
- Tablet (768-1024px): Collapsible sidebar (hamburger), narrower content
- Mobile (<768px): No sidebar, bottom tab nav, full-width content

**Update visualization components:**
- All Canvas components: use container width via ResizeObserver or a `useContainerSize()` hook
- Min-height: 250px mobile, 300px tablet, 400px desktop
- Touch-friendly controls: larger hit targets (44px min)
- Swipe gestures on mobile for step forward/back (optional nice-to-have)

**Update layout components:**
- `Sidebar.tsx`: hidden on mobile, slide-over on tablet (Sheet component)
- `MobileNav.tsx`: only visible on mobile
- `Navbar.tsx`: compact on mobile, hide search hint text

**Update pages:**
- Algorithm grid: 1 column mobile, 2 tablet, 3-4 desktop
- Dashboard stats: stack on mobile, grid on desktop
- Glossary: single column on mobile

### 3. Comparison Mode

**`src/app/compare/page.tsx`**
- Algorithm selector page
- Two dropdown selects (pick algorithm A and B)
- Filter by same category for meaningful comparisons
- Suggested pairs: "Bubble Sort vs Quick Sort", "BFS vs DFS", "CNN vs RNN"
- Start comparison button

**Side-by-side visualization (client-side rendered)**
- After selecting two algorithms, show both visualizations side by side
- Use CSS Grid: 2 columns on desktop, stacked on mobile
- Independent playback controls for each
- Optional: "Sync" button for synchronized playback
- Shared input data option (e.g., same array for two sorting algorithms)
- Each side shows: algorithm name, visualization, step counter, description

### 4. Performance Optimization

**Dynamic imports for ALL visualization components:**
- Verify every visualization is loaded with `next/dynamic({ ssr: false })`
- This is critical for bundle size — each algorithm's viz should be its own chunk

**Loading skeletons:**
- `src/app/loading.tsx` — root loading
- `src/app/algorithms/loading.tsx`
- `src/app/algorithms/[category]/loading.tsx`
- `src/app/algorithms/[category]/[algorithm]/loading.tsx`
- `src/app/glossary/loading.tsx`
- `src/app/progress/loading.tsx`
- Each shows a skeleton that matches the page layout

**Bundle analysis:**
- Run `npx next build` and check output sizes
- Each algorithm page should be <50KB first load (shared chunks are OK)
- Glossary terms should be lazy loaded if the file is too large

**Code splitting verification:**
- Ensure D3 is only loaded on pages that need it (viz pages)
- Ensure KaTeX is only loaded on glossary/AI pages
- Ensure OpenAI SDK is only in API routes (not client bundles)

### 5. SEO & Metadata

**`generateMetadata()` for algorithm pages:**
```typescript
// Title: "{Algorithm Name} — AlgoVerse"
// Description: shortDescription from algorithm data
// OpenGraph: title, description, type: "article"
```

**`src/app/sitemap.ts`**
- Auto-generate sitemap from all algorithm pages, glossary pages, category pages
- Priority: home 1.0, algorithms 0.8, glossary 0.6

**`src/app/robots.ts`**
- Allow all crawlers
- Point to sitemap

### 6. Accessibility Pass
- All interactive elements have `aria-label`
- Keyboard navigation works for search, controls, sidebar
- Focus styles visible on all interactive elements
- Visualization step descriptions readable by screen readers
- Color contrast meets WCAG 2.1 AA

### 7. README Update
Update `README.md` with:
- Project description
- Tech stack
- Features list
- Getting started instructions
- Screenshots (placeholder — user can add later)
- Environment variables needed

### 8. Vercel Deployment

**Steps:**
1. Go to https://vercel.com and import the GitHub repo (viditkbhatnagar/Algo-Verse-VB)
2. Framework: Next.js (auto-detected)
3. Add environment variables:
   - `DATABASE_URL` — from Neon
   - `OPENAI_API_KEY` — user's key
   - `NEXT_PUBLIC_APP_NAME` — AlgoVerse
4. Deploy
5. Verify all routes work in production
6. Check: visualizations load, search works, AI chat works (with key), progress persists

**Ask the user if they want to deploy now or later.**

## CRITICAL: After Completion
1. Run `npm run build` — verify clean build, check bundle sizes
2. Test:
   - Dark/light mode toggle works on ALL pages
   - All visualizations render correctly in both themes
   - Responsive: test at 375px (mobile), 768px (tablet), 1440px (desktop)
   - Comparison mode works
   - Loading skeletons appear
   - SEO metadata present (check with dev tools)
3. Update ALL memory files — Phase 7 COMPLETED, all phases done
4. Git commit and push:
   ```bash
   git add -A
   git commit -m "Phase 7: Dark/light mode, responsive design, comparison mode, Vercel deployment"
   git push origin main
   ```

## Final Verification Checklist
- [ ] 120+ algorithm visualizations working
- [ ] Search (Cmd+K) with fuzzy results
- [ ] Glossary with 500+ terms
- [ ] AI explanations streaming
- [ ] Progress tracking persists in DB
- [ ] Bookmarks and notes work
- [ ] Dashboard shows stats + streak calendar
- [ ] Dark/light mode toggles
- [ ] Responsive on mobile/tablet/desktop
- [ ] Comparison mode
- [ ] Deployed on Vercel
- [ ] README updated
