import { gql, useQuery, QueryHookOptions } from "@apollo/client";
import type { DateRangeInput } from "./sessionAnalytics";
import type { ConversionFunnelStep } from "./conversionFunnel";
import type { CohortRetentionVariables } from "./cohortRetention";

// ============================================================================

// TypeScript Types & Interfaces
// ============================================================================

export type TimeRange =
  | "LAST_24_HOURS"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "LAST_90_DAYS"
  | "THIS_MONTH"
  | "LAST_MONTH";


export interface Analytics360TimeSeriesPoint {
  date: string;
  events: number;
  activeUsers: number;
  revenue: number;
}

export interface Analytics360DashboardStats {
  activeUsers: number;
  totalEvents: number;
  totalPosts: number;
  totalComments: number;
  totalOrders: number;
  totalRevenue: number;
  timeSeries?: Analytics360TimeSeriesPoint[];
}

export interface Analytics360DeviceBreakdown {
  deviceOs: string;
  sessions: number;
  percentage: number;
}

export interface Analytics360BrowserBreakdown {
  browser: string;
  sessions: number;
  percentage: number;
}

export interface Analytics360SourceBreakdown {
  source: string;
  sessions: number;
  percentage: number;
}

export interface Analytics360DeviceCategoryBreakdown {
  category: string;
  sessions: number;
  percentage: number;
}

export interface Analytics360CountryBreakdown {
  country: string;
  countryCode?: string;
  sessions: number;
  percentage: number;
}

export interface Analytics360TopPage {
  pageUrl: string;
  pageTitle?: string;
  views: number;
  percentage: number;
}

export interface Analytics360SessionStats {
  totalSessions: number;
  totalPageViews: number;
  totalUsers: number;
  activeUsersNow: number;
  devices: Analytics360DeviceBreakdown[];
  browsers: Analytics360BrowserBreakdown[];
  sources: Analytics360SourceBreakdown[];
  deviceCategories: Analytics360DeviceCategoryBreakdown[];
  countries: Analytics360CountryBreakdown[];
  topPages: Analytics360TopPage[];
}

export interface Analytics360RetentionPeriod {
  periodIndex: number;
  periodName: string;
  retainedCount: number;
  retentionPercent: number;
}

export interface Analytics360Cohort {
  cohortPeriod: string;
  cohortSize: number;
  retentionPeriods: Analytics360RetentionPeriod[];
}

export interface Analytics360CohortRetention {
  periodType: string;
  cohorts: Analytics360Cohort[];
}

export interface Analytics360ChurnRiskMember {
  userId: string;
  healthScore: number;
  rfmSegment: string;
  lastActive: string;
  daysInactive: number;
  churnRiskLevel: "HIGH" | "MEDIUM" | "LOW" | string;
  recommendedAction: string;
}

export interface Analytics360EventTypeSummary {
  eventType: string;
  count: number;
  percentage: number;
}

export interface ConversionFunnelResponse {
  funnelType: string;
  totalStarted: number;
  totalCompleted: number;
  overallConversionRate: number;
  steps: ConversionFunnelStep[];
}

export interface Analytics360LiveEvent {
  eventId: string;
  eventType: string;
  entityType: string;
  entityId: string;
  eventTime: string;
  source: string;
  userId?: string;
  pageUrl?: string;
  pageTitle?: string;
  properties?: any;
}

export interface Customer360TimelineItem {
  eventId: string;
  eventType: string;
  category: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  title: string;
  description: string;
  source: string;
  pageUrl?: string;
  pageTitle?: string;
  properties?: any;
}

export interface Customer360TimelineResponse {
  total: number;
  events: Customer360TimelineItem[];
}

export interface Analytics360Response {
  tenantId: string;
  generatedAt: string;
  dashboard?: Analytics360DashboardStats;
  sessions?: Analytics360SessionStats;
  cohortRetention?: Analytics360CohortRetention;
  churnRiskMembers?: Analytics360ChurnRiskMember[];
  topEventTypes?: Analytics360EventTypeSummary[];
  conversionFunnel?: ConversionFunnelResponse;
}

// ============================================================================
// 1. Unified 360 Overview Query
// ============================================================================

