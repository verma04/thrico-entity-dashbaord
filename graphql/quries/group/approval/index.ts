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
    creator {
      id
      firstName
      lastName
      avatar
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
      numberOfUser
      verification {
        id
        isVerifiedAt
        isVerified
        verificationReason
      }
      creator {
        id
        firstName
        lastName
        avatar
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

export const GET_COMMUNITY_SIGNUP_TREND = gql`
  query GetCommunitySignupTrend($input: CommunityStatsInput) {
    getCommunitySignupTrend(input: $input) {
      name
      signups
      views
    }
  }
`;

export const GET_TOP_ACTIVE_COMMUNITIES = gql`
  query GetTopActiveCommunities($limit: Int) {
    getTopActiveCommunities(limit: $limit) {
      id
      name
      slug
      members
      views
      status
      avatar
      lastActivity
    }
  }
`;

export const GET_COMMUNITY_ACTIVITY_TREND = gql`
  query GetCommunityActivityTrend {
    getCommunityActivityTrend {
      name
      registered
      checkedIn
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

export interface CommunitySignupTrend {
  name: string;
  signups: number;
  views: number;
}

export interface GetCommunitySignupTrendResponse {
  getCommunitySignupTrend: CommunitySignupTrend[];
}

export interface TopCommunity {
  id: string;
  name: string;
  slug: string;
  members: number;
  views: number;
  status: string;
  avatar?: string;
  lastActivity?: string;
}

export interface GetTopActiveCommunitiesResponse {
  getTopActiveCommunities: TopCommunity[];
}

export interface CommunityActivity {
  name: string;
  registered: number;
  checkedIn: number;
}

export interface GetCommunityActivityTrendResponse {
  getCommunityActivityTrend: CommunityActivity[];
}
