import { gql } from "@apollo/client";

export const CREATE_REWARD_ELIGIBILITY_RULE = gql`
  mutation CreateRewardEligibilityRule(
    $input: CreateRewardEligibilityRuleInput!
  ) {
    createRewardEligibilityRule(input: $input) {
      id
      entityId
      title
      description
      memberEligibility
      membershipTierId
      eligibleTierIds
      eligibleUserIds
      eligibleSegmentIds
      eligibleRoles
      perUserLimit
      totalUsageLimit
      minAccountAge
      minActivityRequired
      blockWarnedUsers
      cooldownPeriod
      showToAllMembers
      isActive
      status
      metadata
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_REWARD_ELIGIBILITY_RULE = gql`
  mutation UpdateRewardEligibilityRule(
    $id: ID!
    $input: UpdateRewardEligibilityRuleInput!
  ) {
    updateRewardEligibilityRule(id: $id, input: $input) {
      id
      entityId
      title
      description
      memberEligibility
      membershipTierId
      eligibleTierIds
      eligibleUserIds
      eligibleSegmentIds
      eligibleRoles
      perUserLimit
      totalUsageLimit
      minAccountAge
      minActivityRequired
      blockWarnedUsers
      cooldownPeriod
      showToAllMembers
      isActive
      status
      metadata
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_REWARD_ELIGIBILITY_RULE = gql`
  mutation DeleteRewardEligibilityRule($id: ID!) {
    deleteRewardEligibilityRule(id: $id)
  }
`;
