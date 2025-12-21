export type NewsStatus = "draft" | "published" | "archived";

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string; // Rich HTML content
  excerpt: string;
  author: string;
  authorId?: string;
  date: string; // ISO date string
  category: string;
  tags: string[];
  status: NewsStatus;
  featuredImage?: string;
  readTime: string; // e.g., "5 min read"
  featured: boolean; // Featured article flag
  createdAt: string;
  updatedAt: string;
}

export interface NewsFilters {
  status: NewsStatus | "all";
  category?: string;
  searchQuery?: string;
  sortBy: "newest" | "oldest" | "title-asc" | "title-desc";
}

export interface CreateNewsArticleInput {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  status: NewsStatus;
  featuredImage?: string;
  featured?: boolean;
}

export interface UpdateNewsArticleInput {
  id: string;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  author?: string;
  category?: string;
  tags?: string[];
  status?: NewsStatus;
  featuredImage?: string;
  featured?: boolean;
}
