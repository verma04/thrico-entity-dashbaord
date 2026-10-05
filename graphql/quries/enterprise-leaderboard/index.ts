import { gql } from "@apollo/client";

// ============================================
// TYPES & INTERFACES
// ============================================

export type EnterprisePeriodType =
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "YEARLY"
  | "ALL_TIME"
  | "CUSTOM";

export type EnterpriseLeaderboardStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export interface EnterpriseClient {
  id: string;
  entityId: string;
  name: string;
  clientId: string;
  clientSecretPrefix?: string | null;
  allowedDomains: string[];
  allowedLeaderboards: string[];
  rateLimitPerMinute: number;
  tokenTtlSeconds: number;
  isActive: boolean;
  lastUsedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseClientSecretResult {
  clientId: string;
  clientSecret: string;
  message: string;
}

export interface EnterpriseLeaderboardRankingRules {
  tieBreaker: string;
  eligibleTiers?: string[] | null;
  excludedUserIds?: string[] | null;
}

export interface EnterpriseLeaderboardVisibleFields {
  showName: boolean;
  showAvatar: boolean;
  showBadges: boolean;
  showRankMovement: boolean;
  maskUserName?: boolean | null;
}

export interface EnterpriseLeaderboardConfig {
  id: string;
  entityId: string;
  code: string;
  name: string;
  description?: string | null;
  periodType: EnterprisePeriodType;
  startDate?: string | null;
  endDate?: string | null;
  status: EnterpriseLeaderboardStatus;
  pointsSource: string;
  rankingRules?: EnterpriseLeaderboardRankingRules | null;
  visibleFields?: EnterpriseLeaderboardVisibleFields | null;
  badgeVisibility: boolean;
  defaultPageSize: number;
  maxPageSize: number;
  cacheTtlSeconds: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateEnterpriseClientInput {
  name?: string | null;
  allowedDomains?: string[] | null;
  allowedLeaderboards?: string[] | null;
  rateLimitPerMinute?: number | null;
  tokenTtlSeconds?: number | null;
  isActive?: boolean | null;
}

export interface EnterpriseLeaderboardRankingRulesInput {
  tieBreaker?: string | null;
  eligibleTiers?: string[] | null;
  excludedUserIds?: string[] | null;
}

export interface EnterpriseLeaderboardVisibleFieldsInput {
  showName?: boolean | null;
  showAvatar?: boolean | null;
  showBadges?: boolean | null;
  showRankMovement?: boolean | null;
  maskUserName?: boolean | null;
}

export interface CreateEnterpriseLeaderboardInput {
  code: string;
  name: string;
  description?: string | null;
  periodType?: EnterprisePeriodType | null;
  startDate?: string | null;
  endDate?: string | null;
  rankingRules?: EnterpriseLeaderboardRankingRulesInput | null;
  visibleFields?: EnterpriseLeaderboardVisibleFieldsInput | null;
  badgeVisibility?: boolean | null;
  defaultPageSize?: number | null;
  maxPageSize?: number | null;
}

export interface UpdateEnterpriseLeaderboardInput {
  name?: string | null;
  description?: string | null;
  periodType?: EnterprisePeriodType | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: EnterpriseLeaderboardStatus | null;
  rankingRules?: EnterpriseLeaderboardRankingRulesInput | null;
  visibleFields?: EnterpriseLeaderboardVisibleFieldsInput | null;
  badgeVisibility?: boolean | null;
  defaultPageSize?: number | null;
  maxPageSize?: number | null;
}

// Response Interfaces
export interface GetEnterpriseClientResponse {
  getEnterpriseClient: EnterpriseClient | null;
}

export interface GetEnterpriseLeaderboardsResponse {
  getEnterpriseLeaderboards: EnterpriseLeaderboardConfig[];
}

export interface GetEnterpriseLeaderboardResponse {
  getEnterpriseLeaderboard: EnterpriseLeaderboardConfig | null;
}

export interface UpdateEnterpriseClientResponse {
  updateEnterpriseClient: EnterpriseClient;
}

export interface RegenerateEnterpriseClientSecretResponse {
  regenerateEnterpriseClientSecret: EnterpriseClientSecretResult;
}

export interface CreateEnterpriseLeaderboardResponse {
  createEnterpriseLeaderboard: EnterpriseLeaderboardConfig;
}

export interface UpdateEnterpriseLeaderboardResponse {
  updateEnterpriseLeaderboard: EnterpriseLeaderboardConfig;
}

export interface DeleteEnterpriseLeaderboardResponse {
  deleteEnterpriseLeaderboard: boolean;
}

// ============================================
// QUERIES
// ============================================

export const GET_ENTERPRISE_CLIENT = gql`
  query GetEnterpriseClient {
    getEnterpriseClient {
      id
      entityId
      name
      clientId
      clientSecretPrefix
      allowedDomains
      allowedLeaderboards
      rateLimitPerMinute
      tokenTtlSeconds
      isActive
      lastUsedAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_ENTERPRISE_LEADERBOARDS = gql`
  query GetEnterpriseLeaderboards {
    getEnterpriseLeaderboards {
      id
      entityId
      code
      name
      description
      periodType
      startDate
      endDate
      status
      pointsSource
      rankingRules {
        tieBreaker
        eligibleTiers
        excludedUserIds
      }
      visibleFields {
        showName
        showAvatar
        showBadges
        showRankMovement
        maskUserName
      }
      badgeVisibility
      defaultPageSize
      maxPageSize
      cacheTtlSeconds
      createdAt
      updatedAt
    }
  }
`;

export const GET_ENTERPRISE_LEADERBOARD = gql`
  query GetEnterpriseLeaderboard($id: ID, $code: String) {
    getEnterpriseLeaderboard(id: $id, code: $code) {
      id
      entityId
      code
      name
      description
      periodType
      startDate
      endDate
      status
      pointsSource
      rankingRules {
        tieBreaker
        eligibleTiers
        excludedUserIds
      }
      visibleFields {
        showName
        showAvatar
        showBadges
        showRankMovement
        maskUserName
      }
      badgeVisibility
      defaultPageSize
      maxPageSize
      cacheTtlSeconds
      createdAt
      updatedAt
    }
  }
`;

// ============================================
// MUTATIONS
// ============================================

export const UPDATE_ENTERPRISE_CLIENT = gql`
  mutation UpdateEnterpriseClient($input: UpdateEnterpriseClientInput!) {
    updateEnterpriseClient(input: $input) {
      id
      entityId
      name
      clientId
      clientSecretPrefix
      allowedDomains
      allowedLeaderboards
      rateLimitPerMinute
      tokenTtlSeconds
      isActive
      updatedAt
    }
  }
`;

export const REGENERATE_ENTERPRISE_CLIENT_SECRET = gql`
  mutation RegenerateEnterpriseClientSecret {
    regenerateEnterpriseClientSecret {
      clientId
      clientSecret
      message
    }
  }
`;

export const CREATE_ENTERPRISE_LEADERBOARD = gql`
  mutation CreateEnterpriseLeaderboard($input: CreateEnterpriseLeaderboardInput!) {
    createEnterpriseLeaderboard(input: $input) {
      id
      entityId
      code
      name
      description
      periodType
      startDate
      endDate
      status
      pointsSource
      rankingRules {
        tieBreaker
        eligibleTiers
        excludedUserIds
      }
      visibleFields {
        showName
        showAvatar
        showBadges
        showRankMovement
        maskUserName
      }
      badgeVisibility
      defaultPageSize
      maxPageSize
      cacheTtlSeconds
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ENTERPRISE_LEADERBOARD = gql`
  mutation UpdateEnterpriseLeaderboard(
    $id: ID!
    $input: UpdateEnterpriseLeaderboardInput!
  ) {
    updateEnterpriseLeaderboard(id: $id, input: $input) {
      id
      entityId
      code
      name
      description
      periodType
      startDate
      endDate
      status
      pointsSource
      rankingRules {
        tieBreaker
        eligibleTiers
        excludedUserIds
      }
      visibleFields {
        showName
        showAvatar
        showBadges
        showRankMovement
        maskUserName
      }
      badgeVisibility
      defaultPageSize
      maxPageSize
      cacheTtlSeconds
      updatedAt
    }
  }
`;

export const DELETE_ENTERPRISE_LEADERBOARD = gql`
  mutation DeleteEnterpriseLeaderboard($id: ID!) {
    deleteEnterpriseLeaderboard(id: $id)
  }
`;
