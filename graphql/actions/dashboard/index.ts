import { useQuery } from "@apollo/client";
import {
  GET_DASHBOARD_STATS,
  GET_MODULE_ACTIVITY,
} from "../../quries/dashboard";

export enum TimeRange {
  LAST_24_HOURS = "LAST_24_HOURS",
  LAST_7_DAYS = "LAST_7_DAYS",
  LAST_30_DAYS = "LAST_30_DAYS",
  LAST_90_DAYS = "LAST_90_DAYS",
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
  timeRange: TimeRange;
}

export interface ModuleActivity {
  name: string;
  userCount: number;
}

export interface GetModuleActivityResponse {
  getModuleActivity: ModuleActivity[];
}

export const useGetDashboardStats = (timeRange: TimeRange, options?: any) =>
  useQuery<GetDashboardStatsResponse, GetDashboardStatsVariables>(
    GET_DASHBOARD_STATS,
    {
      variables: { timeRange },
      ...options,
    }
  );

export const useGetModuleActivity = (timeRange: TimeRange, options?: any) =>
  useQuery<GetModuleActivityResponse, { timeRange: TimeRange }>(
    GET_MODULE_ACTIVITY,
    {
      variables: { timeRange },
      ...options,
    }
  );
