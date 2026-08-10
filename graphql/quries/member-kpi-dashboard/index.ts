import { gql } from "@apollo/client";

/**
 * Dedicated query for the Members Community KPI Dashboard.
 * Fetches all 5 KPI categories from the getCommunityKPIs resolver
 * using a separate operation name so it doesn't conflict with the
 * main dashboard query.
 */
export const GET_MEMBER_KPI_DASHBOARD = gql`
  query GetMemberKPIDashboard($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getCommunityKPIs(timeRange: $timeRange, dateRange: $dateRange) {
      # ── 1. Membership Health ──
      totalMembers {
        value
        change
        trend
      }
      activeUsers {
        value
        change
        trend
      }
      engagementRate {
        value
        change
        trend
      }
      blockMembers {
        value
        change
        trend
      }

      # ── 2. Growth & Retention ──
      newMembers {
        value
        change
        trend
      }
      memberGrowthRate {
        value
        change
        trend
      }
      memberActivationRate {
        value
        change
        trend
      }
      churnRate {
        value
        change
        trend
      }
      retentionRate {
        value
        change
        trend
      }
      referralsJoined {
        value
        change
        trend
      }
      onboardingCompletionRate {
        value
        change
        trend
      }
      reEngagementRecoveryRate {
        value
        change
        trend
      }

      # ── 3. Engagement ──
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
      contentViralityRate {
        value
        change
        trend
      }
      contentToMemberRatio {
        value
        change
        trend
      }
      eventParticipationRate {
        value
        change
        trend
      }
      featureAdoptionRate {
        value
        change
        trend
      }

      # ── 4. Advocacy & Gamification ──
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
      leaderboardParticipants {
        value
        change
        trend
      }

      # ── 5. Monetisation ──
      totalCurrencyPayouts {
        value
        change
        trend
      }
      revenuePerMember {
        value
        change
        trend
      }
      memberLifetimeValue {
        value
        change
        trend
      }
      revenueConversionRate {
        value
        change
        trend
      }

      # ── Community Health ──
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
      memberSatisfactionScore {
        value
        change
        trend
      }
      churnPredictionScore {
        value
        change
        trend
      }
    }
  }
`;
