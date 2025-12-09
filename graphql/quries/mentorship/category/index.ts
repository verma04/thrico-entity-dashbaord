import { gql } from "@apollo/client";

export const GET_ALL_MENTOR_CATEGORY = gql`
  query GET_ALL_MENTOR_CATEGORY {
    getAllMentorCategory {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export const ADD_MENTOR_CATEGORY = gql`
  mutation AddMentorShipCategory($input: inputMentorShipCategory) {
    addMentorShipCategory(input: $input) {
      id
      title
    }
  }
`;

export const DELETE_MENTOR_CATEGORY = gql`
  mutation DeleteMentorShipCategory($input: inputMentorShipCategoryId) {
    deleteMentorShipCategory(input: $input) {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export const DUPLICATE_MENTOR_CATEGORY = gql`
  mutation DuplicateMentorShipCategory($input: inputMentorShipCategoryId) {
    duplicateMentorShipCategory(input: $input) {
      createdAt
      id
      title
      updatedAt
    }
  }
`;

export const GET_ALL_MENTOR = gql`
  query GetAllMentor($input: allStatusInput) {
    getAllMentor(input: $input) {
      id
      isApproved
      isRequested
      displayName
      slug
      about
      featuredArticle
      greatestAchievement
      intro
      introVideo
      whyDoWantBecomeMentor
      agreement
      user {
        user {
          avatar
          lastName
          firstName
          aboutUser {
            currentPosition
          }
        }
      }
      category {
        id
        title
      }
    }
  }
`;

export const MENTOR_SHIP_ACTION = gql`
  mutation MentorShipActions($input: mentorShipActionsInput) {
    mentorShipActions(input: $input) {
      about
    }
  }
`;
