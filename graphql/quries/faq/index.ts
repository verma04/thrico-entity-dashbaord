import { gql } from "@apollo/client";

export const GET_FAQ = gql`
  query GetModuleFaq($input: inputFaq) {
    getModuleFaq(input: $input) {
      id
      title
      description
      createdAt
      updatedAt
    }
  }
`;
export const ADD_FAQ = gql`
  mutation AddFaq($input: inputAddFaq) {
    addFaq(input: $input) {
      id
      title
      description
      createdAt
      updatedAt
    }
  }
`;

export const EDIT_FAQ = gql`
  mutation EditFaq($input: inputEditFaq) {
    editFaq(input: $input) {
      id
      title
      description
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_FAQ = gql`
  mutation DeleteFaq($input: inputDeleteFaq) {
    deleteFaq(input: $input) {
      id
      title
      description
      createdAt
      updatedAt
    }
  }
`;

export const SORT_FAQ = gql`
  mutation SortFaq($input: [sortInputFaq]) {
    sortFaq(input: $input) {
      createdAt
      description
      id
      title
      updatedAt
    }
  }
`;
