"use client";
/**
 * Community Mutations and Mutation Hooks
 *
 * This file contains all GraphQL mutations related to communities and their associated hooks.
 * It includes mutations for creating, editing, joining communities, and managing community settings.
 */

import { useMutation, MutationHookOptions } from "@apollo/client/react";

import { GROUP_DETAILS_FRAGMENT } from "./fragments";
import {
  GET_ALL_COMMUNITIES,
  GET_COMMUNITY_DETAILS,
  GET_PENDING_JOIN_REQUESTS,
  GET_COMMUNITY_MEMBERS_WITH_ROLES,
} from "./community-queries";

// Import community feed queries (you may need to adjust the import path)
const GET_COMMUNITIES_FEED_LIST = gql`
  query GetCommunitiesFeedList {
    getCommunitiesFeedList {
      id
      # Add other fields as needed
    }
  }
`;

const GET_PENDING_FEED_COMMUNITIES = gql`
  query GetPendingFeedCommunities {
    getPendingFeedCommunities {
      id
      # Add other fields as needed
    }
  }
`;

const GET_ALL_PINNED_FEEDS = gql`
  query GetAllPinnedFeeds {
    getAllPinnedFeeds {
      id
      # Add other fields as needed
    }
  }
`;
import {
  AddGroupInput,
  CreateCommunitiesResponse,
  GetCommunitiesInput,
  GetCommunitiesResponse,
  GroupDetails,
  InputId,
  InputJoinCommunity,
  GetPendingJoinRequestsInput,
  GetPendingJoinRequestsResponse,
  RespondToJoinRequestInput,
  RespondToJoinRequestResponse,
  UpdateMemberRoleInput,
  UpdateMemberRoleResponse,
  RemoveMemberInput,
  RemoveMemberResponse,
  GetCommunityMembersInput,
  GetCommunityMembersWithRolesResponse,
  ReportCommunityInput,
  ReportCommunityResponse,
  LeaveCommunityInput,
  LeaveCommunityResponse,
} from "./types";
import { gql } from "@apollo/client";

// Additional types for DeleteCommunityFeed
interface DeleteCommunityFeedResponse {
  deleteCommunityFeed: {
    id: string;
  };
}

// MUTATIONS
export const CREATE_COMMUNITIES = gql`
  mutation CreateCommunities($input: addGroup!) {
    createCommunities(input: $input) {
      ...GroupDetailsFragment
    }
  }
  ${GROUP_DETAILS_FRAGMENT}
`;

export const JOIN_COMMUNITY = gql`
  mutation JoinCommunity($input: inputJoinCommunity!) {
    joinCommunity(input: $input) {
      ...GroupDetailsFragment
    }
  }
  ${GROUP_DETAILS_FRAGMENT}
`;

export const TOGGLE_COMMUNITY_WISHLIST = gql`
  mutation ToggleCommunityWishlist($input: inputId!) {
    toggleCommunityWishlist(input: $input) {
      id
      status
      isFeatured
      isWishList
      isTrending
      group {
        id
        title
        cover
        slug
        description
        privacy
        numberOfUser
        numberOfLikes
        numberOfPost
        createdAt
        updatedAt
        numberOfViews
        tag
        isFeatured
        location
        tagline
        isGroupMember
        isJoinRequest
        isGroupAdmin
        isTrending
      }
      groupSettings {
        groupType
        joiningCondition
        privacy
      }
      groupStatus
      role
      rank
      trendingScore
      isGroupMember
      isJoinRequest
      isGroupAdmin
      isGroupManager
      members {
        id
        avatar
      }
      creator {
        id
        avatar
        firstName
        lastName
      }
    }
  }
`;

export const TRACK_COMMUNITY_VIEW = gql`
  mutation TrackCommunityView($input: inputId!) {
    trackCommunityView(input: $input)
  }
`;

export const EDIT_COMMUNITY = gql`
  mutation EditCommunity($input: editGroup) {
    editCommunity(input: $input) {
      id
      status
      isFeatured
      isWishList
      isTrending
      group {
        id
        title
        cover
        slug
        description
        privacy
        numberOfUser
        numberOfLikes
        numberOfPost
        createdAt
        updatedAt
        numberOfViews
        tag
        isFeatured
        location
        tagline
        isGroupMember
        isJoinRequest
        isGroupAdmin
        isTrending
        allowMemberInvites
        allowMemberPosts
        enableEvents
        enableRatingsAndReviews
      }
      groupSettings {
        groupType
        joiningCondition
        privacy
      }
      groupStatus
      role
      rank
      trendingScore
      isGroupMember
      isJoinRequest
      isGroupAdmin
      isGroupManager
      members {
        id
        avatar
      }
      creator {
        id
        avatar
        firstName
        lastName
      }
    }
  }
`;

