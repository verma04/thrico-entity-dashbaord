"use client";
import { gql } from '@apollo/client'
import { QueryHookOptions, useQuery } from '@apollo/client/react'
import { FeedStats, GetFeedStatsInput } from './types'

// Type definitions for feed stats
interface DeleteFeedInput {
  id: string
}

interface DeleteFeedResponse {
  deleteFeed: {
    id: string
  }
}

export const GET_FEED_STATS = gql`
  query GetFeedStats($input: GetFeedStatsInput!) {
    getFeedStats(input: $input) {
      feedId
      basicStats {
        totalReactions
        totalComments
        totalShares
        createdAt
      }
      reactionBreakdown {
        count
        reactionsType
      }
      commentsOverTime {
        count
        date
      }
      engagementByConnections {
        comments
        isConnection
        reactions
      }
      impressions
      reach
    }
  }
`

export const useGetFeedStats = (
  options?: QueryHookOptions<{ getFeedStats: FeedStats }, { input: GetFeedStatsInput }>,
) => {
  // Validate feedId before making the query
  const hasValidFeedId =
    options?.variables?.input?.feedId != null && options?.variables?.input?.feedId !== ''

  return useQuery<{ getFeedStats: FeedStats }, { input: GetFeedStatsInput }>(
    GET_FEED_STATS,
    {
      ...options,
      variables: options?.variables as { input: GetFeedStatsInput },
      // Skip query if feedId is null or invalid
      skip: !hasValidFeedId || options?.skip,
      errorPolicy: options?.errorPolicy || 'all',
    },
  )
}
