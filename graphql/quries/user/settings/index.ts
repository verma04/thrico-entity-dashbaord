import { gql } from "@apollo/client";

export const USER_SETTINGS = gql`
  query getUserSettings {
    getUserSettings {
      autoApprove
    }
  }
`;

export const UPDATE_SETTINGS = gql`
  mutation updateUserSettings($input: userSettings) {
    updateUserSettings(input: $input) {
      autoApprove
    }
  }
`;
