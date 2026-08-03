"use client";
import { gql } from '@apollo/client'
import { useMutation, MutationHookOptions } from '@apollo/client/react'
import { GET_FEED } from '../queries/feed'


// Import queries for cache updates (you may need to adjust the import paths)

const GET_JOB_FEED = gql`
  query GetJobFeed {
    getJobFeed {
      id
      # Add other fields as needed
    }
  }
`

const GET_MARKETPLACE_FEED = gql`
  query GetMarketplaceFeed {
    getMarketPlaceFeed {
      id
      # Add other fields as needed
    }
  }
`

const GET_COMMUNITIES_FEED = gql`
  query GetCommunitiesFeed {
    getCommunitiesFeed {
      id
      # Add other fields as needed
    }
  }
`

// Type definitions for feed mutations
interface inputId {
  id: string
}

interface DeleteFeedResponse {
  deleteFeed: {
    id: string
  }
}

interface CreateFeedInput {
  title: string
  content: string
  mediaUrls?: string[]
  tags?: string[]
  communityId?: string
}

interface CreateFeedResponse {
  createFeed: {
    id: string
    title: string
    content: string
    createdAt: string
  }
}

interface UpdateFeedInput {
  id: string
  title?: string
  content?: string
  mediaUrls?: string[]
  tags?: string[]
}

interface UpdateFeedResponse {
  updateFeed: {
    id: string
    title: string
    content: string
    updatedAt: string
  }
}

// GraphQL Mutations
export const DELETE_FEED = gql`
  mutation DeleteFeed($input: inputId!) {
    deleteFeed(input: $input) {
      id
    }
  }
`

export const CREATE_FEED = gql`
  mutation CreateFeed($input: CreateFeedInput!) {
    createFeed(input: $input) {
      id
      title
      content
      createdAt
    }
  }
`

export const UPDATE_FEED = gql`
  mutation UpdateFeed($input: UpdateFeedInput!) {
    updateFeed(input: $input) {
      id
      title
      content
      updatedAt
    }
  }
`

// Custom Hooks
export const useDeleteFeed = (
  options?: MutationHookOptions<DeleteFeedResponse, { input: inputId }>,
) => {
  return useMutation<DeleteFeedResponse, { input: inputId }>(DELETE_FEED, {
    ...options,
    errorPolicy: options?.errorPolicy || 'all',
    update(cache, { data }) {
      if (!data?.deleteFeed) return

      const { deleteFeed } = data

      try {
        // Update GET_FEED cache
        try {
          const { getFeed }: any = cache.readQuery({
            query: GET_FEED,
            variables: {
              input: {
                offset: 0,
                limit: 4, // Match the limit in your Following screen
              },
            },
          })

          console.log(getFeed, deleteFeed)

          if (getFeed) {
            const newValue = getFeed.filter((set: any) => set.id !== deleteFeed.id)
            cache.writeQuery({
              query: GET_FEED,
              data: { getFeed: [...newValue] },
              variables: {
                input: {
                  offset: 0,
                  limit: 4, // Match the limit in your Following screen
                },
              },
            })
          }
        } catch (e) {
          // Query might not exist in cache
        }
      } catch (error) {
        console.log('Cache update error:', error)
      }
    },
  })
}

export const useCreateFeed = (
  options?: MutationHookOptions<CreateFeedResponse, { input: CreateFeedInput }>,
) => {
  return useMutation<CreateFeedResponse, { input: CreateFeedInput }>(CREATE_FEED, {
    ...options,
    errorPolicy: options?.errorPolicy || 'all',
  })
}

export const useUpdateFeed = (
  options?: MutationHookOptions<UpdateFeedResponse, { input: UpdateFeedInput }>,
) => {
  return useMutation<UpdateFeedResponse, { input: UpdateFeedInput }>(UPDATE_FEED, {
    ...options,
    errorPolicy: options?.errorPolicy || 'all',
  })
}
