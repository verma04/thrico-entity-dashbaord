import { gql } from "@apollo/client";

export const GET_FEEDBACK_STATS = gql`
  query GetFeedbackStats($timeRange: TimeRange!) {
    getFeedbackStats(timeRange: $timeRange) {
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
