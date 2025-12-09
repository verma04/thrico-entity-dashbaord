import { gql } from "@apollo/client";

export const GET_ALL_PAGES = gql`
  query GetAllPages($input: searchPageInput) {
    getAllPages(input: $input) {
      name
      logo
      location
      type
      industry
      website
      pageType
      size
      tagline
      id
    }
  }
`;
export const ADD_PAGES = gql`
  mutation AddPage($input: pageInput) {
    addPage(input: $input) {
      name
      logo
      location
      type
      industry
      website
      pageType
      size
      tagline
      id
    }
  }
`;
