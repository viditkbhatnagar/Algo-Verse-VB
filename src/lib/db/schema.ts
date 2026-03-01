import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  pgEnum,
  serial,
  uniqueIndex,
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
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("algorithm_idx").on(table.algorithmId)]
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
  (table) => [uniqueIndex("bookmark_algo_idx").on(table.algorithmId)]
);

// ============================================
// NOTES
// ============================================

export const notes = pgTable(
  "notes",
  {
    id: serial("id").primaryKey(),
    algorithmId: varchar("algorithm_id", { length: 100 }).notNull(),
    content: text("content").default("").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("note_algo_idx").on(table.algorithmId)]
);

// ============================================
// AI RESPONSE CACHE
// ============================================

export const aiCache = pgTable(
  "ai_cache",
  {
    id: serial("id").primaryKey(),
    queryHash: varchar("query_hash", { length: 64 }).notNull(),
    term: varchar("term", { length: 200 }).notNull(),
    context: varchar("context", { length: 200 }),
    response: text("response").notNull(),
    model: varchar("model", { length: 50 }).default("gpt-4o-mini"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (table) => [uniqueIndex("query_hash_idx").on(table.queryHash)]
);

// ============================================
// SEARCH HISTORY
// ============================================

export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  query: varchar("query", { length: 200 }).notNull(),
  resultType: varchar("result_type", { length: 50 }),
  resultId: varchar("result_id", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// LEARNING STREAKS
// ============================================

export const learningStreaks = pgTable(
  "learning_streaks",
  {
    id: serial("id").primaryKey(),
    date: varchar("date", { length: 10 }).notNull(),
    algorithmsViewed: integer("algorithms_viewed").default(0),
    timeSpentSeconds: integer("time_spent_seconds").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("date_idx").on(table.date)]
);
