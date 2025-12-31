import { gql } from "@apollo/client";

const details = `
  id
  slug
  title
  addedBy
  privacy
  cover
  status
  isApproved
  description
  createdAt
  updatedAt
  isFeatured
  theme
  interests
  categories
  numberOfUser
  numberOfLikes
   tagline
  numberOfPost
  numberOfViews
  tag
  location
  communityType
  joiningTerms
  allowMemberInvites
  enableEvents
  enableRatingsAndReviews
  requireAdminApprovalForPosts
  allowMemberPosts
  rules
   verification {
      id
      isVerifiedAt
      isVerified
      verificationReason
    }
`;
export const ALL_GROUP = gql`
  query GetAllGroupStatus($input: allStatusInput) {
    getAllGroupStatus(input: $input) {
      id
      slug
      title
      creator
      entity
      cover
      status
      tagline
      about
      createdAt
      updatedAt
      verification {
        id
        isVerifiedAt
        isVerified
        verificationReason
      }
    }
  }
`;

export const ADD_FEATURED_GROUP = gql`
  mutation AddFeaturedGroup($input: [String]) {
    addFeaturedGroup(input: $input) {
      id
      slug
      title
      creator
    }
  }
`;

export const ADD_COMMUNITY = gql`
  mutation AddCommunity($input: CommunityEntityInput) {
    addCommunity(input: $input) {
   ${details}
    }
  }
`;

export const GET_COMMUNITIES = gql`
  query GetCommunities($input: InputGetCommunities!) {
    getCommunities(input: $input) {
      id
      title
      addedBy
      privacy
      cover
      status
      description
      createdAt
      updatedAt
      tagline
      location
      requireAdminApprovalForPosts
      verification {
        id
        isVerifiedAt
        isVerified
        verificationReason
      }
    }
  }
`;

export const GET_COMMUNITY_BY_ID = gql`
query GetCommunityById($input: GetCommunityByIdInput!) {
  getCommunityById(input: $input) {
     ${details}
  }
}`;

export const UPDATE_COMMUNITY_BASIC_INFO = gql`
mutation UpdateBasicInfo($input: UpdateBasicInfoInput!) {
  updateBasicInfo(input: $input) {
      ${details}
  }
}`;
export const UPDATE_COMMUNITY_PERMISSIONS = gql`
mutation UpdateCommunityPermissions($input: UpdateCommunityPermissionsInput!) {
  updateCommunityPermissions(input: $input) {
    ${details}
  }
}`;

export const UPDATE_COMMUNITY_RULES = gql`
mutation UpdateCommunityRules($input: UpdateCommunityRuleInput!) {
  updateCommunityRules(input: $input) {
      ${details}
  }
}`;
export const CHANGE_DISCUSSION_COMMUNITY_STATUS = gql`
mutation ChangeDiscussionCommunityStatus($input: ChangeDiscussionCommunityStatusInput!) {
  changeDiscussionCommunityStatus(input: $input) {
     ${details}
  }
}`;

export const CHANGE_DISCUSSION_COMMUNITY_VERIFICATION = gql`
mutation ChangeDiscussionCommunityVerification($input: ChangeDiscussionCommunityVerificationInput!) {
  changeDiscussionCommunityVerification(input: $input) {
      ${details}
  }
}`;

export const GET_COMMUNITY_REQUEST = gql`
  query GetCommunityRequest($input: inputGetCommunityRequest!) {
    getCommunityRequest(input: $input) {
      id
      notes
      createdAt
      user {
        avatar
        about {
          currentPosition
        }
        firstName
        lastName
      }
    }
  }
`;

export const GET_COMMUNITY_STATS = gql`
  query GetCommunityStats($input: CommunityStatsInput) {
    getCommunityStats(input: $input) {
      totalCommunities
      totalMembers
      totalPosts
      totalViews
      newCommunities
      newMembers
      newPosts
      statusBreakdown {
        status
        count
      }
    }
  }
`;

export interface CommunityStatsInput {
  startDate?: string | null;
  endDate?: string | null;
}

export interface StatusBreakdown {
  status: string;
  count: number;
}

export interface CommunityStats {
  totalCommunities: number;
  totalMembers: number;
  totalPosts: number;
  totalViews: number;
  newCommunities: number;
  newMembers: number;
  newPosts: number;
  statusBreakdown: StatusBreakdown[];
}

export interface GetCommunityStatsResponse {
  getCommunityStats: CommunityStats;
}
