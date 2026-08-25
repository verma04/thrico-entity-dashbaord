import { gql } from "@apollo/client";

export const GET_REWARD_ELIGIBILITY_RULES = gql`
  query GetRewardEligibilityRules($page: Int, $limit: Int, $search: String) {
    getRewardEligibilityRules(page: $page, limit: $limit, search: $search) {
      items {
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
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_REWARD_ELIGIBILITY_RULE_BY_ID = gql`
  query GetRewardEligibilityRuleById($id: ID!) {
    getRewardEligibilityRuleById(id: $id) {
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
