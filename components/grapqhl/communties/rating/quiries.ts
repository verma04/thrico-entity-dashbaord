"use client";
// ...existing code...

import { gql } from "@apollo/client";
import { MutationHookOptions, QueryHookOptions, useMutation, useQuery } from "@apollo/client/react";
import { AddRatingInput, AddRatingResponse, GetCommunityRatingsResponse, GetRatingsInput, UpdateRatingInput, UpdateRatingResponse, VoteOnRatingInput, VoteOnRatingResponse } from "./types";
import { InputId } from "../types";

// RATINGS QUERIES AND MUTATIONS
const GET_COMMUNITY_RATINGS = gql`
  query Metadata($input: getRatingsInput) {
    getCommunityRatings(input: $input) {
      metadata {
        isCurrentUserAdmin
        canAddRating
        summary {
          averageRating
          fiveStar
          fourStar
          oneStar
          threeStar
          twoStar
          totalRatings
        }
        currentUserRating {
          id
          rating
          review
          isVerified
          verifiedBy
          verifiedAt
          helpfulCount
          unhelpfulCount
          createdAt
          updatedAt
        }
      }
      ratings {
        id
        rating
        review
        isVerified
        verifiedBy
        verifiedAt
        helpfulCount
        unhelpfulCount
        createdAt
        updatedAt
        user {
          avatar
          id
          firstName
          lastName
        }
        currentUserVote
      }
      pagination {
        currentPage
        totalPages
        totalCount
        limit
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

const ADD_COMMUNITY_RATING = gql`
  mutation AddCommunityRating($input: addRatingInput) {
    addCommunityRating(input: $input) {
      id
      rating
      review
      isVerified
      verifiedBy
      verifiedAt
      helpfulCount
      unhelpfulCount
      createdAt
      updatedAt
      user {
        id
        firstName
        avatar
        lastName
        isOnline
        cover
        status
      }
      currentUserVote
    }
  }
`;

const UPDATE_COMMUNITY_RATING = gql`
  mutation UpdateCommunityRating($input: updateRatingInput!) {
    updateCommunityRating(input: $input) {
      id
      rating
      review
      isVerified
      verifiedBy
      verifiedAt
      helpfulCount
      unhelpfulCount
      createdAt
      updatedAt
      user {
        avatar
        id
        firstName
        lastName
      }
      currentUserVote
    }
  }
`;

const VOTE_ON_RATING = gql`
  mutation VoteOnRating($input: voteOnRatingInput!) {
    voteOnRating(input: $input) {
      success
      helpfulCount
      unhelpfulCount
      currentUserVote
    }
  }
`;

const DELETE_COMMUNITY_RATING = gql`
  mutation DeleteCommunityRating($input: inputId) {
    deleteCommunityRating(input: $input) {
      status
    }
  }
