import { gql } from "@apollo/client";

export const GET_SPIN_WHEEL_CONFIG = gql`
  query GetSpinWheelConfig {
    getSpinWheelConfig {
      id
      entityId
      costPerSpin
      maxSpinsPerDay
      maxItems
      maxWheelItems
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_SPIN_WHEEL_PRIZES = gql`
  query GetSpinWheelPrizes {
    getSpinWheelPrizes {
      id
      configId
      label
      type
      value
      probability
      color
      sortOrder
      isActive
      storeDiscountRuleId
      manualBatchId
      digitalCardRuleId
      createdAt
      updatedAt

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
    }
  }
`;

export const GET_SPIN_WHEEL_PLAYS = gql`
  query GetSpinWheelPlays($pagination: PaginationInput) {
    getSpinWheelPlays(pagination: $pagination) {
      id
      prizeType
      prizeValue
      coinsSpent
      playedAt
      user {
        id
        firstName
        lastName
      }
      prize {
        id
        label
      }
    }
  }
`;
