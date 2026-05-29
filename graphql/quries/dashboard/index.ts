import { gql } from "@apollo/client";

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats($dateRange: DateRangeInput) {
    getDashboardStats(dateRange: $dateRange) {
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
  query GetModuleActivity($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getModuleActivity(timeRange: $timeRange, dateRange: $dateRange) {
      name
      userCount
    }
  }
`;

export const GET_FEATURE_MODULE_PERFORMANCE = gql`
  query GetFeatureModulePerformance($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getFeatureModulePerformance(timeRange: $timeRange, dateRange: $dateRange) {
      module
      value
      subtext
    }
  }
`;

export const GET_COMMUNITY_KPIS = gql`
  query GetCommunityKPIs($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getCommunityKPIs(timeRange: $timeRange, dateRange: $dateRange) {
      # 1. Core Vitals
      activeUsers {
        value
        change
        trend
      }
      totalMembers {
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
      referralsJoined {
        value
        change
        trend
      }
      gamificationPointsEarned {
        value
        change
        trend
      }
      badgesEarned {
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
export const GET_DEVICE_DISTRIBUTION = gql`
  query GetDeviceDistribution($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getDeviceDistribution(timeRange: $timeRange, dateRange: $dateRange) {
      date
      android
      ios
      web
    }
  }
`
export const GET_LOGIN_SESSIONS_REPORT = gql`
  query GetLoginSessionsReport($timeRange: TimeRange, $groupBy: GroupBy, $dateRange: DateRangeInput) {
    getLoginSessionsReport(timeRange: $timeRange, groupBy: $groupBy, dateRange: $dateRange) {
      time
      desktop
      mobile
    }
  }
`;

export const GET_GROWTH_STATS = gql`
  query GetGrowthStats($timeRange: TimeRange, $groupBy: GroupBy, $dateRange: DateRangeInput) {
    getGrowthStats(timeRange: $timeRange, groupBy: $groupBy, dateRange: $dateRange) {
      data {
        date
        count
      }
      totalNewMembers
      growthRate
    }
  }
`;
