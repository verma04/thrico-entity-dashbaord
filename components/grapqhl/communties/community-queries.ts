"use client";
/**
 * Community Queries and Query Hooks
 *
 * This file contains all GraphQL queries related to communities and their associated hooks.
 * It includes queries for fetching communities, community details, stats, and other read operations.
 */
import { useMutation, useQuery, QueryHookOptions } from "@apollo/client/react";
import { gql } from "@apollo/client";

import { GROUP_DETAILS_FRAGMENT, COMMUNITY_FEED_FRAGMENT } from "./fragments";
import {
  GetCommunitiesInput,
  GetCommunitiesResponse,
  GroupDetails,
  CommunityStats,
  CommunityFilters,
  SearchCommunitiesInput,
  InputId,
  TotalMember,
  GetCommunityAboutByIdResponse,
  GetCommunityMembersInput,
  GetCommunityMembersWithRolesResponse,
  GetPendingJoinRequestsInput,
  GetPendingJoinRequestsCountInput,
  GetPendingJoinRequestsResponse,
  inputGroupFeedPagination,
  GetCommunitiesFeedListResponse,
  CommunityFeed,
} from "./types";

// QUERIES
export const GET_ALL_COMMUNITIES = gql`
  query GetAllCommunities($input: inputGetCommunities) {
    getAllCommunities(input: $input) {
      communities {
        ...GroupDetailsFragment
      }
      pagination {
        currentPage
        totalPages
        totalCount
        limit
        hasNextPage
        hasPreviousPage
      }
    }
  }
  ${GROUP_DETAILS_FRAGMENT}
`;

export const GET_TRENDING_COMMUNITIES = gql`
  query GetTrendingCommunities($input: inputGetCommunities) {
    getTrendingCommunities(input: $input) {
      communities {
        ...GroupDetailsFragment
      }
      pagination {
        currentPage
        totalPages
        totalCount
        limit
        hasNextPage
        hasPreviousPage
      }
    }
  }
  ${GROUP_DETAILS_FRAGMENT}
`;

export const GET_FEATURED_COMMUNITIES = gql`
  query GetFeaturedCommunities {
    getFeaturedCommunities {
      ...GroupDetailsFragment
    }
  }
  ${GROUP_DETAILS_FRAGMENT}
`;

export const GET_WISHLIST_COMMUNITIES = gql`
  query GetWishlistCommunities($input: inputGetCommunities) {
    getWishlistCommunities(input: $input) {
      communities {
        ...GroupDetailsFragment
      }
      pagination {
        currentPage
        totalPages
        totalCount
        limit
        hasNextPage
        hasPreviousPage
      }
    }
  }
  ${GROUP_DETAILS_FRAGMENT}
`;

export const GET_MY_COMMUNITIES = gql`
  query GetMyCommunities($input: inputGetCommunities) {
    getMyCommunities(input: $input) {
      communities {
        ...GroupDetailsFragment
      }
      pagination {
        currentPage
        totalPages
        totalCount
        limit
        hasNextPage
        hasPreviousPage
      }
    }
  }
  ${GROUP_DETAILS_FRAGMENT}
`;

export const GET_SAVED_COMMUNITIES = gql`
  query GetSavedCommunities($input: inputGetCommunities) {
    getSavedCommunities(input: $input) {
      communities {
        ...GroupDetailsFragment
      }
      pagination {
        currentPage
        totalPages
        totalCount
        limit
        hasNextPage
        hasPreviousPage
      }
    }
  }
  ${GROUP_DETAILS_FRAGMENT}
`;

export const SEARCH_COMMUNITIES = gql`
  query SearchCommunities($input: searchCommunitiesInput!) {
    searchCommunities(input: $input) {
      communities {
        ...GroupDetailsFragment
      }
      pagination {
        currentPage
        totalPages
        totalCount
        limit
        hasNextPage
        hasPreviousPage
      }
    }
  }
  ${GROUP_DETAILS_FRAGMENT}
`;

export const GET_RECOMMENDED_COMMUNITIES = gql`
  query GetRecommendedCommunities($input: inputGetCommunities) {
    getRecommendedCommunities(input: $input) {
      communities {
        ...GroupDetailsFragment
      }
      pagination {
        currentPage
        totalPages
        totalCount
        limit
        hasNextPage
        hasPreviousPage
      }
    }
  }
  ${GROUP_DETAILS_FRAGMENT}
`;

