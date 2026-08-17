import { useQuery, QueryHookOptions, QueryResult } from "@apollo/client";
import { DateRangeInput, TimeRange } from "../dashbaord/dashboard-quries";
import { GET_COMMUNITIES_STATS } from "@/graphql/quries/communities";

export { TimeRange };

// --- TypeScript Types ---

export type EnrollmentTrendPoint = {
  label: string;
  count: number;
};

export type StatusDistributionPoint = {
  name: string;
  value: number;
};

export type TopCommunity = {
  id?: string;
  name: string;
  members: number;
  posts: number;
  views: number;
};

export type TopCreator = {
  id?: string;
  name: string;
  avatar: string;
  communitiesCreated: number;
};

export type CommunitiesStats = {
  totalCommunities: number;
  activeCommunities: number;
  totalEnrollments: number;
  totalViews: number;
  totalCommunitiesChange: number;
  activeCommunitiesChange: number;
  enrollmentsChange: number;
  viewsChange: number;
  enrollmentTrend: EnrollmentTrendPoint[];
  statusDistribution: StatusDistributionPoint[];
  topCommunities: TopCommunity[];
  topCreators: TopCreator[];
};

export type GetCommunitiesStatsResponse = {
  getCommunitiesStats: CommunitiesStats;
};

// --- Apollo Client Hook ---

export function useGetCommunitiesStats(
  timeRange?: TimeRange,
  dateRange?: DateRangeInput,
  options?: QueryHookOptions<
    GetCommunitiesStatsResponse,
    { timeRange?: TimeRange; dateRange?: DateRangeInput }
  >,
): QueryResult<
  GetCommunitiesStatsResponse,
  { timeRange?: TimeRange; dateRange?: DateRangeInput }
> {
  return useQuery(GET_COMMUNITIES_STATS, {
    variables: { timeRange, dateRange },
    ...options,
  });
}


