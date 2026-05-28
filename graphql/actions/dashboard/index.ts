import { useQuery } from "@apollo/client";
import {
  GET_DASHBOARD_STATS,
  GET_MODULE_ACTIVITY,
  GET_COMMUNITY_KPIS,
  GET_DEVICE_DISTRIBUTION,
  GET_LOGIN_SESSIONS_REPORT,
  GET_GROWTH_STATS,
} from "../../quries/dashboard";

export enum TimeRange {
  LAST_24_HOURS = "LAST_24_HOURS",
  LAST_7_DAYS = "LAST_7_DAYS",
  LAST_30_DAYS = "LAST_30_DAYS",
  LAST_90_DAYS = "LAST_90_DAYS",
  THIS_MONTH = "THIS_MONTH",
  LAST_MONTH = "LAST_MONTH",
}

export interface DeviceDataPoint {
  date: string;
  android: number;
  ios: number;
  web: number;
}

export interface GetDeviceDistributionResponse {
  getDeviceDistribution: DeviceDataPoint[];
}

export const useGetDeviceDistribution = (timeRange?: TimeRange, dateRange?: DateRangeInput, options?: any) =>
  useQuery<GetDeviceDistributionResponse, { timeRange?: TimeRange; dateRange?: DateRangeInput }>(
    GET_DEVICE_DISTRIBUTION,
    {
      variables: { timeRange, dateRange },
      ...options,
    }
  );

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
  referralsJoined?: CommunityKPIData;
  gamificationPointsEarned?: CommunityKPIData;
  badgesEarned?: CommunityKPIData;
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

export enum GroupBy {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

export interface LoginSessionReportItem {
  time: string;
  desktop: number;
  mobile: number;
}

export interface GetLoginSessionsReportResponse {
  getLoginSessionsReport: LoginSessionReportItem[];
}

export const useGetLoginSessionsReport = (timeRange?: TimeRange, groupBy?: GroupBy, dateRange?: DateRangeInput, options?: any) =>
  useQuery<GetLoginSessionsReportResponse, { timeRange?: TimeRange; groupBy?: GroupBy; dateRange?: DateRangeInput }>(
    GET_LOGIN_SESSIONS_REPORT,
    {
      variables: { timeRange, groupBy, dateRange },
      ...options,
    }
  );

export interface GrowthDataPoint {
  date: string;
  count: number;
}

export interface GetGrowthStatsResponse {
  getGrowthStats: {
    data: GrowthDataPoint[];
    totalNewMembers: number;
    growthRate: number;
  };
}

export const useGetGrowthStats = (timeRange?: TimeRange, groupBy?: GroupBy, dateRange?: DateRangeInput, options?: any) =>
  useQuery<GetGrowthStatsResponse, { timeRange?: TimeRange; groupBy?: GroupBy; dateRange?: DateRangeInput }>(
    GET_GROWTH_STATS,
    {
      variables: { timeRange, groupBy, dateRange },
      ...options,
    }
  );
