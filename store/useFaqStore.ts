import { create } from "zustand";
import { FaqItem, FaqCategory, FaqFilters, FaqLayoutType } from "@/types/faq-types";

interface FaqStore {
  // State
  faqs: FaqItem[];
  categories: FaqCategory[];
  selectedFaq: FaqItem | null;
  selectedCategory: FaqCategory | null;
  filters: FaqFilters;
  selectedLayout: FaqLayoutType;
  isLoading: boolean;

  // FAQ Actions
  setFaqs: (faqs: FaqItem[]) => void;
  addFaq: (faq: FaqItem) => void;
  updateFaq: (id: string, updates: Partial<FaqItem>) => void;
  deleteFaq: (id: string) => void;
  selectFaq: (faq: FaqItem | null) => void;
  toggleFaqStatus: (id: string) => void;
  reorderFaqs: (categoryId: string, orderedIds: string[]) => void;

  // Category Actions
  setCategories: (categories: FaqCategory[]) => void;
  addCategory: (category: FaqCategory) => void;
  updateCategory: (id: string, updates: Partial<FaqCategory>) => void;
  deleteCategory: (id: string) => void;
  selectCategory: (category: FaqCategory | null) => void;
  toggleCategoryStatus: (id: string) => void;
  reorderCategories: (orderedIds: string[]) => void;

  // Filter & Layout Actions
  setFilters: (filters: Partial<FaqFilters>) => void;
  resetFilters: () => void;
  setLayout: (layout: FaqLayoutType) => void;
  setLoading: (loading: boolean) => void;

  // Computed
  getFilteredFaqs: () => FaqItem[];
  getFaqsByCategory: (categoryId: string) => FaqItem[];
  getActiveCount: () => number;
  getInactiveCount: () => number;
}

const DEFAULT_FILTERS: FaqFilters = {
  status: "all",
  categoryId: undefined,
  searchQuery: "",
};

export const useFaqStore = create<FaqStore>((set, get) => ({
  // Initial State
  faqs: [],
  categories: [],
  selectedFaq: null,
  selectedCategory: null,
  filters: DEFAULT_FILTERS,
  selectedLayout: "accordion",
  isLoading: false,

  // FAQ Actions
  setFaqs: (faqs) => set({ faqs }),

  addFaq: (faq) =>
    set((state) => ({
      faqs: [...state.faqs, faq],
    })),

  updateFaq: (id, updates) =>
    set((state) => ({
      faqs: state.faqs.map((faq) =>
        faq.id === id ? { ...faq, ...updates, updatedAt: new Date().toISOString() } : faq
      ),
      selectedFaq:
        state.selectedFaq?.id === id
          ? { ...state.selectedFaq, ...updates, updatedAt: new Date().toISOString() }
          : state.selectedFaq,
    })),

  deleteFaq: (id) =>
    set((state) => ({
      faqs: state.faqs.filter((faq) => faq.id !== id),
      selectedFaq: state.selectedFaq?.id === id ? null : state.selectedFaq,
    })),

  selectFaq: (faq) => set({ selectedFaq: faq }),

  toggleFaqStatus: (id) =>
    set((state) => ({
      faqs: state.faqs.map((faq) =>
        faq.id === id
          ? { ...faq, isActive: !faq.isActive, updatedAt: new Date().toISOString() }
          : faq
      ),
    })),

  reorderFaqs: (categoryId, orderedIds) =>
    set((state) => ({
      faqs: state.faqs.map((faq) => {
        if (faq.categoryId === categoryId) {
          const newOrder = orderedIds.indexOf(faq.id);
          return newOrder >= 0 ? { ...faq, order: newOrder } : faq;
        }
        return faq;
      }),
    })),

  // Category Actions
  setCategories: (categories) => set({ categories }),

  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),

  updateCategory: (id, updates) =>
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === id ? { ...cat, ...updates, updatedAt: new Date().toISOString() } : cat
      ),
      selectedCategory:
        state.selectedCategory?.id === id
          ? { ...state.selectedCategory, ...updates, updatedAt: new Date().toISOString() }
          : state.selectedCategory,
    })),

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((cat) => cat.id !== id),
      selectedCategory: state.selectedCategory?.id === id ? null : state.selectedCategory,
      // Also remove FAQs in this category
      faqs: state.faqs.filter((faq) => faq.categoryId !== id),
    })),

  selectCategory: (category) => set({ selectedCategory: category }),

  toggleCategoryStatus: (id) =>
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === id
          ? { ...cat, isActive: !cat.isActive, updatedAt: new Date().toISOString() }
          : cat
      ),
    })),

  reorderCategories: (orderedIds) =>
    set((state) => ({
      categories: state.categories.map((cat) => {
        const newOrder = orderedIds.indexOf(cat.id);
        return newOrder >= 0 ? { ...cat, order: newOrder } : cat;
      }),
    })),

  // Filter & Layout Actions
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  setLayout: (layout) => set({ selectedLayout: layout }),

  setLoading: (loading) => set({ isLoading: loading }),

  // Computed Properties
  getFilteredFaqs: () => {
    const { faqs, filters } = get();
    let filtered = [...faqs];

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((faq) => faq.isActive === (filters.status === "active"));
    }

    // Filter by category
    if (filters.categoryId) {
      filtered = filtered.filter((faq) => faq.categoryId === filters.categoryId);
    }

    // Filter by search query
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query) ||
          faq.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort by order
    filtered.sort((a, b) => a.order - b.order);

    return filtered;
  },

  getFaqsByCategory: (categoryId) => {
    const { faqs } = get();
    return faqs.filter((faq) => faq.categoryId === categoryId).sort((a, b) => a.order - b.order);
  },

  getActiveCount: () => {
    const { faqs } = get();
    return faqs.filter((faq) => faq.isActive).length;
  },

  getInactiveCount: () => {
    const { faqs } = get();
    return faqs.filter((faq) => !faq.isActive).length;
  },
}));
