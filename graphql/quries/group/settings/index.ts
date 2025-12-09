import { gql } from "@apollo/client";

export const GROUP_SETTINGS = gql`
  query GetGroupSettings {
    getGroupSettings {
      autoApprove
      views
      discussion
      user
    }
  }
`;

export const UPDATE_SETTINGS = gql`
  mutation UpdateGroupSettings($input: updateSettings) {
    updateGroupSettings(input: $input) {
      autoApprove
      views
      discussion
      user
    }
  }
`;
export const COMMUNITY_TERMS_AND_CONDITIONS = gql`
  query Query {
    getCommunityTermAndConditions
  }
`;

export const UPDATE_COMMUNITY_TERMS_AND_CONDITIONS = gql`
  mutation UpdateCommunityTermAndConditions($input: updateTermAndConditions) {
    updateCommunityTermAndConditions(input: $input)
  }
`;

export const COMMUNITY_GUIDELINE = gql`
  query Query {
    getCommunityGuidelines
  }
`;

export const UPDATE_COMMUNITY_GUIDELINE = gql`
  mutation updateCommunityGuidelines($input: updateTermAndConditions) {
    updateCommunityGuidelines(input: $input)
  }
`;
