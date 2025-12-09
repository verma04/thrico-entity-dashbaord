import { gql } from "@apollo/client";

export const GET_ALL_ALUMNI_STORIES = gql`
  query GetAllAlumniStories {
    getAllAlumniStories {
      id
      title
      cover
      slug
      category {
        title
      }
      isApproved
      createdAt
      shortDescription
      description
      updatedAt
      user {
        alumni {
          avatar
          firstName
          lastName
          aboutUser {
            currentPosition
          }
        }
      }
    }
  }
`;
export const GET_ALL_ALUMNI_STORIES_APPROVED = gql`
  query getAllApprovedAlumniStories {
    getAllApprovedAlumniStories {
      id
      title
      cover
      slug
      category {
        title
      }
      isApproved
      createdAt
      shortDescription
      description
      updatedAt
      user {
        alumni {
          avatar
          firstName
          lastName
          aboutUser {
            currentPosition
          }
        }
      }
    }
  }
`;
export const GET_ALL_ALUMNI_STORIES_REQUESTED = gql`
  query getAllApprovedRequestedStories {
    getAllApprovedRequestedStories {
      id
      title
      cover
      slug
      category {
        title
      }
      isApproved
      createdAt
      shortDescription
      description
      updatedAt
      user {
        alumni {
          avatar
          firstName
          lastName
          aboutUser {
            currentPosition
          }
        }
      }
    }
  }
`;

export const ALUMNI_STORIES_ACTIONS = gql`
  mutation AlumniStoriesActions($input: alumniStoriesInput) {
    alumniStoriesActions(input: $input) {
      cover
      id
    }
  }
`;
