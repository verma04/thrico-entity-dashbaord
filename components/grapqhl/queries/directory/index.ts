import { gql } from "@apollo/client";

export const GET_ALL_DIRECTORY = gql`
  query GetAllDirectory {
    getAllDirectory {
      firstName
      lastName
      id
      avatar
      
      isConnectIonRequested {
        isFollower
        connection
        isConnection
      }
      isConnection {
        isFollower
        connection
        isConnection
      }
      isRequestedUser {
        isAccepted
        isRequested
      }
    }
  }
`;

export const CONNECT_TO_USER = gql`
  mutation ConnectToUser($input: id) {
    connectToUser(input: $input) {
      firstName
      lastName
      id
      avatar
      
    }
  }
`;

export const ACCEPT_CONNECTION_REQUEST = gql`
  mutation AcceptConnectionRequest($input: accept) {
    acceptConnectionRequest(input: $input) {
      email
    }
  }
`;

export const USER_DETAILS = gql`
  query GetUserDetails($input: userDetails) {
    getUserDetails(input: $input) {
      email
      firstName
      avatar
      lastName
      id
      myProfile
    }
  }
`;
