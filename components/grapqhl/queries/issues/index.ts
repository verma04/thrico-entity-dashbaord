import { gql } from "@apollo/client";

export const CREATE_ISSUES = gql`
  mutation CreateIssue($input: createIssue) {
    createIssue(input: $input) {
      id
      visibility
      title
      summary
      page
      details
      module
      feature
      ticket
      type
    }
  }
`;
export const ALL_ISSUES = gql`
  query GetIssues($input: inputGetIssues) {
    getIssues(input: $input) {
      data {
        id
        createdAt
        title
        status
        ticket
        type
        user {
          firstName
          id
          lastName
        }
      }
      totalRecords
    }
  }
`;

export const ISSUES_BY_SLUG = gql`
  query Data($input: getBySlug!) {
    getIssueBySlug(input: $input) {
      id
      visibility
      title
      summary
      page
      details
      module
      feature
      ticket
      type
      status
      createdAt
    }
  }
`;

export const GET_ISSUE_COMMENT = gql`
  query getIssueComment($input: getFeedInput!) {
    getIssueComment(input: $input) {
      content
      id
      createdAt
      user {
        id
        alumni {
          id
          avatar
          fistName
          lastName
        }
      }
    }
  }
`;
export const ADD_ISSUE_COMMENT = gql`
  mutation addIssueComment($input: inputFeedComment!) {
    addIssueComment(input: $input) {
      content
      id
      user {
        id
        alumni {
          id
          avatar
          fistName
          lastName
        }
      }
    }
  }
`;
