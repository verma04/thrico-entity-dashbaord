"use client";

import { MutationHookOptions, QueryHookOptions, useMutation, useQuery } from "@apollo/client/react"
import {
  ADD_DISCUSSION_FORM,
  DELETE_FORUM,
  DOWNVOTE_DISCUSSION_FORUM,
  GET_DISCUSSION_FORM,
  GET_DISCUSSION_FORM_BY_ID,
  GET_DISCUSSION_FORUM_CATEGORY,
  GET_DISCUSSION_FORUM_COMMENTS,
  GET_DISCUSSION_POSTED_BY_ME,
  POST_DISCUSSION_FORUM_COMMENTS,
  UPVOTE_DISCUSSION_FORUM,
  GET_DISCUSSION_STATS,
  GET_TOP_CONTRIBUTORS,
} from "../../queries/forum"

export interface ForumCategory {
  id: string
  name: string
}

export interface ForumUser {
  id: string
  firstName: string
  lastName: string
  avatar?: string
  isOnline?: boolean
  cover?: string
}

export interface Forum {
  id: string
  title: string
  content: string
  category: ForumCategory
  upVotes: number
  downVotes: number
  totalComments: number
  isAnonymous: boolean
  addedBy: string
  user: ForumUser
  createdAt: string
  updatedAt: string
  isLikeByYou: boolean
  voteType: string
  isOwner: boolean
  status?: string
}

export interface ForumComment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  slug: string
  commentedBy: string
  discussionForumId: string
  user: ForumUser
}

export enum VoteType {
  UPVOTE = "UPVOTE",
  DOWNVOTE = "DOWNVOTE",
}

export interface InputGetDiscussionForum {
  cursor?: string | null
  limit?: number | null
  status?: string | null
  isAnonymous?: boolean | null
  category?: string | null
}

export interface PaginatedForum {
  edges: {
    node: Forum
    cursor: string
  }[]
  pageInfo: {
    endCursor: string
    hasNextPage: boolean
  }
  totalCount: number
}

export const getDiscussionForum = (options?: QueryHookOptions<{ getDiscussionForum: PaginatedForum }, { input: InputGetDiscussionForum }>) =>
  useQuery<{ getDiscussionForum: PaginatedForum }, { input: InputGetDiscussionForum }>(GET_DISCUSSION_FORM, options)

export const getDiscussionForumDetailsByID = (
  options?: QueryHookOptions<{ getDiscussionForumDetailsByID: Forum }, any>,
) => useQuery<{ getDiscussionForumDetailsByID: Forum }, any>(GET_DISCUSSION_FORM_BY_ID, options)

export const upVoteDiscussionForum = (
  options?: MutationHookOptions<{ upVoteDiscussionForum: { message: string } }, any>,
) =>
  useMutation<{ upVoteDiscussionForum: { message: string } }, any>(UPVOTE_DISCUSSION_FORUM, {
    ...options,
  })

export const downVoteDiscussionForum = (
  options?: MutationHookOptions<{ downVoteDiscussionForum: { message: string } }, any>,
) => useMutation<{ downVoteDiscussionForum: { message: string } }, any>(DOWNVOTE_DISCUSSION_FORUM, options)

export const getDiscussionForumCategory = () =>
  useQuery<{ getDiscussionForumCategory: ForumCategory[] }, any>(GET_DISCUSSION_FORUM_CATEGORY)

export const discussionPostedByMe = (options?: QueryHookOptions<{ discussionPostedByMe: PaginatedForum }, any>) =>
  useQuery<{ discussionPostedByMe: PaginatedForum }, any>(GET_DISCUSSION_POSTED_BY_ME, options)

