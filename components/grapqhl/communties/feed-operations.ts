"use client";
/**
 * Feed Operations and Feed Management Hooks
 * 
 * This file contains all GraphQL mutations related to community feeds and their associated hooks.
 * It includes operations for adding, updating, deleting feeds, and managing feed interactions.
 */

import {  useMutation, MutationHookOptions } from "@apollo/client/react";
import { COMMUNITY_FEED_FRAGMENT } from "./fragments";
import { GET_COMMUNITIES_FEED_LIST } from "./community-queries";
import {
  InputId,
  CommunityFeed,
  inputGroupFeedPagination,
  GetCommunitiesFeedListResponse,
} from "./types";
import { gql } from "@apollo/client";

// FEED MUTATIONS
export const ADD_COMMUNITIES_FEED = gql`
  mutation AddFeedCommunities($input: inputGroupFeed) {
    addFeedCommunities(input: $input) {
      permissions {
        canEdit
        canDelete
        canPin
        canModerate
        canReport
      }
      status
      createdAt
      description
      id
      isLiked
      isOwner
      isWishList
      source
      totalComment
      totalReShare
      totalReactions
      user {
        id
        about {
          currentPosition
        }
        avatar
        firstName
        isOnline
        lastName
      }
    }
  }
`;

export const UPDATE_COMMUNITIES_FEED = gql`
  mutation UpdateFeedCommunities($input: inputUpdateGroupFeed) {
    updateFeedCommunities(input: $input) {
      permissions {
        canEdit
        canDelete
        canPin
        canModerate
        canReport
      }
      communityFeedData {
        status
        isPinned
        priority
      }
      status
      createdAt
      description
      id
      isLiked
      isOwner
      isWishList
      source
      totalComment
      totalReShare
      totalReactions
      user {
        id
        about {
          currentPosition
        }
        avatar
        firstName
        isOnline
        lastName
      }
    }
  }
`;

export const DELETE_COMMUNITIES_FEED = gql`
  mutation DeleteFeedCommunities($input: inputId) {
    deleteFeedCommunities(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_COMMUNITY_FEED = gql`
  mutation DeleteCommunityFeed($input: inputId) {
    deleteCommunityFeed(input: $input) {
      id
    }
  }
`;

export const TOGGLE_FEED_LIKE = gql`
  mutation ToggleFeedLike($input: inputId) {
    toggleFeedLike(input: $input) {
      id
      isLiked
      totalReactions
    }
  }
