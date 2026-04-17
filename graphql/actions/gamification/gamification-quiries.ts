import { gql, QueryHookOptions, useQuery } from "@apollo/client";
import { DateRangeInput, TimeRange } from "../dashbaord/dashboard-quries";
export { TimeRange };
export type { DateRangeInput };
import {
  GET_GAMIFICATION_SUMMARY,
  GET_USER_ACTIVITY_LOG,
  GET_USER_EARNED_BADGES,
} from "../../quries/gamification";

export interface GamificationModule {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface GamificationTrigger {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  type: string;
}

export interface GetEntityGamificationModulesData {
  getEntityGamificationModules: {
    modules: GamificationModule[];
    triggers: GamificationTrigger[];
  };
}

const GET_ENTITY_GAMIFICATION_MODULES = gql`
  query GetEntityGamificationModules {
    getEntityGamificationModules {
      modules {
        id
        name
        description
        icon
      }
      triggers {
        id
        moduleId
        name
        description
        type
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetBadgesData {
  getBadges: Badge[];
}

const GET_BADGES = gql`
  query GetBadges {
    getBadges {
      id
      name
      description
      icon
      type
      module
      action
      targetValue
      condition
      isActive
      createdAt
      updatedAt
    }
  }
`;

export function useGetBadges(options?: QueryHookOptions<GetBadgesData>) {
  return useQuery<GetBadgesData>(GET_BADGES, options);
}

// ---------------------------------------------------------
// POINT RULES
// ---------------------------------------------------------

export interface PointRule {
  id: string;
  module: string;
  action: string;
  trigger: string;
  points: number;
  dailyCap?: number;
  weeklyCap?: number;
  monthlyCap?: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PointRuleFilter {
  isActive?: boolean | null;
  module?: string | null;
  trigger?: string | null;
}

export interface GetPointRulesData {
  getPointRules: PointRule[];
}

const GET_POINT_RULES = gql`
  query GetPointRules($filter: PointRuleFilter) {
    getPointRules(filter: $filter) {
      id
      module
      action
      trigger
      points
      dailyCap
      weeklyCap
      monthlyCap
      description
      isActive
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
  query GetGamificationStats($timeRange: TimeRange, $dateRange: DateRangeInput) {
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
  options?: QueryHookOptions<GetGamificationStatsData, { timeRange?: TimeRange; dateRange?: DateRangeInput }>,
) {
  return useQuery<GetGamificationStatsData, { timeRange?: TimeRange; dateRange?: DateRangeInput }>(GET_GAMIFICATION_STATS, {
    variables: { timeRange, dateRange },
    ...options
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
}

export interface GetLeaderboardData {
  getLeaderboard: {
    totalUsers: number;
    userPosition?: number;
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
      }
      totalUsers
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
}

export interface GamificationActivityLogInput {
  limit: number;
  offset: number;
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
  options?: any,
) =>
  useQuery(GET_USER_ACTIVITY_LOG, {
    variables: { userId, limit, offset },
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
