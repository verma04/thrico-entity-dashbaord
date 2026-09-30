import { gql } from "@apollo/client";

export const GET_ADMIN_SOCIAL_ANALYTICS = gql`
  query GetAdminSocialAnalytics($platform: AdminSocialPlatform) {
    getAdminSocialAnalytics(platform: $platform) {
      totalPublications
      totalLikes
      totalComments
      totalShares
      totalImpressions
      totalReach
      avgEngagementRate
      platformBreakdown {
        platform
        publicationsCount
        likes
        comments
        shares
        impressions
        reach
      }
    }
  }
`;

export const GET_ADMIN_SOCIAL_PUBLICATIONS = gql`
  query GetAdminSocialPublications($input: GetAdminSocialPublicationsInput) {
    getAdminSocialPublications(input: $input) {
      total
      publications {
        id
        feedId
        entityId
        userId
        socialAccountId
        platform
        platformPostId
        platformMediaId
        permalink
        status
        errorMessage
        likeCount
        commentCount
        shareCount
        impressionCount
        reachCount
        engagementRate
        metricsBreakdown
        lastSyncedAt
        accountName
        accountAvatar
        postTitle
        authorName
        authorAvatar
        publishedAt
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_ADMIN_FEED_SOCIAL_PUBLICATIONS = gql`
  query GetAdminFeedSocialPublications($feedId: ID!) {
    getAdminFeedSocialPublications(feedId: $feedId) {
      id
      feedId
      entityId
      userId
      socialAccountId
      platform
      platformPostId
      platformMediaId
      permalink
      status
      errorMessage
      likeCount
      commentCount
      shareCount
      impressionCount
      reachCount
      engagementRate
      metricsBreakdown
      lastSyncedAt
      accountName
      accountAvatar
      postTitle
      authorName
      authorAvatar
      publishedAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_ADMIN_SOCIAL_PUBLICATION_DETAILS = gql`
  query GetAdminSocialPublicationDetails($publicationId: ID!) {
    getAdminSocialPublicationDetails(publicationId: $publicationId) {
      id
      feedId
      entityId
      userId
      socialAccountId
      platform
      platformPostId
      platformMediaId
      permalink
      status
      errorMessage
      likeCount
      commentCount
      shareCount
      impressionCount
      reachCount
      engagementRate
      metricsBreakdown
      lastSyncedAt
      accountName
      accountAvatar
      postTitle
      authorName
      authorAvatar
      publishedAt
      createdAt
      updatedAt
    }
  }
`;

export const SYNC_SOCIAL_PUBLICATION_METRICS = gql`
  mutation SyncSocialPublicationMetrics($publicationId: ID!) {
    syncSocialPublicationMetrics(publicationId: $publicationId) {
      success
      syncedCount
      publication {
        id
        platform
        likeCount
        commentCount
        shareCount
        impressionCount
        reachCount
        engagementRate
        lastSyncedAt
      }
    }
  }
`;

export const SYNC_ALL_SOCIAL_PUBLICATIONS_METRICS = gql`
  mutation SyncAllSocialPublicationsMetrics($limit: Int) {
    syncAllSocialPublicationsMetrics(limit: $limit) {
      success
      syncedCount
    }
  }
`;
