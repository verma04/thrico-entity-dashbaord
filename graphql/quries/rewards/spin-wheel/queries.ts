import { gql } from "@apollo/client";

export const GET_SPIN_WHEEL_CONFIG = gql`
  query GetSpinWheelConfig {
    getSpinWheelConfig {
      id
      entityId
      costPerSpin
      maxSpinsPerDay
      isActive
      campaignStartDate
      campaignEndDate
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
      rewardId
      createdAt
      updatedAt
      reward {
        id
        title
        description
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
      tcSpent
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