export const GET_RECENTLY_VIEWED_COMMUNITIES = gql`
  query GetRecentlyViewedCommunities($input: inputGetCommunities) {
    getRecentlyViewedCommunities(input: $input) {
      communities {
        ...GroupDetailsFragment
      }
      pagination {
        currentPage
        totalPages
        totalCount
        limit
        hasNextPage
        hasPreviousPage
      }
    }
  }
  ${GROUP_DETAILS_FRAGMENT}
`;

export const GET_COMMUNITY_DETAILS = gql`
  query GetCommunityDetails($input: inputId!) {
    getCommunityDetails(input: $input) {
      id
      status
      isFeatured
      isWishList
      isTrending
      group {
        id
        title
        cover
        slug
        description
        privacy
        numberOfUser
        numberOfLikes
        numberOfPost
        createdAt
        updatedAt
        numberOfViews
        tag
        isFeatured
        location
        tagline
        isGroupMember
        isJoinRequest
        isGroupAdmin
        isTrending
        allowMemberInvites
        allowMemberPosts
        enableEvents
        enableRatingsAndReviews
      }
      groupSettings {
        groupType
        joiningCondition
        privacy
      }
      groupStatus
      role
      rank
      trendingScore
      isGroupMember
      isJoinRequest
      isGroupAdmin
      isGroupManager
      members {
        id
        avatar
      }
      creator {
        id
        avatar
        firstName
        lastName
      }
    }
  }
`;

export const GET_COMMUNITY_STATS = gql`
  query GetCommunityStats($input: inputId!) {
    getCommunityStats(input: $input) {
      totalMembers
      totalPosts
      totalLikes
      totalViews
      postsToday
      newMembersThisWeek
    }
  }
`;

export const GET_COMMUNITY_FILTERS = gql`
  query GetCommunityFilters {
    getCommunityFilters {
      categories
      interests
      communityTypes
      privacyOptions
    }
  }
`;

export const GET_COMMUNITY_MEMBERS = gql`
  query GetCommunityMembers($input: inputId!) {
    getCommunitiesMember(input: $input) {
      total
      members {
        id
        avatar
        name
      }
    }
  }
`;

export const GET_COMMUNITY_MEMBERS_WITH_ROLES = gql`
  query Members($input: getCommunityMembersInput) {
    getCommunityMembersWithRoles(input: $input) {
      members {
        id
        userId
        role
        joinedAt
        isActive
        lastActivityAt
        user {
          id
          firstName
          lastName
          fullName
          avatar
        }
      }
      pagination {
        currentPage
        totalPages
        totalCount
        limit
        hasNextPage
        hasPreviousPage
      }
      roleStatistics {
        ADMIN
        MANAGER
        MODERATOR
        USER
        total
      }
      permissions {
        isCurrentUserAdmin
        currentUserRole
        canInviteMembers
        canManageRoles
        canRemoveMembers
      }
    }
  }
`;

export const GET_PENDING_JOIN_REQUESTS = gql`
  query GetPendingJoinRequests($input: getPendingJoinRequestsInput!) {
    getPendingJoinRequests(input: $input) {
      requests {
        userId
        notes
        requestedAt
        user {
          avatar
          firstName
          lastName
          id
        }
        id
      }
      pagination {
        currentPage
        totalPages
        totalCount
        limit
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_PENDING_JOIN_REQUESTS_COUNT = gql`
  query GetPendingJoinRequestsCount($input: getPendingJoinRequestsCountInput!) {
    getPendingJoinRequestsCount(input: $input) {
      count
      groupId
    }
  }
