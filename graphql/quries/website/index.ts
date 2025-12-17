import { gql } from "@apollo/client";

// ============================================
// QUERIES
// ============================================

export const GET_WEBSITE = gql`
  query GetWebsite {
    getWebsite {
      id
      entityId
      theme
      font
      isPublished
      customDomain
      createdAt
      updatedAt

      navbar {
        id
        layout
        isEnabled
        content
        updatedAt
      }

      footer {
        id
        layout
        isEnabled
        content
        updatedAt
      }

      pages {
        id
        name
        slug
        isEnabled
        order
        createdAt
        updatedAt


      }
    }
  }
`;

export const GET_WEBSITE_BY_SLUG = gql`
  query GetWebsiteBySlug($slug: String!) {
    getWebsiteBySlug(slug: $slug) {
      id
      theme
      font
      isPublished

      navbar {
        layout
        isEnabled
        content
      }

      footer {
        layout
        isEnabled
        content
      }

      pages {
        id
        name
        slug
        isEnabled
        order
        modules {
          id
          type
          name
          layout
          content
          isEnabled
          order
        }
      }
    }
  }
`;

export const GET_PAGE = gql`
  query GetPage($pageId: ID!) {
    getPage(pageId: $pageId) {
      id
      name
      slug
      isEnabled
      order
      modules {
        id
        type
        name
        layout
        isEnabled
        isCustomized
        order
        content
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

// ============================================
// MUTATIONS
// ============================================

export const UPDATE_WEBSITE_THEME = gql`
  mutation UpdateWebsiteTheme($websiteId: ID!, $theme: String!) {
    updateWebsiteTheme(websiteId: $websiteId, theme: $theme) {
      id
      theme
      updatedAt
    }
  }
`;

export const UPDATE_WEBSITE_FONT = gql`
  mutation UpdateWebsiteFont($websiteId: ID!, $font: String!) {
    updateWebsiteFont(websiteId: $websiteId, font: $font) {
      id
      font
      updatedAt
    }
  }
`;

export const PUBLISH_WEBSITE = gql`
  mutation PublishWebsite($websiteId: ID!) {
    publishWebsite(websiteId: $websiteId) {
      id
      isPublished
      updatedAt
    }
  }
`;

export const UPDATE_NAVBAR = gql`
  mutation UpdateNavbar(
    $websiteId: ID!
    $layout: String
    $content: JSON
    $isEnabled: Boolean
  ) {
    updateNavbar(
      websiteId: $websiteId
      layout: $layout
      content: $content
      isEnabled: $isEnabled
    ) {
      id
      layout
      isEnabled
      content
      updatedAt
    }
  }
`;

export const UPDATE_FOOTER = gql`
  mutation UpdateFooter(
    $websiteId: ID!
    $layout: String
    $content: JSON
    $isEnabled: Boolean
  ) {
    updateFooter(
      websiteId: $websiteId
      layout: $layout
      content: $content
      isEnabled: $isEnabled
    ) {
      id
      layout
      isEnabled
      content
      updatedAt
    }
  }
`;

export const CREATE_PAGE = gql`
  mutation CreatePage($websiteId: ID!, $name: String!, $slug: String!) {
    createPage(websiteId: $websiteId, name: $name, slug: $slug) {
      id
      name
      slug
      isEnabled
      order
      createdAt
    }
  }
`;

export const UPDATE_PAGE = gql`
  mutation UpdatePage(
    $pageId: ID!
    $name: String
    $slug: String
    $isEnabled: Boolean
  ) {
    updatePage(
      pageId: $pageId
      name: $name
      slug: $slug
      isEnabled: $isEnabled
    ) {
      id
      name
      slug
      isEnabled
      updatedAt
    }
  }
`;

export const DELETE_PAGE = gql`
  mutation DeletePage($pageId: ID!) {
    deletePage(pageId: $pageId)
  }
`;

export const REORDER_PAGES = gql`
  mutation ReorderPages($websiteId: ID!, $pageIds: [ID!]!) {
    reorderPages(websiteId: $websiteId, pageIds: $pageIds) {
      id
      order
      name
    }
  }
`;

export const CREATE_MODULE = gql`
  mutation CreateModule(
    $pageId: ID!
    $type: String!
    $name: String!
    $layout: String!
    $content: JSON!
  ) {
    createModule(
      pageId: $pageId
      type: $type
      name: $name
      layout: $layout
      content: $content
    ) {
      id
      type
      name
      layout
      content
      order
      isEnabled
    }
  }
`;

export const UPDATE_MODULE = gql`
  mutation UpdateModule(
    $moduleId: ID!
    $name: String
    $layout: String
    $content: JSON
    $isEnabled: Boolean
  ) {
    updateModule(
      moduleId: $moduleId
      name: $name
      layout: $layout
      content: $content
      isEnabled: $isEnabled
    ) {
      id
      name
      layout
      content
      isEnabled
      updatedAt
    }
  }
