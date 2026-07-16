import { useQuery } from "@apollo/client";
import { GET_FEEDBACK_STATS } from "@/graphql/quries/feedback";
import { TimeRange, DateRangeInput } from "../dashbaord/dashboard-quries";

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

export const useGetFeedbackStats = (timeRange?: TimeRange, dateRange?: DateRangeInput, options?: any) =>
  useQuery<GetFeedbackStatsResponse, { timeRange?: TimeRange, dateRange?: DateRangeInput }>(
    GET_FEEDBACK_STATS,
    {
      variables: { timeRange, dateRange },
      ...options,
    }
  );
