import { gql } from "@apollo/client";

export const GET_SPONSORS = gql`
  query GetSponsors {
    getSponsors {
      id
      title
      image
      description
      externalUrl
      displayOrder
      createdAt
      updatedAt
    }
  }
`;

export const GET_SPONSOR = gql`
  query GetSponsor($getSponsorId: ID!) {
    getSponsor(id: $getSponsorId) {
      id
      title
      image
      description
      externalUrl
      displayOrder
      entityId
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_SPONSOR_CATEGORIES = gql`
  query GetSponsorCategories {
    getSponsorCategories {
      id
      title
      displayOrder
      entityId
      createdAt
      updatedAt
      sponsors {
        description
        title
        image
        externalUrl
        displayOrder
      }
    }
  }
`;
