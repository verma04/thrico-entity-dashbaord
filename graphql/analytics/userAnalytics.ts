import { gql, useQuery, QueryHookOptions } from "@apollo/client";

export const GET_USER_ANALYTICS = gql`
  query GetUserAnalytics($timeRange: TimeRange) {
    getUserAnalytics(timeRange: $timeRange) {
      totalMembers
      verifiedMembers
      verifiedPercent
      activeMembers
      activePercent
      newMembersThisMonth
      dau
      wau
      mau
    }
  }
`;

export interface UserAnalyticsData {
  getUserAnalytics: {
    totalMembers: number;
    verifiedMembers: number;
    verifiedPercent: number;
    activeMembers: number;
    activePercent: number;
    newMembersThisMonth: number;
    dau: number;
    wau: number;
    mau: number;
  };
}

export const useUserAnalytics = (
  timeRange: string = "LAST_30_DAYS",
  options?: QueryHookOptions<UserAnalyticsData, { timeRange?: string }>
) => {
  return useQuery<UserAnalyticsData, { timeRange?: string }>(GET_USER_ANALYTICS, {
    variables: { timeRange },
    ...options,
  });
};
