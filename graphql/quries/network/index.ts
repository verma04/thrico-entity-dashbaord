import { gql } from "@apollo/client";

export const GET_NETWORK = gql`
  query GetNetwork {
    getNetwork {
      id
      firstName
      lastName
      avatar
      about
      status
    }
  }
`;

export const SEND_CONNECTION = gql`
  mutation ConnectAsConnection($input: InputId) {
    connectAsConnection(input: $input) {
      id
      status
    }
  }
`;

export const ACCEPT_CONNECTION = gql`
  mutation AcceptConnection($input: InputId) {
    acceptConnection(input: $input) {
      id
      status
    }
  }
`;

export const GET_USER_DETAILS = gql`
  query GetUserDetails($input: InputId) {
    getUserDetails(input: $input) {
      id
      firstName
      lastName
      avatar
      about
      status
    }
  }
`;