`;

export const REORDER_MODULES = gql`
  mutation ReorderModules($pageId: ID!, $moduleIds: [ID!]!) {
    reorderModules(pageId: $pageId, moduleIds: $moduleIds) {
      id
      order
      name
    }
  }
`;

// ============================================
// TYPESCRIPT TYPES
// ============================================

export interface Module {
  id: string;
  type: string;
  name: string;
  layout: string;
  isEnabled: boolean;
  isCustomized?: boolean;
  order: number;
  content: any; // JSON type
  updatedAt: string;
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  isEnabled: boolean;
  order: number;
  modules: Module[];
  createdAt: string;
  updatedAt: string;
}

export interface NavbarFooter {
  id: string;
  layout: string;
  isEnabled: boolean;
  content: any; // JSON type
  updatedAt: string;
}

export interface Website {
  id: string;
  entityId: string;
  theme: string;
  font: string;
  isPublished: boolean;
  customDomain?: string;
  navbar: NavbarFooter;
  footer: NavbarFooter;
  pages: Page[];
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteBySlug {
  id: string;
  theme: string;
  font: string;
  isPublished: boolean;
  navbar: Omit<NavbarFooter, "id" | "updatedAt">;
  footer: Omit<NavbarFooter, "id" | "updatedAt">;
  pages: Array<
    Omit<Page, "createdAt" | "updatedAt"> & {
      modules: Omit<Module, "isCustomized" | "updatedAt">[];
    }
  >;
}

// Query Response Types
export interface GetWebsiteResponse {
  getWebsite: Website;
}

export interface GetWebsiteBySlugResponse {
  getWebsiteBySlug: WebsiteBySlug;
}

export interface GetPageResponse {
  getPage: Page;
}

// Mutation Response Types
export interface UpdateWebsiteThemeResponse {
  updateWebsiteTheme: {
    id: string;
    theme: string;
    updatedAt: string;
  };
}

export interface UpdateWebsiteFontResponse {
  updateWebsiteFont: {
    id: string;
    font: string;
    updatedAt: string;
  };
}

export interface PublishWebsiteResponse {
  publishWebsite: {
    id: string;
    isPublished: boolean;
    updatedAt: string;
  };
}

export interface UpdateNavbarResponse {
  updateNavbar: NavbarFooter;
}

export interface UpdateFooterResponse {
  updateFooter: NavbarFooter;
}

export interface CreatePageResponse {
  createPage: {
    id: string;
    name: string;
    slug: string;
    isEnabled: boolean;
    order: number;
    createdAt: string;
  };
}

export interface UpdatePageResponse {
  updatePage: {
    id: string;
    name: string;
    slug: string;
    isEnabled: boolean;
    updatedAt: string;
  };
}

export interface DeletePageResponse {
  deletePage: boolean;
}

export interface ReorderPagesResponse {
  reorderPages: Array<{
    id: string;
    order: number;
    name: string;
  }>;
}

export interface CreateModuleResponse {
  createModule: {
    id: string;
    type: string;
    name: string;
    layout: string;
    content: any;
    order: number;
    isEnabled: boolean;
  };
}

export interface UpdateModuleResponse {
  updateModule: {
    id: string;
    name: string;
    layout: string;
    content: any;
    isEnabled: boolean;
    updatedAt: string;
  };
}

export interface ReorderModulesResponse {
  reorderModules: Array<{
    id: string;
    order: number;
    name: string;
  }>;
}

// Mutation Variables Types
export interface UpdateWebsiteThemeVariables {
  websiteId: string;
  theme: string;
}

export interface UpdateWebsiteFontVariables {
  websiteId: string;
  font: string;
}

export interface PublishWebsiteVariables {
  websiteId: string;
}

export interface UpdateNavbarVariables {
  websiteId: string;
  layout?: string;
  content?: any;
  isEnabled?: boolean;
}

export interface UpdateFooterVariables {
  websiteId: string;
  layout?: string;
  content?: any;
  isEnabled?: boolean;
}

export interface CreatePageVariables {
  websiteId: string;
  name: string;
  slug: string;
}

export interface UpdatePageVariables {
  pageId: string;
  name?: string;
  slug?: string;
  isEnabled?: boolean;
}

export interface DeletePageVariables {
  pageId: string;
}

export interface ReorderPagesVariables {
  websiteId: string;
  pageIds: string[];
}

export interface CreateModuleVariables {
  pageId: string;
  type: string;
  name: string;
  layout: string;
  content: any;
}

export interface UpdateModuleVariables {
  moduleId: string;
  name?: string;
  layout?: string;
  content?: any;
  isEnabled?: boolean;
}

export interface ReorderModulesVariables {
  pageId: string;
  moduleIds: string[];
}
