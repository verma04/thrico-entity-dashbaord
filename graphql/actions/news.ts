import { useMutation, useQuery, MutationHookOptions, QueryHookOptions } from "@apollo/client";
import {
  GET_NEWS_ARTICLES,
  GET_NEWS_ARTICLE,
  GET_NEWS_CATEGORIES,
  CREATE_NEWS_ARTICLE,
  UPDATE_NEWS_ARTICLE,
  DELETE_NEWS_ARTICLE,
  PUBLISH_NEWS_ARTICLE,
  GetNewsArticlesResponse,
  GetNewsArticlesVariables,
  GetNewsArticleResponse,
  GetNewsArticleVariables,
  GetNewsCategoriesResponse,
  CreateNewsArticleResponse,
  CreateNewsArticleVariables,
  UpdateNewsArticleResponse,
  UpdateNewsArticleVariables,
  DeleteNewsArticleResponse,
  DeleteNewsArticleVariables,
  PublishNewsArticleResponse,
  PublishNewsArticleVariables,
} from "../quries/news";

// ============================================
// QUERY HOOKS
// ============================================

export const useGetNewsArticles = (
  options?: QueryHookOptions<GetNewsArticlesResponse, GetNewsArticlesVariables>
) => {
  return useQuery<GetNewsArticlesResponse, GetNewsArticlesVariables>(
    GET_NEWS_ARTICLES,
    options
  );
};

export const useGetNewsArticle = (
  options?: QueryHookOptions<GetNewsArticleResponse, GetNewsArticleVariables>
) => {
  return useQuery<GetNewsArticleResponse, GetNewsArticleVariables>(
    GET_NEWS_ARTICLE,
    options
  );
};

export const useGetNewsCategories = (
  options?: QueryHookOptions<GetNewsCategoriesResponse>
) => {
  return useQuery<GetNewsCategoriesResponse>(GET_NEWS_CATEGORIES, options);
};

// ============================================
// MUTATION HOOKS
// ============================================

export const useCreateNewsArticle = (
  options?: MutationHookOptions<CreateNewsArticleResponse, CreateNewsArticleVariables>
) => {
  return useMutation<CreateNewsArticleResponse, CreateNewsArticleVariables>(
    CREATE_NEWS_ARTICLE,
    options
  );
};

export const useUpdateNewsArticle = (
  options?: MutationHookOptions<UpdateNewsArticleResponse, UpdateNewsArticleVariables>
) => {
  return useMutation<UpdateNewsArticleResponse, UpdateNewsArticleVariables>(
    UPDATE_NEWS_ARTICLE,
    options
  );
};

export const useDeleteNewsArticle = (
  options?: MutationHookOptions<DeleteNewsArticleResponse, DeleteNewsArticleVariables>
) => {
  return useMutation<DeleteNewsArticleResponse, DeleteNewsArticleVariables>(
    DELETE_NEWS_ARTICLE,
    options
  );
};

export const usePublishNewsArticle = (
  options?: MutationHookOptions<PublishNewsArticleResponse, PublishNewsArticleVariables>
) => {
  return useMutation<PublishNewsArticleResponse, PublishNewsArticleVariables>(
    PUBLISH_NEWS_ARTICLE,
    options
  );
};
