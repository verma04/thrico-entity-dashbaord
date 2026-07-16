import { gql } from "@apollo/client";

// ============================================
// QUERIES
// ============================================

export const GET_NEWS_ARTICLES = gql`
  query GetNewsArticles($filter: NewsFilterInput) {
    getNewsArticles(filter: $filter) {
      id
      title
      slug
      content
      excerpt
      author
      authorId
      date
      category
      tags
      status
      featuredImage
      readTime
      featured
      createdAt
      updatedAt
    }
  }
`;

export const GET_NEWS_ARTICLE = gql`
  query GetNewsArticle($id: ID!) {
    getNewsArticle(id: $id) {
      id
      title
      slug
      content
      excerpt
      author
      authorId
      date
      category
      tags
      status
      featuredImage
      readTime
      featured
      createdAt
      updatedAt
    }
  }
`;

export const GET_NEWS_CATEGORIES = gql`
  query GetNewsCategories {
    getNewsCategories {
      id
      name
      slug
    }
  }
`;

// ============================================
// MUTATIONS
// ============================================

export const CREATE_NEWS_ARTICLE = gql`
  mutation CreateNewsArticle($input: CreateNewsArticleInput!) {
    createNewsArticle(input: $input) {
      id
      title
      slug
      content
      excerpt
      author
      date
      category
      tags
      status
      featuredImage
      readTime
      featured
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_NEWS_ARTICLE = gql`
  mutation UpdateNewsArticle($id: ID!, $input: UpdateNewsArticleInput!) {
    updateNewsArticle(id: $id, input: $input) {
      id
      title
      slug
      content
      excerpt
      author
      date
      category
      tags
      status
      featuredImage
      readTime
      featured
      updatedAt
    }
  }
`;

export const DELETE_NEWS_ARTICLE = gql`
  mutation DeleteNewsArticle($id: ID!) {
    deleteNewsArticle(id: $id)
  }
`;

export const PUBLISH_NEWS_ARTICLE = gql`
  mutation PublishNewsArticle($id: ID!) {
    publishNewsArticle(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

// ============================================
// TYPESCRIPT TYPES
// ============================================

export interface NewsArticleGQL {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  authorId?: string;
  date: string;
  category: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  featuredImage?: string;
  readTime: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsFilterInput {
  status?: "draft" | "published" | "archived" | "all";
  category?: string;
  searchQuery?: string;
}

export interface CreateNewsArticleInput {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  featuredImage?: string;
  featured?: boolean;
}

export interface UpdateNewsArticleInput {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  author?: string;
  category?: string;
  tags?: string[];
  status?: "draft" | "published" | "archived";
  featuredImage?: string;
  featured?: boolean;
}

// Query Response Types
export interface GetNewsArticlesResponse {
  getNewsArticles: NewsArticleGQL[];
}

export interface GetNewsArticleResponse {
  getNewsArticle: NewsArticleGQL;
}

export interface GetNewsCategoriesResponse {
  getNewsCategories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

// Mutation Response Types
export interface CreateNewsArticleResponse {
  createNewsArticle: NewsArticleGQL;
}

export interface UpdateNewsArticleResponse {
  updateNewsArticle: NewsArticleGQL;
}

export interface DeleteNewsArticleResponse {
  deleteNewsArticle: boolean;
}

export interface PublishNewsArticleResponse {
  publishNewsArticle: {
    id: string;
    status: string;
    updatedAt: string;
  };
}

// Variables Types
export interface GetNewsArticlesVariables {
  filter?: NewsFilterInput;
}

export interface GetNewsArticleVariables {
  id: string;
}

export interface CreateNewsArticleVariables {
  input: CreateNewsArticleInput;
}

export interface UpdateNewsArticleVariables {
  id: string;
  input: UpdateNewsArticleInput;
}

export interface DeleteNewsArticleVariables {
  id: string;
}

export interface PublishNewsArticleVariables {
  id: string;
}
