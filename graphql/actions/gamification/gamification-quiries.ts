import { gql, QueryHookOptions, useQuery } from "@apollo/client";
import { DateRangeInput, TimeRange } from "../dashbaord/dashboard-quries";
export { TimeRange };
export type { DateRangeInput };
import {
  GET_GAMIFICATION_SUMMARY,
  GET_USER_ACTIVITY_LOG,
  GET_USER_EARNED_BADGES,
} from "../../quries/gamification";
export type GamificationSourceType = "MODULE" | "INTEGRATION";

export interface GamificationModule {
  id: string;
  uuid?: string;
  name: string;
  description: string;
  icon: string;
  isGamification?: boolean;
}

export interface GamificationIntegration {
  id: string;
  uuid?: string;
  name: string;
  slug?: string;
  description: string;
  icon: string;
  isGamification?: boolean;
}

export interface GamificationModuleTrigger {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  type: string;
  isActive?: boolean;
}

export interface GamificationIntegrationTrigger {
  id: string;
  integrationId: string;
  name: string;
  description: string;
  type: string;
  isActive?: boolean;
}

export interface GamificationTrigger {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  type: string;
  isActive?: boolean;
}

export interface GetEntityGamificationModulesData {
  getEntityGamificationModules: {
    modules: GamificationModule[];
    integrations?: GamificationIntegration[];
    moduleTriggers?: GamificationModuleTrigger[];
    integrationTriggers?: GamificationIntegrationTrigger[];
    triggers: GamificationTrigger[];
  };
}

export const GET_ENTITY_GAMIFICATION_MODULES = gql`
  query GetEntityGamificationModules {
    getEntityGamificationModules {
      modules {
        id
        uuid
        name
        description
        icon
        isGamification
      }
      integrations {
        id
        uuid
        name
        slug
        description
        icon
        isGamification
      }
      moduleTriggers {
        id
        moduleId
        name
        description
        type
        isActive
      }
      integrationTriggers {
        id
        integrationId
        name
        description
        type
        isActive
      }
      triggers {
        id
        moduleId
        name
        description
        type
        isActive
      }
    }
  }
`;
export function useGetEntityGamificationModules(
  options?: QueryHookOptions<GetEntityGamificationModulesData>,
) {
  return useQuery<GetEntityGamificationModulesData>(
    GET_ENTITY_GAMIFICATION_MODULES,
    options,
  );
}

