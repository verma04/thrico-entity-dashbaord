import { useMutation, useQuery, QueryHookOptions } from "@apollo/client";
import { DateRangeInput, TimeRange } from "../dashbaord/dashboard-quries";
export { TimeRange };
export type { DateRangeInput };
import {
  ADD_COMMENT,
  ADD_FEED,
  DELETE_COMMENT_FEED,
  GET_ALL_FEED,
  GET_FEED_COMMENTS,
  LIKE_FEED,
  NUMBER_OF_FEED,
  GET_ADMIN_FEED,
  GET_JOB_FEED,
  GET_MOMENTS_FEED,
  GET_LISTING_FEED,
  GET_PINNED_FEED,
  GET_FEED_INTELLIGENCE_KPI,
  GET_FEED_YIELD_VELOCITY,
  GET_FEED_INTEREST_MATRIX,
  GET_PROMOTED_NODE_EVENTS,
  DELETE_FEED,
  PIN_FEED,
  GET_POST_ANALYTICS,
} from "../../quries/feed";

export const useAllFeed = (options: any) => useQuery(GET_ALL_FEED, options);

export const useAdminFeed = (options: any) => useQuery(GET_ADMIN_FEED, options);

export const useJobFeed = (options: any) => useQuery(GET_JOB_FEED, options);

export const useMomentsFeed = (options: any) =>
  useQuery(GET_MOMENTS_FEED, options);

export const useListingFeed = (options: any) =>
  useQuery(GET_LISTING_FEED, options);

export const usePinnedFeed = (options: any) =>
  useQuery(GET_PINNED_FEED, options);

export const useDeleteFeed = (options: any) =>
  useMutation(DELETE_FEED, options);

export const usePinFeed = (options: any) => useMutation(PIN_FEED, options);

export const useNumberOfFeeds = () => useQuery(NUMBER_OF_FEED);

