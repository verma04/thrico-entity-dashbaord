import { gql } from "@apollo/client";

export const GET_COMMUNITY_MEMBERS = gql`
  query GetCommunityMembers($communityId: ID!, $limit: Int, $offset: Int) {
    getCommunityMembers(communityId: $communityId, limit: $limit, offset: $offset) {
      data {
        id
        userId
        groupId
        role
        createdAt
        user {
          id
          firstName
          lastName
          avatar
        }
      }
      totalCount
    }
  }
`;

export const GET_COMMUNITY_MEMBER_REQUESTS = gql`
  query GetCommunityMemberRequests($communityId: ID!, $limit: Int, $offset: Int) {
    getCommunityMemberRequests(communityId: $communityId, limit: $limit, offset: $offset) {
      data {
        id
        userId
        groupId
        isAccepted
        createdAt
        user {
          id
          firstName
          lastName
          avatar
        }
      }
      totalCount
    }
  }
`;

export const REMOVE_COMMUNITY_MEMBER = gql`
  mutation RemoveCommunityMember($communityId: ID!, $userId: ID!) {
    removeCommunityMember(communityId: $communityId, userId: $userId)
  }
`;

export const CHANGE_COMMUNITY_MEMBER_ROLE = gql`
  mutation ChangeCommunityMemberRole($communityId: ID!, $userId: ID!, $role: String!) {
    changeCommunityMemberRole(communityId: $communityId, userId: $userId, role: $role)
  }
`;

export const APPROVE_COMMUNITY_MEMBER_REQUEST = gql`
  mutation ApproveCommunityMemberRequest($communityId: ID!, $userId: ID!) {
    approveCommunityMemberRequest(communityId: $communityId, userId: $userId)
  }
`;

export const REJECT_COMMUNITY_MEMBER_REQUEST = gql`
  mutation RejectCommunityMemberRequest($communityId: ID!, $userId: ID!) {
    rejectCommunityMemberRequest(communityId: $communityId, userId: $userId)
  }
`;