export interface Badge {
  id: string;
  source?: "MODULE" | "INTEGRATION" | string;
  name: string;
  description: string;
  icon: string;
  type: string;
  module: string;
  action?: string;
  targetValue?: number;
  count?: number;
  points?: number;
  condition?: any;
  allowPushNotification?: boolean;
  allowEmailNotification?: boolean;
  pushNotificationTitle?: string;
  pushNotificationBody?: string;
  emailNotificationSubject?: string;
  emailNotificationBody?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BadgeFilter {
  source?: GamificationSourceType;
  type?: string;
  module?: string;
  action?: string;
  isActive?: boolean;
  isCompleted?: boolean;
  search?: string;
}

export interface GetBadgesData {
  getBadges: Badge[];
}

export interface GetBadgesVariables {
  filter?: BadgeFilter;
}

const GET_BADGES = gql`
  query GetBadges($filter: BadgeFilter) {
    getBadges(filter: $filter) {
      id
      source
      name
      description
      icon
      type
      module
      action
      targetValue
      condition
      allowPushNotification
      allowEmailNotification
      pushNotificationTitle
      pushNotificationBody
      emailNotificationSubject
      emailNotificationBody
      isActive
      createdAt
      updatedAt
      userProgress {
        id
        progress
        isCompleted
        earnedAt
      }
    }
  }
`;

export function useGetBadges(
  options?: QueryHookOptions<GetBadgesData, GetBadgesVariables>,
) {
  return useQuery<GetBadgesData, GetBadgesVariables>(GET_BADGES, options);
}

// ---------------------------------------------------------
// POINT RULES
// ---------------------------------------------------------

export interface PointRule {
  id: string;
  source?: "MODULE" | "INTEGRATION" | string;
  module: string;
  action: string;
  trigger: string;
  points: number;
  dailyCap?: number;
  weeklyCap?: number;
  monthlyCap?: number;
  description?: string;
  isActive: boolean;
  allowPushNotification?: boolean;
  allowEmailNotification?: boolean;
  pushNotificationTitle?: string;
  pushNotificationBody?: string;
  emailNotificationSubject?: string;
  emailNotificationBody?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PointRuleFilter {
  source?: GamificationSourceType | null;
  isActive?: boolean | null;
  module?: string | null;
  action?: string | null;
  trigger?: string | null;
  search?: string | null;
}

export interface GetPointRulesData {
  getPointRules: PointRule[];
}

const GET_POINT_RULES = gql`
  query GetPointRules($filter: PointRuleFilter) {
    getPointRules(filter: $filter) {
      id
      source
      module
      action
      trigger
      points
      dailyCap
      weeklyCap
      monthlyCap
      description
      isActive
      allowPushNotification
      allowEmailNotification
      pushNotificationTitle
      pushNotificationBody
      emailNotificationSubject
      emailNotificationBody
      createdAt
      updatedAt
    }
  }
`;

export function useGetPointRules(
  options?: QueryHookOptions<GetPointRulesData, { filter?: PointRuleFilter }>,
) {
  return useQuery<GetPointRulesData, { filter?: PointRuleFilter }>(
    GET_POINT_RULES,
    options,
  );
}

// ---------------------------------------------------------
// RANKS
// ---------------------------------------------------------

export interface Rank {
  id: string;
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  icon: string;
  order: number;
  allowPushNotification?: boolean;
  allowEmailNotification?: boolean;
  pushNotificationTitle?: string;
  pushNotificationBody?: string;
  emailNotificationSubject?: string;
  emailNotificationBody?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RankFilter {
  isActive?: boolean | null;
}

export interface GetRanksData {
  getRanks: Rank[];
}

const GET_RANKS = gql`
  query GetRanks($filter: RankFilter) {
    getRanks(filter: $filter) {
      id
      name
      minPoints
      maxPoints
      color
      icon
      order
      allowPushNotification
      allowEmailNotification
      pushNotificationTitle
      pushNotificationBody
      emailNotificationSubject
      emailNotificationBody
      isActive
      createdAt
      updatedAt
    }
  }
`;

export function useGetRanks(
  options?: QueryHookOptions<GetRanksData, { filter?: RankFilter }>,
) {
  return useQuery<GetRanksData, { filter?: RankFilter }>(GET_RANKS, options);
}

// ---------------------------------------------------------
// STATS
// ---------------------------------------------------------

export interface PointRuleStats {
  totalRules: number;
  activeRules: number;
  firstTimeRules: number;
  recurringRules: number;
}

export interface GetPointRuleStatsData {
  getPointRuleStats: PointRuleStats;
}

const GET_POINT_RULE_STATS = gql`
  query GetPointRuleStats {
    getPointRuleStats {
      totalRules
      activeRules
      firstTimeRules
      recurringRules
    }
  }
`;

export function useGetPointRuleStats(
  options?: QueryHookOptions<GetPointRuleStatsData>,
) {
  return useQuery<GetPointRuleStatsData>(GET_POINT_RULE_STATS, options);
}

export interface GamificationStats {
  totalUsers: number;
  totalPointsAwarded: number;
  totalBadgesEarned: number;
  activePointRules: number;
  activeBadges: number;
  activeRanks: number;
  topRank?: {
    name: string;
    color: string;
  };
  mostPopularBadge?: {
    name: string;
    icon: string;
  };
}

export interface GetGamificationStatsData {
  getGamificationStats: GamificationStats;
}

const GET_GAMIFICATION_STATS = gql`
  query GetGamificationStats(
    $timeRange: TimeRange
    $dateRange: DateRangeInput
  ) {
    getGamificationStats(timeRange: $timeRange, dateRange: $dateRange) {
      totalUsers
      totalPointsAwarded
      totalBadgesEarned
      activePointRules
      activeBadges
      activeRanks
      topRank {
        name
        color
      }
      mostPopularBadge {
        name
        icon
      }
    }
  }
`;

export function useGetGamificationStats(
  timeRange?: TimeRange,
  dateRange?: DateRangeInput,
  options?: QueryHookOptions<
    GetGamificationStatsData,
    { timeRange?: TimeRange; dateRange?: DateRangeInput }
  >,
) {
  return useQuery<
    GetGamificationStatsData,
    { timeRange?: TimeRange; dateRange?: DateRangeInput }
  >(GET_GAMIFICATION_STATS, {
    variables: { timeRange, dateRange },
    ...options,
  });
}

// ---------------------------------------------------------
// LEADERBOARD
// ---------------------------------------------------------

export interface LeaderboardEntry {
  rank: number;
  totalPoints: number;
  badgesCount: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  currentRank: {
    name: string;
    color: string;
    icon: string;
  };
  entityCurrencyWallet?: {
    id: string;
    userId: string;
    entityId: string;
    balance: number;
    totalEarned: number;
    totalSpent: number;
    totalConvertedToTc: number;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export interface GetLeaderboardData {
  getLeaderboard: {
    totalUsers: number;
    userPosition?: number;
    entityCurrent?: LeaderboardEntry | null;
    entries: LeaderboardEntry[];
  };
}

export interface LeaderboardPaginationInput {
  limit: number;
  offset: number;
}

const GET_LEADERBOARD = gql`
  query GetLeaderboard($pagination: PaginationInput) {
    getLeaderboard(pagination: $pagination) {
      entries {
        user {
          id
          firstName
          lastName
          avatar
        }
        rank
        totalPoints
        badgesCount
        currentRank {
          color
          icon
          name
        }
        entityCurrencyWallet {
          id
          userId
          entityId
          balance
          totalEarned
          totalSpent
          totalConvertedToTc
          createdAt
          updatedAt
        }
      }
      totalUsers
      entityCurrent {
        rank
        totalPoints
        badgesCount
        currentRank {
          id
          name
          minPoints
          maxPoints
          color
          icon
          order
          isActive
          createdAt
          updatedAt
          userCount
        }
        entityCurrencyWallet {
          id
          userId
          entityId
          balance
          totalEarned
          totalSpent
          totalConvertedToTc
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export function useGetLeaderboard(
  options?: QueryHookOptions<
    GetLeaderboardData,
    { pagination?: LeaderboardPaginationInput }
  >,
) {
  return useQuery<
    GetLeaderboardData,
    { pagination?: LeaderboardPaginationInput }
  >(GET_LEADERBOARD, options);
}

export interface GamificationActivityLogEntry {
  id: string;
  type: string;
  points: number;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  ruleAction?: string;
  ruleDescription?: string;
  badgeName?: string;
  badgeDescription?: string;
  badgeIcon?: string;
}

export interface GamificationActivityLogInput {
  limit: number;
  offset: number;
  startDate?: Date;
  endDate?: Date;
}

export interface GetGamificationActivityLogResponse {
  getGamificationActivityLog: GamificationActivityLogEntry[];
}

export const GET_GAMIFICATION_ACTIVITY_LOG = gql`
  query GetGamificationActivityLog($input: GamificationActivityLogInput) {
    getGamificationActivityLog(input: $input) {
      id
      type
      points
      createdAt
      user {
        id
        firstName
        lastName
        avatar
      }
      ruleAction
      ruleDescription
      badgeName
      badgeDescription
      badgeIcon
    }
  }
`;

export function useGetGamificationActivityLog(
  options?: QueryHookOptions<
    GetGamificationActivityLogResponse,
    { input: GamificationActivityLogInput }
  >,
) {
  return useQuery<
    GetGamificationActivityLogResponse,
    { input: GamificationActivityLogInput }
  >(GET_GAMIFICATION_ACTIVITY_LOG, options);
}
export interface UserGamificationActivityLogEntry {
  id: string;
  type: string;
  points: number;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  gamificationId?: string;
  ruleAction?: string;
  ruleDescription?: string;
  badgeName?: string;
  badgeDescription?: string;
  badgeIcon?: string;
}

export interface UserGamificationActivityLogInput {
  limit?: number | null;
  offset?: number | null;
  userId?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface GetUserGamificationActivityLogResponse {
  getUserGamificationActivityLog: UserGamificationActivityLogEntry[];
}

export const GET_USER_GAMIFICATION_ACTIVITY_LOG = gql`
  query GetUserGamificationActivityLog(
    $input: UserGamificationActivityLogInput!
  ) {
    getUserGamificationActivityLog(input: $input) {
      id
      type
      points
      createdAt
      user {
        firstName
        lastName
        avatar
      }
      gamificationId
      ruleAction
      ruleDescription
      badgeName
      badgeDescription
      badgeIcon
    }
  }
`;

export function useGetUserGamificationActivityLog(
  options?: QueryHookOptions<
    GetUserGamificationActivityLogResponse,
    { input: UserGamificationActivityLogInput }
  >,
) {
  return useQuery<
    GetUserGamificationActivityLogResponse,
    { input: UserGamificationActivityLogInput }
  >(GET_USER_GAMIFICATION_ACTIVITY_LOG, options);
}

export const useGetGamificationSummary = (userId: string, options?: any) =>
  useQuery(GET_GAMIFICATION_SUMMARY, {
    variables: { userId },
    skip: !userId,
    ...options,
  });

export const useGetUserActivityLog = (
  userId: string,
  limit?: number,
  offset?: number,
  pointFilter?: string,
  options?: any,
) =>
  useQuery(GET_USER_ACTIVITY_LOG, {
    variables: { userId, limit, offset, pointFilter: pointFilter === "all" ? null : pointFilter },
    skip: !userId,
    ...options,
  });

export const useGetUserEarnedBadges = (
  userId: string,
  limit?: number,
  cursor?: string,
  options?: any,
) =>
  useQuery(GET_USER_EARNED_BADGES, {
    variables: { userId, limit, cursor },
    skip: !userId,
    ...options,
  });

export interface EntityCurrencyWalletWithUser {
  id: string;
  userId: string;
  entityId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  totalConvertedToTc: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  };
}

export interface GetEntityCurrencyWalletsData {
  getEntityCurrencyWallets: {
    data: EntityCurrencyWalletWithUser[];
    totalCount: number;
  };
}

export const GET_ENTITY_CURRENCY_WALLETS = gql`
  query GetEntityCurrencyWallets($limit: Int, $offset: Int, $search: String) {
    getEntityCurrencyWallets(limit: $limit, offset: $offset, search: $search) {
      data {
        id
        userId
        entityId
        balance
        totalEarned
        totalSpent
        totalConvertedToTc
        createdAt
        updatedAt
        user {
          id
          firstName
          lastName
          email
          avatar
        }
      }
      totalCount
    }
  }
`;

export function useGetEntityCurrencyWallets(
  options?: QueryHookOptions<GetEntityCurrencyWalletsData>
) {
  return useQuery<GetEntityCurrencyWalletsData>(
    GET_ENTITY_CURRENCY_WALLETS,
    options
  );
}

// ---------------------------------------------------------
// GAMIFICATION GENERAL SETTINGS
// ---------------------------------------------------------

export interface GamificationGeneralSettings {
  isEnabled: boolean;
  dailyPointsCap?: number | null;
  weeklyPointsCap?: number | null;
  monthlyPointsCap?: number | null;
  enableGlobalPushNotifications?: boolean;
  enableGlobalEmailNotifications?: boolean;
  pointsPushNotificationEnabled?: boolean;
  pointsEmailNotificationEnabled?: boolean;
  badgesPushNotificationEnabled?: boolean;
  badgesEmailNotificationEnabled?: boolean;
  ranksPushNotificationEnabled?: boolean;
  ranksEmailNotificationEnabled?: boolean;
}

export interface GetGamificationSettingsData {
  getGamificationSettings: GamificationGeneralSettings;
}

export const GET_GAMIFICATION_SETTINGS = gql`
  query GetGamificationSettings {
    getGamificationSettings {
      isEnabled
      dailyPointsCap
      weeklyPointsCap
      monthlyPointsCap
      enableGlobalPushNotifications
      enableGlobalEmailNotifications
      pointsPushNotificationEnabled
      pointsEmailNotificationEnabled
      badgesPushNotificationEnabled
      badgesEmailNotificationEnabled
      ranksPushNotificationEnabled
      ranksEmailNotificationEnabled
    }
  }
`;

export function useGetGamificationSettings(
  options?: QueryHookOptions<GetGamificationSettingsData>,
) {
  return useQuery<GetGamificationSettingsData>(
    GET_GAMIFICATION_SETTINGS,
    options,
  );
}