`;

// ...existing hooks...

// RATINGS HOOKS
export const useGetCommunityRatings = (
  options?: QueryHookOptions<GetCommunityRatingsResponse, { input: GetRatingsInput }>
) => {
  return useQuery<GetCommunityRatingsResponse, { input: GetRatingsInput }>(
    GET_COMMUNITY_RATINGS,
    options as any
  );
};

export const useAddCommunityRating = (
  options?: MutationHookOptions<AddRatingResponse, { input: AddRatingInput }>
) => {
  return useMutation<AddRatingResponse, { input: AddRatingInput }>(
    ADD_COMMUNITY_RATING,
    {
      ...options,
      update: (cache, { data }) => {
        if (data?.addCommunityRating) {
          try {
            // Update the ratings cache
            const communityId = options?.variables?.input?.communityId;
            if (communityId) {
              const existingData = cache.readQuery<GetCommunityRatingsResponse, { input: GetRatingsInput }>({
                query: GET_COMMUNITY_RATINGS,
                variables: { input: { communityId, page: 1, limit: 10 } }
              });

              if (existingData?.getCommunityRatings) {
                cache.writeQuery({
                  query: GET_COMMUNITY_RATINGS,
                  variables: { input: { communityId, page: 1, limit: 10 } },
                  data: {
                    getCommunityRatings: {
                      ...existingData.getCommunityRatings,
                      ratings: [data.addCommunityRating, ...existingData.getCommunityRatings.ratings],
                      pagination: {
                        ...existingData.getCommunityRatings.pagination,
                        totalCount: existingData.getCommunityRatings.pagination.totalCount + 1
                      },
                      metadata: {
                        ...existingData.getCommunityRatings.metadata,
                        currentUserRating: data.addCommunityRating
                      }
                    }
                  }
                });
              }
            }
          } catch (error) {
            console.log('Cache miss for getCommunityRatings query');
          }
        }
      }
    }
  );
};

export const useUpdateCommunityRating = (
  options?: MutationHookOptions<UpdateRatingResponse, { input: UpdateRatingInput }>
) => {
  return useMutation<UpdateRatingResponse, { input: UpdateRatingInput }>(
    UPDATE_COMMUNITY_RATING,
    {
      ...options,
      update: (cache, { data }) => {
        if (data?.updateCommunityRating) {
          // Update cache to reflect the updated rating
          cache.modify({
            id: cache.identify(data?.updateCommunityRating as any),
            fields: {
              rating: () => data?.updateCommunityRating.rating,
              review: () => data?.updateCommunityRating.review,
              updatedAt: () => data?.updateCommunityRating.updatedAt,
            }
          });
        }
      }
    }
  );
};

export const useVoteOnRating = (
  options?: MutationHookOptions<VoteOnRatingResponse, { input: VoteOnRatingInput }>
) => {
  return useMutation<VoteOnRatingResponse, { input: VoteOnRatingInput }>(
    VOTE_ON_RATING,
    {
      ...options,
      update: (cache, { data }) => {
        if (data?.voteOnRating && options?.variables?.input?.ratingId) {
          // Update the specific rating's vote counts and current user vote
          cache.modify({
            id: `CommunityRating:${options.variables.input.ratingId}`,
            fields: {
              helpfulCount: () => data.voteOnRating.helpfulCount,
              unhelpfulCount: () => data.voteOnRating.unhelpfulCount,
              currentUserVote: () => data.voteOnRating.currentUserVote,
            }
          });
        }
      }
    }
  );
};

export const useDeleteCommunityRating = (
  options?: MutationHookOptions<{ deleteCommunityRating: { status: boolean } }, { input: InputId }>
) => {
  return useMutation<{ deleteCommunityRating: { status: boolean } }, { input: InputId }>(
    DELETE_COMMUNITY_RATING,
    {
      ...options,
      update: (cache, { data }) => {
        if (data?.deleteCommunityRating?.status && options?.variables?.input?.id) {
          const ratingId = options.variables.input.id;

          // Remove the rating from the ratings list in getCommunityRatings
          // Try to get the communityId from the cache or ratings list
          let communityId = (options?.variables as any)?.input?.communityId;
          if (!communityId) {
            // Fallback: try to get it from the cached ratings list
            const allRatings = cache.readQuery<GetCommunityRatingsResponse, { input: GetRatingsInput }>({
              query: GET_COMMUNITY_RATINGS,
              variables: { input: { page: 1, limit: 10 } }
            })?.getCommunityRatings?.ratings;
            const deletedRating = allRatings?.find(r => r.id === ratingId);
            communityId = deletedRating?.communityId;
          }
          if (communityId) {
            try {
              const existingData = cache.readQuery<GetCommunityRatingsResponse, { input: GetRatingsInput }>({
                query: GET_COMMUNITY_RATINGS,
                variables: { input: { communityId, page: 1, limit: 10 } }
              });

              if (existingData?.getCommunityRatings) {
                cache.writeQuery({
                  query: GET_COMMUNITY_RATINGS,
                  variables: { input: { communityId, page: 1, limit: 10 } },
                  data: {
                    getCommunityRatings: {
                      ...existingData.getCommunityRatings,
                      ratings: existingData.getCommunityRatings.ratings.filter(r => r.id !== ratingId),
                      pagination: {
                        ...existingData.getCommunityRatings.pagination,
                        totalCount: Math.max(existingData.getCommunityRatings.pagination.totalCount - 1, 0)
                      },
                      metadata: {
                        ...existingData.getCommunityRatings.metadata,
                        currentUserRating: null
                      }
                    }
                  }
                });
              }
            } catch (error) {
              console.log('Cache miss for getCommunityRatings query');
            }
          }

          // Evict the rating object from cache
          cache.evict({
            id: `CommunityRating:${ratingId}`
          });
          cache.gc();
        }
      }
    }
  );
};