import { gql } from "@apollo/client";

export const GET_SCRATCH_CONFIG = gql`
  query GetScratchCardConfig {
    getScratchCardConfig {
      id
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_SCRATCH_PRIZES = gql`
  query GetScratchCardPrizes {
    getScratchCardPrizes {
      id
      label
      type
      value
      probability
      isActive
      minAccountAge
      minActivity
      eligibilityDescription
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
      coinsSpent
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
