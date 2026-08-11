import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_COMMUNITY,
  CHANGE_DISCUSSION_COMMUNITY_STATUS,
  CHANGE_DISCUSSION_COMMUNITY_VERIFICATION,
  GET_COMMUNITIES,
  GET_COMMUNITY_BY_ID,
  GET_COMMUNITY_REQUEST,
  UPDATE_COMMUNITY,
  DELETE_COMMUNITY,
  DELETE_COMMUNITY_RATING,
  UPDATE_COMMUNITY_RATING,
  UPDATE_COMMUNITY_BASIC_INFO,
  UPDATE_COMMUNITY_PERMISSIONS,
  UPDATE_COMMUNITY_RULES,
  GET_COMMUNITY_STATS,
  GET_COMMUNITY_SIGNUP_TREND,
  GET_TOP_ACTIVE_COMMUNITIES,
  GET_COMMUNITY_ACTIVITY_TREND,
  GetCommunityStatsResponse,
  GetCommunitySignupTrendResponse,
  GetTopActiveCommunitiesResponse,
  GetCommunityActivityTrendResponse,
  GET_COMMUNITY_RATINGS,
  VOTE_COMMUNITY_RATING_HELPFULNESS,
  GET_JOINED_COMMUNITIES,
  GET_CREATED_COMMUNITIES,
} from "../../quries/group/approval";

export const getCommunityRatings = (options: any) =>
  useQuery(GET_COMMUNITY_RATINGS, options);

export const deleteCommunityRating = (options: any) =>
  useMutation(DELETE_COMMUNITY_RATING, {
    ...options,
    update(cache, { data: { deleteCommunityRating } }) {
      if (deleteCommunityRating && options?.variables?.id) {
        cache.evict({ id: `CommunityRating:${options.variables.id}` });
        cache.gc();
      }
    },
  });

export const updateCommunityRating = (options: any) =>
  useMutation(UPDATE_COMMUNITY_RATING, options);

export const voteCommunityRatingHelpfulness = (options: any) =>
  useMutation(VOTE_COMMUNITY_RATING_HELPFULNESS, options);

export const addCommunity = (options: any) =>
  useMutation(ADD_COMMUNITY, {
    refetchQueries: ["GetCommunities"],
    awaitRefetchQueries: true,
    ...options,
    update(cache, { data: { addCommunity } }) {
      if (addCommunity) {
        const statusesToUpdate = ["ALL", undefined, addCommunity.status];

        statusesToUpdate.forEach((status) => {
          try {
            const cachedData: any = cache.readQuery({
              query: GET_COMMUNITIES,
              variables: { input: { status } },
            });

            if (cachedData && cachedData.getCommunities) {
              cache.writeQuery({
                query: GET_COMMUNITIES,
                variables: { input: { status } },
                data: {
                  getCommunities: [addCommunity, ...cachedData.getCommunities],
                },
              });
            }
          } catch (error) {
            // Ignore if query not in cache yet
          }
        });
      }
    },
  });

export const getCommunities = (options: any) =>
  useQuery(GET_COMMUNITIES, options);

export const getJoinedCommunities = (options: any) =>
  useQuery(GET_JOINED_COMMUNITIES, options);

export const getCreatedCommunities = (options: any) =>
  useQuery(GET_CREATED_COMMUNITIES, options);

export const getCommunityById = (options: any) =>
  useQuery(GET_COMMUNITY_BY_ID, options);

