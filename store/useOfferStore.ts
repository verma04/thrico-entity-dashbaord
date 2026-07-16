import { create } from "zustand";
import { Offer, OfferCategory, OfferFilters, OfferStatus } from "@/types/offer-types";

interface OfferStore {
  offers: Offer[];
  categories: OfferCategory[];
  filters: OfferFilters;

  // Actions
  setOffers: (offers: Offer[]) => void;
  addOffer: (offer: Offer) => void;
  updateOffer: (id: string, updates: Partial<Offer>) => void;
  deleteOffer: (id: string) => void;
  approveOffer: (id: string) => void;
  rejectOffer: (id: string) => void;
  toggleActive: (id: string) => void;
  toggleFeatured: (id: string) => void;
  toggleTrending: (id: string) => void;
  
  // Categories
  setCategories: (categories: OfferCategory[]) => void;
  addCategory: (category: OfferCategory) => void;
  updateCategory: (id: string, updates: Partial<OfferCategory>) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryStatus: (id: string) => void;
  
  // Filters
  setFilters: (filters: Partial<OfferFilters>) => void;
  resetFilters: () => void;

  // Computed
  getFilteredOffers: () => Offer[];
  getPendingCount: () => number;
  getAdminOffersCount: () => number;
  getUserOffersCount: () => number;
  getFeaturedOffers: () => Offer[];
  getTrendingOffers: () => Offer[];
}

const DEFAULT_FILTERS: OfferFilters = {
  status: "all",
  source: "all",
  searchQuery: "",
};

const DEFAULT_CATEGORIES: OfferCategory[] = [
  {
    id: "cat-1",
    name: "Food & Dining",
    description: "Restaurant deals and food offers",
    isActive: true,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat-2",
    name: "Shopping",
    description: "Retail and e-commerce deals",
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat-3",
    name: "Services",
    description: "Service-based offers",
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useOfferStore = create<OfferStore>((set, get) => ({
  offers: [],
  categories: DEFAULT_CATEGORIES,
  filters: DEFAULT_FILTERS,

  setOffers: (offers) => set({ offers }),

  addOffer: (offer) =>
    set((state) => ({
      offers: [...state.offers, offer],
    })),

  updateOffer: (id, updates) =>
    set((state) => ({
      offers: state.offers.map((o) =>
        o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o
      ),
    })),

  deleteOffer: (id) =>
    set((state) => ({
      offers: state.offers.filter((o) => o.id !== id),
    })),

  approveOffer: (id) =>
    set((state) => ({
      offers: state.offers.map((o) =>
        o.id === id ? { ...o, status: "approved" as OfferStatus, isActive: true } : o
      ),
    })),

  rejectOffer: (id) =>
    set((state) => ({
      offers: state.offers.map((o) =>
        o.id === id ? { ...o, status: "rejected" as OfferStatus, isActive: false } : o
      ),
    })),

  toggleActive: (id) =>
    set((state) => ({
      offers: state.offers.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o)),
    })),

  toggleFeatured: (id) =>
    set((state) => ({
      offers: state.offers.map((o) => (o.id === id ? { ...o, isFeatured: !o.isFeatured } : o)),
    })),

  toggleTrending: (id) =>
    set((state) => ({
      offers: state.offers.map((o) => (o.id === id ? { ...o, isTrending: !o.isTrending } : o)),
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

  getFilteredOffers: () => {
    const { offers, filters } = get();
    let filtered = [...offers];

    if (filters.status !== "all") {
      filtered = filtered.filter((o) => o.status === filters.status);
    }

    if (filters.source !== "all") {
      filtered = filtered.filter((o) => o.source === filters.source);
    }

    if (filters.categoryId) {
      filtered = filtered.filter((o) => o.categoryId === filters.categoryId);
    }

    if (filters.featured !== undefined) {
      filtered = filtered.filter((o) => o.isFeatured === filters.featured);
    }

    if (filters.trending !== undefined) {
      filtered = filtered.filter((o) => o.isTrending === filters.trending);
    }

    if (filters.searchQuery?.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.title.toLowerCase().includes(query) ||
          o.description.toLowerCase().includes(query) ||
          o.code?.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getPendingCount: () => {
    const { offers } = get();
    return offers.filter((o) => o.status === "pending").length;
  },

  getAdminOffersCount: () => {
    const { offers } = get();
    return offers.filter((o) => o.source === "admin").length;
  },

  getUserOffersCount: () => {
    const { offers } = get();
    return offers.filter((o) => o.source === "user").length;
  },

  getFeaturedOffers: () => {
    const { offers } = get();
    return offers.filter((o) => o.isFeatured && o.isActive && o.status === "approved");
  },

  getTrendingOffers: () => {
    const { offers } = get();
    return offers.filter((o) => o.isTrending && o.isActive && o.status === "approved");
  },
}));
