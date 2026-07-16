import { gql, useQuery, useMutation } from "@apollo/client";

const ALBUM_FIELDS = `
  id
  entityId
  title
  description
  isFeatured
  order
  coverImage
  imageCount
  createdAt
  updatedAt
`;

const IMAGE_FIELDS = `
  id
  albumId
  entityId
  url
  caption
  order
  commentCount
  createdAt
  updatedAt
`;

const COMMENT_FIELDS = `
  id
  imageId
  userId
  content
  user {
    id
    firstName
    lastName
    image
  }
  createdAt
`;

// ──────────────────────────────────────────
// Queries
// ──────────────────────────────────────────
export const GET_MEDIA_GALLERY_ALBUMS = gql`
  query GetMediaGalleryAlbums {
    getMediaGalleryAlbums {
      ${ALBUM_FIELDS}
    }
  }
`;

export const GET_MEDIA_GALLERY_ALBUM = gql`
  query GetMediaGalleryAlbum($id: ID!) {
    getMediaGalleryAlbum(id: $id) {
      ${ALBUM_FIELDS}
      images {
        ${IMAGE_FIELDS}
      }
    }
  }
`;

export const GET_MEDIA_GALLERY_IMAGE_COMMENTS = gql`
  query GetMediaGalleryImageComments($imageId: ID!, $first: Int, $after: String) {
    getMediaGalleryImageComments(imageId: $imageId, first: $first, after: $after) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          ${COMMENT_FIELDS}
        }
      }
    }
  }
`;

// ──────────────────────────────────────────
// Mutations
// ──────────────────────────────────────────
export const CREATE_MEDIA_GALLERY_ALBUM = gql`
  mutation CreateMediaGalleryAlbum($input: CreateMediaGalleryAlbumInput!) {
    createMediaGalleryAlbum(input: $input) {
      ${ALBUM_FIELDS}
    }
  }
`;

export const UPDATE_MEDIA_GALLERY_ALBUM = gql`
  mutation UpdateMediaGalleryAlbum($id: ID!, $input: UpdateMediaGalleryAlbumInput!) {
    updateMediaGalleryAlbum(id: $id, input: $input) {
      ${ALBUM_FIELDS}
    }
  }
`;

export const DELETE_MEDIA_GALLERY_ALBUM = gql`
  mutation DeleteMediaGalleryAlbum($id: ID!) {
    deleteMediaGalleryAlbum(id: $id)
  }
`;

export const REORDER_MEDIA_GALLERY_ALBUMS = gql`
  mutation ReorderMediaGalleryAlbums($input: [ReorderMediaGalleryAlbumsInput!]!) {
    reorderMediaGalleryAlbums(input: $input)
  }
`;

export const ADD_MEDIA_GALLERY_IMAGE = gql`
  mutation AddMediaGalleryImage($input: AddMediaGalleryImageInput!) {
    addMediaGalleryImage(input: $input) {
      ${IMAGE_FIELDS}
    }
  }
`;

export const UPDATE_MEDIA_GALLERY_IMAGE = gql`
  mutation UpdateMediaGalleryImage($id: ID!, $input: UpdateMediaGalleryImageInput!) {
    updateMediaGalleryImage(id: $id, input: $input) {
      ${IMAGE_FIELDS}
    }
  }
`;

export const DELETE_MEDIA_GALLERY_IMAGE = gql`
  mutation DeleteMediaGalleryImage($id: ID!) {
    deleteMediaGalleryImage(id: $id)
  }
`;

export const REORDER_MEDIA_GALLERY_IMAGES = gql`
  mutation ReorderMediaGalleryImages($input: [ReorderMediaGalleryImagesInput!]!) {
    reorderMediaGalleryImages(input: $input)
  }
`;

export const DELETE_MEDIA_GALLERY_COMMENT_ADMIN = gql`
  mutation DeleteMediaGalleryCommentAdmin($id: ID!) {
    deleteMediaGalleryCommentAdmin(id: $id)
  }
`;

// ──────────────────────────────────────────
// Hooks
// ──────────────────────────────────────────
export const useGetMediaGalleryAlbums = () =>
  useQuery(GET_MEDIA_GALLERY_ALBUMS, { fetchPolicy: "network-only" });

export const useGetMediaGalleryAlbum = (id: string) =>
  useQuery(GET_MEDIA_GALLERY_ALBUM, {
    variables: { id },
    skip: !id,
    fetchPolicy: "network-only",
  });

export const useGetMediaGalleryImageComments = (
  imageId: string,
  first = 20,
  after?: string,
) =>
  useQuery(GET_MEDIA_GALLERY_IMAGE_COMMENTS, {
    variables: { imageId, first, after },
    skip: !imageId,
    fetchPolicy: "network-only",
  });

export const useCreateMediaGalleryAlbum = () =>
  useMutation(CREATE_MEDIA_GALLERY_ALBUM, {
    refetchQueries: [{ query: GET_MEDIA_GALLERY_ALBUMS }],
  });

export const useUpdateMediaGalleryAlbum = () =>
  useMutation(UPDATE_MEDIA_GALLERY_ALBUM, {
    refetchQueries: [{ query: GET_MEDIA_GALLERY_ALBUMS }],
  });

export const useDeleteMediaGalleryAlbum = () =>
  useMutation(DELETE_MEDIA_GALLERY_ALBUM, {
    refetchQueries: [{ query: GET_MEDIA_GALLERY_ALBUMS }],
  });

export const useReorderMediaGalleryAlbums = () =>
  useMutation(REORDER_MEDIA_GALLERY_ALBUMS);

export const useAddMediaGalleryImage = (albumId: string) =>
  useMutation(ADD_MEDIA_GALLERY_IMAGE, {
    refetchQueries: [
      { query: GET_MEDIA_GALLERY_ALBUM, variables: { id: albumId } },
    ],
  });

export const useUpdateMediaGalleryImage = (albumId: string) =>
  useMutation(UPDATE_MEDIA_GALLERY_IMAGE, {
    refetchQueries: [
      { query: GET_MEDIA_GALLERY_ALBUM, variables: { id: albumId } },
    ],
  });

export const useDeleteMediaGalleryImage = (albumId: string) =>
  useMutation(DELETE_MEDIA_GALLERY_IMAGE, {
    refetchQueries: [
      { query: GET_MEDIA_GALLERY_ALBUM, variables: { id: albumId } },
    ],
  });

export const useReorderMediaGalleryImages = () =>
  useMutation(REORDER_MEDIA_GALLERY_IMAGES);

export const useDeleteMediaGalleryCommentAdmin = () =>
  useMutation(DELETE_MEDIA_GALLERY_COMMENT_ADMIN);
