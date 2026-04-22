import { gql } from "@apollo/client";

export const SEARCH_USER_BY_NAME = gql`
  query SearchUserByName($name: String!) {
    searchUserByName(name: $name) {
      id
      status
      lastActive
      user {
        id
        firstName
        lastName
        avatar
        profile {
          headline
          currentPosition
        }
        about {
          about
          social {
            platform
            url
          }
        }
      }
    }
  }
`;

export const ADD_MENTOR = gql`
  mutation AddMentor($input: DirectAddMentorInput!) {
    addMentor(input: $input) {
      id
      displayName
      slug
      isApproved
      description
      category {
        id
        title
      }
      user {
        user {
          firstName
          lastName
        }
      }
    }
  }
`;
