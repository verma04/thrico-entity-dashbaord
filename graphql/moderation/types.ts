export type Severity = "LOW" | "MEDIUM" | "HIGH";
export type LinkType = "DOMAIN" | "URL" | "PATTERN";
export type ReportStatus = "PENDING" | "RESOLVED" | "DISMISSED";
export type AiClassification = "safe" | "spam" | "offensive" | "harassment";
export type ModerationContentType =
  | "POST"
  | "COMMENT"
  | "MARKETPLACE"
  | "COMMUNITY"
  | "EVENT"
  | "SHOP"
  | "OFFER"
  | "JOB"
  | "DISCUSSION_FORUM"
  | "DISCUSSION_FORUM_COMMENT"
  | "MESSAGE";

export interface BannedWord {
  __typename?: "BannedWord";
  id: string;
  word: string;
  severity: Severity;
  category?: string;
  isActive: boolean;
  createdAt: string;
}

export interface BlockedLink {
  __typename?: "BlockedLink";
  id: string;
  url: string;
  type: LinkType;
  isBlocked: boolean;
  reason?: string;
  createdAt: string;
}

export interface ContentReport {
  __typename?: "ContentReport";
  id: string;
  contentType: ModerationContentType;
  contentId: string;
  contentPreview?: string;
  reason: string;
  status: ReportStatus;
  reportsCount: number;
  createdAt: string;
  reportedBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
  reportedUser: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface ModerationSettings {
  __typename?: "ModerationSettings";
  id: string;
  autoModerationEnabled: boolean;
  bannedWordsAction: string;
  blockedLinksAction: string;
  spamDetectionEnabled: boolean;
  spamThreshold: number;
  autoFlagThreshold: number;
  autoHideThreshold: number;
  aiClassificationDefinitions?: any;
}

export interface PaginatedBannedWordResponse {
  items: BannedWord[];
  totalCount: number;
}

export interface PaginatedBlockedLinkResponse {
  items: BlockedLink[];
  totalCount: number;
}

export interface PaginatedContentReportResponse {
  items: ContentReport[];
  totalCount: number;
}

export interface ModerationStats {
  __typename?: "ModerationStats";
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  bannedWordsCount: number;
  blockedLinksCount: number;
  autoModeratedToday: number;
}

export interface AiModerationDashboard {
  __typename?: "AiModerationDashboard";
  totalPosts: number;
  pendingModeration: number;
  flaggedContent: number;
  rejectedPosts: number;
  totalTokens: number;
}

export interface AiModerationLog {
  id: string;
  contentId: string;
  entityId: string;
  classification?: AiClassification;
  confidence?: number;
  model?: string;
  createdAt: string;
}

export interface ModerationLog {
  id: string;
  contentType: ModerationContentType;
  aiLabel: AiClassification;
  aiScore?: number;
  aiCategories?: any;
  decision: string;
  actionTaken: string;
  createdAt: string;
  contentId?: string;
  contentPreview?: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export interface AiTokenUsage {
  module: string;
  tokens: number;
  model: string;
  createdAt: string;
}

export interface PaginatedModerationLogResponse {
  items: ModerationLog[];
  totalCount: number;
}

export interface PaginatedAiModerationLogResponse {
  items: AiModerationLog[];
  totalCount: number;
}

export interface PaginatedAiTokenUsageResponse {
  items: AiTokenUsage[];
  totalCount: number;
}

export interface AiModerationSettings {
  __typename?: "AiModerationSettings";
  aiModerationFeed: boolean;
  aiModerationComments: boolean;
  aiModerationEvents: boolean;
  aiModerationCommunities: boolean;
  aiModerationDiscussionForums: boolean;
  aiModerationJobs: boolean;
  aiModerationMentorship: boolean;
  aiModerationListing: boolean;
  aiModerationShop: boolean;
  aiModerationOffers: boolean;
  aiModerationOpportunities: boolean;
  aiModerationSurveys: boolean;
  aiModerationPolls: boolean;
  aiModerationStories: boolean;
}

export interface AiModerationSettingsInput {
  aiModerationFeed?: boolean;
  aiModerationComments?: boolean;
  aiModerationEvents?: boolean;
  aiModerationCommunities?: boolean;
  aiModerationDiscussionForums?: boolean;
  aiModerationJobs?: boolean;
  aiModerationMentorship?: boolean;
  aiModerationListing?: boolean;
  aiModerationShop?: boolean;
  aiModerationOffers?: boolean;
  aiModerationOpportunities?: boolean;
  aiModerationSurveys?: boolean;
  aiModerationPolls?: boolean;
  aiModerationStories?: boolean;
}

export interface UserStatusEvent {
  eventId: string;
  tenantId: string;
  userId: string;
  userToEntityId?: string;
  action: string;
  previousStatus?: string;
  newStatus: string;
  reason: string;
  performedBy?: string;
  source: string;
  metadata?: string;
  createdAt: string;
}

export interface PaginatedUserStatusTimeline {
  items: UserStatusEvent[];
  totalCount: number;
}

export interface UserModerationEvent {
  eventId: string;
  tenantId: string;
  userId: string;
  contentId: string;
  contentType: string;
  contentPreview?: string;
  originalContent?: string;
  label: string;
  score: number;
  confidence: number;
  categories: string[];
  isSpam: boolean;
  isViolation: boolean;
  decision: string;
  status: string;
  model?: string;
  reason: string;
  tokens: number;
  createdAt: string;
}

export interface PaginatedUserModerationTimeline {
  items: UserModerationEvent[];
  totalCount: number;
}

export interface UserModerationSummary {
  totalChecked: number;
  spamCount: number;
  violationsCount: number;
  blockedCount: number;
  flaggedCount: number;
  approvedCount: number;
  lastViolationAt?: string;
}

