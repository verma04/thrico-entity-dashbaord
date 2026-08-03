export interface AddGroupInput {
  title: string;
  cover?: string;
  description?: string;
  privacy: string;
  groupType: string;
  joiningCondition: string;
  location?: string;
  tagline?: string;
  tag?: string[];
}

export interface UpdateMemberRoleInput {
  groupId: string;
  memberId: string;
  newRole: string;
}

export interface UpdateMemberRoleResponse {
  updateMemberRole: {
    success: boolean;
    updatedMember: {
      id: string;
      userId: string;
      role: string;
      updatedAt: string;
    };
  };
}

export interface RemoveMemberInput {
  groupId: string;
  memberId: string;
  reason?: string;
}

export interface RemoveMemberResponse {
  removeMemberFromCommunity: {
    success: boolean;
    message: string;
  };
}

export interface GetCommunitiesInput {
  page?: number | null;
  limit?: number | null;
}

export interface Group {
  title: string;
  cover: string;
  id: string;
  slug: string;
  total: number;
  description: string;
  privacy: string;
  isGroupMember: boolean;
  isJoinRequest: boolean;
  isGroupAdmin: boolean;
  isTrending: boolean;
  numberOfUser: number;
  numberOfLikes: number;
  numberOfPost: number;
  createdAt: string;
  updatedAt: string; // New field
  numberOfViews: number;
  tag: string;
  isFeatured: boolean;
  location: string;
  tagline: string;
  creator: string; // New field
  addedBy: string; // New field
  entity: string; // New field
  theme: string; // New field
  interests: string[]; // New field
  categories: string[]; // New field
  communityType: string; // New field
  joiningTerms: string; // New field
  requireAdminApprovalForPosts: boolean; // New field
  allowMemberInvites: boolean; // New field
  allowMemberPosts: boolean; // New field
  enableEvents: boolean; // New field
  enableRatingsAndReviews: boolean; // New field
  rules: string; // New field
  overallRating: number; // New field
  totalRatings: number; // New field
  verifiedRating: number; // New field
  totalVerifiedRatings: number; // New field
}

export interface GroupMember {
  avatar: string;
  id: string;
}

export interface Creator {
  avatar: string;
  firstName: string;
  id: string;
  lastName: string;
}

// Update your existing GroupDetails interface
export interface GroupDetails {
  id: string;
  status: string;
  isFeatured: boolean;
  isWishList: boolean;
  isTrending: boolean;
  group: Group;
  groupSettings: {
    groupType: string;
    joiningCondition: string;
    privacy: string;
  };
  groupStatus: string;
  role: string;
  rank: number; // New field
  trendingScore: number; // New field
  isGroupMember: boolean; // New field
  isJoinRequest: boolean; // New field
  isGroupAdmin: boolean; // New field
  isGroupManager: boolean; // New field
  groupMember: GroupMember; // New field
  creator: Creator; // New field
}

