import { gql } from '@apollo/client';

export const ADD_LISTING = gql`
  mutation AddListing($input: inputAddListing) {
    addListing(input: $input) {
      title
      description
      condition
      category
      price
      createdAt
      media
      location
    }
  }
`;