export const RESPOND_TO_JOIN_REQUEST = gql`
  mutation RespondToJoinRequest($input: respondToJoinRequestInput!) {
    respondToJoinRequest(input: $input) {
      action
      request {
        id
        userId
        user {
          avatar
          firstName
          fullName
        }
        status
      }
      success
    }
  }
`;

export const UPDATE_MEMBER_ROLE = gql`
  mutation UpdateMemberRole($input: updateMemberRoleInput) {
    updateMemberRole(input: $input) {
      success
      updatedMember {
        id
        userId
        role
        updatedAt
      }
    }
  }
`;

export const REMOVE_MEMBER_FROM_COMMUNITY = gql`
  mutation RemoveMemberFromCommunity($input: removeMemberInput) {
    removeMemberFromCommunity(input: $input) {
      success
      message
    }
  }
`;

export const REPORT_COMMUNITY = gql`
  mutation ReportCommunity($input: ReportCommunityInput!) {
    reportCommunity(input: $input) {
      success
      reportId
      totalReports
      isFlagged
      message
    }
  }
`;

export const LEAVE_COMMUNITY = gql`
  mutation LeaveCommunity($input: leaveCommunityInput!) {
    leaveCommunity(input: $input) {
      communityArchived
      message
      success
    }
  }
`;

// MUTATION HOOKS

export const useCreateCommunities = (
  options?: MutationHookOptions<
    CreateCommunitiesResponse,
    { input: AddGroupInput }
  >,
) => {
  return useMutation<CreateCommunitiesResponse, { input: AddGroupInput }>(
    CREATE_COMMUNITIES,
    {
      ...options,
      update: (cache, { data }) => {
        if (data?.createCommunities) {
          try {
            const existingData = cache.readQuery<
              GetCommunitiesResponse,
              { input: GetCommunitiesInput }
            >({
              query: GET_ALL_COMMUNITIES,
              variables: { input: { page: 1, limit: 10 } },
            });

            if (existingData?.getAllCommunities) {
              cache.writeQuery({
                query: GET_ALL_COMMUNITIES,
                variables: options?.variables || {
                  input: { page: 1, limit: 10 },
                },
                data: {
                  getAllCommunities: {
                    ...existingData.getAllCommunities,
                    communities: [
                      data.createCommunities,
                      ...existingData.getAllCommunities.communities,
                    ],
                    pagination: {
                      ...existingData.getAllCommunities.pagination,
                      totalCount:
                        existingData.getAllCommunities.pagination.totalCount +
                        1,
                    },
                  },
                },
              });
            }
          } catch (error) {
            console.log("Cache miss for getAllCommunities query");
          }
        }
      },
    },
  );
};

export const useJoinCommunity = (
  options?: MutationHookOptions<
    { joinCommunity: GroupDetails },
    { input: InputJoinCommunity }
  >,
) => {
  return useMutation<
    { joinCommunity: GroupDetails },
    { input: InputJoinCommunity }
  >(JOIN_COMMUNITY, {
    ...options,
    update: (cache, { data }) => {
      if (data?.joinCommunity) {
        try {
          // Update getCommunityDetails cache
          cache.writeQuery<
            { getCommunityDetails: GroupDetails },
            { input: InputId }
          >({
            query: GET_COMMUNITY_DETAILS,
            variables: { input: { id: data.joinCommunity.id } },
            data: {
              getCommunityDetails: data.joinCommunity,
            },
          });
        } catch (error) {
          console.log("Cache miss for getCommunityDetails query");
        }
      }
    },
    refetchQueries: [
      "GetAllCommunities",
      "GetMyOwnedCommunities",
      "GetMyJoinedCommunities",
    ],
  });
};

