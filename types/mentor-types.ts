export type MentorStatus = "pending" | "approved" | "rejected" | "inactive";
export type MentorSource = "admin" | "user";

export interface Mentor {
  id: string;
  name: string;
  title: string; // e.g., "Senior Software Engineer", "Product Designer"
  bio: string;
  image?: string;
  
  // Contact
  email: string;
  linkedin?: string;
  website?: string;
  
  // Category and Expertise
  categoryId: string;
  categoryName?: string;
  expertise: string[]; // Array of expertise areas
  yearsOfExperience?: number;
  
  // Availability
  availability?: string; // e.g., "Available", "Busy", "On Holiday"
  
  // Flags
  isFeatured: boolean;
  isTrending: boolean;
  isActive: boolean;
  
  // Meta
  status: MentorStatus;
  source: MentorSource;
  addedBy: string; // User ID or "admin"
  
  createdAt: string;
  updatedAt: string;
}

export interface MentorCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface MentorFilters {
  status: "all" | MentorStatus;
  source: "all" | MentorSource;
  categoryId?: string;
  searchQuery?: string;
  featured?: boolean;
  trending?: boolean;
}

export interface MentorSettings {
  acceptMentorRequests: boolean;
  autoApproveMentors: boolean;
  termsAndConditions: string;
  submissionGuidelines: string;
}

export interface CreateMentorInput {
  name: string;
  title: string;
  bio: string;
  image?: string;
  email: string;
  linkedin?: string;
  website?: string;
  categoryId: string;
  expertise: string[];
  yearsOfExperience?: number;
  availability?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  source: MentorSource;
}