export interface Community {
  id: string;
  status: string;
  isFeatured: boolean;
  isWishList: boolean;
  isTrending: boolean;
  group: Group;
  groupSettings: {
    groupType: string;
    joiningCondition: string;
    privacy: string;
  };
  groupStatus: string;
  role: string;
  rank: number;
  trendingScore: number;
  isGroupMember: boolean;
  isJoinRequest: boolean;
  isGroupAdmin: boolean;
  isGroupManager: boolean;
  members: GroupMember[];
  creator: Creator;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CreateCommunitiesResponse {
  createCommunities: Community;
}

export interface GetCommunitiesResponse {
  getAllCommunities: {
    communities: Community[];
    pagination: Pagination;
  };
}

// New types that need to be added
export interface CommunityStats {
  totalMembers: number;
  totalPosts: number;
  totalLikes: number;
  totalViews: number;
}

export interface CommunityFilters {
  categories: string[];
  interests: string[];
  communityTypes: string[];
  privacyOptions: string[];
}

export interface SearchCommunitiesInput {
  searchTerm?: string;
  page?: number;
  limit?: number;
  filters?: CommunitySearchFilters;
}

export interface CommunitySearchFilters {
  privacy?: string;
  communityType?: string;
  categories?: string[];
}

export interface InputId {
  id: string;
}

export interface InputJoinCommunity {
  groupId: string;
  // Add other fields based on your schema
}

export interface TotalMember {
  total: number;
  members: Member[];
}

export interface Member {
  id: string;
  avatar: string;
  name: string;
}

export interface Status {
  status: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Enums
export enum IsMemberEnum {
  MEMBER = 'MEMBER',
  REQUEST_SEND = 'REQUEST_SEND',
  NO_MEMBER = 'NO_MEMBER'
}

export enum GroupStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED'
}

export interface CommunityAdminInfo {
  id: string;
  groupId: string;
  groupType: string;
  joiningCondition: string;
  privacy: string;
}

export interface PostRatingSummary {
  groupId: string;
  totalRatings: number;
  averageRating: number;
  totalVerifiedRatings: number;
  averageVerifiedRating: number;
  oneStar: number;
  twoStar: number;
  threeStar: number;
  fourStar: number;
  fiveStar: number;
  verifiedOneStar: number;
  verifiedTwoStar: number;
  verifiedThreeStar: number;
  verifiedFourStar: number;
  verifiedFiveStar: number;
  lastUpdated: string;
}

export interface MemberSummary {
  total: number;
  member: string;
}

export interface CommunityAdmin {
  id: string;
  cover: string;
  firstName: string;
  lastName: string;
}

export interface CommunityDetails {
  admin: CommunityAdmin;
  allowMemberInvites: boolean;
  allowMemberPosts: boolean;
  communityType: string;
  totalRatings: number;
  total: number;
  title: string;
  theme: string;
  addedBy: string;
  categories: string[];
  cover: string;
  createdAt: string;
  creator: string;
  description: string;
  enableEvents: boolean;
  enableRatingsAndReviews: boolean;
  entity: string;
  id: string;
  interests: string[];
  isApproved: boolean;
  isFeatured: boolean;
  isGroupAdmin: boolean;
  isGroupMember: boolean;
  isJoinRequest: boolean;
  isTrending: boolean;
  joiningTerms: string;
  location: string;
  numberOfLikes: number;
  numberOfPost: number;
  numberOfUser: number;
  numberOfViews: number;
  overallRating: number;
  privacy: string;
  requireAdminApprovalForPosts: boolean;
  rules: string;
  slug: string;
  status: string;
  tag: string[];
  tagline: string;
  totalVerifiedRatings: number;
  updatedAt: string;
  verifiedRating: number;
}

export interface GetCommunityAboutByIdResponse {
  getCommunityAboutById: {
    adminInfo: CommunityAdminInfo;
    rules: string;
    postRatingSummary: PostRatingSummary;
    memberSummary: MemberSummary;
    communityDetails: CommunityDetails;
  };
}

export interface InputId {
  id: string;
}

// New types for getCommunityMembersWithRoles
export interface GetCommunityMembersInput {
  groupId: string;
  limit?: number;
  page?: number;
  role?: string | null;
}

export interface CommunityMemberUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string;
}

export interface CommunityMember {
  id: string;
  userId: string;
  role: string;
  joinedAt: string;
  isActive: boolean;
  lastActivityAt: string;
  user: CommunityMemberUser;
}

export interface RoleStatistics {
  ADMIN: number;
  MANAGER: number;
  MODERATOR: number;
  USER: number;
  total: number;
}

export interface CommunityPermissions {
  isCurrentUserAdmin: boolean;
  currentUserRole: string;
  canInviteMembers: boolean;
  canManageRoles: boolean;
  canRemoveMembers: boolean;
}

export interface GetCommunityMembersWithRolesResponse {
  getCommunityMembersWithRoles: {
    members: CommunityMember[];
    pagination: Pagination;
    roleStatistics: RoleStatistics;
    permissions: CommunityPermissions;
  };
}

// Types for pending join requests
export interface GetPendingJoinRequestsInput {
 id?: string;
  limit?: number;
  page?: number;
}

export interface GetPendingJoinRequestsCountInput {
  id: string;
}

export interface PendingJoinRequestUser {
   id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string;
  
}

export interface PendingJoinRequest {
  id: string;
  userId: string;
  notes: string;
  requestedAt: string;
  user: PendingJoinRequestUser;
}

export interface GetPendingJoinRequestsResponse {
  getPendingJoinRequests: {
    requests: PendingJoinRequest[];
    pagination: Pagination;
  };
}

// Types for respond to join request mutation
export enum JoinRequestAction {
  ACCEPT = "ACCEPT",
  REJECT = "REJECT"
}

