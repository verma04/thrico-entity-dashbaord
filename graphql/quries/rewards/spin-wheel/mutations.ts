import { gql } from "@apollo/client";

export const UPSERT_SPIN_WHEEL_CONFIG = gql`
  mutation UpsertSpinWheelConfig($input: UpsertSpinWheelConfigInput!) {
    upsertSpinWheelConfig(input: $input) {
      id
      costPerSpin
      maxSpinsPerDay
      isActive
      campaignStartDate
      campaignEndDate
    }
  }
`;

export const CREATE_SPIN_WHEEL_PRIZE = gql`
  mutation CreateSpinWheelPrize($input: CreateSpinWheelPrizeInput!) {
    createSpinWheelPrize(input: $input) {
      id
      label
      type
      value
      probability
      color
      sortOrder
      isActive
    }
  }
`;

export const UPDATE_SPIN_WHEEL_PRIZE = gql`
  mutation UpdateSpinWheelPrize($id: ID!, $input: UpdateSpinWheelPrizeInput!) {
    updateSpinWheelPrize(id: $id, input: $input) {
      id
      label
      type
      value
      probability
      isActive
    }
  }
`;

export const DELETE_SPIN_WHEEL_PRIZE = gql`
  mutation DeleteSpinWheelPrize($id: ID!) {
    deleteSpinWheelPrize(id: $id)
  }
`;