`;

// FEED MUTATION HOOKS

export const useAddFeedCommunities = (
  options?: MutationHookOptions<
    { addFeedCommunities: CommunityFeed },
    { input: any }
  > & {
    communityId?: string;
    onCompleted?: (data: { addFeedCommunities: CommunityFeed }) => void;
  }
) => {
  return useMutation<{ addFeedCommunities: CommunityFeed }, { input: any }>(
    ADD_COMMUNITIES_FEED,
    {
      ...options,
      onCompleted: (data) => {
        console.log("Feed added successfully:", data.addFeedCommunities);
        options?.onCompleted?.(data);
      },
      onError: (error) => {
        console.error("Error adding feed:", error);
        options?.onError?.(error);
      },
      update: (cache, { data }, { variables }) => {
        if (data?.addFeedCommunities) {
          try {
            const communityId = options?.communityId || variables?.input?.groupId;
            
            if (!communityId) {
              console.warn("No community ID provided for cache update");
              return;
            }

            // Read existing feed list from cache
            const existingData = cache.readQuery<
              GetCommunitiesFeedListResponse,
              { input: inputGroupFeedPagination }
            >({
              query: GET_COMMUNITIES_FEED_LIST,
              variables: {
                input: {
                  id: communityId,
                  limit: 8,
                  offset: 0,
                },
              },
            });

            console.log(existingData, "Existing feed data from cache");
            console.log(data.addFeedCommunities, "Newly added feed data");

            if (existingData?.getCommunitiesFeedList) {
              // Add new feed to the beginning of the list
              const updatedFeeds = [
                data.addFeedCommunities,
                ...existingData.getCommunitiesFeedList.feeds,
              ];

              console.log(updatedFeeds, "Updated feed list for cache");

              // Write updated data back to cache
              cache.writeQuery({
                query: GET_COMMUNITIES_FEED_LIST,
                variables: {
                  input: {
                    id: communityId,
                    limit: 8,
                    offset: 0,
                  },
                },
                data: {
                  getCommunitiesFeedList: {
                    feeds: updatedFeeds,
                    pagination: {
                      ...existingData.getCommunitiesFeedList.pagination,
                    },
                  },
                },
              });

              console.log("Feed cache updated successfully");
            }
          } catch (error) {
            console.log("Cache miss for getCommunitiesFeedList query:", error);
            // Cache miss - the query will be refetched via refetchQueries below
          }
        }
      },
      // Ensure feed list is refetched to maintain consistency
      refetchQueries: [
        {
          query: GET_COMMUNITIES_FEED_LIST,
          variables: {
            input: {
              id: options?.communityId,
              limit: 20,
              offset: 0,
            },
          },
        },
      ],
      awaitRefetchQueries: false, // Don't wait for refetch to complete
    }
  );
};

export const useUpdateFeedCommunities = (
  options?: MutationHookOptions<
    { updateFeedCommunities: CommunityFeed },
    { input: any }
  > & {
    communityId?: string;
  }
) => {
  return useMutation<{ updateFeedCommunities: CommunityFeed }, { input: any }>(
    UPDATE_COMMUNITIES_FEED,
    {
      ...options,
      onCompleted: (data) => {
        console.log("Feed updated successfully:", data.updateFeedCommunities);
        options?.onCompleted?.(data);
      },
      update: (cache, { data }, { variables }) => {
        if (data?.updateFeedCommunities) {
          const communityId = options?.communityId || variables?.input?.groupId;
          if (communityId) {
            // Use the updateFeedCache utility function which will be imported from cache-utils
            // updateFeedCache(cache, data.updateFeedCommunities, communityId, 'update');
            
            // For now, implement inline cache update
            try {
              const existingData = cache.readQuery<
                GetCommunitiesFeedListResponse,
                { input: inputGroupFeedPagination }
              >({
                query: GET_COMMUNITIES_FEED_LIST,
                variables: {
                  input: {
                    id: communityId,
                    limit: 20,
                    offset: 0,
                  },
                },
              });

              if (existingData?.getCommunitiesFeedList) {
                const updatedFeeds = existingData.getCommunitiesFeedList.feeds.map(feed =>
                  feed.id === data.updateFeedCommunities.id ? data.updateFeedCommunities : feed
                );

                cache.writeQuery({
                  query: GET_COMMUNITIES_FEED_LIST,
                  variables: {
                    input: {
                      id: communityId,
                      limit: 20,
                      offset: 0,
                    },
                  },
                  data: {
                    getCommunitiesFeedList: {
                      ...existingData.getCommunitiesFeedList,
                      feeds: updatedFeeds,
                    },
                  },
                });
              }
            } catch (error) {
              console.log("Error updating feed cache:", error);
            }
          }
        }
      },
    }
  );
};



export const useDeleteCommunityFeed = (
  options?: MutationHookOptions<
    { deleteCommunityFeed: { id: string } },
    { input: InputId }
  > & {
    communityId?: string;
    feedId?: string;
  }
) => {
  return useMutation<
    { deleteCommunityFeed: { id: string } },
    { input: InputId }
  >(DELETE_COMMUNITY_FEED, {
    ...options,
    onCompleted: (data) => {
      console.log("Community feed deleted successfully:", data.deleteCommunityFeed.id);
      options?.onCompleted?.(data);
    },
    onError: (error) => {
      console.error("Error deleting community feed:", error);
      options?.onError?.(error);
    },
    update: (cache, { data }, { variables }) => {
      console.log("Running cache update after community feed deletion");
      console.log(data, "Deleted feed data");
      if (data?.deleteCommunityFeed?.id ) {
        const communityId = data.deleteCommunityFeed.id

        console.log(communityId, "Community ID for cache update after deletion");
        
        if (communityId) {
          try {
            // Update GET_COMMUNITIES_FEED_LIST cache
            const existingData = cache.readQuery<
              GetCommunitiesFeedListResponse,
              { input: inputGroupFeedPagination }
            >({
              query: GET_COMMUNITIES_FEED_LIST,
              variables: {
                input: {
                  id: communityId,
                  limit: 8,
                  offset: 0,
                },
              },
            });
     

            if (existingData?.getCommunitiesFeedList) {
              // Remove the deleted feed from the list
              const updatedFeeds = existingData.getCommunitiesFeedList.feeds.filter(feed =>
                feed.id !== data.deleteCommunityFeed.id
              );

              console.log(`Removing feed ${data.deleteCommunityFeed.id} from cache`);

              // Write updated data back to cache
              cache.writeQuery({
                query: GET_COMMUNITIES_FEED_LIST,
                variables: {
                  input: {
                    id: communityId,
                    limit: 8,
                    offset: 0,
                  },
                },
                data: {
                  getCommunitiesFeedList: {
                    feeds: updatedFeeds,
                    pagination: {
                      ...existingData.getCommunitiesFeedList.pagination,
                      total: Math.max(0, existingData.getCommunitiesFeedList.pagination.total - 1),
                    },
                  },
                },
              });

              console.log("Community feed cache updated successfully after deletion");
            }
          } catch (error) {
            console.log("Cache miss for getCommunitiesFeedList query during deletion:", error);
            // Cache miss - will be handled by refetch
          }
        }
      }
    },
    // Ensure feed list is refetched to maintain consistency
  
    awaitRefetchQueries: false, // Don't wait for refetch to complete
  });
};

export const useToggleFeedLike = (
  options?: MutationHookOptions<
    { toggleFeedLike: { id: string; isLiked: boolean; totalReactions: number } },
    { input: InputId }
  > & {
    communityId?: string;
  }
) => {
  return useMutation<
    { toggleFeedLike: { id: string; isLiked: boolean; totalReactions: number } },
    { input: InputId }
  >(TOGGLE_FEED_LIKE, {
    ...options,
    optimisticResponse: ({ input }) => ({
      toggleFeedLike: {
        id: input.id,
        isLiked: true, // This would be toggled based on current state
        totalReactions: 0, // This would be updated based on current state
      },
    }),
    update: (cache, { data }, { variables }) => {
      if (data?.toggleFeedLike && variables?.input?.id) {
        const communityId = options?.communityId;
        if (communityId) {
          try {
            const existingData: GetCommunitiesFeedListResponse | null = cache.readQuery({
              query: GET_COMMUNITIES_FEED_LIST,
              variables: {
                input: {
                  id: communityId,
                  limit: 20,
                  offset: 0,
                },
              },
            });

            if (existingData?.getCommunitiesFeedList) {
              const updatedFeeds = existingData.getCommunitiesFeedList.feeds.map(feed =>
                feed.id === data.toggleFeedLike.id
                  ? {
                      ...feed,
                      isLiked: data.toggleFeedLike.isLiked,
                      totalReactions: data.toggleFeedLike.totalReactions,
                    }
                  : feed
              );

              cache.writeQuery({
                query: GET_COMMUNITIES_FEED_LIST,
                variables: {
                  input: {
                    id: communityId,
                    limit: 20,
                    offset: 0,
                  },
                },
                data: {
                  getCommunitiesFeedList: {
                    ...existingData.getCommunitiesFeedList,
                    feeds: updatedFeeds,
                  },
                },
              });
            }
          } catch (error) {
            console.log("Error updating like cache:", error);
          }
        }
      }
    },
  });
};

// Keep the old function for backward compatibility but mark as deprecated
/**
 * @deprecated Use useAddFeedCommunities instead for better type safety and cache management
 */
export const addFeedCommunities = (options: any) =>
  useMutation(ADD_COMMUNITIES_FEED, {
    onCompleted(data) {
      options?.onCompleted?.();
      console.log(data);
    },
    onError(error) {
      console.error("Error adding feed (legacy hook):", error);
      options?.onError?.(error);
    },
  });