import { gql } from "@apollo/client";

export const GET_ALL_ALUMNI_STORIES_CATEGORY = gql`
  query GET_ALL_ALUMNI_STORIES_CATEGORY {
    getAllAlumniStoriesCategory {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export const ADD_ALUMNI_STORIES_CATEGORY = gql`
  mutation AddAlumniStoryCategory($input: inputAlumniStoryCategory) {
    addAlumniStoryCategory(input: $input) {
      id
      title
    }
  }
`;

export const DELETE_ALUMNI_STORIES_CATEGORY = gql`
  mutation DeleteAlumniStoryCategory($input: inputAlumniStoryCategoryId) {
    deleteAlumniStoryCategory(input: $input) {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export const DUPLICATE_ALUMNI_STORIES_CATEGORY = gql`
  mutation DuplicateAlumniStoryCategory($input: inputAlumniStoryCategoryId) {
    duplicateAlumniStoryCategory(input: $input) {
      createdAt
      id
      title
      updatedAt
    }
  }
`;

export const GET_ALL_MENTOR = gql`
  query GetAllMentor {
    getAllMentor {
      about
      agreement
      category {
        createdAt
        id
        title
      }
      displayName
      featuredArticle
      greatestAchievement
      id
      intro
      introVideo
      isApproved
      isRequested
      slug
      whyDoWantBecomeMentor
      user {
        alumni {
          aboutUser {
            currentPosition
          }

          avatar
          firstName
          lastName
        }
      }
    }
  }
`;

export const MENTOR_SHIP_ACTION = gql`
  mutation AlumniStoryActions($input: AlumniStoryActionsInput) {
    AlumniStoryActions(input: $input) {
      about
    }
  }
`;
