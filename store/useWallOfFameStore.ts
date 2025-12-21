import { create } from "zustand";
import { WallOfFameEntry, WallOfFameFilters } from "@/types/wall-of-fame-types";

interface WallOfFameStore {
  entries: WallOfFameEntry[];
  categories: string[];
  filters: WallOfFameFilters;
  selectedEntry: WallOfFameEntry | null;

  // Actions
  setEntries: (entries: WallOfFameEntry[]) => void;
  addEntry: (entry: WallOfFameEntry) => void;
  updateEntry: (id: string, updates: Partial<WallOfFameEntry>) => void;
  deleteEntry: (id: string) => void;
  selectEntry: (entry: WallOfFameEntry | null) => void;
  toggleStatus: (id: string) => void;
  toggleFeatured: (id: string) => void;
  addCategory: (category: string) => void;
  setFilters: (filters: Partial<WallOfFameFilters>) => void;
  resetFilters: () => void;

  // Computed
  getFilteredEntries: () => WallOfFameEntry[];
  getFeaturedEntries: () => WallOfFameEntry[];
  getActiveCount: () => number;
}

const DEFAULT_FILTERS: WallOfFameFilters = {
  status: "all",
  searchQuery: "",
  featured: undefined,
};

const DEFAULT_CATEGORIES = ["Leadership", "Innovation", "Community", "Achievement"];

export const useWallOfFameStore = create<WallOfFameStore>((set, get) => ({
  entries: [],
  categories: DEFAULT_CATEGORIES,
  filters: DEFAULT_FILTERS,
  selectedEntry: null,

  setEntries: (entries) => set({ entries }),

  addEntry: (entry) =>
    set((state) => ({
      entries: [...state.entries, entry],
    })),

  updateEntry: (id, updates) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, ...updates, updatedAt: new Date().toISOString() } : entry
      ),
    })),

  deleteEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id),
    })),

  selectEntry: (entry) => set({ selectedEntry: entry }),

  toggleStatus: (id) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, isActive: !entry.isActive } : entry
      ),
    })),

  toggleFeatured: (id) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, isFeatured: !entry.isFeatured } : entry
      ),
    })),

  addCategory: (category) =>
    set((state) => ({
      categories: state.categories.includes(category)
        ? state.categories
        : [...state.categories, category],
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  getFilteredEntries: () => {
    const { entries, filters } = get();
    let filtered = [...entries];

    if (filters.status !== "all") {
      filtered = filtered.filter((e) => e.isActive === (filters.status === "active"));
    }

    if (filters.category) {
      filtered = filtered.filter((e) => e.category === filters.category);
    }

    if (filters.featured !== undefined) {
      filtered = filtered.filter((e) => e.isFeatured === filters.featured);
    }

    if (filters.searchQuery?.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.title.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => a.order - b.order);
  },

  getFeaturedEntries: () => {
    const { entries } = get();
    return entries.filter((e) => e.isFeatured && e.isActive).sort((a, b) => a.order - b.order);
  },

  getActiveCount: () => {
    const { entries } = get();
    return entries.filter((e) => e.isActive).length;
  },
}));
