import { gql, QueryHookOptions, useQuery } from "@apollo/client";

// ---------------------------------------------------------
// ENUMS
// ---------------------------------------------------------

export enum TimeRange {
  LAST_24_HOURS = "LAST_24_HOURS",
  LAST_7_DAYS = "LAST_7_DAYS",
  LAST_30_DAYS = "LAST_30_DAYS",
  LAST_90_DAYS = "LAST_90_DAYS",
}

// ---------------------------------------------------------
// DASHBOARD STATS
// ---------------------------------------------------------

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

export interface GetDashboardStatsData {
  getDashboardStats: DashboardStats;
}

export interface GetDashboardStatsVariables {
  timeRange: TimeRange;
}

const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats($timeRange: TimeRange!) {
    getDashboardStats(timeRange: $timeRange) {
      totalUsers
      activeUsers
      pageViews
      engagementRate
      totalUsersChange
      activeUsersChange
      pageViewsChange
      engagementRateChange
    }
  }
`;

export function useGetDashboardStats(
  timeRange: TimeRange,
  options?: QueryHookOptions<GetDashboardStatsData, GetDashboardStatsVariables>,
) {
  return useQuery<GetDashboardStatsData, GetDashboardStatsVariables>(
    GET_DASHBOARD_STATS,
    {
      variables: { timeRange },
      ...options,
    },
  );
}

// ---------------------------------------------------------
// MODULE ACTIVITY
// ---------------------------------------------------------

export interface ModuleActivity {
  name: string;
  userCount: number;
}

export interface GetModuleActivityData {
  getModuleActivity: ModuleActivity[];
}

export interface GetModuleActivityVariables {
  timeRange: TimeRange;
}

const GET_MODULE_ACTIVITY = gql`
  query GetModuleActivity($timeRange: TimeRange!) {
    getModuleActivity(timeRange: $timeRange) {
      name
      userCount
    }
  }
`;

export function useGetModuleActivity(
  timeRange: TimeRange,
  options?: QueryHookOptions<GetModuleActivityData, GetModuleActivityVariables>,
) {
  return useQuery<GetModuleActivityData, GetModuleActivityVariables>(
    GET_MODULE_ACTIVITY,
    {
      variables: { timeRange },
      ...options,
    },
  );
}

// ---------------------------------------------------------
// PLATFORM MODULE ACTIVITY
// ---------------------------------------------------------

export interface PlatformModuleItem {
  name: string;
  itemCount: number;
}

export interface PlatformModuleActivity {
  total: number;
  active: number;
  inactive: number;
  modules: PlatformModuleItem[];
}

export interface GetPlatformModuleActivityData {
  getPlatformModuleActivity: PlatformModuleActivity;
}

export interface GetPlatformModuleActivityVariables {
  timeRange: TimeRange;
}

const GET_PLATFORM_MODULE_ACTIVITY = gql`
  query GetPlatformModuleActivity($timeRange: TimeRange!) {
    getPlatformModuleActivity(timeRange: $timeRange) {
      total
      active
      inactive
      modules {
        name
        itemCount
      }
    }
  }
`;

export function useGetPlatformModuleActivity(
  timeRange: TimeRange,
  options?: QueryHookOptions<
    GetPlatformModuleActivityData,
    GetPlatformModuleActivityVariables
  >,
) {
  return useQuery<
    GetPlatformModuleActivityData,
    GetPlatformModuleActivityVariables
  >(GET_PLATFORM_MODULE_ACTIVITY, {
    variables: { timeRange },
    ...options,
  });
}
