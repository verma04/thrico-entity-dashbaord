import { create } from "zustand";
import { Mentor, MentorCategory, MentorFilters, MentorStatus } from "@/types/mentor-types";

interface MentorStore {
  mentors: Mentor[];
  categories: MentorCategory[];
  filters: MentorFilters;

  // Actions
  setMentors: (mentors: Mentor[]) => void;
  addMentor: (mentor: Mentor) => void;
  updateMentor: (id: string, updates: Partial<Mentor>) => void;
  deleteMentor: (id: string) => void;
  approveMentor: (id: string) => void;
  rejectMentor: (id: string) => void;
  toggleActive: (id: string) => void;
  toggleFeatured: (id: string) => void;
  toggleTrending: (id: string) => void;
  
  // Categories
  setCategories: (categories: MentorCategory[]) => void;
  addCategory: (category: MentorCategory) => void;
  updateCategory: (id: string, updates: Partial<MentorCategory>) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryStatus: (id: string) => void;
  
  // Filters
  setFilters: (filters: Partial<MentorFilters>) => void;
  resetFilters: () => void;

  // Computed
  getFilteredMentors: () => Mentor[];
  getPendingCount: () => number;
  getAdminMentorsCount: () => number;
  getUserMentorsCount: () => number;
  getFeaturedMentors: () => Mentor[];
  getTrendingMentors: () => Mentor[];
}

const DEFAULT_FILTERS: MentorFilters = {
  status: "all",
  source: "all",
  searchQuery: "",
};

const DEFAULT_CATEGORIES: MentorCategory[] = [
  {
    id: "cat-1",
    name: "Technology",
    description: "Software development, engineering, and tech leadership",
    isActive: true,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat-2",
    name: "Business",
    description: "Entrepreneurship, strategy, and business development",
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat-3",
    name: "Design",
    description: "UX/UI, product design, and creative direction",
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat-4",
    name: "Marketing",
    description: "Digital marketing, growth, and brand strategy",
    isActive: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useMentorStore = create<MentorStore>((set, get) => ({
  mentors: [],
  categories: DEFAULT_CATEGORIES,
  filters: DEFAULT_FILTERS,

  setMentors: (mentors) => set({ mentors }),

  addMentor: (mentor) =>
    set((state) => ({
      mentors: [...state.mentors, mentor],
    })),

  updateMentor: (id, updates) =>
    set((state) => ({
      mentors: state.mentors.map((m) =>
        m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
      ),
    })),

  deleteMentor: (id) =>
    set((state) => ({
      mentors: state.mentors.filter((m) => m.id !== id),
    })),

  approveMentor: (id) =>
    set((state) => ({
      mentors: state.mentors.map((m) =>
        m.id === id ? { ...m, status: "approved" as MentorStatus, isActive: true } : m
      ),
    })),

  rejectMentor: (id) =>
    set((state) => ({
      mentors: state.mentors.map((m) =>
        m.id === id ? { ...m, status: "rejected" as MentorStatus, isActive: false } : m
      ),
    })),

  toggleActive: (id) =>
    set((state) => ({
      mentors: state.mentors.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m)),
    })),

  toggleFeatured: (id) =>
    set((state) => ({
      mentors: state.mentors.map((m) => (m.id === id ? { ...m, isFeatured: !m.isFeatured } : m)),
    })),

  toggleTrending: (id) =>
    set((state) => ({
      mentors: state.mentors.map((m) => (m.id === id ? { ...m, isTrending: !m.isTrending } : m)),
    })),

  setCategories: (categories) => set({ categories }),

  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),

  updateCategory: (id, updates) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      ),
    })),

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),

  toggleCategoryStatus: (id) =>
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  getFilteredMentors: () => {
    const { mentors, filters } = get();
    let filtered = [...mentors];

    if (filters.status !== "all") {
      filtered = filtered.filter((m) => m.status === filters.status);
    }

    if (filters.source !== "all") {
      filtered = filtered.filter((m) => m.source === filters.source);
    }

    if (filters.categoryId) {
      filtered = filtered.filter((m) => m.categoryId === filters.categoryId);
    }

    if (filters.featured !== undefined) {
      filtered = filtered.filter((m) => m.isFeatured === filters.featured);
    }

    if (filters.trending !== undefined) {
      filtered = filtered.filter((m) => m.isTrending === filters.trending);
    }

    if (filters.searchQuery?.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.title.toLowerCase().includes(query) ||
          m.bio.toLowerCase().includes(query) ||
          m.expertise.some((e) => e.toLowerCase().includes(query))
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getPendingCount: () => {
    const { mentors } = get();
    return mentors.filter((m) => m.status === "pending").length;
  },

  getAdminMentorsCount: () => {
    const { mentors } = get();
    return mentors.filter((m) => m.source === "admin").length;
  },

  getUserMentorsCount: () => {
    const { mentors } = get();
    return mentors.filter((m) => m.source === "user").length;
  },

  getFeaturedMentors: () => {
    const { mentors } = get();
    return mentors.filter((m) => m.isFeatured && m.isActive && m.status === "approved");
  },

  getTrendingMentors: () => {
    const { mentors } = get();
    return mentors.filter((m) => m.isTrending && m.isActive && m.status === "approved");
  },
}));
