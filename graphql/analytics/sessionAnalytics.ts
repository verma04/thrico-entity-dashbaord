import { gql, useQuery, QueryHookOptions } from "@apollo/client";

export const GET_SESSION_ANALYTICS = gql`
  query GetSessionAnalytics($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getSessionAnalytics(timeRange: $timeRange, dateRange: $dateRange) {
      totalSessions
      totalPageViews
      totalUsers
      activeUsersNow
      avgSessionDurationSeconds
      devices {
        deviceOs
        sessions
        percentage
      }
      browsers {
        browser
        sessions
        percentage
      }
      sources {
        source
        sessions
        percentage
      }
      deviceCategories {
        category
        sessions
        percentage
      }
      countries {
        country
        countryCode
        sessions
        percentage
      }
      topPages {
        pageUrl
        pageTitle
        views
        percentage
      }
    }
  }
`;

export interface DateRangeInput {
  startDate: string;
  endDate: string;
}

export interface SessionAnalyticsVariables {
  timeRange?: "LAST_24_HOURS" | "LAST_7_DAYS" | "LAST_30_DAYS" | "LAST_90_DAYS" | "THIS_MONTH" | "LAST_MONTH" | string;
  dateRange?: DateRangeInput;
}

export interface SessionAnalyticsResponse {
  getSessionAnalytics: {
    totalSessions: number;
    totalPageViews: number;
    totalUsers?: number;
    activeUsersNow?: number;
    avgSessionDurationSeconds?: number;
    devices: Array<{ deviceOs: string; sessions: number; percentage: number }>;
    browsers: Array<{ browser: string; sessions: number; percentage: number }>;
    sources: Array<{ source: string; sessions: number; percentage: number }>;
    deviceCategories?: Array<{ category: string; sessions: number; percentage: number }>;
    countries?: Array<{ country: string; countryCode?: string; sessions: number; percentage: number }>;
    topPages?: Array<{ pageUrl: string; pageTitle?: string; views: number; percentage: number }>;
  };
}

export type SessionAnalyticsData = SessionAnalyticsResponse;

export const useSessionAnalytics = (
  variables?: SessionAnalyticsVariables,
  options?: QueryHookOptions<SessionAnalyticsResponse, SessionAnalyticsVariables>
) => {
  return useQuery<SessionAnalyticsResponse, SessionAnalyticsVariables>(GET_SESSION_ANALYTICS, {
    variables,
    fetchPolicy: "cache-and-network",
    ...options,
  });
};
