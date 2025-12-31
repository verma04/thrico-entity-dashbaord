import { gql } from "@apollo/client";

export const GET_DASHBOARD_STATS = gql`
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

export const GET_MODULE_ACTIVITY = gql`
  query GetModuleActivity($timeRange: TimeRange!) {
    getModuleActivity(timeRange: $timeRange) {
      name
      userCount
    }
  }
`;
