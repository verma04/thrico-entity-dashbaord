import { useQuery, QueryHookOptions, QueryResult } from "@apollo/client";
import { TimeRange } from "..";
import { GET_COMMUNITIES_STATS } from "@/graphql/quries/communities";

// --- TypeScript Types ---

export type CommunitiesStats = {
  totalCommunities: number;
  activeCommunities: number;
  totalEnrollments: number;
  totalViews: number;
  totalCommunitiesChange: number;
  activeCommunitiesChange: number;
  enrollmentsChange: number;
  viewsChange: number;
};

export type GetCommunitiesStatsResponse = {
  getCommunitiesStats: CommunitiesStats;
};

// --- Apollo Client Hook ---

export function useGetCommunitiesStats(
  timeRange: TimeRange,
  options?: QueryHookOptions<
    GetCommunitiesStatsResponse,
    { timeRange: TimeRange }
  >,
): QueryResult<GetCommunitiesStatsResponse, { timeRange: TimeRange }> {
  return useQuery(GET_COMMUNITIES_STATS, {
    variables: { timeRange },
    ...options,
  });
}
