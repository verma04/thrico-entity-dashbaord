import { gql } from "@apollo/client";

export const GROUP_INTERESTS = gql`
  query GetAllGroupInterests {
    getAllGroupInterests {
      id
      title
    }
  }
`;
export const ADD_GROUP_INTERESTS = gql`
  mutation AddGroupInterests($input: addInterests) {
    addGroupInterests(input: $input) {
      id
      title
    }
  }
`;
export const EDIT_GROUP_INTERESTS = gql`
  mutation EditGroupInterests($input: editInterests) {
    editGroupInterests(input: $input) {
      id
      title
    }
  }
`;
export const DELETE_GROUP_INTERESTS = gql`
  mutation DeleteGroupInterests($input: deleteInterests) {
    deleteGroupInterests(input: $input) {
      id
      title
    }
  }
`;
export const DUPLICATE_GROUP_INTERESTS = gql`
  mutation DuplicateGroupInterests($input: duplicateInterests) {
    duplicateGroupInterests(input: $input) {
      id
      title
    }
  }
`;
