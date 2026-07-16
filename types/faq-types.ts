export type FaqStatus = "active" | "inactive";
export type FaqLayoutType = "accordion" | "grid" | "tabs" | "two-column" | "nested";

export interface FaqCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string; // Rich HTML content
  categoryId: string;
  categoryName?: string; // Denormalized for easy display
  order: number;
  isActive: boolean;
  tags: string[];
  helpful: number; // Helpful count
  notHelpful: number; // Not helpful count
  createdAt: string;
  updatedAt: string;
}

export interface FaqFilters {
  categoryId?: string;
  status: "all" | FaqStatus;
  searchQuery?: string;
}

export interface CreateFaqInput {
  question: string;
  answer: string;
  categoryId: string;
  tags?: string[];
  isActive?: boolean;
}

export interface UpdateFaqInput {
  id: string;
  question?: string;
  answer?: string;
  categoryId?: string;
  tags?: string[];
  isActive?: boolean;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateCategoryInput {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}
