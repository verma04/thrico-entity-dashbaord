import { useMutation, useQuery, QueryHookOptions, MutationHookOptions } from "@apollo/client";
import {
  GET_ADMIN_SOCIAL_ANALYTICS,
  GET_ADMIN_SOCIAL_PUBLICATIONS,
  GET_ADMIN_FEED_SOCIAL_PUBLICATIONS,
  GET_ADMIN_SOCIAL_PUBLICATION_DETAILS,
  SYNC_SOCIAL_PUBLICATION_METRICS,
  SYNC_ALL_SOCIAL_PUBLICATIONS_METRICS,
} from "../../quries/social";

export enum AdminSocialPlatform {
  LINKEDIN = "LINKEDIN",
  FACEBOOK = "FACEBOOK",
  INSTAGRAM = "INSTAGRAM",
}

export interface AdminSocialPublication {
  id: string;
  feedId: string;
  entityId?: string;
  userId?: string;
  socialAccountId?: string;
  platform: AdminSocialPlatform | string;
  platformPostId?: string | null;
  platformMediaId?: string | null;
  permalink?: string | null;
  status: string;
  errorMessage?: string | null;

  // Engagement & Analytics Metrics
  likeCount: number;
  commentCount: number;
  shareCount: number;
  impressionCount: number;
  reachCount: number;
  engagementRate: number;
  metricsBreakdown?: Record<string, any> | null;
  lastSyncedAt?: string | null;

  // Associated Details
  accountName?: string | null;
  accountAvatar?: string | null;
  postTitle?: string | null;
  authorName?: string | null;
  authorAvatar?: string | null;

  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminSocialPlatformSummary {
  platform: AdminSocialPlatform | string;
  publicationsCount: number;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  reach: number;
}

export interface AdminSocialAnalyticsSummary {
  totalPublications: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalImpressions: number;
  totalReach: number;
  avgEngagementRate: number;
  platformBreakdown: AdminSocialPlatformSummary[];
}

export interface GetAdminSocialPublicationsInput {
  platform?: AdminSocialPlatform | string;
  status?: string;
  feedId?: string;
  userId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface AdminSocialPublicationsListResponse {
  total: number;
  publications: AdminSocialPublication[];
}

export interface SyncSocialMetricsResponse {
  success: boolean;
  syncedCount?: number;
  publication?: AdminSocialPublication;
}

// ── Apollo Hooks ──────────────────────────────────────────────────────────────

export const useGetAdminSocialAnalytics = (
  variables?: { platform?: AdminSocialPlatform | string },
  options?: QueryHookOptions<{ getAdminSocialAnalytics: AdminSocialAnalyticsSummary }>
) => {
  return useQuery<{ getAdminSocialAnalytics: AdminSocialAnalyticsSummary }>(
    GET_ADMIN_SOCIAL_ANALYTICS,
    {
      variables,
      fetchPolicy: "cache-and-network",
      ...options,
    }
  );
};

export const useGetAdminSocialPublications = (
  variables?: { input?: GetAdminSocialPublicationsInput },
  options?: QueryHookOptions<{ getAdminSocialPublications: AdminSocialPublicationsListResponse }>
) => {
  return useQuery<{ getAdminSocialPublications: AdminSocialPublicationsListResponse }>(
    GET_ADMIN_SOCIAL_PUBLICATIONS,
    {
      variables,
      fetchPolicy: "cache-and-network",
      ...options,
    }
  );
};

export const useGetAdminFeedSocialPublications = (
  feedId: string,
  options?: QueryHookOptions<{ getAdminFeedSocialPublications: AdminSocialPublication[] }>
) => {
  return useQuery<{ getAdminFeedSocialPublications: AdminSocialPublication[] }>(
    GET_ADMIN_FEED_SOCIAL_PUBLICATIONS,
    {
      variables: { feedId },
      skip: !feedId,
      fetchPolicy: "cache-and-network",
      ...options,
    }
  );
};

export const useGetAdminSocialPublicationDetails = (
  publicationId: string,
  options?: QueryHookOptions<{ getAdminSocialPublicationDetails: AdminSocialPublication }>
) => {
  return useQuery<{ getAdminSocialPublicationDetails: AdminSocialPublication }>(
    GET_ADMIN_SOCIAL_PUBLICATION_DETAILS,
    {
      variables: { publicationId },
      skip: !publicationId,
      fetchPolicy: "cache-and-network",
      ...options,
    }
  );
};

export const useSyncSocialPublicationMetrics = (
  options?: MutationHookOptions<
    { syncSocialPublicationMetrics: SyncSocialMetricsResponse },
    { publicationId: string }
  >
) => {
  return useMutation<
    { syncSocialPublicationMetrics: SyncSocialMetricsResponse },
    { publicationId: string }
  >(SYNC_SOCIAL_PUBLICATION_METRICS, options);
};

export const useSyncAllSocialPublicationsMetrics = (
  options?: MutationHookOptions<
    { syncAllSocialPublicationsMetrics: SyncSocialMetricsResponse },
    { limit?: number }
  >
) => {
  return useMutation<
    { syncAllSocialPublicationsMetrics: SyncSocialMetricsResponse },
    { limit?: number }
  >(SYNC_ALL_SOCIAL_PUBLICATIONS_METRICS, options);
};
