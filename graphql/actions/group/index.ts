import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_COMMUNITY,
  CHANGE_DISCUSSION_COMMUNITY_STATUS,
  CHANGE_DISCUSSION_COMMUNITY_VERIFICATION,
  GET_COMMUNITIES,
  GET_COMMUNITY_BY_ID,
  GET_COMMUNITY_REQUEST,
  UPDATE_COMMUNITY_BASIC_INFO,
  UPDATE_COMMUNITY_PERMISSIONS,
  UPDATE_COMMUNITY_RULES,
} from "../../quries/group/approval";

export const addCommunity = (options: any) =>
  useMutation(ADD_COMMUNITY, {
    ...options,
    update(cache, { data: { addCommunity } }) {
      try {
        if (addCommunity.status === "APPROVED") {
          // Update for status: "APPROVED"
          const approvedData: any = cache.readQuery({
            query: GET_COMMUNITIES,
            variables: {
              input: {
                status: "APPROVED",
              },
            },
          });

          cache.writeQuery({
            query: GET_COMMUNITIES,
            data: {
              getCommunities: [
                addCommunity,
                ...(approvedData?.getCommunities || []),
              ],
            },
            variables: {
              input: {
                status: "APPROVED",
              },
            },
          });

          // Update for status: "ALL"
          const allData: any = cache.readQuery({
            query: GET_COMMUNITIES,
            variables: {
              input: {
                status: "ALL",
              },
            },
          });

          cache.writeQuery({
            query: GET_COMMUNITIES,
            data: {
              getCommunities: [
                addCommunity,
                ...(allData?.getCommunities || []),
              ],
            },
            variables: {
              input: {
                status: "ALL",
              },
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

export const getCommunities = (options: any) =>
  useQuery(GET_COMMUNITIES, options);

export const getCommunityById = (options: any) =>
  useQuery(GET_COMMUNITY_BY_ID, options);

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
