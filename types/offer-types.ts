export type OfferStatus = "pending" | "approved" | "rejected" | "expired";
export type OfferSource = "admin" | "user";

export interface Offer {
  id: string;
  title: string;
  description: string;
  image?: string;
  categoryId: string;
  categoryName?: string;
  discount?: string; // e.g., "20% OFF", "$50 OFF"
  code?: string; // Promo code
  validFrom: string;
  validTo: string;
  terms?: string;
  website?: string;
  
  // Flags
  isFeatured: boolean;
  isTrending: boolean;
  isActive: boolean;
  
  // Meta
  status: OfferStatus;
  source: OfferSource;
  addedBy: string; // User ID or "admin"
  
  createdAt: string;
  updatedAt: string;
}

export interface OfferCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface OfferFilters {
  status: "all" | OfferStatus;
  source: "all" | OfferSource;
  categoryId?: string;
  searchQuery?: string;
  featured?: boolean;
  trending?: boolean;
}

export interface OfferSettings {
  acceptUserSubmissions: boolean;
  autoApproveOffers: boolean;
  termsAndConditions: string;
  submissionGuidelines: string;
}

export interface CreateOfferInput {
  title: string;
  description: string;
  image?: string;
  categoryId: string;
  discount?: string;
  code?: string;
  validFrom: string;
  validTo: string;
  terms?: string;
  website?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  source: OfferSource;
}
