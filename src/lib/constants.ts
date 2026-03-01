// Visualization colors
export const VIZ_COLORS = {
  default: "#475569",
  active: "#6366f1",
  comparing: "#f59e0b",
  swapping: "#ef4444",
  completed: "#22c55e",
  highlighted: "#22d3ee",
  mstEdge: "#8b5cf6",
  relaxed: "#06b6d4",
  backtracked: "#f87171",
  window: "#a78bfa",
} as const;

// Playback speeds
export const PLAYBACK_SPEEDS = [0.25, 0.5, 1, 1.5, 2, 4] as const;
export const DEFAULT_SPEED = 1;

// Category slugs
export const CATEGORY_SLUGS = [
  "data-structures",
  "sorting",
  "searching",
  "graph",
  "dynamic-programming",
  "greedy",
  "divide-and-conquer",
  "string",
  "mathematical",
  "backtracking",
  "machine-learning",
  "deep-learning",
  "nlp",
  "reinforcement-learning",
  "optimization",
  "miscellaneous",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

// Difficulty levels
export const DIFFICULTIES = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

// App constants
export const APP_NAME = "AlgoVerse";
export const APP_DESCRIPTION =
  "Interactive visual learning platform for algorithms, ML, and NLP";
