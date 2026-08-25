import { gql } from "@apollo/client";

export const GET_SCRATCH_CONFIG = gql`
  query GetScratchCardConfig {
    getScratchCardConfig {
      id
      entityId
      isActive
      createdAt
      updatedAt
      prizes {
        id
        configId
        label
        type
        value
        coinsAmount
        tryAgainMessage
        isActive
        minAccountAge
        minActivity
        eligibilityDescription
        storeDiscountRuleId
        manualBatchId
        digitalCardRuleId
        eligibilityRuleId
        storeDiscountRule {
          id
          title
          discountType
          discountValue
        }
        manualBatch {
          id
          name
          totalCount
        }
        digitalCardRule {
          id
          brandName
          title
          faceValue
          totalCost
        }
        eligibilityRule {
          id
          title
        }
        mechanism {
          type
          ruleId
          manualBatchId
          storeDiscountRuleId
          digitalCardRuleId
        }
        eligibility {
          memberEligibility
          membershipTierId
          eligibleTierIds
          eligibleUserIds
          minAccountAge
          minActivityRequired
          showToAllMembers
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_SCRATCH_PRIZES = gql`
  query GetScratchCardPrizes {
    getScratchCardPrizes {
      id
      configId
      label
      type
      value
      coinsAmount
      tryAgainMessage
      isActive
      minAccountAge
      minActivity
      eligibilityDescription
      storeDiscountRuleId
      manualBatchId
      digitalCardRuleId
      eligibilityRuleId
      storeDiscountRule {
        id
        title
        discountType
        discountValue
      }
      manualBatch {
        id
        name
        totalCount
      }
      digitalCardRule {
        id
        brandName
        title
        faceValue
        totalCost
      }
      eligibilityRule {
        id
        title
      }
      mechanism {
        type
        ruleId
        manualBatchId
        storeDiscountRuleId
        digitalCardRuleId
      }
      eligibility {
        memberEligibility
        membershipTierId
        eligibleTierIds
        eligibleUserIds
        minAccountAge
        minActivityRequired
        showToAllMembers
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_SCRATCH_PLAYS = gql`
  query GetScratchCardPlays($pagination: PaginationInput) {
    getScratchCardPlays(pagination: $pagination) {
      id
      userId
      prizeType
      prizeValue
      coinsSpent
      playedAt
      user {
        id
        firstName
        lastName
        email
        avatar
      }
      prize {
        id
        label
        type
        value
      }
    }
  }
`;

export const GET_SCRATCH_PRIZE_BY_ID = gql`
  query GetScratchCardPrizeById($id: ID!) {
    getScratchCardPrizeById(id: $id) {
      id
      configId
      label
      type
      value
      coinsAmount
      tryAgainMessage
      isActive
      minAccountAge
      minActivity
      eligibilityDescription
      storeDiscountRuleId
      manualBatchId
      digitalCardRuleId
      eligibilityRuleId
      storeDiscountRule {
        id
        title
        discountType
        discountValue
      }
      manualBatch {
        id
        name
        totalCount
      }
      digitalCardRule {
        id
        brandName
        title
        faceValue
        totalCost
      }
      eligibilityRule {
        id
        title
      }
      mechanism {
        type
        ruleId
        manualBatchId
        storeDiscountRuleId
        digitalCardRuleId
      }
      eligibility {
        memberEligibility
        membershipTierId
        eligibleTierIds
        eligibleUserIds
        eligibleSegmentIds
        eligibleRoles
        minAccountAge
        minActivityRequired
        totalUsageLimit
        perUserLimit
        cooldownPeriod
        blockWarnedUsers
        showToAllMembers
      }
      createdAt
      updatedAt
    }
  }
`;

