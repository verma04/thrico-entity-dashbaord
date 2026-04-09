import { useQuery } from "@apollo/client";
import {
  GET_DASHBOARD_STATS,
  GET_MODULE_ACTIVITY,
  GET_COMMUNITY_KPIS,
} from "../../quries/dashboard";

export enum TimeRange {
  LAST_24_HOURS = "LAST_24_HOURS",
  LAST_7_DAYS = "LAST_7_DAYS",
  LAST_30_DAYS = "LAST_30_DAYS",
  LAST_90_DAYS = "LAST_90_DAYS",
}

export interface DateRangeInput {
  startDate: string | null;
  endDate: string | null;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pageViews: number;
  engagementRate: number;
  totalUsersChange: number;
  activeUsersChange: number;
  pageViewsChange: number;
  engagementRateChange: number;
}

export interface GetDashboardStatsResponse {
  getDashboardStats: DashboardStats;
}

export interface GetDashboardStatsVariables {
  dateRange?: DateRangeInput;
}

export interface ModuleActivity {
  name: string;
  userCount: number;
}

export interface GetModuleActivityResponse {
  getModuleActivity: ModuleActivity[];
}

export const useGetDashboardStats = (dateRange?: DateRangeInput, options?: any) =>
  useQuery<GetDashboardStatsResponse, GetDashboardStatsVariables>(
    GET_DASHBOARD_STATS,
    {
      variables: { dateRange },
      ...options,
    }
  );

export const useGetModuleActivity = (timeRange?: TimeRange, dateRange?: DateRangeInput, options?: any) =>
  useQuery<GetModuleActivityResponse, { timeRange?: TimeRange; dateRange?: DateRangeInput }>(
    GET_MODULE_ACTIVITY,
    {
      variables: { timeRange, dateRange },
      ...options,
    }
  );

export interface CommunityKPIData {
  value: string | number;
  change: number;
  trend: number[];
}

export interface ContentTypeBreakdown {
  type: string;
  count: number;
  percentage: number;
}

export interface ModerationStat {
  type: string;
  count: number;
  status: string;
}

export interface ModulePerformance {
  module: string;
  value: string | number;
  subtext: string;
}

export interface CommunityKPIs {
  dailyActiveUsers: CommunityKPIData;
  monthlyActiveUsers: CommunityKPIData;
  engagementRate: CommunityKPIData;
  retentionRate: CommunityKPIData;
  newMembers: CommunityKPIData;
  churnRate: CommunityKPIData;
  healthIndex: CommunityKPIData;
  communityNPS: CommunityKPIData;
  totalPosts: CommunityKPIData;
  contributionFrequency: CommunityKPIData;
  interactionReciprocity: CommunityKPIData;
  contentReach: CommunityKPIData;
  contentTypeBreakdown: ContentTypeBreakdown[];
  memberActivationRate: CommunityKPIData;
  communityAdvocacyIndex: CommunityKPIData;
  superfanRatio: CommunityKPIData;
  moderationStats: ModerationStat[];
  modulePerformance: ModulePerformance[];
}

export interface GetCommunityKPIsResponse {
  getCommunityKPIs: CommunityKPIs;
}

export const useGetCommunityKPIs = (timeRange?: TimeRange, dateRange?: DateRangeInput, options?: any) =>
  useQuery<GetCommunityKPIsResponse, { timeRange?: TimeRange; dateRange?: DateRangeInput }>(
    GET_COMMUNITY_KPIS,
    {
      variables: { timeRange, dateRange },
      ...options,
    }
  );