export const addDiscussionForum = (options?: MutationHookOptions<{ addDiscussionForum: Forum }, any>) =>
  useMutation<{ addDiscussionForum: Forum }, any>(ADD_DISCUSSION_FORM, {
    refetchQueries: [
      { query: GET_DISCUSSION_POSTED_BY_ME },
      { query: GET_DISCUSSION_FORM }
    ],
    ...options,
    update(cache, { data }) {
      if (!data?.addDiscussionForum) return

      try {
        const existingData = cache.readQuery<{ discussionPostedByMe: PaginatedForum }>({
          query: GET_DISCUSSION_POSTED_BY_ME,
          variables: { input: { status: "MY_POST", limit: 20 } }
        })

        if (existingData?.discussionPostedByMe) {
          const newEdge = {
            node: data.addDiscussionForum,
            cursor: new Date().getTime().toString(),
            __typename: "DiscussionForumEdge"
          }

          cache.writeQuery({
            query: GET_DISCUSSION_POSTED_BY_ME,
            variables: { input: { status: "MY_POST", limit: 20 } },
            data: {
              discussionPostedByMe: {
                ...existingData.discussionPostedByMe,
                edges: [newEdge, ...existingData.discussionPostedByMe.edges],
                totalCount: existingData.discussionPostedByMe.totalCount + 1
              },
            },
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
  })

export const deleteForum = (options?: MutationHookOptions<{ deleteForum: Forum }, any>) =>
  useMutation<{ deleteForum: Forum }, any>(DELETE_FORUM, {
    ...options,
    update(cache, { data }) {
      if (!data?.deleteForum) return

      try {
        // Remove from 'discussionPostedByMe' cache
        const existingData = cache.readQuery<{ discussionPostedByMe: PaginatedForum }>({
          query: GET_DISCUSSION_POSTED_BY_ME,
          variables: { input: { status: "MY_POST", limit: 20 } }
        })

        if (existingData?.discussionPostedByMe) {
          const updatedEdges = existingData.discussionPostedByMe.edges.filter(
            (edge) => edge.node.id !== data.deleteForum.id,
          )

          cache.writeQuery({
            query: GET_DISCUSSION_POSTED_BY_ME,
            variables: { input: { status: "MY_POST", limit: 20 } },
            data: {
              discussionPostedByMe: {
                ...existingData.discussionPostedByMe,
                edges: updatedEdges,
                totalCount: Math.max(0, existingData.discussionPostedByMe.totalCount - 1)
              },
            },
          })
        }

        // Evict the deleted forum from the Apollo cache entirely
        if (data.deleteForum) {
          cache.evict({ id: cache.identify(data.deleteForum) })
          cache.gc()
        }
      } catch (error) {
        console.log(error)
      }
    },
  })

export interface PaginatedForumComment {
  edges: {
    node: ForumComment
    cursor: string
  }[]
  pageInfo: {
    endCursor: string
    hasNextPage: boolean
  }
  totalCount: number
}

export const getDiscussionForumComments = (
  options?: QueryHookOptions<{ getDiscussionForumComments: PaginatedForumComment }, any>,
) => useQuery<{ getDiscussionForumComments: PaginatedForumComment }, any>(GET_DISCUSSION_FORUM_COMMENTS, options)

export const postDiscussionForumComments = (
  options?: MutationHookOptions<{ postDiscussionForumComments: ForumComment }, any>,
) =>
  useMutation<{ postDiscussionForumComments: ForumComment }, any>(POST_DISCUSSION_FORUM_COMMENTS, {
    ...options,
    update(cache, { data }) {
      if (!data?.postDiscussionForumComments) return

      try {
        const response = cache.readQuery<{ getDiscussionForumComments: PaginatedForumComment }>({
          query: GET_DISCUSSION_FORUM_COMMENTS,
          variables: {
            input: {
              id: data.postDiscussionForumComments.discussionForumId,
              limit: 50,
              cursor: null,

            },
          },
        })

        if (!response?.getDiscussionForumComments) return

        const newEdge = {
          node: data.postDiscussionForumComments,
          cursor: new Date().getTime().toString(), // Dummy cursor for optimistic update
          __typename: "ForumCommentEdge"
        }

        cache.writeQuery({
          query: GET_DISCUSSION_FORUM_COMMENTS,
          data: {
            getDiscussionForumComments: {
              ...response.getDiscussionForumComments,
              edges: [newEdge, ...response.getDiscussionForumComments.edges],
              totalCount: response.getDiscussionForumComments.totalCount + 1
            },
          },
          variables: {
            input: {
              id: data.postDiscussionForumComments.discussionForumId,
              limit: 50,
              cursor: null,

            },
          },
        })
      } catch (error) {
        console.log(error)
      }
    },
  })

export interface DiscussionStats {
  totalDiscussions: number
  activeToday: number
  yourPosts: number
  yourReplies: number
}

export interface PopularCategory {
  count: number
  name: string
}

export interface DiscussionStatsData {
  getDiscussionStats: DiscussionStats
  getPopularCategories: PopularCategory[]
}

export const getDiscussionStats = (options?: QueryHookOptions<DiscussionStatsData, any>) =>
  useQuery<DiscussionStatsData, any>(GET_DISCUSSION_STATS, options)

export interface TopContributor {
  id: string
  firstName: string
  lastName: string
  avatar: string | null
  totalPosts: number
}

export interface TopContributorsData {
  getTopContributors: TopContributor[]
}

export const getTopContributors = (options?: QueryHookOptions<TopContributorsData, any>) =>
  useQuery<TopContributorsData, any>(GET_TOP_CONTRIBUTORS, options)
