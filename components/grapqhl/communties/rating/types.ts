// ...existing code...

export interface GetRatingsInput {
  communityId: string;
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
  filterBy?: 'all' | 'verified' | 'unverified';
}

export interface CommunityRatingUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isOnline?: boolean;
  cover?: string;
  status?: string;
}

export interface CommunityRating {
  id: string;
  rating: number;
  review: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: string;
  updatedAt: string;
  user: CommunityRatingUser;
  currentUserVote?: number;
}

export interface RatingSummary {
  averageRating: number;
  fiveStar: number;
  fourStar: number;
  oneStar: number;
  threeStar: number;
  twoStar: number;
  totalRatings: number;
}

export interface RatingsMetadata {
  isCurrentUserAdmin: boolean;
  canAddRating: boolean;
  summary: RatingSummary;
  currentUserRating?: CommunityRating;
}

export interface RatingsPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetCommunityRatingsResponse {
  getCommunityRatings: {
    metadata: RatingsMetadata;
    ratings: CommunityRating[];
    pagination: RatingsPagination;
  };
}

export interface AddRatingInput {
  communityId: string;
  rating: number;
  review: string;
  title?: string;
}

export interface UpdateRatingInput {
  ratingId: string;
  rating?: number;
  review?: string;
  title?: string;
}

export interface VoteOnRatingInput {
  ratingId: string;
  voteType: 'helpful' | 'unhelpful';
}

export interface AddRatingResponse {
  addCommunityRating: CommunityRating;
}

export interface UpdateRatingResponse {
  updateCommunityRating: CommunityRating;
}

export interface VoteOnRatingResponse {
  voteOnRating: {
    success: boolean;
    helpfulCount: number;
    unhelpfulCount: number;
    currentUserVote: 'helpful' | 'unhelpful' | null;
  };
}

export interface DeleteCommunityRatingResponse {
  deleteCommunityRating: {
    status: boolean
  }
}