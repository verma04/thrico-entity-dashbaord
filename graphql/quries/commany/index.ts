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

export const GET_SEARCH_COMPANIES = gql`
  query GetSearchCompanies($input: ClassificationSearchInput) {
    getSearchCompanies(input: $input) {
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_SEARCH_JOB_TITLE = gql`
  query GetSearchJobTitle($input: ClassificationSearchInput) {
    getSearchJobTitle(input: $input) {
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_SEARCH_SKILLS = gql`
  query GetSearchSkills($input: ClassificationSearchInput) {
    getSearchSkills(input: $input) {
      edges {
        node {
          id
          title
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_SEARCH_DEGREE = gql`
  query GetSearchDegree($input: ClassificationSearchInput) {
    getSearchDegree(input: $input) {
      edges {
        node {
          id
          title
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_SEARCH_INTERESTS = gql`
  query GetSearchInterests($input: ClassificationSearchInput) {
    getSearchInterests(input: $input) {
      edges {
        node {
          id
          title
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_SEARCH_INDUSTRIES = gql`
  query GetSearchIndustries($input: ClassificationSearchInput) {
    getSearchIndustries(input: $input) {
      edges {
        node {
          id
          title
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_SEARCH_FUNCTIONS = gql`
  query GetSearchFunctions($input: ClassificationSearchInput) {
    getSearchFunctions(input: $input) {
      edges {
        node {
          id
          title
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
