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
    }
  }
`;

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
      segment:
        | "CHAMPION"
        | "LOYAL"
        | "POTENTIAL_LOYALIST"
        | "NEW"
        | "AT_RISK"
        | "HIBERNATING"
        | "LOST"
        | string;
    };
    recentActivity?: Array<{
      eventType: string;
      entityType?: string;
      entityId?: string;
      timestamp: string;
      summary?: string;
      properties?: Record<string, any>;
    }>;
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