export const useToggleCommunityWishlist = (
  options?: MutationHookOptions<
    { toggleCommunityWishlist: GroupDetails },
    { input: InputId }
  >,
) => {
  return useMutation<
    { toggleCommunityWishlist: GroupDetails },
    { input: InputId }
  >(TOGGLE_COMMUNITY_WISHLIST, {
    ...options,
    update: (cache, { data }, { variables }) => {
      const { toggleCommunityWishlist } = data || {};
      console.log(toggleCommunityWishlist, "Toggle Community Wishlist Data");
      try {
        const existingData = cache.readQuery<
          GetCommunitiesResponse,
          { input: GetCommunitiesInput }
        >({
          query: GET_ALL_COMMUNITIES,
          variables: { input: { page: 1, limit: 10 } },
        });

        if (existingData?.getAllCommunities) {
          const updatedCommunities =
            existingData.getAllCommunities.communities.map((comm) =>
              comm.id === toggleCommunityWishlist?.id
                ? { ...comm, isWishList: !comm.isWishList }
                : comm,
            );

          cache.writeQuery({
            query: GET_ALL_COMMUNITIES,
            variables: options?.variables || { input: { page: 1, limit: 10 } },
            data: {
              getAllCommunities: {
                communities: updatedCommunities,
                pagination: existingData.getAllCommunities.pagination,
              },
            },
          });
        }
      } catch (error) {
        console.log("Cache miss for getAllCommunities query");
      }
    },
  });
};

export const useTrackCommunityView = (
  options?: MutationHookOptions<
    { trackCommunityView: boolean },
    { input: InputId }
  >,
) => {
  return useMutation<{ trackCommunityView: boolean }, { input: InputId }>(
    TRACK_COMMUNITY_VIEW,
    options,
  );
};

export const useEditCommunity = (
  options?: MutationHookOptions<
    { editCommunity: GroupDetails },
    { input: any }
  >,
) => {
  return useMutation<{ editCommunity: GroupDetails }, { input: any }>(
    EDIT_COMMUNITY,
    {
      ...options,
      update: (cache, { data }) => {
        if (data?.editCommunity) {
          cache.writeQuery<
            { getCommunityDetails: GroupDetails },
            { input: InputId }
          >({
            query: GET_COMMUNITY_DETAILS,
            variables: { input: { id: data.editCommunity?.id } },
            data: { getCommunityDetails: data.editCommunity },
          });
        }
      },
    },
  );
};

export const useRespondToJoinRequest = (
  options?: MutationHookOptions<
    RespondToJoinRequestResponse,
    { input: RespondToJoinRequestInput }
  >,
) => {
  return useMutation<
    RespondToJoinRequestResponse,
    { input: RespondToJoinRequestInput }
  >(RESPOND_TO_JOIN_REQUEST, {
    ...options,
    update: (cache, { data }, { variables }) => {
      if (data?.respondToJoinRequest.success) {
        try {
          // Update the pending join requests cache
          const existingData = cache.readQuery<
            GetPendingJoinRequestsResponse,
            { input: GetPendingJoinRequestsInput }
          >({
            query: GET_PENDING_JOIN_REQUESTS,
            variables: {
              input: {
                id: variables?.input.groupId || "",
                page: 1,
                limit: 10,
              },
            },
          });

          if (existingData?.getPendingJoinRequests) {
            // Remove the processed request from the list
            const updatedRequests =
              existingData.getPendingJoinRequests.requests.filter(
                (request) => request.id !== variables?.input.requestId,
              );

            cache.writeQuery({
              query: GET_PENDING_JOIN_REQUESTS,
              variables: {
                input: {
                  id: variables?.input.groupId || "",
                  page: 1,
                  limit: 10,
                },
              },
              data: {
                getPendingJoinRequests: {
                  ...existingData.getPendingJoinRequests,
                  requests: updatedRequests,
                  pagination: {
                    ...existingData.getPendingJoinRequests.pagination,
                    totalCount:
                      existingData.getPendingJoinRequests.pagination
                        .totalCount - 1,
                  },
                },
              },
            });
          }
        } catch (error) {
          console.log("Cache miss for getPendingJoinRequests query");
        }
      }
    },
    refetchQueries: [
      {
        query: GET_PENDING_JOIN_REQUESTS,
        variables: {
          input: {
            id: options?.variables?.input?.groupId || "",
            page: 1,
            limit: 20,
          },
        },
      },
    ],
    awaitRefetchQueries: true,
  });
};

