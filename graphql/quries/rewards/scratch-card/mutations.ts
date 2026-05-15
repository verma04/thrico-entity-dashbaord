import { gql } from "@apollo/client";

export const UPSERT_SCRATCH_CONFIG = gql`
  mutation UpsertScratchCardConfig($input: UpsertScratchCardConfigInput!) {
    upsertScratchCardConfig(input: $input) {
      id
      isActive
      prizes {
        id
        label
        type
        value
        probability
        isActive
        minAccountAge
        minActivity
        eligibilityDescription
      }
    }
  }
`;

export const CREATE_SCRATCH_PRIZE = gql`
  mutation CreateScratchCardPrize($input: CreateScratchCardPrizeInput!) {
    createScratchCardPrize(input: $input) {
      id
      label
      type
      value
      probability
      isActive
      minAccountAge
      minActivity
      eligibilityDescription
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
      label
      type
      value
      probability
      isActive
      minAccountAge
      minActivity
      eligibilityDescription
    }
  }
`;

export const DELETE_SCRATCH_PRIZE = gql`
  mutation DeleteScratchCardPrize($id: ID!) {
    deleteScratchCardPrize(id: $id)
  }
`;
