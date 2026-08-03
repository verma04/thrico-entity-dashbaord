import { gql } from "@apollo/client";

export const GET_MEDIA_GALLERY_IMAGES_USER = gql`
  query GetMediaGalleryImagesUser(
    $albumId: ID!
    $input: GetMediaGalleryImagesInput
  ) {
    getMediaGalleryImagesUser(albumId: $albumId, input: $input) {
      edges {
        node {
          id
          albumId
          entityId
          url
          caption
          order
          commentCount
          createdAt
          updatedAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_MEDIA_GALLERY_ALBUMS_USER = gql`
  query GetMediaGalleryAlbumsUser($input: GetMediaGalleryAlbumsInput) {
    getMediaGalleryAlbumsUser(input: $input) {
      edges {
        cursor
        node {
          id
          title
          description
          isFeatured
          coverImage
          imageCount
          createdAt
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_MEDIA_GALLERY_IMAGE_COMMENTS_USER = gql`
  query GetMediaGalleryImageCommentsUser(
    $imageId: ID!
    $input: GetMediaGalleryCommentsInput
  ) {
    getMediaGalleryImageCommentsUser(imageId: $imageId, input: $input) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          content
          createdAt
          user {
            firstName
            id
            image
            lastName
          }
          isOwner
          updatedAt
        }
        cursor
      }
    }
  }
`;

export const ADD_MEDIA_GALLERY_COMMENT = gql`
  mutation AddMediaGalleryComment($imageId: ID!, $content: String!) {
    addMediaGalleryComment(imageId: $imageId, content: $content) {
      id
      imageId
      userId
      entityId
      content
      isOwner
      createdAt
      updatedAt
      user {
        id
        firstName
        lastName
        image
      }
    }
  }
`;

export const EDIT_MEDIA_GALLERY_COMMENT = gql`
  mutation EditMediaGalleryComment($id: ID!, $content: String!) {
    editMediaGalleryComment(id: $id, content: $content) {
      id
      imageId
      userId
      entityId
      content
      isOwner
      createdAt
      updatedAt
      user {
        id
        firstName
        lastName
        image
      }
    }
  }
`;

export const DELETE_MEDIA_GALLERY_COMMENT = gql`
  mutation DeleteMediaGalleryComment($id: ID!) {
    deleteMediaGalleryComment(id: $id)
  }
`;

