import { gql, useQuery, QueryHookOptions } from "@apollo/client";
import { TimeRange, DateRangeInput } from "../actions/dashboard";

export const GET_SESSION_ANALYTICS = gql`
  query GetSessionAnalytics($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getSessionAnalytics(timeRange: $timeRange, dateRange: $dateRange) {
      totalSessions
      totalPageViews
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
    }
  }
`;

export interface DeviceBreakdown {
  deviceOs: string;
  sessions: number;
  percentage: number;
}

export interface BrowserBreakdown {
  browser: string;
  sessions: number;
  percentage: number;
}

export interface SourceBreakdown {
  source: string;
  sessions: number;
  percentage: number;
}

export interface SessionAnalyticsData {
  getSessionAnalytics: {
    totalSessions: number;
    totalPageViews: number;
    avgSessionDurationSeconds: number;
    devices: DeviceBreakdown[];
    browsers: BrowserBreakdown[];
    sources: SourceBreakdown[];
  };
}

export interface SessionAnalyticsVariables {
  timeRange?: TimeRange | string;
  dateRange?: DateRangeInput;
}

export const useSessionAnalytics = (
  variables?: SessionAnalyticsVariables,
  options?: QueryHookOptions<SessionAnalyticsData, SessionAnalyticsVariables>
) => {
  return useQuery<SessionAnalyticsData, SessionAnalyticsVariables>(GET_SESSION_ANALYTICS, {
    variables: { timeRange: TimeRange.LAST_30_DAYS, ...variables },
    fetchPolicy: "cache-and-network",
    ...options,
  });
};