export const GET_ANALYTICS_360 = gql`
  query GetAnalytics360($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getAnalytics360(timeRange: $timeRange, dateRange: $dateRange) {
      tenantId
      generatedAt
      dashboard {
        activeUsers
        totalEvents
        totalPosts
        totalComments
        totalOrders
        totalRevenue
        timeSeries {
          date
          events
          activeUsers
          revenue
        }
      }
      sessions {
        totalSessions
        totalPageViews
        totalUsers
        activeUsersNow
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
      cohortRetention {
        periodType
        cohorts {
          cohortPeriod
          cohortSize
          retentionPeriods {
            periodIndex
            periodName
            retainedCount
            retentionPercent
          }
        }
      }
      churnRiskMembers {
        userId
        healthScore
        rfmSegment
        lastActive
        daysInactive
        churnRiskLevel
        recommendedAction
      }
      topEventTypes {
        eventType
        count
        percentage
      }
      conversionFunnel {
        funnelType
        totalStarted
        totalCompleted
        overallConversionRate
        steps {
          stepIndex
          name
          eventType
          count
          conversionRate
          dropOffRate
        }
      }
    }
  }
`;

export interface GetAnalytics360Data {
  getAnalytics360: Analytics360Response;
}

export interface Analytics360Variables {
  timeRange?: TimeRange;
  dateRange?: DateRangeInput;
}

export function useAnalytics360(
  variables: Analytics360Variables = { timeRange: "LAST_30_DAYS" },
  options?: QueryHookOptions<GetAnalytics360Data, Analytics360Variables>
) {
  return useQuery<GetAnalytics360Data, Analytics360Variables>(GET_ANALYTICS_360, {
    variables,
    fetchPolicy: "cache-and-network",
    ...options,
  });
}

// ============================================================================
// 2. Headline KPIs & Trends (Overview Tab)
// ============================================================================

export const GET_ANALYTICS_360_OVERVIEW = gql`
  query GetAnalytics360Overview($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getAnalytics360Overview(timeRange: $timeRange, dateRange: $dateRange) {
      activeUsers
      totalEvents
      totalPosts
      totalComments
      totalOrders
      totalRevenue
      timeSeries {
        date
        events
        activeUsers
        revenue
      }
    }
  }
`;

export interface GetAnalytics360OverviewData {
  getAnalytics360Overview: Analytics360DashboardStats;
}

export function useAnalytics360Overview(
  variables: Analytics360Variables = { timeRange: "LAST_30_DAYS" },
  options?: QueryHookOptions<GetAnalytics360OverviewData, Analytics360Variables>
) {
  return useQuery<GetAnalytics360OverviewData, Analytics360Variables>(
    GET_ANALYTICS_360_OVERVIEW,
    {
      variables,
      fetchPolicy: "cache-and-network",
      ...options,
    }
  );
}

// ============================================================================
// 3. Traffic, Devices & Pages (Sessions Tab)
// ============================================================================

export const GET_ANALYTICS_360_SESSIONS = gql`
  query GetAnalytics360Sessions($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getAnalytics360Sessions(timeRange: $timeRange, dateRange: $dateRange) {
      totalSessions
      totalPageViews
      totalUsers
      activeUsersNow
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

export interface GetAnalytics360SessionsData {
  getAnalytics360Sessions: Analytics360SessionStats;
}

export function useAnalytics360Sessions(
  variables: Analytics360Variables = { timeRange: "LAST_30_DAYS" },
  options?: QueryHookOptions<GetAnalytics360SessionsData, Analytics360Variables>
) {
  return useQuery<GetAnalytics360SessionsData, Analytics360Variables>(
    GET_ANALYTICS_360_SESSIONS,
    {
      variables,
      fetchPolicy: "cache-and-network",
      ...options,
    }
  );
}

// ============================================================================
// 4. Cohort Retention Heatmap (Cohorts Tab)
// ============================================================================

export const GET_ANALYTICS_360_COHORT_RETENTION = gql`
  query GetAnalytics360CohortRetention($period: String, $cohortCount: Int) {
    getAnalytics360CohortRetention(period: $period, cohortCount: $cohortCount) {
      periodType
      cohorts {
        cohortPeriod
        cohortSize
        retentionPeriods {
          periodIndex
          periodName
          retainedCount
          retentionPercent
        }
      }
    }
  }
`;

export interface GetAnalytics360CohortRetentionData {
  getAnalytics360CohortRetention: Analytics360CohortRetention;
}

export function useAnalytics360CohortRetention(
  variables: CohortRetentionVariables = { period: "week", cohortCount: 6 },
  options?: QueryHookOptions<
    GetAnalytics360CohortRetentionData,
    CohortRetentionVariables
  >
) {
  return useQuery<
    GetAnalytics360CohortRetentionData,
    CohortRetentionVariables
  >(GET_ANALYTICS_360_COHORT_RETENTION, {
    variables,
    fetchPolicy: "cache-and-network",
    ...options,
  });
}

// ============================================================================
// 5. At-Risk Members & Interventions (Churn Risk Tab)
// ============================================================================

export const GET_ANALYTICS_360_CHURN_RISK = gql`
  query GetAnalytics360ChurnRisk($limit: Int) {
    getAnalytics360ChurnRisk(limit: $limit) {
      userId
      healthScore
      rfmSegment
      lastActive
      daysInactive
      churnRiskLevel
      recommendedAction
    }
  }
