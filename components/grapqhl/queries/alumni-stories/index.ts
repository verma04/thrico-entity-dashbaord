import { gql } from "@apollo/client";

export const GET_ALUMNI_STORIES = gql`
  query GetAlumniStoriesCategory {
    getAlumniStoriesCategory {
      id
      title
      count
    }
  }
`;

export const ALUMNI_STORY_POSTED_BY_USER = gql`
  mutation AlumniStoryPostedByUser($input: inputAlumniStoryPostedByUser) {
    alumniStoryPostedByUser(input: $input) {
      success
    }
  }
`;

export const ALUMNI_STORY_BY_USER = gql`
  query GetMyAlumniStories {
    getMyAlumniStories {
      category {
        title
      }
      cover
      id
      isApproved
      slug
      title
      shortDescription
      description
      createdAt
    }
  }
`;
