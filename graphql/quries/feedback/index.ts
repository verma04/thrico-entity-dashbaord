import { gql } from "@apollo/client";

export const GET_FEEDBACK_STATS = gql`
  query GetFeedbackStats($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getFeedbackStats(timeRange: $timeRange, dateRange: $dateRange) {
      totalFeedback
      pendingFeedback
      resolvedFeedback
      satisfactionScore
      totalFeedbackChange
      pendingFeedbackChange
      resolvedFeedbackChange
      satisfactionScoreChange
    }
  }
`;
