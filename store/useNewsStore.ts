import { create } from "zustand";
import { NewsArticle, NewsFilters, NewsStatus } from "@/types/news-types";

interface NewsStore {
  // State
  articles: NewsArticle[];
  categories: string[];
  selectedArticle: NewsArticle | null;
  filters: NewsFilters;
  isLoading: boolean;
  
  // Actions
  setArticles: (articles: NewsArticle[]) => void;
  addArticle: (article: NewsArticle) => void;
  updateArticle: (id: string, updates: Partial<NewsArticle>) => void;
  deleteArticle: (id: string) => void;
  selectArticle: (article: NewsArticle | null) => void;
  toggleStatus: (id: string, status: NewsStatus) => void;
  setFilters: (filters: Partial<NewsFilters>) => void;
  resetFilters: () => void;
  setCategories: (categories: string[]) => void;
  addCategory: (category: string) => void;
  setLoading: (loading: boolean) => void;
  
  // Computed
  getFilteredArticles: () => NewsArticle[];
  getDraftCount: () => number;
  getPublishedCount: () => number;
}

const DEFAULT_FILTERS: NewsFilters = {
  status: "all",
  category: undefined,
  searchQuery: "",
  sortBy: "newest",
};

export const useNewsStore = create<NewsStore>((set, get) => ({
  // Initial State
  articles: [],
  categories: ["General", "Technology", "Business", "Design"],
  selectedArticle: null,
  filters: DEFAULT_FILTERS,
  isLoading: false,

  // Actions
  setArticles: (articles) => set({ articles }),

  addArticle: (article) =>
    set((state) => ({
      articles: [article, ...state.articles],
    })),

  updateArticle: (id, updates) =>
    set((state) => ({
      articles: state.articles.map((article) =>
        article.id === id
          ? { ...article, ...updates, updatedAt: new Date().toISOString() }
          : article
      ),
      selectedArticle:
        state.selectedArticle?.id === id
          ? { ...state.selectedArticle, ...updates, updatedAt: new Date().toISOString() }
          : state.selectedArticle,
    })),

  deleteArticle: (id) =>
    set((state) => ({
      articles: state.articles.filter((article) => article.id !== id),
      selectedArticle: state.selectedArticle?.id === id ? null : state.selectedArticle,
    })),

  selectArticle: (article) => set({ selectedArticle: article }),

  toggleStatus: (id, status) =>
    set((state) => ({
      articles: state.articles.map((article) =>
        article.id === id
          ? { ...article, status, updatedAt: new Date().toISOString() }
          : article
      ),
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  setCategories: (categories) => set({ categories }),

  addCategory: (category) =>
    set((state) => ({
      categories: state.categories.includes(category)
        ? state.categories
        : [...state.categories, category],
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  // Computed Properties
  getFilteredArticles: () => {
    const { articles, filters } = get();
    let filtered = [...articles];

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((article) => article.status === filters.status);
    }

    // Filter by category
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((article) => article.category === filters.category);
    }

    // Filter by search query
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.author.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "title-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return filtered;
  },

  getDraftCount: () => {
    const { articles } = get();
    return articles.filter((article) => article.status === "draft").length;
  },

  getPublishedCount: () => {
    const { articles } = get();
    return articles.filter((article) => article.status === "published").length;
  },
}));
