import { gql } from "@apollo/client";

export const MEDIA_GROUP = gql`
  query GetMediaByGroup($input: typeMedia!) {
    getMediaByGroup(input: $input) {
      url
      id
    }
  }
`;
