import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecentSearch {
  name: string;
  href: string;
  type: "algorithm" | "term" | "category";
}

interface SearchStore {
  recentSearches: RecentSearch[];
  addRecent: (item: RecentSearch) => void;
  clearRecents: () => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      recentSearches: [],
      addRecent: (item) =>
        set((state) => ({
          recentSearches: [
            item,
            ...state.recentSearches.filter((r) => r.href !== item.href),
          ].slice(0, 10),
        })),
      clearRecents: () => set({ recentSearches: [] }),
    }),
    { name: "algoverse-search" }
  )
);
