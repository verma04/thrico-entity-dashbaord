export interface WallOfFameEntry {
  id: string;
  name: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  achievement?: string;
  year?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface WallOfFameFilters {
  category?: string;
  status: "all" | "active" | "inactive";
  searchQuery?: string;
  featured?: boolean;
}

export interface CreateEntryInput {
  name: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  achievement?: string;
  year?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  tags?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
}
