"use client";
import {
  MutationHookOptions,
  QueryHookOptions,
  useMutation,
  useQuery,
} from "@apollo/client/react";
import {
  ADD_COMMENT,
  EDIT_COMMENT,
  ADD_COMMUNITIES_FEED,
  ADD_FEED,
  DELETE_COMMENT,
  DELETE_FEED,
  GET_ALL_OFFER,
  GET_COMMUNITIES_FEED,
  GET_COMMUNITIES_FEED_LIST,
  GET_DISCUSSION_FORUM_CATEGORY,
  GET_EVENTS_FEED,
  GET_FEED,
  GET_FEED_COMMENT,
  GET_FEED_DETAILS_ID,
  GET_JOB_FEED,
  GET_MARKETPLACE_FEED,
  GET_PERSONALIZED_FEED,
  GET_USER_FEED,
  LIKE_FEED,
  REPOST_FEED,
  WISHLIST_FEED,
  GET_MY_FEED,
  GET_FEED_REACTIONS,
  GET_FEED_STATS,
  GET_MY_FEED_STATS,
  GET_MY_PROFILE_STATS,
  GET_FEED_SETTINGS,
  GET_MOMENTS_FEED,
  GET_FEED_BY_ADMIN,
  GET_POLLS_FEED,
  GET_MY_JOINED_COMMUNITIES_FEED,
} from "../../queries/feed";

export interface FeedUser {
  id: string;
  avatar?: string;
  firstName: string;
  lastName: string;
  about?: {
    headline: string;
  };
  isOnline?: boolean;
}

export interface FeedComment {
  id: string;
  isOwner: boolean;
  isPostOwner: boolean;
  content: string;
  createdAt: string;
  user: FeedUser;
}

export interface FeedItem {
  id: string;
  repostId?: string;
  source?: string;
  privacy: string;
  isLiked: boolean;
  isWishList: boolean;
  addedBy: string;
  isOwner: boolean;
  media: string[];
  totalComment: number;
  totalReactions: number;
  totalReShare: number;
  description: string;
  createdAt: string;
  user: FeedUser;
  marketPlace?: {
    category: string;
    condition: string;
    description: string;
    createdAt: string;
    location: string;
    price: string;
    media: string[];
    title: string;
  };
  forum?: {
    downVotes: number;
    upVotes: number;
    id: string;
    category: {
      name: string;
    };
    title: string;
    content: string;
  };
  poll?: {
    id: string;
    title: string;
  };
  job?: {
    id: string;
    title: string;
    company: string;
    description: string;
    location: string;
    jobType: string;
    workplaceType: string;
  };
  offer?: {
    cover?: string;
    title: string;
    description: string;
    location: string;
    company: string;
    timeline: string;
    termsAndConditions: string;
    website: string;
    createdAt: string;
    updatedAt: string;
  };
  celebration?: {
    id: string;
    celebrationType: string;
    title: string;
    description: string;
    cover?: string;
  };
}

export const getCommunitiesFeedList = (
  options?: QueryHookOptions<{ getCommunitiesFeedList: FeedItem[] }, any>,
) =>
  useQuery<{ getCommunitiesFeedList: FeedItem[] }, any>(
    GET_COMMUNITIES_FEED_LIST,
    options,
  );

export const getFeedDetailsById = (
  options?: QueryHookOptions<{ getFeedDetailsById: FeedItem }, any>,
) =>
  useQuery<{ getFeedDetailsById: FeedItem }, any>(GET_FEED_DETAILS_ID, options);

export const getCommunitiesFeed = () =>
  useQuery<{ getCommunitiesFeed: FeedItem[] }, any>(GET_COMMUNITIES_FEED);

export const useAddFeed = (
  options?: MutationHookOptions<{ addFeed: FeedItem }, any>,
) =>
  useMutation<{ addFeed: FeedItem }, any>(ADD_FEED, {
    onCompleted(data) {
      options?.onCompleted?.(data);
    },
    update(cache, { data }) {
      if (!data?.addFeed) return;
      try {
        // Evict all paginated feed queries so active FeedList components
        // automatically refetch the first page and show the new post.
        const feedQueries = [
          "getFeed",
          "getMyFeed",
          "getFeedByAdmin",
          "getMomentsFeed",
          "getPollsFeed",
          "getMyJoinedCommunitiesFeed",
        ];
        feedQueries.forEach((fieldName) => {
          cache.evict({ id: "ROOT_QUERY", fieldName });
        });
        cache.gc();
      } catch (error) {
        console.log(error);
      }
    },
  });

