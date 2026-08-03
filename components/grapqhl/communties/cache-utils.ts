/**
 * Cache Utilities for Communities GraphQL Operations
 *
 * This file contains utility functions for managing Apollo Client cache updates
 * specifically for community-related operations. These utilities ensure consistent
 * cache management across different operations.
 */

import { GET_COMMUNITIES_FEED_LIST } from "./community-queries";
import {
  CommunityFeed,
  GetCommunitiesFeedListResponse,
  inputGroupFeedPagination,
} from "./types";

/**
 * Helper function to update feed cache
 * @param cache - Apollo Client cache instance
 * @param newFeed - The feed item to add/update/remove
 * @param communityId - The ID of the community
 * @param operation - The type of operation: 'add', 'update', or 'remove'
 * @returns boolean indicating success
 */
export const updateFeedCache = (
  cache: any,
  newFeed: CommunityFeed,
  communityId: string,
  operation: "add" | "update" | "remove" = "add",
): boolean => {
  try {
    const existingData: GetCommunitiesFeedListResponse | null = cache.readQuery(
      {
        query: GET_COMMUNITIES_FEED_LIST,
        variables: {
          input: {
            id: communityId,
            limit: 8,
            offset: 0,
          },
        },
      },
    );

    if (existingData?.getCommunitiesFeedList) {
      let updatedFeeds = [...existingData.getCommunitiesFeedList.feeds];
      let totalChange = 0;

      switch (operation) {
        case "add":
          updatedFeeds = [newFeed, ...updatedFeeds];
          totalChange = 1;
          break;
        case "update":
          updatedFeeds = updatedFeeds.map((feed) =>
            feed.id === newFeed.id ? newFeed : feed,
          );
          break;
        case "remove":
          updatedFeeds = updatedFeeds.filter((feed) => feed.id !== newFeed.id);
          totalChange = -1;
          break;
      }

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
            feeds: updatedFeeds,
            pagination: {
              ...existingData.getCommunitiesFeedList.pagination,
              total: Math.max(
                0,
                existingData.getCommunitiesFeedList.pagination.total +
                  totalChange,
              ),
            },
          },
        },
      });

      console.log(`Feed cache ${operation} operation completed successfully`);
      return true;
    }
  } catch (error) {
    console.error(`Error updating feed cache (${operation}):`, error);
    return false;
  }
  return false;
};

/**
 * Update community list cache after community operations
 * @param cache - Apollo Client cache instance
 * @param updatedCommunity - The updated community data
 * @param operation - The type of operation: 'add', 'update', or 'remove'
 * @param queryToUpdate - The specific query to update
 * @param variables - Variables for the query
 */
export const updateCommunityListCache = (
  cache: any,
  updatedCommunity: any,
  operation: "add" | "update" | "remove",
  queryToUpdate: any,
  variables?: any,
) => {
  try {
    const existingData = cache.readQuery({
      query: queryToUpdate,
      variables: variables || { input: { page: 1, limit: 10 } },
    });

    if (existingData) {
      let updatedCommunities;
      const communities =
        existingData[Object.keys(existingData)[0]].communities;

      switch (operation) {
        case "add":
          updatedCommunities = [updatedCommunity, ...communities];
          break;
        case "update":
          updatedCommunities = communities.map((comm: any) =>
            comm.id === updatedcommunity?.id ? updatedCommunity : comm,
          );
          break;
        case "remove":
          updatedCommunities = communities.filter(
            (comm: any) => comm.id !== updatedcommunity?.id,
          );
          break;
        default:
          updatedCommunities = communities;
      }

      const dataKey = Object.keys(existingData)[0];
      cache.writeQuery({
        query: queryToUpdate,
        variables: variables || { input: { page: 1, limit: 10 } },
        data: {
          [dataKey]: {
            ...existingData[dataKey],
            communities: updatedCommunities,
            pagination: {
              ...existingData[dataKey].pagination,
              totalCount:
                operation === "add"
                  ? existingData[dataKey].pagination.totalCount + 1
                  : operation === "remove"
                    ? Math.max(
                        0,
                        existingData[dataKey].pagination.totalCount - 1,
                      )
                    : existingData[dataKey].pagination.totalCount,
            },
          },
        },
      });
    }
  } catch (error) {
    console.log(
      `Cache miss for ${queryToUpdate.definitions[0].name.value} query`,
    );
  }
};

/**
 * Clear all community-related cache entries
 * @param cache - Apollo Client cache instance
 */
export const clearCommunitiesCache = (cache: any) => {
  try {
    // This would clear specific cache entries
    // Implementation depends on specific requirements
    console.log("Clearing communities cache...");
  } catch (error) {
    console.error("Error clearing communities cache:", error);
  }
};