export const useUpdateMemberRole = (
  options?: MutationHookOptions<
    UpdateMemberRoleResponse,
    { input: UpdateMemberRoleInput }
  >,
) => {
  return useMutation<
    UpdateMemberRoleResponse,
    { input: UpdateMemberRoleInput }
  >(UPDATE_MEMBER_ROLE, {
    ...options,
    update: (cache, { data }, { variables }) => {
      if (data?.updateMemberRole.success) {
        try {
          // Update the community members with roles cache
          const existingData = cache.readQuery<
            GetCommunityMembersWithRolesResponse,
            { input: GetCommunityMembersInput }
          >({
            query: GET_COMMUNITY_MEMBERS_WITH_ROLES,
            variables: {
              input: {
                groupId: variables?.input.groupId || "",
                limit: 100,
                page: 1,
                role: null,
              },
            },
          });

          if (existingData?.getCommunityMembersWithRoles) {
            // Update the member with the new role
            const updatedMembers =
              existingData.getCommunityMembersWithRoles.members.map((member) =>
                member.userId === data.updateMemberRole.updatedMember.userId
                  ? {
                      ...member,
                      role: data.updateMemberRole.updatedMember.role,
                      updatedAt: data.updateMemberRole.updatedMember.updatedAt,
                    }
                  : member,
              );

            cache.writeQuery({
              query: GET_COMMUNITY_MEMBERS_WITH_ROLES,
              variables: {
                input: {
                  groupId: variables?.input.groupId || "",
                  limit: 100,
                  page: 1,
                  role: null,
                },
              },
              data: {
                getCommunityMembersWithRoles: {
                  ...existingData.getCommunityMembersWithRoles,
                  members: updatedMembers,
                },
              },
            });
          }
        } catch (error) {
          console.log("Cache miss for getCommunityMembersWithRoles query");
        }
      }
    },
  });
};

export const useRemoveMemberFromCommunity = (
  options?: MutationHookOptions<
    RemoveMemberResponse,
    { input: RemoveMemberInput }
  >,
) => {
  return useMutation<RemoveMemberResponse, { input: RemoveMemberInput }>(
    REMOVE_MEMBER_FROM_COMMUNITY,
    {
      ...options,
      update: (cache, { data }, { variables }) => {
        if (data?.removeMemberFromCommunity?.success) {
          try {
            // Update the community members with roles cache
            const existingData = cache.readQuery<
              GetCommunityMembersWithRolesResponse,
              { input: GetCommunityMembersInput }
            >({
              query: GET_COMMUNITY_MEMBERS_WITH_ROLES,
              variables: {
                input: {
                  groupId: variables?.input.groupId || "",
                  limit: 100,
                  page: 1,
                  role: null,
                },
              },
            });

            if (existingData?.getCommunityMembersWithRoles) {
              // Remove the member from the list
              const updatedMembers =
                existingData.getCommunityMembersWithRoles.members.filter(
                  (member) => member.userId !== variables?.input.memberId,
                );

              cache.writeQuery({
                query: GET_COMMUNITY_MEMBERS_WITH_ROLES,
                variables: {
                  input: {
                    groupId: variables?.input.groupId || "",
                    limit: 100,
                    page: 1,
                    role: null,
                  },
                },
                data: {
                  getCommunityMembersWithRoles: {
                    ...existingData.getCommunityMembersWithRoles,
                    members: updatedMembers,
                    pagination: {
                      ...existingData.getCommunityMembersWithRoles.pagination,
                      totalCount: Math.max(
                        0,
                        existingData.getCommunityMembersWithRoles.pagination
                          .totalCount - 1,
                      ),
                    },
                  },
                },
              });
            }

            console.log(
              options?.variables?.input?.memberId,
              "Member removed from cache",
            );
          } catch (error) {
            console.log("Cache miss for getCommunityMembersWithRoles query");
          }
        }
      },
    },
  );
};

export const useReportCommunity = (
  options?: MutationHookOptions<
    ReportCommunityResponse,
    { input: ReportCommunityInput }
  >,
) => {
  return useMutation<ReportCommunityResponse, { input: ReportCommunityInput }>(
    REPORT_COMMUNITY,
    options,
  );
};