export interface RespondToJoinRequestInput {
  action: JoinRequestAction | null;
  groupId: string | null;
  reason: string | null;
  requestId: string | null;
}

export interface RespondToJoinRequestUser {
  avatar: string;
  firstName: string;
  fullName: string;
}

export interface RespondToJoinRequestDetails {
  id: string;
  userId: string;
  user: RespondToJoinRequestUser;
  status: string;
}

export interface RespondToJoinRequestResponse {
  respondToJoinRequest: {
    action: string;
    request: RespondToJoinRequestDetails;
    success: boolean;
  };
}

// Types for Communities Feed List
export interface inputGroupFeedPagination {
  id?: string;
  limit?: number;
  offset?: number;
}

export interface FeedUser {
  about: {
    headline: string;
  };
  avatar: string;
  cover: string;
  firstName: string;
  id: string;
  lastName: string;
}

export interface FeedJob {
  id: string;
  location: string;
  salary: string;
  skills: string[];
  title: string;
}

export interface FeedOffer {
  id: string;
  title: string;
  description: string;
  location: string;
  company: string;
  timeline: string;
  termsAndConditions: string;
  website: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  cover: string;
}

export interface FeedMarketPlace {
  id: string;
  title: string;
  description: string;
  location: string;
  condition: string;
  category: string;
  price: number;
  createdAt: string;
  media: string[];
  currency: string;
}

export interface FeedPoll {
  id: string;
  title: string;
}

export interface ForumCategory {
  id: string;
  name: string;
}

export interface FeedForum {
  id: string;
  title: string;
  content: string;
  category: ForumCategory;
  upVotes: number;
  downVotes: number;
  totalComments: number;
  status: string;
  isAnonymous: boolean;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
  isLikeByYou: boolean;
  voteType: string;
  isOwner: boolean;
}

export interface FeedCelebration {
  id: string;
  celebrationType: string;
  title: string;
  description: string;
  cover: string;
}

export interface FeedEvent {
  cover: string;
  type: string;
  title: string;
  description: string;
  endDate: string;
  lastDateOfRegistration: string;
  startDate: string;
  startTime: string;
  location: string;
  numberOfAttendees: number;
  numberOfPost: number;
  numberOfViews: number;
}

export interface FeedPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canPin: boolean;
  canModerate: boolean;
  canReport: boolean;
}

export interface CommunityFeedData {
  status: string;
  isPinned: boolean;
  priority: number;
}

export interface CommunityFeedConnection {
  edges: CommunityFeedEdge[];
  pageInfo: PageInfo;
  totalCount: number;
  hasPinnedPost?: boolean;
}

export interface CommunityFeed {
  isLiked: boolean;
  id: string;
  description: string;
  user: FeedUser;
  createdAt: string;
  totalComment: number;
  totalReactions: number;
  totalReShare: number;
  isWishList: boolean;
  isOwner: boolean;
  source: string;
  media: string[];
  privacy: string;
  job?: FeedJob;
  offer?: FeedOffer;
  marketPlace?: FeedMarketPlace;
  repostId?: string;
  addedBy: string;
  poll?: FeedPoll;
  forum?: FeedForum;
  celebration?: FeedCelebration;
  videoUrl?: string;
  thumbnailUrl?: string;
  status: string;
  event?: FeedEvent;
  permissions: FeedPermissions;
  communityFeedData?: CommunityFeedData;
  isAiContent?: boolean;
  momentId?: string;
  reactionType?: string;
}

export interface FeedPagination {
  hasMore: boolean;
  limit: number;
  offset: number;
  total: number;
}

export interface GetCommunitiesFeedListResponse {
  getCommunitiesFeedList: {
    feeds: CommunityFeed[];
    pagination: FeedPagination;
  };
}

export interface ReportCommunityInput {
  communityId: string;
  reason: string;
  description?: string;
  evidenceUrls?: string[];
}

export interface ReportCommunityResponse {
  reportCommunity: {
    success: boolean;
    reportId: string;
    totalReports: number;
    isFlagged: boolean;
    message: string;
  };
}

export interface LeaveCommunityInput {
  groupId: string;
}

export interface LeaveCommunityResponse {
  leaveCommunity: {
    communityArchived: boolean;
    message: string;
    success: boolean;
  };
}
