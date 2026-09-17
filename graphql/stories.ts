import { gql } from "@apollo/client";

export const STORY_FIELDS_FRAGMENT = gql`
  fragment StoryFields on Story {
    id
    entityId
    userId
    image
    caption
    textOverlays
    createdAt
    expiresAt
    isActive
    user {
      id
      firstName
      lastName
      avatar
      email
      headline
    }
  }
`;

export const PAGINATION_META_FRAGMENT = gql`
  fragment PaginationMetaFields on PaginationMeta {
    currentPage
    totalPages
    totalItems
    itemsPerPage
    hasNextPage
    hasPreviousPage
  }
`;

export const GET_ALL_ACTIVE_STORIES = gql`
  ${STORY_FIELDS_FRAGMENT}
  ${PAGINATION_META_FRAGMENT}
  query GetAllActiveStories($pagination: PaginationInput) {
    getAllActiveStories(pagination: $pagination) {
      data {
        ...StoryFields
      }
      meta {
        ...PaginationMetaFields
      }
    }
  }
`;

export const GET_ALL_STORIES_BY_USER = gql`
  ${STORY_FIELDS_FRAGMENT}
  ${PAGINATION_META_FRAGMENT}
  query GetAllStoriesByUser($userId: ID!, $pagination: PaginationInput) {
    getAllStoriesByUser(userId: $userId, pagination: $pagination) {
      data {
        ...StoryFields
      }
      meta {
        ...PaginationMetaFields
      }
    }
  }
`;

export const GET_PAST_STORIES = gql`
  ${STORY_FIELDS_FRAGMENT}
  ${PAGINATION_META_FRAGMENT}
  query GetPastStories($pagination: PaginationInput) {
    getPastStories(pagination: $pagination) {
      data {
        ...StoryFields
      }
      meta {
        ...PaginationMetaFields
      }
    }
  }
`;

export const GET_STORIES = gql`
  ${STORY_FIELDS_FRAGMENT}
  ${PAGINATION_META_FRAGMENT}
  query GetStories($pagination: PaginationInput, $filter: StoryFilterInput) {
    stories(pagination: $pagination, filter: $filter) {
      data {
        ...StoryFields
      }
      meta {
        ...PaginationMetaFields
      }
    }
  }
`;

export const GET_STORY_BY_ID = gql`
  ${STORY_FIELDS_FRAGMENT}
  query GetStoryById($id: ID!) {
    getStoryById(id: $id) {
      ...StoryFields
    }
  }
`;

export const DELETE_STORY = gql`
  mutation DeleteStory($id: ID!) {
    deleteStory(id: $id) {
      id
      caption
      image
      isActive
    }
  }
`;

export const DELETE_STORIES = gql`
  mutation DeleteStories($ids: [ID!]!) {
    deleteStories(ids: $ids) {
      success
      count
      deletedIds
    }
  }
`;

export const EXPORT_STORIES_DATA = gql`
  mutation ExportStoriesData($input: ExportDataInput!) {
    exportData(input: $input) {
      success
      message
      totalCount
      fileUrl
    }
  }
`;