export const useLeaveCommunity = (
  options?: MutationHookOptions<
    LeaveCommunityResponse,
    { input: LeaveCommunityInput }
  >,
) => {
  return useMutation<LeaveCommunityResponse, { input: LeaveCommunityInput }>(
    LEAVE_COMMUNITY,
    {
      ...options,
      update: (cache, { data }, { variables }) => {
        if (data?.leaveCommunity?.success) {
          const groupId = variables?.input.groupId || "";

          try {
            // Update getAllCommunities cache
            const existingCommunitiesData = cache.readQuery<
              GetCommunitiesResponse,
              { input: GetCommunitiesInput }
            >({
              query: GET_ALL_COMMUNITIES,
              variables: { input: { page: 1, limit: 10 } },
            });

            if (existingCommunitiesData?.getAllCommunities) {
              const updatedCommunities =
                existingCommunitiesData.getAllCommunities.communities.map(
                  (comm) => {
                    if (comm.id === groupId) {
                      return {
                        ...comm,
                        isGroupMember: false,
                        isJoinRequest: false,
                        group: {
                          ...comm.group,
                          isGroupMember: false,
                          isJoinRequest: false,
                          numberOfUser: Math.max(
                            0,
                            comm.group.numberOfUser - 1,
                          ),
                        },
                      };
                    }
                    return comm;
                  },
                );

              cache.writeQuery({
                query: GET_ALL_COMMUNITIES,
                variables: options?.variables || {
                  input: { page: 1, limit: 10 },
                },
                data: {
                  getAllCommunities: {
                    communities: updatedCommunities,
                    pagination:
                      existingCommunitiesData.getAllCommunities.pagination,
                  },
                },
              });
            }
          } catch (error) {
            console.log("Cache miss for getAllCommunities query");
          }

          try {
            // Update getCommunityDetails cache
            const existingDetailsData = cache.readQuery<
              { getCommunityDetails: GroupDetails },
              { input: InputId }
            >({
              query: GET_COMMUNITY_DETAILS,
              variables: { input: { id: groupId } },
            });

            if (existingDetailsData?.getCommunityDetails) {
              const updatedCommunityDetails = {
                ...existingDetailsData.getCommunityDetails,
                isGroupMember: false,
                isJoinRequest: false,
                isGroupAdmin: false,
                isGroupManager: false,
                group: {
                  ...existingDetailsData.getCommunityDetails.group,
                  isGroupMember: false,
                  isJoinRequest: false,
                  isGroupAdmin: false,
                  numberOfUser: Math.max(
                    0,
                    existingDetailsData.getCommunityDetails.group.numberOfUser -
                      1,
                  ),
                },
              };

              cache.writeQuery({
                query: GET_COMMUNITY_DETAILS,
                variables: { input: { id: groupId } },
                data: {
                  getCommunityDetails: updatedCommunityDetails,
                },
              });
            }
          } catch (error) {
            console.log("Cache miss for getCommunityDetails query");
          }

          try {
            // Update community members cache if it exists
            const existingMembersData = cache.readQuery<
              GetCommunityMembersWithRolesResponse,
              { input: GetCommunityMembersInput }
            >({
              query: GET_COMMUNITY_MEMBERS_WITH_ROLES,
              variables: {
                input: {
                  groupId: groupId,
                  limit: 100,
                  page: 1,
                  role: null,
                },
              },
            });

            if (existingMembersData?.getCommunityMembersWithRoles) {
              // Remove the current user from members list
              // Note: You'll need the current user ID for this to work properly
              // For now, we'll decrease the total count
              cache.writeQuery({
                query: GET_COMMUNITY_MEMBERS_WITH_ROLES,
                variables: {
                  input: {
                    groupId: groupId,
                    limit: 100,
                    page: 1,
                    role: null,
                  },
                },
                data: {
                  getCommunityMembersWithRoles: {
                    ...existingMembersData.getCommunityMembersWithRoles,
                    pagination: {
                      ...existingMembersData.getCommunityMembersWithRoles
                        .pagination,
                      totalCount: Math.max(
                        0,
                        existingMembersData.getCommunityMembersWithRoles
                          .pagination.totalCount - 1,
                      ),
                    },
                  },
                },
              });
            }
          } catch (error) {
            console.log("Cache miss for getCommunityMembersWithRoles query");
          }

          console.log(
            "Left community and updated all caches for groupId:",
            groupId,
          );

          // If community was archived, you might want to handle additional logic here
          if (data.leaveCommunity?.communityArchived) {
            console.log("Community was archived after leaving");
            // You could remove it from various community lists if needed
          }
        }
      },
    },
  );
};
