import { gql } from "@apollo/client";

export const GET_ALL_CONTACTS = gql`
  query GetAllContacts($limit: Int) {
    getAllContacts(limit: $limit) {
      nodes {
        id
        subject
        message
        status
        createdAt
        user {
          id
          user {
            id
            firstName
            lastName
            email
            avatar
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_CONTACT_STATS = gql`
  query GetContactStats {
    getContactStats {
      totalInquiries
      resolvedInquiries
      responseRate
      peakFrequency
    }
  }
`;

export const UPDATE_CONTACT_STATUS = gql`
  mutation UpdateContactStatus($id: String!, $status: String!) {
    updateContactStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;
