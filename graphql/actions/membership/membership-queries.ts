import { useQuery } from "@apollo/client";
import {
  GET_MEMBERS_TERMS_AND_CONDITIONS,
  GET_USER_ANALYTICS,
  GET_USER_GROWTH,
  GET_USER_ROLE_DISTRIBUTION,
  GET_ALL_USER,
  GET_USER_DETIALS,
  GET_USER_STATS,
  GET_MEMBERS_STATS,
  GET_GROWTH_STATS,
  GET_USER_REFERRALS,
} from "../../quries/user";
import { TimeRange, DateRangeInput } from "../dashbaord/dashboard-quries";

// ---------------------------------------------------------
// TYPES & INTERFACES
// ---------------------------------------------------------

export interface GrowthStats {
  totalNewMembers: number;
  growthRate: number;
  data: {
    date: string;
    count: number;
  }[];
}

export interface GetGrowthStatsResponse {
  getGrowthStats: GrowthStats;
}

export interface MembersStats {

  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  activeRate: number;
  totalMembersChange: number;
  activeMembersChange: number;
  newMembersChange: number;
  activeRateChange: number;
}

export interface GetMembersStatsResponse {
  getMembersStats: MembersStats;
}

export interface UserAnalytics {
  totalMembers: number;
  verifiedMembers: number;
  verifiedPercent: number;
  activeMembers: number;
  activePercent: number;
  newMembersThisMonth: number;
}

export interface GetUserAnalyticsResponse {
  getUserAnalytics: UserAnalytics;
}

export interface UserGrowthItem {
  date: string;
  count: number;
}

export interface GetUserGrowthResponse {
  getUserGrowth: UserGrowthItem[];
}

export interface UserRoleDistributionItem {
  name: string;
  value: number;
}

export interface GetUserRoleDistributionResponse {
  getUserRoleDistribution: UserRoleDistributionItem[];
}

export interface UserDetail {
  id: string;
  isApproved: boolean;
  status: string;
  lastActive?: string;
  verification?: {
    isVerified: boolean;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    createdAt: string;
    location?: {
      name: string;
    };
    about?: {
      headline?: string;
      currentPosition?: string;
      about?: string;
    };
    profile?: {
      phone?: {
        countryCode: string;
        phoneNumber: string;
      };
    };
  };
}

export interface GetAllUserResponse {
  getAllUser: UserDetail[];
}

export interface UserReferralData {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    location: {
      name: string;
    } | null;
    avatar: string;
    cover: string;
    createdAt: string;
  };
}

export interface GetUserReferralsResponse {
  getUserReferrals: {
    totalCount: number;
    hasNextPage: boolean;
    data: UserReferralData[];
  };
}

// ---------------------------------------------------------
// QUERY HOOKS
// ---------------------------------------------------------

export const useGetUserAnalytics = (timeRange?: TimeRange, options?: any) =>
  useQuery<GetUserAnalyticsResponse>(GET_USER_ANALYTICS, {
    variables: { timeRange },
    ...options,
  });

export const useGetUserGrowth = (timeRange: TimeRange, options?: any) =>
  useQuery<GetUserGrowthResponse>(GET_USER_GROWTH, {
    variables: { timeRange },
    ...options,
  });

export const useGetUserRoleDistribution = (
  timeRange: TimeRange,
  options?: any,
) =>
  useQuery<GetUserRoleDistributionResponse>(GET_USER_ROLE_DISTRIBUTION, {
    variables: { timeRange },
    ...options,
  });

export const useGetAllUser = (input?: {
  status?: string | null;
  limit?: number | null;
  offset?: number | null;
  industryId?: string | null;
}) =>
  useQuery<GetAllUserResponse>(GET_ALL_USER, {
    variables: {
      input: {
        status: input?.status ?? "ALL",
        limit: input?.limit ?? null,
        offset: input?.offset,
        industryId: input?.industryId ?? null,
      },
    },
    fetchPolicy: "network-only",
  });

export const useGetUserDetailsById = (options: any) =>
  useQuery(GET_USER_DETIALS, options);

export const useMembersTermsAndConditions = () =>
  useQuery(GET_MEMBERS_TERMS_AND_CONDITIONS);

export const useGetUserStats = (userId: string, options?: any) =>
  useQuery(GET_USER_STATS, {
    variables: { userId },
    skip: !userId,
    ...options,
  });

export const useGetMembersStats = (
  timeRange?: TimeRange,
  dateRange?: DateRangeInput,
  options?: any,
) =>
  useQuery<GetMembersStatsResponse>(GET_MEMBERS_STATS, {
    variables: { timeRange, dateRange },
    ...options,
  });

export const useGetGrowthStats = (
  timeRange?: TimeRange,
  dateRange?: DateRangeInput,
  options?: any,
) =>
  useQuery<GetGrowthStatsResponse>(GET_GROWTH_STATS, {
    variables: { timeRange, dateRange },
    ...options,
  });

export const useGetUserReferrals = (
  input: { userId: string; limit?: number; offset?: number },
  options?: any,
) =>
  useQuery<GetUserReferralsResponse>(GET_USER_REFERRALS, {
    variables: { input },
    skip: !input.userId,
    ...options,
  });
