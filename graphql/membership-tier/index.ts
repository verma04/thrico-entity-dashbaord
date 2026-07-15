import { gql } from "@apollo/client";

export const GET_MEMBERSHIP_TIERS = gql`
  query GetMembershipTiers {
    getMembershipTiers {
      id
      entityId
      name
      description
      badgeIcon
      badgeColor
      benefits
      isDefault
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_MEMBERSHIP_TIER = gql`
  mutation CreateMembershipTier($input: CreateMembershipTierInput!) {
    createMembershipTier(input: $input) {
      id
      name
      description
      badgeIcon
      badgeColor
      benefits
      isDefault
    }
  }
`;

export const UPDATE_MEMBERSHIP_TIER = gql`
  mutation UpdateMembershipTier($id: ID!, $input: UpdateMembershipTierInput!) {
    updateMembershipTier(id: $id, input: $input) {
      id
      name
      description
      badgeIcon
      badgeColor
      benefits
      isDefault
    }
  }
`;

export const DELETE_MEMBERSHIP_TIER = gql`
  mutation DeleteMembershipTier($id: ID!) {
    deleteMembershipTier(id: $id)
  }
`;

export const ASSIGN_MEMBERS_TO_TIER = gql`
  mutation AssignMembersToTier($tierId: ID!, $memberIds: [ID!]!) {
    assignMembersToTier(tierId: $tierId, memberIds: $memberIds)
  }
`;

export const REMOVE_MEMBER_FROM_TIER = gql`
  mutation RemoveMemberFromTier($memberId: ID!) {
    removeMemberFromTier(memberId: $memberId)
  }
`;
