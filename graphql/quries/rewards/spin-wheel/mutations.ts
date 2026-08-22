import { gql } from "@apollo/client";

export const UPSERT_SPIN_WHEEL_CONFIG = gql`
  mutation UpsertSpinWheelConfig($input: UpsertSpinWheelConfigInput!) {
    upsertSpinWheelConfig(input: $input) {
      id
      costPerSpin
      maxSpinsPerDay
      maxItems
      maxWheelItems
      isActive
    }
  }
`;

export const CREATE_SPIN_WHEEL_PRIZE = gql`
  mutation CreateSpinWheelPrize($input: CreateSpinWheelPrizeInput!) {
    createSpinWheelPrize(input: $input) {
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

export const UPDATE_SPIN_WHEEL_PRIZE = gql`
  mutation UpdateSpinWheelPrize($id: ID!, $input: UpdateSpinWheelPrizeInput!) {
    updateSpinWheelPrize(id: $id, input: $input) {
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

export const DELETE_SPIN_WHEEL_PRIZE = gql`
  mutation DeleteSpinWheelPrize($id: ID!) {
    deleteSpinWheelPrize(id: $id)
  }
`;
