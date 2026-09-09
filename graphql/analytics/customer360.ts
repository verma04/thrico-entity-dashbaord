import { gql, useQuery, QueryHookOptions } from "@apollo/client";

export const GET_CUSTOMER_360 = gql`
  query GetCustomer360($userId: ID!) {
    getCustomer360(userId: $userId) {
      userId
      tenantId
      healthScore
      firstSeenAt
      lastActiveAt
      totalEvents
      totalOrders
      totalSpend
      pointsEarned
      communitiesJoined
      postsCreated
      commentsCreated
      eventsAttended
      eventsRegistered
      campaignsReceived
      campaignsOpened
      rfm {
        recencyDays
        frequencyScore
        monetaryScore
        segment
      }
      recentActivity {
        eventType
        entityType
        entityId
        timestamp
        summary
        properties
      }
      # ── Google Analytics (GA4) Digital Intelligence ──────────────────
      gaAnalytics {
        totalSessions
        totalPageViews
        isCurrentlyOnline
        firstTouch {
          channel
          source
          medium
          campaign
          term
          content
          referrerUrl
          landingPage
        }
        lastTouch {
          channel
          source
          medium
          campaign
          landingPage
        }
        devices {
          name
          category
          sessionsCount
          percentage
        }
        browsers {
          name
          category
          sessionsCount
          percentage
        }
        operatingSystems {
          name
          category
          sessionsCount
          percentage
        }
        geoLocation {
          country
          countryCode
          city
          region
          timezone
        }
        topPages {
          pageUrl
          pageTitle
          viewsCount
          lastVisitedAt
        }
      }
    }
  }
`;

export interface Customer360TrafficAcquisitionData {
  channel?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  referrerUrl?: string;
  landingPage?: string;
}

export interface Customer360DeviceData {
  name: string;
  category: "device" | "os" | "browser";
  sessionsCount: number;
  percentage: number;
}

export interface Customer360GeoLocationData {
  country?: string;
  countryCode?: string;
  city?: string;
  region?: string;
  timezone?: string;
}

export interface Customer360TopPageData {
  pageUrl: string;
  pageTitle?: string;
  viewsCount: number;
  lastVisitedAt?: string;
}

export interface Customer360GaAnalyticsData {
  totalSessions: number;
  totalPageViews: number;
  isCurrentlyOnline: boolean;
  firstTouch?: Customer360TrafficAcquisitionData;
  lastTouch?: Customer360TrafficAcquisitionData;
  devices: Customer360DeviceData[];
  browsers: Customer360DeviceData[];
  operatingSystems: Customer360DeviceData[];
  geoLocation?: Customer360GeoLocationData;
  topPages: Customer360TopPageData[];
}

export interface Customer360Data {
  getCustomer360: {
    userId: string;
    tenantId?: string;
    healthScore: number;
    firstSeenAt?: string;
    lastActiveAt?: string;
    totalEvents?: number;
    totalOrders?: number;
    totalSpend?: number;
    pointsEarned?: number;
    communitiesJoined?: number;
    postsCreated?: number;
    commentsCreated?: number;
    eventsAttended?: number;
    eventsRegistered?: number;
    campaignsReceived?: number;
    campaignsOpened?: number;
    rfm?: {
      recencyDays: number;
      frequencyScore: number;
      monetaryScore: number;
      segment: string;
    };
    recentActivity?: Array<{
      eventType: string;
      entityType?: string;
      entityId?: string;
      timestamp: string;
      summary?: string;
      properties?: Record<string, any>;
    }>;
    gaAnalytics?: Customer360GaAnalyticsData;
  };
}

export const useCustomer360 = (
  userId: string,
  options?: QueryHookOptions<Customer360Data, { userId: string }>
) => {
  return useQuery<Customer360Data, { userId: string }>(GET_CUSTOMER_360, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: "cache-and-network",
    ...options,
  });
};
