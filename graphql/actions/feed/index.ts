import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_COMMENT,
  ADD_FEED,
  DELETE_COMMENT_FEED,
  GET_ALL_FEED,
  GET_FEED_COMMENTS,
  LIKE_FEED,
  NUMBER_OF_FEED,
} from "../../quries/feed";

export const useAllFeed = (options: any) => useQuery(GET_ALL_FEED, options);

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
          (comment: any) => comment.id !== deleteCommentFeed.id
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
