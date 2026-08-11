import { useQuery } from "@apollo/client";
import { GET_MEMBER_KPI_DASHBOARD } from "../../quries/member-kpi-dashboard";

// ───────────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────────

export interface StatValue {
  value: number;
  change?: number;
  trend?: number[];
}

export interface MemberKPIDashboardData {
  // 1. Membership Health
  totalMembers: StatValue;
  activeUsers: StatValue;
  engagementRate: StatValue;
  blockMembers: StatValue;

  // 2. Growth & Retention
  newMembers: StatValue;
  memberGrowthRate: StatValue;
  memberActivationRate: StatValue;
  churnRate: StatValue;
  retentionRate: StatValue;
  referralsJoined: StatValue;
  onboardingCompletionRate: StatValue;
  reEngagementRecoveryRate: StatValue;

  // 3. Engagement
  totalPosts: StatValue;
  contributionFrequency: StatValue;
  interactionReciprocity: StatValue;
  contentReach: StatValue;
  contentViralityRate: StatValue;
  contentToMemberRatio: StatValue;
  eventParticipationRate: StatValue;
  featureAdoptionRate: StatValue;

  // 4. Advocacy & Gamification
  communityAdvocacyIndex: StatValue;
  superfanRatio: StatValue;
  gamificationPointsEarned: StatValue;
  badgesEarned: StatValue;
  leaderboardParticipants: StatValue;

  // 5. Monetisation
  totalCurrencyPayouts: StatValue;
  revenuePerMember: StatValue;
  memberLifetimeValue: StatValue;
  revenueConversionRate: StatValue;

  // Community Health
  healthIndex: StatValue;
  communityNPS: StatValue;
  memberSatisfactionScore: StatValue;
  churnPredictionScore: StatValue;
}

export interface GetMemberKPIDashboardResponse {
  getCommunityKPIs: MemberKPIDashboardData;
}

// ───────────────────────────────────────────────────────────
// Hooks
// ───────────────────────────────────────────────────────────

export enum TimeRange {
  LAST_24_HOURS = "LAST_24_HOURS",
  LAST_7_DAYS = "LAST_7_DAYS",
  LAST_30_DAYS = "LAST_30_DAYS",
  LAST_90_DAYS = "LAST_90_DAYS",
  THIS_MONTH = "THIS_MONTH",
  LAST_MONTH = "LAST_MONTH",
}

export interface DateRangeInput {
  startDate: string;
  endDate: string;
}

export const useGetMemberKPIDashboard = (
  timeRange?: TimeRange,
  dateRange?: DateRangeInput,
  options?: any,
) =>
  useQuery<
    GetMemberKPIDashboardResponse,
    { timeRange?: TimeRange; dateRange?: DateRangeInput }
  >(GET_MEMBER_KPI_DASHBOARD, {
    variables: { timeRange, dateRange },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    ...options,
  });