export const useAddFeed = (options: any) =>
  useMutation(ADD_FEED, {
    onCompleted(data) {
      options.onCompleted();
    },
    update(cache, { data: { addFeed } }) {
      try {
        const { getAllFeed }: any = cache.readQuery({
          query: GET_ALL_FEED,
          variables: {
            input: {
              offset: 0,
              limit: 10, // Match the limit in your Following screen
            },
          },
        });

        cache.writeQuery({
          query: GET_ALL_FEED,
          data: { getAllFeed: [addFeed, ...getAllFeed] },
          variables: {
            input: {
              offset: 0,
              limit: 10, // Match the limit in your Following screen
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const useLikeFeed = (options: any) => useMutation(LIKE_FEED, {});

export const useAddComment = (options: any) =>
  useMutation(ADD_COMMENT, {
    onCompleted(data) {
      options.onCompleted();
    },
    update(cache, { data: { addComment } }) {
      try {
        const { getFeedComment }: any = cache.readQuery({
          query: GET_FEED_COMMENTS,
          variables: {
            input: {
              id: addComment?.feedId, // Match the limit in your Following screen
            },
          },
        });

        cache.writeQuery({
          query: GET_FEED_COMMENTS,
          data: { getFeedComment: [addComment, ...getFeedComment] },
          variables: {
            input: {
              id: addComment?.feedId, // Match the limit in your Following screen
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const useDeleteCommentFeed = (options: any) =>
  useMutation(DELETE_COMMENT_FEED, {
    update(cache, { data: { deleteCommentFeed } }) {
      try {
        const { getFeedComment }: any = cache.readQuery({
          query: GET_FEED_COMMENTS,
          variables: {
            input: {
              id: deleteCommentFeed?.feedId, // Match the limit in your Following screen
            },
          },
        });
        if (!getFeedComment) return;
        const updatedComments = getFeedComment.filter(
          (comment: any) => comment.id !== deleteCommentFeed.id,
        );

        cache.writeQuery({
          query: GET_FEED_COMMENTS,
          variables: {
            input: {
              id: deleteCommentFeed?.feedId,
            },
          },
          data: {
            getFeedComment: updatedComments,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const useFeedComment = (options: any) =>
  useQuery(GET_FEED_COMMENTS, options);

// ==========================================
// FEED INTELLIGENCE (DASHBOARD) HOOKS
// ==========================================

export interface FeedIntelligenceKPI {
  aggregateReach: string;
  activeDialogue: string;
  networkVelocity: string;
  engagementYield: string;
  reachTrend: number;
  dialogueTrend: number;
  velocityTrend: number;
  yieldTrend: number;
}

export interface FeedYieldVelocity {
  day: string;
  signups: number;
}

export interface FeedInterestMatrix {
  name: string;
  value: number;
  color: string;
}

export interface FeedPromotedEvent {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export interface GetFeedIntelligenceKPIData {
  getFeedIntelligenceKPI: FeedIntelligenceKPI;
}

export interface GetFeedYieldVelocityData {
  getFeedYieldVelocity: FeedYieldVelocity[];
}

export interface GetFeedInterestMatrixData {
  getFeedInterestMatrix: FeedInterestMatrix[];
}

export interface GetPromotedNodeEventsData {
  getPromotedNodeEvents: FeedPromotedEvent[];
}

export const useGetFeedIntelligenceKPI = (
  timeRange?: TimeRange,
  dateRange?: DateRangeInput,
  options?: QueryHookOptions<
    GetFeedIntelligenceKPIData,
    { timeRange?: TimeRange; dateRange?: DateRangeInput }
  >,
) =>
  useQuery<
    GetFeedIntelligenceKPIData,
    { timeRange?: TimeRange; dateRange?: DateRangeInput }
  >(GET_FEED_INTELLIGENCE_KPI, {
    variables: { timeRange, dateRange },
    ...options,
  });

export const useGetFeedYieldVelocity = (
  timeRange?: TimeRange,
  dateRange?: DateRangeInput,
  options?: QueryHookOptions<
    GetFeedYieldVelocityData,
    { timeRange?: TimeRange; dateRange?: DateRangeInput }
  >,
) =>
  useQuery<
    GetFeedYieldVelocityData,
    { timeRange?: TimeRange; dateRange?: DateRangeInput }
  >(GET_FEED_YIELD_VELOCITY, {
    variables: { timeRange, dateRange },
    ...options,
  });

export const useGetFeedInterestMatrix = (
  timeRange?: TimeRange,
  dateRange?: DateRangeInput,
  options?: QueryHookOptions<
    GetFeedInterestMatrixData,
    { timeRange?: TimeRange; dateRange?: DateRangeInput }
  >,
) =>
  useQuery<
    GetFeedInterestMatrixData,
    { timeRange?: TimeRange; dateRange?: DateRangeInput }
  >(GET_FEED_INTEREST_MATRIX, {
    variables: { timeRange, dateRange },
    ...options,
  });

export const useGetPromotedNodeEvents = (options?: any) =>
  useQuery<GetPromotedNodeEventsData>(GET_PROMOTED_NODE_EVENTS, options);

export interface PostAnalytics {
  engagement: {
    name: string;
    value: number;
    color: string;
  }[];
  demographics: {
    age: {
      group: string;
      percentage: number;
    }[];
    location: {
      country: string;
      percentage: number;
    }[];
  };
  reachData: {
    total: number;
    organic: number;
    paid: number;
  };
}
//localhost:2025/

export interface GetPostAnalyticsData {
  getPostAnalytics: PostAnalytics;
}

export const usePostAnalytics = (
  postId: string,
  options?: QueryHookOptions<GetPostAnalyticsData, { input: { id: string } }>,
) =>
  useQuery<GetPostAnalyticsData, { input: { id: string } }>(
    GET_POST_ANALYTICS,
    {
      variables: { input: { id: postId } },
      skip: !postId,
      ...options,
    },
  );
