export interface discussionCategory {
  id?: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  slug?: string;
}

export type discussionForumStatus =
  | "ALL"
  | "APPROVED"
  | "PENDING"
  | "REJECTED"
  | "DISABLED"
  | "ENABLED"
  | "REAPPROVE";

interface Category {
  id: string;
  name: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

interface Verification {
  isVerifiedAt: string | null; // ISO date string or null if not verified
  isVerified: boolean;
  verificationReason: string | null;
}

export interface discussionForm {
  id: string;
  title: string;
  content: string;
  category: Category;
  upVotes: number;
  downVotes: number;
  status: discussionForumStatus;
  approvedReason: string | null;
  isAnonymous: boolean;
  addedBy: string;
  user: User | null; // null if anonymous or user removed
  verification: Verification | null;
  createdAt: string;
  updatedAt: string;
  voteType: voteType;
  isLikeByYou: Boolean;
}

export type CommentedBy = "USER" | "ENTITY";
export type voteType = "UPVOTE" | "DOWNVOTE" | null;
export interface CommentUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  cover: string;
  isOnline: boolean;
}

export interface formComment {
  id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  slug: string;
  content: string;
  commentedBy: CommentedBy;
  user: CommentUser | null; // null if commentedBy is ENTITY
}

export interface PostEngagement {
  upVotes: number;
  downVotes: number;
  isLikedByYou: boolean;
  voteType: voteType; // or string if there are more types
  totalComments: number;
}
