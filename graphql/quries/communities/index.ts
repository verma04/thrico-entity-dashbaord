import { gql } from "@apollo/client";

export const GET_COMMUNITIES_STATS = gql`
  query GetCommunitiesStats($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getCommunitiesStats(timeRange: $timeRange, dateRange: $dateRange) {
      totalCommunities
      activeCommunities
      totalEnrollments
      totalViews
      totalCommunitiesChange
      activeCommunitiesChange
      enrollmentsChange
      viewsChange

      enrollmentTrend {
        label
        count
      }

      statusDistribution {
        name
        value
      }

      topCommunities {
        name
        members
        posts
        views
      }

      topCreators {
        name
        avatar
        communitiesCreated
      }
    }
  }
`;