`;

export const GET_COMMUNITY_ABOUT_BY_ID = gql`
  query GetCommunityAboutById($input: inputId) {
    getCommunityAboutById(input: $input) {
      adminInfo {
        id
        groupId
        groupType
        joiningCondition
        privacy
      }
      rules
      postRatingSummary {
        groupId
        totalRatings
        averageRating
        totalVerifiedRatings
        averageVerifiedRating
        oneStar
        twoStar
        threeStar
        fourStar
        fiveStar
        verifiedOneStar
        verifiedTwoStar
        verifiedThreeStar
        verifiedFourStar
        verifiedFiveStar
        lastUpdated
      }

      communityDetails {
        admin {
          id
          avatar
          firstName
          lastName
        }
        allowMemberInvites
        allowMemberPosts
        communityType
        totalRatings
        total
        title
        theme
        addedBy
        categories
        cover
        createdAt
        creator
        description
        enableEvents
        enableRatingsAndReviews
        entity
        id
        interests
        isApproved
        isFeatured
        isGroupAdmin
        isGroupMember
        isJoinRequest
        isTrending
        joiningTerms
        location
        numberOfLikes
        numberOfPost
        numberOfUser
        numberOfViews
        overallRating
        privacy
        requireAdminApprovalForPosts
        rules
        slug
        status
        tag
        tagline
        totalVerifiedRatings
        updatedAt
        verifiedRating
      }
    }
  }
`;

export const GET_COMMUNITY_ANALYTICS = gql`
  query GetCommunityAnalytics($input: inputId) {
    getCommunityAnalytics(input: $input) {
      totalMembers
      activeUsers
      postsThisMonth
      eventsCreated
      recentActivity
    }
  }
