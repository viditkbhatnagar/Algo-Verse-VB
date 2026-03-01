# AlgoVerse — Database Schema (Neon PostgreSQL + Drizzle ORM)

## Overview

The database stores ONLY user-generated data. All algorithm content is static TypeScript files.

**Database:** Neon (free tier PostgreSQL)
**ORM:** Drizzle ORM
**Connection:** `@neondatabase/serverless` (HTTP-based, no persistent connections)

---

## Schema Definition (Drizzle ORM)

```typescript
// src/db/schema.ts

import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  pgEnum,
  serial,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";

// ============================================
// ENUMS
// ============================================

export const progressStatusEnum = pgEnum("progress_status", [
  "not_started",
  "in_progress",
  "understood",
]);

// ============================================
// USER PROGRESS
// ============================================

export const userProgress = pgTable(
  "user_progress",
  {
    id: serial("id").primaryKey(),
    algorithmId: varchar("algorithm_id", { length: 100 }).notNull(),
    status: progressStatusEnum("status").default("not_started").notNull(),
    lastVisitedAt: timestamp("last_visited_at").defaultNow(),
    timeSpentSeconds: integer("time_spent_seconds").default(0),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    algorithmIdx: uniqueIndex("algorithm_idx").on(table.algorithmId),
  })
);

// ============================================
// BOOKMARKS
// ============================================

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: serial("id").primaryKey(),
    algorithmId: varchar("algorithm_id", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    bookmarkAlgoIdx: uniqueIndex("bookmark_algo_idx").on(table.algorithmId),
  })
);

// ============================================
// NOTES
// ============================================

export const notes = pgTable(
  "notes",
  {
    id: serial("id").primaryKey(),
    algorithmId: varchar("algorithm_id", { length: 100 }).notNull(),
    content: text("content").default("").notNull(), // Markdown content
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    noteAlgoIdx: uniqueIndex("note_algo_idx").on(table.algorithmId),
  })
);

// ============================================
// AI RESPONSE CACHE
// ============================================

export const aiCache = pgTable(
  "ai_cache",
  {
    id: serial("id").primaryKey(),
    queryHash: varchar("query_hash", { length: 64 }).notNull(), // SHA-256 of term+context
    term: varchar("term", { length: 200 }).notNull(),
    context: varchar("context", { length: 200 }), // Algorithm context
    response: text("response").notNull(),
    model: varchar("model", { length: 50 }).default("gpt-4o-mini"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at").notNull(), // 30 days from creation
  },
  (table) => ({
    queryHashIdx: uniqueIndex("query_hash_idx").on(table.queryHash),
  })
);

// ============================================
// SEARCH HISTORY
// ============================================

export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  query: varchar("query", { length: 200 }).notNull(),
  resultType: varchar("result_type", { length: 50 }), // "algorithm" | "term" | "category"
  resultId: varchar("result_id", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// LEARNING STREAKS
// ============================================

export const learningStreaks = pgTable("learning_streaks", {
  id: serial("id").primaryKey(),
  date: varchar("date", { length: 10 }).notNull(), // "2026-03-01" format
  algorithmsViewed: integer("algorithms_viewed").default(0),
  timeSpentSeconds: integer("time_spent_seconds").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  dateIdx: uniqueIndex("date_idx").on(table.date),
}));
```

---

## Database Connection

```typescript
// src/db/index.ts

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

---

## Migration Commands

```bash
# Generate migration
npx drizzle-kit generate:pg

# Push schema to Neon (development)
npx drizzle-kit push:pg

# View Drizzle Studio (DB browser)
npx drizzle-kit studio
```

---

## Drizzle Config

```typescript
// drizzle.config.ts

import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

---

## Storage Estimation (Free Tier: 0.5GB)

| Table | Est. Rows | Est. Size |
|---|---|---|
| user_progress | 230 (one per algorithm) | ~50KB |
| bookmarks | ~50 | ~5KB |
| notes | ~100 | ~500KB (generous) |
| ai_cache | ~500 | ~2MB |
| search_history | ~1000 | ~100KB |
| learning_streaks | ~365/year | ~20KB |
| **Total** | | **~3MB** |

The free tier's 0.5GB is more than sufficient. Even with years of use, this won't exceed 10MB.

---

## Query Examples

```typescript
// Get progress for all algorithms
const progress = await db.select().from(schema.userProgress);

// Update progress for an algorithm
await db
  .insert(schema.userProgress)
  .values({ algorithmId: "bubble-sort", status: "understood" })
  .onConflictDoUpdate({
    target: schema.userProgress.algorithmId,
    set: { status: "understood", updatedAt: new Date() },
  });

// Get bookmarks
const myBookmarks = await db.select().from(schema.bookmarks);

// Save/update notes
await db
  .insert(schema.notes)
  .values({ algorithmId: "dijkstra", content: "# My Notes\n\nGreat for shortest paths..." })
  .onConflictDoUpdate({
    target: schema.notes.algorithmId,
    set: { content: "...", updatedAt: new Date() },
  });

// Check AI cache
const cached = await db
  .select()
  .from(schema.aiCache)
  .where(eq(schema.aiCache.queryHash, hash))
  .where(gt(schema.aiCache.expiresAt, new Date()));
```
