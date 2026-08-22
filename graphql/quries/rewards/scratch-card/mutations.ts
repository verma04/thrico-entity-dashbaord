import { gql } from "@apollo/client";

export const UPSERT_SCRATCH_CONFIG = gql`
  mutation UpsertScratchCardConfig($input: UpsertScratchCardConfigInput!) {
    upsertScratchCardConfig(input: $input) {
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
        storeDiscountRule {
          id
          title
          discountValue
        }
        manualBatch {
          id
          name
          totalCount
        }
        digitalCardRule {
          id
          title
          faceValue
          totalCost
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
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_SCRATCH_PRIZE = gql`
  mutation CreateScratchCardPrize($input: CreateScratchCardPrizeInput!) {
    createScratchCardPrize(input: $input) {
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
      mechanism {
        type
        ruleId
        manualBatchId
        storeDiscountRuleId
        digitalCardRuleId
      }
      storeDiscountRule {
        id
        title
        discountValue
      }
      manualBatch {
        id
        name
        totalCount
      }
      digitalCardRule {
        id
        title
        faceValue
        totalCost
      }
      eligibility {
        memberEligibility
        membershipTierId
        eligibleTierIds
        eligibleUserIds
        minAccountAge
        minActivityRequired
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SCRATCH_PRIZE = gql`
  mutation UpdateScratchCardPrize(
    $id: ID!
    $input: UpdateScratchCardPrizeInput!
  ) {
    updateScratchCardPrize(id: $id, input: $input) {
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
      mechanism {
        type
        ruleId
        manualBatchId
        storeDiscountRuleId
        digitalCardRuleId
      }
      storeDiscountRule {
        id
        title
        discountValue
      }
      manualBatch {
        id
        name
        totalCount
      }
      digitalCardRule {
        id
        title
        faceValue
        totalCost
      }
      eligibility {
        memberEligibility
        membershipTierId
        eligibleTierIds
        eligibleUserIds
        minAccountAge
        minActivityRequired
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_SCRATCH_PRIZE = gql`
  mutation DeleteScratchCardPrize($id: ID!) {
    deleteScratchCardPrize(id: $id)
  }
`;

