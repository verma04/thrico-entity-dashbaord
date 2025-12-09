import { gql } from "@apollo/client";

export const GET_ALL_MENTOR_SKILLS = gql`
  query GET_ALL_MENTOR_SKILLS {
    getAllMentorSkills {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export const ADD_MENTOR_SKILLS = gql`
  mutation AddMentorShipSkills($input: inputMentorShipSkills) {
    addMentorShipSkills(input: $input) {
      id
      title
    }
  }
`;

export const DELETE_MENTOR_SKILLS = gql`
  mutation DeleteMentorShipSkills($input: inputMentorShipSkillsId) {
    deleteMentorShipSkills(input: $input) {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export const DUPLICATE_MENTOR_SKILLS = gql`
  mutation DuplicateMentorShipSkills($input: inputMentorShipSkillsId) {
    duplicateMentorShipSkills(input: $input) {
      createdAt
      id
      title
      updatedAt
    }
  }
`;
