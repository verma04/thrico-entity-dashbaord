import { useQuery, useMutation, QueryHookOptions, MutationHookOptions } from "@apollo/client";
import {
  GET_ALL_ACTIVE_STORIES,
  GET_ALL_STORIES_BY_USER,
  GET_PAST_STORIES,
  GET_STORIES,
  GET_STORY_BY_ID,
  DELETE_STORY,
  DELETE_STORIES,
  EXPORT_STORIES_DATA,
} from "../../quries/stories";

// ─────────────────────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export interface StoryUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  email?: string | null;
  headline?: string | null;
}

export interface StoryTextOverlay {
  id?: string;
  text?: string;
  color?: string;
  fontSize?: number;
  x?: number;
  y?: number;
  [key: string]: any;
}

export interface Story {
  id: string;
  entityId: string;
  userId: string;
  image: string;
  caption?: string | null;
  textOverlays?: StoryTextOverlay[] | string | null;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  user?: StoryUser | null;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationInput {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface StoryFilterInput {
  userId?: string;
  isActive?: boolean;
}

export interface StoryConnection {
  data: Story[];
  meta: PaginationMeta;
}

export interface DeleteStoriesResponse {
  success: boolean;
  count: number;
  deletedIds: string[];
}

export interface DeleteStoryResponse {
  id: string;
  caption?: string | null;
  image?: string;
  isActive?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// React Apollo Query Hooks
// ─────────────────────────────────────────────────────────────────────────────

export const useGetAllActiveStories = (
  pagination?: PaginationInput,
  options?: QueryHookOptions<{ getAllActiveStories: StoryConnection }, { pagination?: PaginationInput }>
) => {
  return useQuery<{ getAllActiveStories: StoryConnection }, { pagination?: PaginationInput }>(
    GET_ALL_ACTIVE_STORIES,
    {
      variables: { pagination },
      fetchPolicy: "cache-and-network",
      ...options,
    }
  );
};

export const useGetPastStories = (
  pagination?: PaginationInput,
  options?: QueryHookOptions<{ getPastStories: StoryConnection }, { pagination?: PaginationInput }>
) => {
  return useQuery<{ getPastStories: StoryConnection }, { pagination?: PaginationInput }>(
    GET_PAST_STORIES,
    {
      variables: { pagination },
      fetchPolicy: "cache-and-network",
      ...options,
    }
  );
};

export const useGetStories = (
  pagination?: PaginationInput,
  filter?: StoryFilterInput,
  options?: QueryHookOptions<{ stories: StoryConnection }, { pagination?: PaginationInput; filter?: StoryFilterInput }>
) => {
  return useQuery<{ stories: StoryConnection }, { pagination?: PaginationInput; filter?: StoryFilterInput }>(
    GET_STORIES,
    {
      variables: { pagination, filter },
      fetchPolicy: "cache-and-network",
      ...options,
    }
  );
};

export const useGetStoryById = (
  id?: string,
  options?: QueryHookOptions<{ getStoryById: Story }, { id: string }>
) => {
  return useQuery<{ getStoryById: Story }, { id: string }>(GET_STORY_BY_ID, {
    variables: { id: id! },
    skip: !id,
    fetchPolicy: "cache-and-network",
    ...options,
  });
};

export const useGetAllStoriesByUser = (
  userId: string,
  pagination?: PaginationInput,
  options?: QueryHookOptions<{ getAllStoriesByUser: StoryConnection }, { userId: string; pagination?: PaginationInput }>
) => {
  return useQuery<{ getAllStoriesByUser: StoryConnection }, { userId: string; pagination?: PaginationInput }>(
    GET_ALL_STORIES_BY_USER,
    {
      variables: { userId, pagination },
      skip: !userId,
      fetchPolicy: "cache-and-network",
      ...options,
    }
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// React Apollo Mutation Hooks
// ─────────────────────────────────────────────────────────────────────────────

export const useDeleteStory = (
  options?: MutationHookOptions<{ deleteStory: DeleteStoryResponse }, { id: string }>
) => {
  return useMutation<{ deleteStory: DeleteStoryResponse }, { id: string }>(
    DELETE_STORY,
    {
      refetchQueries: ["GetAllActiveStories", "GetPastStories", "GetStories"],
      awaitRefetchQueries: true,
      ...options,
    }
  );
};

export const useDeleteStories = (
  options?: MutationHookOptions<{ deleteStories: DeleteStoriesResponse }, { ids: string[] }>
) => {
  return useMutation<{ deleteStories: DeleteStoriesResponse }, { ids: string[] }>(
    DELETE_STORIES,
    {
      refetchQueries: ["GetAllActiveStories", "GetPastStories", "GetStories"],
      awaitRefetchQueries: true,
      ...options,
    }
  );
};

export interface ExportDataInput {
  module: string;
  status?: string | null;
  format?: string | null;
  targetId?: string | null;
  search?: string | null;
  [key: string]: any;
}

export interface ExportDataResponse {
  exportData: {
    success: boolean;
    message: string;
    totalCount?: number | null;
    fileUrl?: string | null;
  };
}

export const useExportStoriesData = (
  options?: MutationHookOptions<ExportDataResponse, { input: ExportDataInput }>
) => {
  return useMutation<ExportDataResponse, { input: ExportDataInput }>(
    EXPORT_STORIES_DATA,
    options
  );
};

