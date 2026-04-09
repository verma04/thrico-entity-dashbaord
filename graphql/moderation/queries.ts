import { gql } from "@apollo/client";

export const GET_BANNED_WORDS = gql`
  query GetBannedWords($limit: Int, $offset: Int) {
    getBannedWords(limit: $limit, offset: $offset) {
      items {
        id
        word
        severity
        category
        isActive
        createdAt
      }
      totalCount
    }
  }
`;

export const GET_BLOCKED_LINKS = gql`
  query GetBlockedLinks($limit: Int, $offset: Int) {
    getBlockedLinks(limit: $limit, offset: $offset) {
      items {
        id
        url
        type
        isBlocked
        reason
        createdAt
      }
      totalCount
    }
  }
`;

export const GET_CONTENT_REPORTS = gql`
  query GetContentReports(
    $status: ReportStatus
    $contentType: String
    $limit: Int
    $offset: Int
  ) {
    getContentReports(
      status: $status
      contentType: $contentType
      limit: $limit
      offset: $offset
    ) {
      items {
        id
        contentType
        contentId
        contentPreview
        reason
        status
        reportsCount
        createdAt
        reportedBy {
          id
          firstName
          lastName
        }
        reportedUser {
          id
          firstName
          lastName
        }
      }
      totalCount
    }
  }
`;

export const GET_MODERATION_SETTINGS = gql`
  query GetModerationSettings {
    getModerationSettings {
      id
      autoModerationEnabled
      bannedWordsAction
      blockedLinksAction
      spamDetectionEnabled
      spamThreshold
      autoFlagThreshold
      autoHideThreshold
    }
  }
`;

export const GET_MODERATION_STATS = gql`
  query GetModerationStats($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getModerationStats(timeRange: $timeRange, dateRange: $dateRange) {
      totalReports
      pendingReports
      resolvedReports
      bannedWordsCount
      blockedLinksCount
      autoModeratedToday
    }
  }
`;

export const GET_AI_MODERATION_DASHBOARD = gql`
  query GetAiModerationDashboard($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getAiModerationDashboard(timeRange: $timeRange, dateRange: $dateRange) {
      totalPosts
      pendingModeration
      flaggedContent
      rejectedPosts
      totalTokens
    }
  }
`;

export const GET_AI_MODERATION_LOGS = gql`
  query GetAiModerationLogs($limit: Int, $offset: Int) {
    getAiModerationLogs(limit: $limit, offset: $offset) {
      items {
        id
        contentId
        classification
        confidence
        model
        createdAt
      }
      totalCount
    }
  }
`;

export const GET_HISTORY = gql`
  query GetHistory($limit: Int, $offset: Int) {
    getModerationLogs(limit: $limit, offset: $offset) {
      items {
        id
        contentType
        aiLabel
        decision
        actionTaken
        createdAt
        user {
          firstName
          lastName
        }
      }
      totalCount
    }

    getAiTokenUsage(limit: $limit, offset: $offset) {
      items {
        module
        tokens
        model
        createdAt
      }
      totalCount
    }
  }
`;
