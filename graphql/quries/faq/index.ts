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

export const GET_FAQ_BY_MODULE = gql`
  query GetFaqByModule($input: ModuleInput!) {
    getFaqByModule(input: $input) {
      faq
      module
    }
  }
`;

export const GET_TERMS_AND_CONDITIONS_BY_MODULE = gql`
  query GetTermsAndConditionsByModule($input: ModuleInput!) {
    getTermsAndConditionsByModule(input: $input) {
      module
      termsAndConditions
    }
  }
`;

export const UPDATE_FAQ_BY_MODULE = gql`
  mutation UpdateFaqByModule($module: String!, $faq: JSON!) {
    updateFaqByModule(module: $module, faq: $faq) {
      faq
      module
    }
  }
`;

export const UPDATE_TERMS_AND_CONDITIONS_BY_MODULE = gql`
  mutation UpdateTermsAndConditionsByModule(
    $module: String!
    $termsAndConditions: JSON!
  ) {
    updateTermsAndConditionsByModule(
      module: $module
      termsAndConditions: $termsAndConditions
    ) {
      module
      termsAndConditions
    }
  }
`;
