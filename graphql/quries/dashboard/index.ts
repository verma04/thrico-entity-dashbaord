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

export const GET_COMMUNITY_KPIS = gql`
  query GetCommunityKPIs($timeRange: TimeRange!) {
    getCommunityKPIs(timeRange: $timeRange) {
      # 1. Core Community Vitals
      dailyActiveUsers {
        value
        change
        trend
      }
      monthlyActiveUsers {
        value
        change
        trend
      }
      engagementRate {
        value
        change
        trend
      }
      retentionRate {
        value
        change
        trend
      }
      newMembers {
        value
        change
        trend
      }
      churnRate {
        value
        change
        trend
      }
      healthIndex {
        value
        change
        trend
      }
      communityNPS {
        value
        change
        trend
      }

      # 2. Content & Feed
      totalPosts {
        value
        change
        trend
      }
      contributionFrequency {
        value
        change
        trend
      }
      interactionReciprocity {
        value
        change
        trend
      }
      contentReach {
        value
        change
        trend
      }
      contentTypeBreakdown {
        type
        count
        percentage
      }

      # 3. Acquisition & Retention
      memberActivationRate {
        value
        change
        trend
      }
      communityAdvocacyIndex {
        value
        change
        trend
      }
      superfanRatio {
        value
        change
        trend
      }

      # 4. Moderation Overview
      moderationStats {
        type
        count
        status
      }

      # 5. Module Performance
      modulePerformance {
        module
        value
        subtext
      }
    }
  }
`;
