import { useQuery } from "@apollo/client";
import { GET_FEEDBACK_STATS } from "@/graphql/quries/feedback";
import { TimeRange } from "..";

export interface FeedbackStats {
  totalFeedback: number;
  pendingFeedback: number;
  resolvedFeedback: number;
  satisfactionScore: number;
  totalFeedbackChange: number;
  pendingFeedbackChange: number;
  resolvedFeedbackChange: number;
  satisfactionScoreChange: number;
}

export interface GetFeedbackStatsResponse {
  getFeedbackStats: FeedbackStats;
}

export const useGetFeedbackStats = (timeRange: TimeRange, options?: any) =>
  useQuery<GetFeedbackStatsResponse, { timeRange: TimeRange }>(
    GET_FEEDBACK_STATS,
    {
      variables: { timeRange },
      ...options,
    }
  );
