import {
  QueryHookOptions,
  useQuery,
  MutationHookOptions,
  useMutation,
} from "@apollo/client/react";
import {
  GET_MEDIA_GALLERY_ALBUMS_USER,
  GET_MEDIA_GALLERY_IMAGES_USER,
  GET_MEDIA_GALLERY_IMAGE_COMMENTS_USER,
  ADD_MEDIA_GALLERY_COMMENT,
  EDIT_MEDIA_GALLERY_COMMENT,
  DELETE_MEDIA_GALLERY_COMMENT,
} from "../../queries/media-gallery";
import { GET_ENTITY_SETTINGS } from "../../queries";

export interface EntitySettings {
  allowMediaGalleryComments: boolean;
}

export const useGetEntitySettings = (
  options?: QueryHookOptions<{ getEntitySettings: EntitySettings }, any>
) =>
  useQuery<{ getEntitySettings: EntitySettings }, any>(
    GET_ENTITY_SETTINGS,
    options
  );


export interface MediaGalleryAlbumUserNode {
  id: string;
  title: string;
  description: string | null;
  isFeatured: boolean;
  coverImage: string | null;
  imageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaGalleryAlbumUserEdge {
  cursor: string;
  node: MediaGalleryAlbumUserNode;
}

export interface MediaGalleryAlbumUserConnection {
  edges: MediaGalleryAlbumUserEdge[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
  totalCount: number;
}

export const useGetMediaGalleryAlbumsUser = (
  options?: QueryHookOptions<
    { getMediaGalleryAlbumsUser: MediaGalleryAlbumUserConnection },
    any
  >,
) =>
  useQuery<{ getMediaGalleryAlbumsUser: MediaGalleryAlbumUserConnection }, any>(
    GET_MEDIA_GALLERY_ALBUMS_USER,
    options,
  );

export interface MediaGalleryImageUserNode {
  id: string;
  albumId: string;
  entityId: string;
  url: string;
  caption: string | null;
  order: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaGalleryImageUserEdge {
  cursor: string;
  node: MediaGalleryImageUserNode;
}

export interface MediaGalleryImageUserConnection {
  edges: MediaGalleryImageUserEdge[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
  totalCount: number;
}

export const useGetMediaGalleryImagesUser = (
  options?: QueryHookOptions<
    { getMediaGalleryImagesUser: MediaGalleryImageUserConnection },
    any
  >,
) =>
  useQuery<{ getMediaGalleryImagesUser: MediaGalleryImageUserConnection }, any>(
    GET_MEDIA_GALLERY_IMAGES_USER,
    options,
  );

export interface MediaGalleryImageCommentUserNode {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
}

export interface MediaGalleryImageCommentUserEdge {
  cursor: string;
  node: MediaGalleryImageCommentUserNode;
}

export interface MediaGalleryImageCommentUserConnection {
  edges: MediaGalleryImageCommentUserEdge[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
  totalCount: number;
}

export const useGetMediaGalleryImageCommentsUser = (
  options?: QueryHookOptions<
    {
      getMediaGalleryImageCommentsUser: MediaGalleryImageCommentUserConnection;
    },
    any
  >,
) =>
  useQuery<
    {
      getMediaGalleryImageCommentsUser: MediaGalleryImageCommentUserConnection;
    },
    any
  >(GET_MEDIA_GALLERY_IMAGE_COMMENTS_USER, options);

export interface MediaGalleryCommentUserNode {
  id: string;
  imageId: string;
  userId: string;
  entityId: string;
  content: string;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  } | null;
}

export interface MediaGalleryCommentUserEdge {
  cursor: string;
  node: MediaGalleryCommentUserNode;
}

export interface MediaGalleryCommentUserConnection {
  edges: MediaGalleryCommentUserEdge[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
  totalCount: number;
}

export const useAddMediaGalleryComment = (
  options?: MutationHookOptions<
    { addMediaGalleryComment: MediaGalleryCommentUserNode },
    any
  >,
) =>
  useMutation<{ addMediaGalleryComment: MediaGalleryCommentUserNode }, any>(
    ADD_MEDIA_GALLERY_COMMENT,
    options,
  );

export const useEditMediaGalleryComment = (
  options?: MutationHookOptions<
    { editMediaGalleryComment: MediaGalleryCommentUserNode },
    any
  >,
) =>
  useMutation<{ editMediaGalleryComment: MediaGalleryCommentUserNode }, any>(
    EDIT_MEDIA_GALLERY_COMMENT,
    options,
  );

export const useDeleteMediaGalleryComment = (
  options?: MutationHookOptions<{ deleteMediaGalleryComment: boolean }, any>,
) =>
  useMutation<{ deleteMediaGalleryComment: boolean }, any>(
    DELETE_MEDIA_GALLERY_COMMENT,
    options,
  );