export const getFeed = (
  options?: QueryHookOptions<{ getFeed: FeedItem[] }, any>,
) => useQuery<{ getFeed: FeedItem[] }, any>(GET_FEED, options);

export const getJobFeed = () =>
  useQuery<{ getJobFeed: FeedItem[] }, any>(GET_JOB_FEED);

export const getPersonalizedFeed = () =>
  useQuery<{ getPersonalizedFeed: FeedItem[] }, any>(GET_PERSONALIZED_FEED);

export const getMarketPlaceFeed = () =>
  useQuery<{ getMarketPlaceFeed: FeedItem[] }, any>(GET_MARKETPLACE_FEED);

export const getUserEventsFeed = () =>
  useQuery<{ getUserEventsFeed: { id: string }[] }, any>(GET_EVENTS_FEED);

export const getFeedComment = (
  options?: QueryHookOptions<{ getFeedComment: FeedComment[] }, any>,
) =>
  useQuery<{ getFeedComment: FeedComment[] }, any>(GET_FEED_COMMENT, options);

export const addFeedComment = (
  options?: MutationHookOptions<{ addComment: FeedComment }, any> & {
    id: string;
  },
) =>
  useMutation<{ addComment: FeedComment }, any>(ADD_COMMENT, {
    onCompleted(data) {
      options?.onCompleted?.(data);
    },
    update(cache, { data }) {
      if (!data?.addComment) return;
      try {
        const response = cache.readQuery<{ getFeed: FeedItem[] }, any>({
          query: GET_FEED,
          variables: {
            input: {
              offset: 0,
              limit: 4, // Match the limit in your Following screen
            },
          },
        });

        const getFeed = response?.getFeed;

        if (getFeed) {
          const newData = getFeed.map((item) => {
            if (item.id === options?.id) {
              return { ...item, totalComment: item.totalComment + 1 };
            } else {
              return item;
            }
          });

          cache.writeQuery({
            query: GET_FEED,
            data: { getFeed: [...newData] },
          });
        }

        const commentResponse = cache.readQuery<any, any>({
          query: GET_FEED_COMMENT,
          variables: {
            input: {
              feedId: options?.id,
              limit: 20,
            },
          },
        });

        const getFeedCommentEdges =
          commentResponse?.getFeedComment?.edges || [];

        cache.writeQuery({
          query: GET_FEED_COMMENT,
          data: {
            getFeedComment: {
              ...commentResponse?.getFeedComment,
              edges: [
                { node: data.addComment, cursor: data.addComment.id },
                ...getFeedCommentEdges,
              ],
            },
          },
          variables: {
            input: {
              feedId: options?.id,
              limit: 20,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const editFeedComment = (
  options?: MutationHookOptions<{ editFeedComment: FeedComment }, any>,
) => useMutation<{ editFeedComment: FeedComment }, any>(EDIT_COMMENT, options);

export const wishListFeed = (
  options?: MutationHookOptions<{ wishListFeed: { status: string } }, any>,
) =>
  useMutation<{ wishListFeed: { status: string } }, any>(
    WISHLIST_FEED,
    options,
  );

export const likeFeed = (
  options?: MutationHookOptions<{ likeFeed: { status: string } }, any>,
) => useMutation<{ likeFeed: { status: string } }, any>(LIKE_FEED, options);

export const deleteFeed = (
  options?: MutationHookOptions<{ deleteFeed: { id: string } }, any>,
) =>
  useMutation<{ deleteFeed: { id: string } }, any>(DELETE_FEED, {
    onCompleted(data) {
      options?.onCompleted?.(data);
    },
    update(cache, { data }) {
      if (!data?.deleteFeed) return;
      try {
        // Automatically evict the deleted feed item from the cache.
        // This removes it from ALL queries (including cursor-paginated ones) instantly.
        cache.evict({
          id: cache.identify({
            __typename: "feed",
            id: data.deleteFeed.id,
          }),
        });
        cache.gc();
      } catch (error) {
        console.log(error);
      }
    },
  });

export const deleteCommentFeed = (
  options?: MutationHookOptions<{ deleteCommentFeed: { id: string } }, any> & {
    id: string;
  },
) =>
  useMutation<{ deleteCommentFeed: { id: string } }, any>(DELETE_COMMENT, {
    onCompleted(data) {
      options?.onCompleted?.(data);
    },
    update(cache, { data }) {
      if (!data?.deleteCommentFeed) return;
      try {
        const response = cache.readQuery<any, any>({
          query: GET_FEED_COMMENT,
          variables: {
            input: {
              feedId: options?.id,
              limit: 20,
            },
          },
        });

        if (response?.getFeedComment?.edges) {
          const newEdges = response.getFeedComment.edges.filter(
            (edge: any) => edge.node.id !== data.deleteCommentFeed.id,
          );

          cache.writeQuery({
            query: GET_FEED_COMMENT,
            data: {
              getFeedComment: {
                ...response.getFeedComment,
                edges: newEdges,
              },
            },
            variables: {
              input: {
                feedId: options?.id,
                limit: 20,
              },
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

export const addFeedCommunities = (
  options?: MutationHookOptions<{ addFeedCommunities: FeedItem }, any> & {
    id: string;
  },
) =>
  useMutation<{ addFeedCommunities: FeedItem }, any>(ADD_COMMUNITIES_FEED, {
    onCompleted(data) {
      options?.onCompleted?.(data);
    },

    update(cache, { data }) {
      if (!data?.addFeedCommunities) return;
      try {
        const response = cache.readQuery<
          { getCommunitiesFeedList: FeedItem[] },
          any
        >({
          query: GET_COMMUNITIES_FEED_LIST,
          variables: {
            input: {
              id: options?.id,
            },
          },
        });

        if (response?.getCommunitiesFeedList) {
          cache.writeQuery({
            query: GET_COMMUNITIES_FEED_LIST,
            data: {
              getCommunitiesFeedList: [
                data.addFeedCommunities,
                ...response.getCommunitiesFeedList,
              ],
            },
            variables: {
              input: {
                id: options?.id,
              },
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

export const repostFeedWithThought = (
  options?: MutationHookOptions<{ repostFeedWithThought: FeedItem }, any>,
) =>
  useMutation<{ repostFeedWithThought: FeedItem }, any>(REPOST_FEED, {
    onCompleted(data) {
      options?.onCompleted?.(data);
    },

    update(cache, { data }) {
      if (!data?.repostFeedWithThought) return;
      try {
        // Evict cursor-based feed queries so they refetch with the repost
        // at the top of the list.
        const feedQueries = [
          "getFeed",
          "getMyFeed",
          "getFeedByAdmin",
        ];
        feedQueries.forEach((fieldName) => {
          cache.evict({ id: "ROOT_QUERY", fieldName });
        });
        cache.gc();
      } catch (error) {
        console.log(error);
      }
    },
  });

export const getUserActivityFeed = (
  options?: QueryHookOptions<{ getUserActivityFeed: FeedItem[] }, any>,
) => useQuery<{ getUserActivityFeed: FeedItem[] }, any>(GET_USER_FEED, options);

export const getAllOffer = (options?: QueryHookOptions<{ getAllOffer: any[] }, any>) =>
  useQuery<{ getAllOffer: any[] }, any>(GET_ALL_OFFER, options);

export interface ForumCategory {
  id: string;
  name: string;
}

export const getDiscussionForumCategory = () =>
  useQuery<{ getDiscussionForumCategory: ForumCategory[] }, any>(
    GET_DISCUSSION_FORUM_CATEGORY,
  );

export const getMyFeed = (
  options?: QueryHookOptions<{ getMyFeed: FeedItem[] }, any>,
) => useQuery<{ getMyFeed: FeedItem[] }, any>(GET_MY_FEED, options);

export const getFeedReactions = (options?: QueryHookOptions<any, any>) =>
  useQuery<any, any>(GET_FEED_REACTIONS, options);

export const useGetFeedStats = (options?: QueryHookOptions<any, any>) =>
  useQuery<any, any>(GET_FEED_STATS, options);

export const useGetMyFeedStats = (options?: QueryHookOptions<any, any>) =>
  useQuery<any, any>(GET_MY_FEED_STATS, options);

export const useGetMyProfileStats = (options?: QueryHookOptions<any, any>) =>
  useQuery<any, any>(GET_MY_PROFILE_STATS, options);

export const useGetFeedSettings = (options?: QueryHookOptions<any, any>) =>
  useQuery<any, any>(GET_FEED_SETTINGS, options);

export const getMomentsFeed = (options?: QueryHookOptions<any, any>) =>
  useQuery<any, any>(GET_MOMENTS_FEED, options);

export const getFeedByAdmin = (options?: QueryHookOptions<any, any>) =>
  useQuery<any, any>(GET_FEED_BY_ADMIN, options);

export const getPollsFeed = (options?: QueryHookOptions<any, any>) =>
  useQuery<any, any>(GET_POLLS_FEED, options);

export const getMyJoinedCommunitiesFeed = (options?: QueryHookOptions<any, any>) =>
  useQuery<any, any>(GET_MY_JOINED_COMMUNITIES_FEED, options);
