import { gql } from "@apollo/client";

export const UPDATE_FONT = gql`
  mutation UpdateFont($input: inputUpdateFont!) {
    updateFont(input: $input) {
      name
      weights
      styles
      subsets
    }
  }
`;
