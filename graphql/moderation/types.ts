export type Severity = "LOW" | "MEDIUM" | "HIGH";
export type LinkType = "DOMAIN" | "URL" | "PATTERN";
export type ReportStatus = "PENDING" | "RESOLVED" | "DISMISSED";
export type AiClassification = "safe" | "spam" | "offensive" | "harassment";

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
  contentType: string;
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
  contentType: string;
  aiLabel: AiClassification;
  decision: string;
  actionTaken: string;
  createdAt: string;
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

export interface PaginatedAiTokenUsageResponse {
  items: AiTokenUsage[];
  totalCount: number;
}
