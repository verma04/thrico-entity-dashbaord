import { gql } from "@apollo/client";

export const ADD_ANNOUNCEMENT = gql`
  mutation AddAnnouncement($input: inputAddAnnouncement) {
    addAnnouncement(input: $input) {
      id
    }
  }
`;
