import { gql } from "@apollo/client";

export const GET_COMMUNITIES_STATS = gql`
  query GetCommunitiesStats($timeRange: TimeRange!) {
    getCommunitiesStats(timeRange: $timeRange) {
      totalCommunities
      activeCommunities
      totalEnrollments
      totalViews
      totalCommunitiesChange
      activeCommunitiesChange
      enrollmentsChange
      viewsChange
    }
  }
`;