`;

export interface GetAnalytics360ChurnRiskData {
  getAnalytics360ChurnRisk: Analytics360ChurnRiskMember[];
}

export interface ChurnRiskVariables {
  limit?: number;
}

export function useAnalytics360ChurnRisk(
  limit: number = 20,
  options?: QueryHookOptions<GetAnalytics360ChurnRiskData, ChurnRiskVariables>
) {
  return useQuery<GetAnalytics360ChurnRiskData, ChurnRiskVariables>(
    GET_ANALYTICS_360_CHURN_RISK,
    {
      variables: { limit },
      fetchPolicy: "cache-and-network",
      ...options,
    }
  );
}

// ============================================================================
// 6. Conversion Funnels (Funnels Tab)
// ============================================================================

export const GET_ANALYTICS_360_FUNNEL = gql`
  query GetAnalytics360Funnel($funnelType: String!, $entityId: ID) {
    getAnalytics360Funnel(funnelType: $funnelType, entityId: $entityId) {
      funnelType
      totalStarted
      totalCompleted
      overallConversionRate
      steps {
        stepIndex
        name
        eventType
        count
        conversionRate
        dropOffRate
      }
    }
  }
`;

export interface GetAnalytics360FunnelData {
  getAnalytics360Funnel: ConversionFunnelResponse;
}

export interface FunnelVariables {
  funnelType: "ONBOARDING" | "COMMERCE" | "EVENT_REGISTRATION" | string;
  entityId?: string;
}

export function useAnalytics360Funnel(
  variables: FunnelVariables = { funnelType: "ONBOARDING" },
  options?: QueryHookOptions<GetAnalytics360FunnelData, FunnelVariables>
) {
  return useQuery<GetAnalytics360FunnelData, FunnelVariables>(
    GET_ANALYTICS_360_FUNNEL,
    {
      variables,
      fetchPolicy: "cache-and-network",
      ...options,
    }
  );
}

// ============================================================================
// 7. Real-Time Activity Feed (Live Feed Tab / Widget)
// ============================================================================

export const GET_ANALYTICS_360_LIVE_EVENTS = gql`
  query GetAnalytics360LiveEvents($limit: Int, $eventType: String) {
    getAnalytics360LiveEvents(limit: $limit, eventType: $eventType) {
      eventId
      eventType
      entityType
      entityId
      eventTime
      source
      userId
      pageUrl
      pageTitle
      properties
    }
  }
`;

export interface GetAnalytics360LiveEventsData {
  getAnalytics360LiveEvents: Analytics360LiveEvent[];
}

export interface LiveEventsVariables {
  limit?: number;
  eventType?: string;
}

export function useAnalytics360LiveEvents(
  variables: LiveEventsVariables = { limit: 30 },
  options?: QueryHookOptions<GetAnalytics360LiveEventsData, LiveEventsVariables>
) {
  return useQuery<GetAnalytics360LiveEventsData, LiveEventsVariables>(
    GET_ANALYTICS_360_LIVE_EVENTS,
    {
      variables,
      fetchPolicy: "network-only",
      ...options,
    }
  );
}

// ============================================================================
// 8. User Activity Timeline (Drill-down Modal)
// ============================================================================

export const GET_CUSTOMER_360_TIMELINE = gql`
  query GetCustomer360Timeline($userId: ID!, $limit: Int, $offset: Int) {
    getCustomer360Timeline(userId: $userId, limit: $limit, offset: $offset) {
      total
      events {
        eventId
        eventType
        category
        entityType
        entityId
        timestamp
        title
        description
        source
        pageUrl
        pageTitle
        properties
      }
    }
  }
`;

export interface GetCustomer360TimelineData {
  getCustomer360Timeline: Customer360TimelineResponse;
}

export interface Customer360TimelineVariables {
  userId: string;
  limit?: number;
  offset?: number;
}

export function useCustomer360Timeline(
  userId: string,
  options?: QueryHookOptions<
    GetCustomer360TimelineData,
    Customer360TimelineVariables
  >
) {
  return useQuery<GetCustomer360TimelineData, Customer360TimelineVariables>(
    GET_CUSTOMER_360_TIMELINE,
    {
      variables: { userId, limit: 50, offset: 0 },
      skip: !userId,
      fetchPolicy: "cache-and-network",
      ...options,
    }
  );
}
