import { gql } from "@apollo/client";

export const GROUP_THEME = gql`
  query GetAllGroupTheme {
    getAllGroupTheme {
      id
      title
    }
  }
`;
export const ADD_GROUP_THEME = gql`
  mutation AddGroupTheme($input: addTheme) {
    addGroupTheme(input: $input) {
      id
      title
    }
  }
`;
export const EDIT_GROUP_THEME = gql`
  mutation EditGroupTheme($input: editTheme) {
    editGroupTheme(input: $input) {
      id
      title
    }
  }
`;
export const DELETE_GROUP_THEME = gql`
  mutation DeleteGroupTheme($input: deleteTheme) {
    deleteGroupTheme(input: $input) {
      id
      title
    }
  }
`;
export const DUPLICATE_GROUP_THEME = gql`
  mutation DuplicateGroupTheme($input: duplicateTheme) {
    duplicateGroupTheme(input: $input) {
      id
      title
    }
  }
`;
