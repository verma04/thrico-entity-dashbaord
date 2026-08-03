import { gql } from "@apollo/client";

export const GET_ALL_CONNECTION = gql`
  query GetAllConnection($input: idInput) {
    getAllConnection(input: $input) {
      id
      firstName
      lastName
      isAdded
      avatar
      aboutAlumni {
        currentPosition
      }
    }
  }
`;

export const GET_ALL_ORGANIZATION_USER = gql`
  query GetAllOrganizationUser {
    getAllOrganizationUser {
      id
      firstName
      lastName
      avatar
      aboutAlumni {
        currentPosition
      }
      isAdded
    }
  }
`;

export const REGISTER_EVENT = gql`
  mutation RegisterEvent($input: slug) {
    registerEvent(input: $input) {
      success
    }
  }
`;
