import {
  gql,
  useQuery,
  useMutation,
  useLazyQuery,
  QueryHookOptions,
  MutationHookOptions,
} from "@apollo/client";

const SETTINGS_FIELDS = `
  allowDownload
  allowPlatformRepost
  allowPlatformRepostWithThoughts
  allowSocialShare
  allowLinkedinShare
  allowLinkedinNative
  allowLinkedinCopyLink
  allowInstagramShare
  allowInstagramNative
  allowInstagramCopyLink
  allowWhatsappShare
  allowWhatsappNative
  allowWhatsappCopyLink
  allowWhatsappStoryShare
  allowComments
  socialShareCustomMessage
`;

const ALBUM_FIELDS = `
  id
  entityId
  title
  description
  isFeatured
  order
  coverImage
  imageCount
  settings {
    ${SETTINGS_FIELDS}
  }
  allowDownload
  allowPlatformRepost
  allowPlatformRepostWithThoughts
  allowSocialShare
  allowLinkedinShare
  allowLinkedinNative
  allowLinkedinCopyLink
  allowInstagramShare
  allowInstagramNative
  allowInstagramCopyLink
  allowWhatsappShare
  allowWhatsappNative
  allowWhatsappCopyLink
  allowWhatsappStoryShare
  allowComments
  socialShareCustomMessage
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
  type
  status
  thumbnailUrl
  duration
  optimizedUrl
  errorMessage
  commentCount
  source
  externalUploaderName
  externalUploaderEmail
  externalUserId
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

export const GET_MEDIA_GALLERY_UPLOAD_URL = gql`
  query GetMediaGalleryUploadUrl($input: GetMediaGalleryUploadUrlInput!) {
    getMediaGalleryUploadUrl(input: $input) {
      uploadUrl
      fileUrl
      key
      expiresIn
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

export const ADD_MEDIA_GALLERY_VIDEO = gql`
  mutation AddMediaGalleryVideo($input: AddMediaGalleryVideoInput!) {
    addMediaGalleryVideo(input: $input) {
      ${IMAGE_FIELDS}
    }
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

export const GET_MEDIA_GALLERY_ALBUM_SETTINGS = gql`
  query GetMediaGalleryAlbumSettings($albumId: ID!) {
    getMediaGalleryAlbumSettings(albumId: $albumId) {
      ${SETTINGS_FIELDS}
    }
  }
`;

export const UPDATE_MEDIA_GALLERY_ALBUM_SETTINGS = gql`
  mutation UpdateMediaGalleryAlbumSettings($albumId: ID!, $input: UpdateMediaGalleryAlbumSettingsInput!) {
    updateMediaGalleryAlbumSettings(albumId: $albumId, input: $input) {
      ${SETTINGS_FIELDS}
    }
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

export const useGetMediaGalleryAlbumSettings = (
  albumId: string,
  options?: QueryHookOptions,
) =>
  useQuery(GET_MEDIA_GALLERY_ALBUM_SETTINGS, {
    variables: { albumId },
    skip: !albumId,
    fetchPolicy: "network-only",
    ...options,
  });

export const useUpdateMediaGalleryAlbumSettings = (
  albumId?: string,
  options?: MutationHookOptions,
) =>
  useMutation(UPDATE_MEDIA_GALLERY_ALBUM_SETTINGS, {
    refetchQueries: albumId
      ? [
          { query: GET_MEDIA_GALLERY_ALBUM, variables: { id: albumId } },
          { query: GET_MEDIA_GALLERY_ALBUM_SETTINGS, variables: { albumId } },
          { query: GET_MEDIA_GALLERY_ALBUMS },
        ]
      : [{ query: GET_MEDIA_GALLERY_ALBUMS }],
    ...options,
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

export const useGetMediaGalleryUploadUrl = () =>
  useLazyQuery(GET_MEDIA_GALLERY_UPLOAD_URL, { fetchPolicy: "network-only" });

export const useAddMediaGalleryVideo = (albumId: string) =>
  useMutation(ADD_MEDIA_GALLERY_VIDEO, {
    refetchQueries: [
      { query: GET_MEDIA_GALLERY_ALBUM, variables: { id: albumId } },
    ],
  });

export const useAddMediaGalleryLink = (albumId: string) =>
  useMutation(ADD_MEDIA_GALLERY_IMAGE, {
    refetchQueries: [
      { query: GET_MEDIA_GALLERY_ALBUM, variables: { id: albumId } },
    ],
  });


export const GET_MEDIA_GALLERY_SDK_SETTINGS = gql`
  query GetMediaGallerySdkSettings {
    getMediaGallerySdkSettings {
      id
      entityId
      allowThirdPartyUploads
      requireModeration
      defaultAlbumId
      defaultAlbum {
        id
        title
      }
      allowedAlbumIds
      allowUserSelectAlbum
      allowedMediaTypes
      maxImageSizeMb
      maxVideoSizeMb
      maxVideoDurationSeconds
      maxDailyUploadsPerUploader
      maxDailyUploadsTotal
      requireUploaderInfo
      requireCaption
      webhookUrl
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_MEDIA_GALLERY_SDK_SETTINGS = gql`
  mutation UpdateMediaGallerySdkSettings($input: UpdateMediaGallerySdkSettingsInput!) {
    updateMediaGallerySdkSettings(input: $input) {
      id
      entityId
      allowThirdPartyUploads
      requireModeration
      defaultAlbumId
      defaultAlbum {
        id
        title
      }
      allowedAlbumIds
      allowUserSelectAlbum
      allowedMediaTypes
      maxImageSizeMb
      maxVideoSizeMb
      maxVideoDurationSeconds
      maxDailyUploadsPerUploader
      maxDailyUploadsTotal
      requireUploaderInfo
      requireCaption
      webhookUrl
      updatedAt
    }
  }
`;

export const GET_MEDIA_GALLERY_SUBMISSIONS = gql`
  query GetMediaGallerySubmissions($input: GetMediaGallerySubmissionsInput) {
    getMediaGallerySubmissions(input: $input) {
      items {
        ${IMAGE_FIELDS}
      }
      totalCount
      pendingCount
    }
  }
`;

export const APPROVE_MEDIA_GALLERY_SUBMISSION = gql`
  mutation ApproveMediaGallerySubmission($id: ID!) {
    approveMediaGallerySubmission(id: $id) {
      ${IMAGE_FIELDS}
    }
  }
`;

export const REJECT_MEDIA_GALLERY_SUBMISSION = gql`
  mutation RejectMediaGallerySubmission($id: ID!, $reason: String) {
    rejectMediaGallerySubmission(id: $id, reason: $reason) {
      ${IMAGE_FIELDS}
    }
  }
`;

export const useGetMediaGallerySdkSettings = (
  options?: QueryHookOptions
) =>
  useQuery(GET_MEDIA_GALLERY_SDK_SETTINGS, {
    fetchPolicy: "network-only",
    ...options,
  });

export const useUpdateMediaGallerySdkSettings = (
  options?: MutationHookOptions
) =>
  useMutation(UPDATE_MEDIA_GALLERY_SDK_SETTINGS, {
    refetchQueries: [{ query: GET_MEDIA_GALLERY_SDK_SETTINGS }],
    ...options,
  });

export const useGetMediaGallerySubmissions = (
  input?: Record<string, unknown>,
  options?: QueryHookOptions
) =>
  useQuery(GET_MEDIA_GALLERY_SUBMISSIONS, {
    variables: { input },
    fetchPolicy: "network-only",
    ...options,
  });

export const useApproveMediaGallerySubmission = (
  options?: MutationHookOptions
) =>
  useMutation(APPROVE_MEDIA_GALLERY_SUBMISSION, {
    refetchQueries: [{ query: GET_MEDIA_GALLERY_SUBMISSIONS }],
    ...options,
  });

export const useRejectMediaGallerySubmission = (
  options?: MutationHookOptions
) =>
  useMutation(REJECT_MEDIA_GALLERY_SUBMISSION, {
    refetchQueries: [{ query: GET_MEDIA_GALLERY_SUBMISSIONS }],
    ...options,
  });
