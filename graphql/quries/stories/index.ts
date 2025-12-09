import { gql } from "@apollo/client";

export const ADD_STORY = gql`
  mutation UserStoryPostedByUser($input: inputUserStoryPostedByUser) {
    userStoryPostedByUser(input: $input) {
      id
      email
      success
    }
  }
`;
