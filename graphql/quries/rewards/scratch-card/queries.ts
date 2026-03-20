import { gql } from "@apollo/client";

export const GET_SCRATCH_CONFIG = gql`
  query GetScratchCardConfig {
    getScratchCardConfig {
      id
      entityId
      costPerScratch
      maxScratchesPerDay
      isActive
      campaignStartDate
      campaignEndDate
      createdAt
      updatedAt
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
      probability
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_SCRATCH_PLAYS = gql`
  query GetScratchCardPlays($pagination: PaginationInput) {
    getScratchCardPlays(pagination: $pagination) {
      id
      prizeType
      prizeValue
      tcSpent
      playedAt
      prize {
        id
        label
        value
        type
      }
    }
  }
`;
