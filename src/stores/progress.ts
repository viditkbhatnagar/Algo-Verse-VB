import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ProgressStatus = "not_started" | "in_progress" | "understood";

export interface ProgressEntry {
  algorithmId: string;
  status: ProgressStatus;
  timeSpentSeconds: number;
  lastVisitedAt: string | null;
}

interface ProgressStore {
  progressMap: Record<string, ProgressEntry>;
  bookmarks: string[];
  hasFetched: boolean;

  // Actions
  fetchAll: () => Promise<void>;
  updateProgress: (algorithmId: string, status: ProgressStatus, timeSpent?: number) => Promise<void>;
  addTimeSpent: (algorithmId: string, seconds: number) => Promise<void>;
  toggleBookmark: (algorithmId: string) => Promise<void>;
  isBookmarked: (algorithmId: string) => boolean;
  getStatus: (algorithmId: string) => ProgressStatus;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progressMap: {},
      bookmarks: [],
      hasFetched: false,

      fetchAll: async () => {
        try {
          const [progressRes, bookmarksRes] = await Promise.all([
            fetch("/api/progress"),
            fetch("/api/bookmarks"),
          ]);

          if (progressRes.ok) {
            const progressRows = await progressRes.json();
            const map: Record<string, ProgressEntry> = {};
            for (const row of progressRows) {
              map[row.algorithmId] = {
                algorithmId: row.algorithmId,
                status: row.status,
                timeSpentSeconds: row.timeSpentSeconds ?? 0,
                lastVisitedAt: row.lastVisitedAt,
              };
            }
            set({ progressMap: map });
          }

          if (bookmarksRes.ok) {
            const bookmarkRows = await bookmarksRes.json();
            set({ bookmarks: bookmarkRows.map((r: { algorithmId: string }) => r.algorithmId) });
          }

          set({ hasFetched: true });
        } catch (err) {
          console.error("Failed to fetch progress data:", err);
        }
      },

      updateProgress: async (algorithmId, status, timeSpent) => {
        // Optimistic update
        const prev = get().progressMap[algorithmId];
        set((state) => ({
          progressMap: {
            ...state.progressMap,
            [algorithmId]: {
              algorithmId,
              status,
              timeSpentSeconds: timeSpent ?? prev?.timeSpentSeconds ?? 0,
              lastVisitedAt: new Date().toISOString(),
            },
          },
        }));

        try {
          const res = await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ algorithmId, status, timeSpent }),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
        } catch (err) {
          console.error("Failed to update progress:", err);
          if (prev) {
            set((state) => ({
              progressMap: { ...state.progressMap, [algorithmId]: prev },
            }));
          } else {
            set((state) => {
              const { [algorithmId]: _, ...rest } = state.progressMap;
              return { progressMap: rest };
            });
          }
        }
      },

      addTimeSpent: async (algorithmId, seconds) => {
        const prev = get().progressMap[algorithmId];
        const newTime = (prev?.timeSpentSeconds ?? 0) + seconds;
        const newStatus = prev?.status ?? "in_progress";

        set((state) => ({
          progressMap: {
            ...state.progressMap,
            [algorithmId]: {
              algorithmId,
              status: newStatus,
              timeSpentSeconds: newTime,
              lastVisitedAt: new Date().toISOString(),
            },
          },
        }));

        try {
          const res = await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              algorithmId,
              status: newStatus,
              timeSpent: seconds,
            }),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
        } catch (err) {
          console.error("Failed to update time spent:", err);
          if (prev) {
            set((state) => ({
              progressMap: { ...state.progressMap, [algorithmId]: prev },
            }));
          } else {
            set((state) => {
              const { [algorithmId]: _, ...rest } = state.progressMap;
              return { progressMap: rest };
            });
          }
        }
      },

      toggleBookmark: async (algorithmId) => {
        const isCurrentlyBookmarked = get().bookmarks.includes(algorithmId);

        // Optimistic update
        if (isCurrentlyBookmarked) {
          set((state) => ({
            bookmarks: state.bookmarks.filter((id) => id !== algorithmId),
          }));
        } else {
          set((state) => ({
            bookmarks: [...state.bookmarks, algorithmId],
          }));
        }

        try {
          let res: Response;
          if (isCurrentlyBookmarked) {
            res = await fetch(`/api/bookmarks?algorithmId=${encodeURIComponent(algorithmId)}`, {
              method: "DELETE",
            });
          } else {
            res = await fetch("/api/bookmarks", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ algorithmId }),
            });
          }
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
        } catch (err) {
          console.error("Failed to toggle bookmark:", err);
          // Revert
          if (isCurrentlyBookmarked) {
            set((state) => ({
              bookmarks: [...state.bookmarks, algorithmId],
            }));
          } else {
            set((state) => ({
              bookmarks: state.bookmarks.filter((id) => id !== algorithmId),
            }));
          }
        }
      },

      isBookmarked: (algorithmId) => get().bookmarks.includes(algorithmId),
      getStatus: (algorithmId) => get().progressMap[algorithmId]?.status ?? "not_started",
    }),
    { name: "algoverse-progress" }
  )
);