export const updateCommunity = (options: any) =>
  useMutation(UPDATE_COMMUNITY, {
    ...options,
    update(cache, { data: { updateCommunity } }) {
      try {
        const approvedData: any = cache.readQuery({
          query: GET_COMMUNITY_BY_ID,
          variables: {
            input: {
              communityId: updateCommunity.id,
            },
          },
        });

        cache.writeQuery({
          query: GET_COMMUNITY_BY_ID,
          data: {
            getCommunityById: updateCommunity,
          },
          variables: {
            input: {
              communityId: updateCommunity.id,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const deleteCommunity = (options: any) =>
  useMutation(DELETE_COMMUNITY, {
    ...options,
    update(cache, { data: { deleteCommunity } }) {
      if (deleteCommunity && options?.variables?.id) {
        const idToRemove = options.variables.id;

        const statuses = [
          "ALL",
          "APPROVED",
          "PENDING",
          "DISABLED",
          "REJECTED",
          "PAUSED",
        ];

        statuses.forEach((status) => {
          try {
            const cachedData: any = cache.readQuery({
              query: GET_COMMUNITIES,
              variables: { input: { status } },
            });
            if (cachedData && cachedData.getCommunities) {
              cache.writeQuery({
                query: GET_COMMUNITIES,
                variables: { input: { status } },
                data: {
                  getCommunities: cachedData.getCommunities.filter(
                    (c: any) => c.id !== idToRemove,
                  ),
                },
              });
            }
          } catch (e) {
            // Ignore if query not in cache yet
          }
        });
      }
    },
  });

export const updateBasicInfo = (options: any) =>
  useMutation(UPDATE_COMMUNITY_BASIC_INFO, {
    ...options,
    update(cache, { data: { updateBasicInfo } }) {
      try {
        // Update for status: "APPROVED"
        const approvedData: any = cache.readQuery({
          query: GET_COMMUNITY_BY_ID,
          variables: {
            input: {
              communityId: updateBasicInfo.id,
            },
          },
        });

        cache.writeQuery({
          query: GET_COMMUNITY_BY_ID,
          data: {
            getCommunityById: updateBasicInfo,
          },
          variables: {
            input: {
              communityId: updateBasicInfo.id,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const updateCommunityPermissions = (options: any) =>
  useMutation(UPDATE_COMMUNITY_PERMISSIONS, {
    ...options,
    update(cache, { data: { updateCommunityPermissions } }) {
      try {
        const communityId = updateCommunityPermissions.id;
        const existingData: any = cache.readQuery({
          query: GET_COMMUNITY_BY_ID,
          variables: {
            input: {
              communityId,
            },
          },
        });

        cache.writeQuery({
          query: GET_COMMUNITY_BY_ID,
          data: {
            getCommunityById: {
              ...existingData?.getCommunityById,
              ...updateCommunityPermissions,
            },
          },
          variables: {
            input: {
              communityId,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const updateCommunityRules = (options: any) =>
  useMutation(UPDATE_COMMUNITY_RULES, {
    ...options,
    update(cache, { data: { updateCommunityRules } }) {
      try {
        const communityId = updateCommunityRules.id;
        const existingData: any = cache.readQuery({
          query: GET_COMMUNITY_BY_ID,
          variables: {
            input: {
              communityId,
            },
          },
        });

        cache.writeQuery({
          query: GET_COMMUNITY_BY_ID,
          data: {
            getCommunityById: {
              ...existingData?.getCommunityById,
              ...updateCommunityRules,
            },
          },
          variables: {
            input: {
              communityId,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const changeDiscussionCommunityStatus = (options: any) =>
  useMutation(CHANGE_DISCUSSION_COMMUNITY_STATUS, {
    ...options,
    refetchQueries: [
      {
        query: GET_COMMUNITIES,
        variables: {
          input: {
            status: "ALL",
          },
        },
      },
      {
        query: GET_COMMUNITIES,
        variables: {
          input: {
            status: "PENDING",
          },
        },
      },
      {
        query: GET_COMMUNITIES,
        variables: {
          input: {
            status: "APPROVED",
          },
        },
      },

      {
        query: GET_COMMUNITIES,
        variables: {
          input: {
            status: "REJECTED",
          },
        },
      },

      {
        query: GET_COMMUNITIES,
        variables: {
          input: {
            status: "DISABLED",
          },
        },
      },
    ],
    awaitRefetchQueries: true, // ensures mutation waits until refetch is complete
  });

export const changeDiscussionCommunityVerification = (options: any) =>
  useMutation(CHANGE_DISCUSSION_COMMUNITY_VERIFICATION, {
    ...options,
    refetchQueries: [
      {
        query: GET_COMMUNITIES,
        variables: {
          input: {
            status: "ALL",
          },
        },
      },
      {
        query: GET_COMMUNITIES,
        variables: {
          input: {
            status: "PENDING",
          },
        },
      },
      {
        query: GET_COMMUNITIES,
        variables: {
          input: {
            status: "APPROVED",
          },
        },
      },

      {
        query: GET_COMMUNITIES,
        variables: {
          input: {
            status: "REJECTED",
          },
        },
      },

      {
        query: GET_COMMUNITIES,
        variables: {
          input: {
            status: "DISABLED",
          },
        },
      },
    ],
    awaitRefetchQueries: true, // ensures mutation waits until refetch is complete
  });

export const getCommunityRequest = (options: any) =>
  useQuery(GET_COMMUNITY_REQUEST, options);

export const getCommunityStats = (options: any) =>
  useQuery<GetCommunityStatsResponse>(GET_COMMUNITY_STATS, options);

export const useCommunitySignupTrend = (options?: any) =>
  useQuery<GetCommunitySignupTrendResponse>(GET_COMMUNITY_SIGNUP_TREND, {
    fetchPolicy: "network-only",
    ...options,
  });

export const useTopActiveCommunities = (limit: number = 5) =>
  useQuery<GetTopActiveCommunitiesResponse>(GET_TOP_ACTIVE_COMMUNITIES, {
    variables: { limit },
    fetchPolicy: "network-only",
  });

export const useCommunityActivityTrend = () =>
  useQuery<GetCommunityActivityTrendResponse>(GET_COMMUNITY_ACTIVITY_TREND, {
    fetchPolicy: "network-only",
  });