`;

export const GET_COMMUNITIES_FEED_LIST = gql`
  query GetCommunitiesFeedList(
    $getCommunitiesFeedListId: ID!
    $input: FeedCursorInput
  ) {
    getCommunitiesFeedList(id: $getCommunitiesFeedListId, input: $input) {
      edges {
        cursor
        node {
          isLiked
          id
          description
          user {
            firstName
            lastName
            avatar
            id
          }
          createdAt
          totalComment
          totalReactions
          totalReShare
          isWishList
          isOwner
          source
          media
          privacy
          repostId
          addedBy
          videoUrl
          thumbnailUrl
          status
          isPinned
          pinnedAt
          permissions {
            canEdit
            canDelete
            canPin
            canModerate
            canReport
          }
          communityFeedData {
            status
            priority
            isPinned
          }
          surveyId
          communityfeedId
          momentId
          reactionType
          isAiContent
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
      hasPinnedPost
    }
  }
`;

export const GET_PENDING_FEED_COMMUNITIES = gql`
  query GetPendingFeedCommunities($input: inputGroupFeedPagination) {
    getPendingFeedCommunities(input: $input) {
      feeds {
        ...CommunityFeedFragment
      }
      pagination {
        hasMore
        limit
        offset
        total
      }
    }
  }
  ${COMMUNITY_FEED_FRAGMENT}
`;

export const GET_ALL_PINNED_FEEDS = gql`
  query GetAllPinnedFeeds($input: inputGroupFeedPagination) {
    getAllPinnedFeeds(input: $input) {
      feeds {
        ...CommunityFeedFragment
      }
      pagination {
        hasMore
        limit
        offset
        total
      }
    }
  }
  ${COMMUNITY_FEED_FRAGMENT}
`;

export const GET_COMMUNITY_FEED_STATS = gql`
  query GetCommunityFeedStats($input: inputId) {
    getCommunityFeedStats(input: $input) {
      totalFeeds
      pinnedFeeds
      pendingFeeds
      approvedFeeds
      rejectedFeeds
      flaggedFeeds
      reportedFeeds
      recentFeeds
      criticallyReportedFeeds
      feedsByType
      feedsByPriority
    }
  }
`;

export const QUERY_TRACK_COMMUNITY_VIEW = gql`
  query QueryTrackCommunityView($input: inputId) {
    trackCommunityView(input: $input)
  }
`;

export const GET_COMMUNITY_REPORT_REASONS = gql`
  query GetCommunityReportReasons {
    getCommunityReportReasons {
      value
      label
    }
  }
`;

export const GET_COMMUNITY_MEMBER_STATS = gql`
  query GetCommunityMemberStats($input: GetCommunityMemberStatsInput!) {
    getCommunityMemberStats(input: $input) {
      memberId
      communityId
      stats {
        totalPosts
        approvedPosts
        pendingPosts
        rejectedPosts
        pinnedPosts
        reportedPosts
        totalLikes
        totalComments
        totalShares
        totalViews
        joinedAt
        lastActive
        membershipDuration
        rank
        badges
        postsByType
        engagementScore
      }

      role
    }
  }
`;

// Type for analytics response
export interface CommunityAnalytics {
  totalMembers: number;
  activeUsers: number;
  postsThisMonth: number;
  eventsCreated: number;
  recentActivity: string;
}

// Type for community feed stats response
export interface CommunityFeedStats {
  totalFeeds: number;
  pinnedFeeds: number;
  pendingFeeds: number;
  approvedFeeds: number;
  rejectedFeeds: number;
  flaggedFeeds: number;
  reportedFeeds: number;
  recentFeeds: number;
  criticallyReportedFeeds: number;
  feedsByType: any; // Define more specific type if needed
  feedsByPriority: any; // Define more specific type if needed
}

// Type for community report reason
export interface CommunityReportReason {
  value: string;
  label: string;
}

// Type for community member stats
export interface CommunityMemberStats {
  totalPosts: number;
  approvedPosts: number;
  pendingPosts: number;
  rejectedPosts: number;
  pinnedPosts: number;
  reportedPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalViews: number;
  joinedAt: string;
  lastActive: string;
  membershipDuration: number;
  rank: number;
  badges: string[];
  postsByType: any; // Define more specific type if needed
  engagementScore: number;
}

export interface GetCommunityMemberStatsResponse {
  getCommunityMemberStats: {
    memberId: string;
    communityId: string;
    stats: CommunityMemberStats;
    canViewPrivateStats: boolean;
    role: string;
  };
}

export interface GetCommunityMemberStatsInput {
  memberId: string;
  communityId: string;
}

// QUERY HOOKS

export const useGetAllCommunities = (
  options?: QueryHookOptions<
    GetCommunitiesResponse,
    { input: GetCommunitiesInput }
  >,
) => {
  return useQuery<GetCommunitiesResponse, { input: GetCommunitiesInput }>(
    GET_ALL_COMMUNITIES,
    options,
  );
};

export const useGetTrendingCommunities = (
  options?: QueryHookOptions<
    GetCommunitiesResponse,
    { input: GetCommunitiesInput }
  >,
) => {
  return useQuery<GetCommunitiesResponse, { input: GetCommunitiesInput }>(
    GET_TRENDING_COMMUNITIES,
    options,
  );
};

export const useGetFeaturedCommunities = (
  options?: QueryHookOptions<{ getFeaturedCommunities: GroupDetails[] }>,
) => {
  return useQuery<{ getFeaturedCommunities: GroupDetails[] }>(
    GET_FEATURED_COMMUNITIES,
    options,
  );
};

export const useGetWishlistCommunities = (
  options?: QueryHookOptions<
    GetCommunitiesResponse,
    { input: GetCommunitiesInput }
  >,
) => {
  return useQuery<GetCommunitiesResponse, { input: GetCommunitiesInput }>(
    GET_WISHLIST_COMMUNITIES,
    options,
  );
};

export const useGetMyCommunities = (
  options?: QueryHookOptions<
    GetCommunitiesResponse,
    { input: GetCommunitiesInput }
  >,
) => {
  return useQuery<GetCommunitiesResponse, { input: GetCommunitiesInput }>(
    GET_MY_COMMUNITIES,
    options,
  );
};

export const useGetSavedCommunities = (
  options?: QueryHookOptions<
    GetCommunitiesResponse,
    { input: GetCommunitiesInput }
  >,
) => {
  return useQuery<GetCommunitiesResponse, { input: GetCommunitiesInput }>(
    GET_SAVED_COMMUNITIES,
    options,
  );
};

export const useSearchCommunities = (
  options?: QueryHookOptions<
    GetCommunitiesResponse,
    { input: SearchCommunitiesInput }
  >,
) => {
  return useQuery<GetCommunitiesResponse, { input: SearchCommunitiesInput }>(
    SEARCH_COMMUNITIES,
    options,
  );
};

export const useGetRecommendedCommunities = (
  options?: QueryHookOptions<
    GetCommunitiesResponse,
    { input: GetCommunitiesInput }
  >,
) => {
  return useQuery<GetCommunitiesResponse, { input: GetCommunitiesInput }>(
    GET_RECOMMENDED_COMMUNITIES,
    options,
  );
};

export const useGetRecentlyViewedCommunities = (
  options?: QueryHookOptions<
    GetCommunitiesResponse,
    { input: GetCommunitiesInput }
  >,
) => {
  return useQuery<GetCommunitiesResponse, { input: GetCommunitiesInput }>(
    GET_RECENTLY_VIEWED_COMMUNITIES,
    options,
  );
};

export const useGetCommunityDetails = (
  options?: QueryHookOptions<
    { getCommunityDetails: GroupDetails },
    { input: InputId }
  >,
) => {
  return useQuery<{ getCommunityDetails: GroupDetails }, { input: InputId }>(
    GET_COMMUNITY_DETAILS,
    options,
  );
};

export const useGetCommunityStats = (
  options?: QueryHookOptions<
    { getCommunityStats: CommunityStats },
    { input: InputId }
  >,
) => {
  return useQuery<{ getCommunityStats: CommunityStats }, { input: InputId }>(
    GET_COMMUNITY_STATS,
    options,
  );
};

export const useGetCommunityFilters = (
  options?: QueryHookOptions<{ getCommunityFilters: CommunityFilters }>,
) => {
  return useQuery<{ getCommunityFilters: CommunityFilters }>(
    GET_COMMUNITY_FILTERS,
    options,
  );
};

export const useGetCommunityMembers = (
  options?: QueryHookOptions<
    { getCommunitiesMember: TotalMember },
    { input: InputId }
  >,
) => {
  return useQuery<{ getCommunitiesMember: TotalMember }, { input: InputId }>(
    GET_COMMUNITY_MEMBERS,
    options,
  );
};

export const useGetCommunityMembersWithRoles = (
  options?: QueryHookOptions<
    GetCommunityMembersWithRolesResponse,
    { input: GetCommunityMembersInput }
  >,
) => {
  return useQuery<
    GetCommunityMembersWithRolesResponse,
    { input: GetCommunityMembersInput }
  >(GET_COMMUNITY_MEMBERS_WITH_ROLES, options);
};

export const useGetPendingJoinRequests = (
  options?: QueryHookOptions<
    GetPendingJoinRequestsResponse,
    { input: GetPendingJoinRequestsInput }
  >,
) => {
  return useQuery<
    GetPendingJoinRequestsResponse,
    { input: GetPendingJoinRequestsInput }
  >(GET_PENDING_JOIN_REQUESTS, options);
};

export const useGetPendingJoinRequestsCount = (
  options?: QueryHookOptions<
    { getPendingJoinRequestsCount: { count: number; groupId: string } },
    { input: GetPendingJoinRequestsCountInput }
  >,
) => {
  return useQuery<
    { getPendingJoinRequestsCount: { count: number; groupId: string } },
    { input: GetPendingJoinRequestsCountInput }
  >(GET_PENDING_JOIN_REQUESTS_COUNT, options);
};

export const useGetCommunityAboutById = (
  options?: QueryHookOptions<GetCommunityAboutByIdResponse, { input: InputId }>,
) => {
  return useQuery<GetCommunityAboutByIdResponse, { input: InputId }>(
    GET_COMMUNITY_ABOUT_BY_ID,
    options,
  );
};

export const useGetCommunitiesFeedList = (
  options?: QueryHookOptions<
    GetCommunitiesFeedListResponse,
    { input: inputGroupFeedPagination }
  >,
) => {
  return useQuery<
    GetCommunitiesFeedListResponse,
    { input: inputGroupFeedPagination }
  >(GET_COMMUNITIES_FEED_LIST, options);
};

export const useGetCommunityAnalytics = (
  options?: QueryHookOptions<
    { getCommunityAnalytics: CommunityAnalytics },
    { input: InputId }
  >,
) => {
  return useQuery<
    { getCommunityAnalytics: CommunityAnalytics },
    { input: InputId }
  >(GET_COMMUNITY_ANALYTICS, options);
};

// Fixed: useGetPendingFeedCommunities should be a query hook, not mutation
export const useGetPendingFeedCommunities = (
  options?: QueryHookOptions<
    { getPendingFeedCommunities: { feeds: CommunityFeed[]; pagination: any } },
    { input: inputGroupFeedPagination }
  >,
) => {
  return useQuery<
    { getPendingFeedCommunities: { feeds: CommunityFeed[]; pagination: any } },
    { input: inputGroupFeedPagination }
  >(GET_PENDING_FEED_COMMUNITIES, options);
};

export const useGetAllPinnedFeeds = (
  options?: QueryHookOptions<
    { getAllPinnedFeeds: { feeds: CommunityFeed[]; pagination: any } },
    { input: inputGroupFeedPagination }
  >,
) => {
  return useQuery<
    { getAllPinnedFeeds: { feeds: CommunityFeed[]; pagination: any } },
    { input: inputGroupFeedPagination }
  >(GET_ALL_PINNED_FEEDS, options);
};

export const useQueryTrackCommunityView = (
  options?: QueryHookOptions<
    { trackCommunityView: boolean },
    { input: InputId }
  >,
) => {
  return useQuery<{ trackCommunityView: boolean }, { input: InputId }>(
    QUERY_TRACK_COMMUNITY_VIEW,
    options,
  );
};

export const useGetCommunityFeedStats = (
  options?: QueryHookOptions<
    { getCommunityFeedStats: CommunityFeedStats },
    { input: InputId }
  >,
) => {
  return useQuery<
    { getCommunityFeedStats: CommunityFeedStats },
    { input: InputId }
  >(GET_COMMUNITY_FEED_STATS, options);
};

export const useGetCommunityReportReasons = (
  options?: QueryHookOptions<{
    getCommunityReportReasons: CommunityReportReason[];
  }>,
) => {
  return useQuery<{ getCommunityReportReasons: CommunityReportReason[] }>(
    GET_COMMUNITY_REPORT_REASONS,
    options,
  );
};

export const useGetCommunityMemberStats = (
  options?: QueryHookOptions<
    GetCommunityMemberStatsResponse,
    { input: GetCommunityMemberStatsInput }
  >,
) => {
  return useQuery<
    GetCommunityMemberStatsResponse,
    { input: GetCommunityMemberStatsInput }
  >(GET_COMMUNITY_MEMBER_STATS, options);
};

export const GET_TOP_COMMUNITIES = gql`
  query GetTopCommunities($limit: Int) {
    getTopCommunities(limit: $limit) {
      title
      cover
      tagline
      description
      numberOfViews
      numberOfPost
      numberOfLikes
      overallRating
    }
  }
`;

export interface TopCommunityItem {
  title: string;
  cover?: string;
  tagline?: string;
  description?: string;
  numberOfViews?: number;
  numberOfPost?: number;
  numberOfLikes?: number;
  overallRating?: number;
}

export const useGetTopCommunities = (
  options?: QueryHookOptions<
    { getTopCommunities: TopCommunityItem[] },
    { limit?: number }
  >,
) => {
  return useQuery<
    { getTopCommunities: TopCommunityItem[] },
    { limit?: number }
  >(GET_TOP_COMMUNITIES, options);
};
export const GET_COMMUNITY_MEMBERS_WITH_STATS = gql`
  query GetCommunityMembersWithStats($input: GetCommunityMembersWithStatsInput!) {
    getCommunityMembersWithStats(input: $input) {
      members {
        id
        userId
        firstName
        lastName
        fullName
        avatar
        role
        joinedAt
        isOnline
        canViewPrivateStats
        stats {
          totalPosts
          approvedPosts
          pendingPosts
          rejectedPosts
          pinnedPosts
          reportedPosts
          totalLikes
          totalComments
          totalShares
          totalViews
          joinedAt
          lastActive
          membershipDuration
          rank
          badges
          engagementScore
        }
      }
      pagination {
        currentPage
        totalPages
        totalCount
        limit
        hasNextPage
        hasPreviousPage
        nextCursor
        endCursor
      }
    }
  }
`;

export interface GetCommunityMembersWithStatsInput {
  communityId: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  role?: string;
  searchTerm?: string;
}

export interface CommunityMembersWithStatsResponse {
  getCommunityMembersWithStats: {
    members: any[];
    pagination: any;
  };
}

export const useGetCommunityMembersWithStats = (
  options?: QueryHookOptions<
    CommunityMembersWithStatsResponse,
    { input: GetCommunityMembersWithStatsInput }
  >,
) => {
  return useQuery<
    CommunityMembersWithStatsResponse,
    { input: GetCommunityMembersWithStatsInput }
  >(GET_COMMUNITY_MEMBERS_WITH_STATS, options);
};
