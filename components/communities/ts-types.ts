import { verification } from "../../screen/user/ts-types";

export type FormValues = {
  title: string;
  privacy: string;
  description: string;
  communityType: string;
  joiningTerms: string;
  requireAdminApprovalForPosts: boolean;
  allowMemberInvites: boolean;
  enableEvents: boolean;
  enableRatings: boolean;
};

export type CommunityStatus =
  | "ALL"
  | "APPROVED"
  | "PENDING"
  | "REJECTED"
  | "DISABLED"
  | "ENABLED"
  | "PAUSED";

export type communitiesForumStatus = {
  status: CommunityStatus;
};

export interface communityEntity {
  addedBy: string; // e.g., "ENTITY"
  allowMemberInvites: boolean;
  enableEvents: boolean;
  enableRatingsAndReviews: boolean;
  requireAdminApprovalForPosts: boolean;
  allowMemberPosts: boolean;
  categories: string[]; // assuming categories are string values
  cover: string;
  createdAt: string; // timestamp as string
  description: string;

  id: string; // UUID
  interests: string[]; // assuming interests are string values
  isApproved: boolean;
  isFeatured: boolean;
  location: string | null;
  numberOfLikes: number;
  numberOfPost: number;
  numberOfUser: number;
  numberOfViews: number;
  status: CommunityStatus; // update if there are more statuses
  // update if there are more statuses
  tag: string[]; // assuming tags are strings
  theme: string | null;
  title: string;
  updatedAt: string; // timestamp as string
  privacy: string;
  communityType: string;
  joiningTerms: string;
  rules: string;
  verification: verification;
  tagline: string;
}

export interface requests {
  id: string;
  notes: string;
  createdAt: string; // or `Date` if it's a Date object
  user: {
    avatar: string;
    about: {
      currentPosition: string;
    };
    firstName: string;
    lastName: string;
  };
}
