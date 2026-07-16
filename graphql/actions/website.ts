import {
  useMutation,
  useQuery,
  MutationHookOptions,
  QueryHookOptions,
} from "@apollo/client";
import {
  GET_WEBSITE,
  GET_WEBSITE_BY_SLUG,
  GET_PAGE,
  UPDATE_WEBSITE_THEME,
  UPDATE_WEBSITE_FONT,
  PUBLISH_WEBSITE,
  UPDATE_NAVBAR,
  UPDATE_FOOTER,
  CREATE_PAGE,
  UPDATE_PAGE,
  DELETE_PAGE,
  REORDER_PAGES,
  CREATE_MODULE,
  UPDATE_MODULE,
  REORDER_MODULES,
  GET_ALL_PAGES_SEO,
  UPDATE_PAGE_SEO,
  DELETE_MODULE,
  TOGGLE_MODULE,
  UPDATE_WEBSITE_CUSTOM_COLORS,
  GetWebsiteResponse,
  GetWebsiteBySlugResponse,
  GetPageResponse,
  UpdateWebsiteThemeResponse,
  UpdateWebsiteThemeVariables,
  UpdateWebsiteFontResponse,
  UpdateWebsiteFontVariables,
  PublishWebsiteResponse,
  PublishWebsiteVariables,
  UpdateNavbarResponse,
  UpdateNavbarVariables,
  UpdateFooterResponse,
  UpdateFooterVariables,
  CreatePageResponse,
  CreatePageVariables,
  UpdatePageResponse,
  UpdatePageVariables,
  DeletePageResponse,
  DeletePageVariables,
  ReorderPagesResponse,
  ReorderPagesVariables,
  CreateModuleResponse,
  CreateModuleVariables,
  UpdateModuleResponse,
  UpdateModuleVariables,
  ReorderModulesResponse,
  ReorderModulesVariables,
  GetAllPagesSeoResponse,
  UpdatePageSeoResponse,
  UpdatePageSeoVariables,
  DeleteModuleResponse,
  DeleteModuleVariables,
  ToggleModuleResponse,
  ToggleModuleVariables,
  UpdateWebsiteCustomColorsResponse,
  UpdateWebsiteCustomColorsVariables,
  CustomThemeColorsInput,
} from "../quries/website";

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Hook to fetch website data by entity ID
 * @param entityId - The entity ID to fetch the website for
 * @param options - Apollo query options
 */
export const useGetWebsite = (
  options?: QueryHookOptions<GetWebsiteResponse>
) => {
  return useQuery<GetWebsiteResponse>(GET_WEBSITE, {
    ...options,
  });
};

/**
 * Hook to fetch website data by slug (for public viewing)
 * @param slug - The website slug
 * @param options - Apollo query options
 */
export const useGetWebsiteBySlug = (
  slug: string,
  options?: QueryHookOptions<GetWebsiteBySlugResponse, { slug: string }>
) => {
  return useQuery<GetWebsiteBySlugResponse, { slug: string }>(
    GET_WEBSITE_BY_SLUG,
    {
      variables: { slug },
      ...options,
    }
  );
};

/**
 * Hook to fetch a single page by ID
 * @param pageId - The page ID to fetch
 * @param options - Apollo query options
 */
export const useGetPage = (
  pageId: string,
  options?: QueryHookOptions<GetPageResponse, { pageId: string }>
) => {
  return useQuery<GetPageResponse, { pageId: string }>(GET_PAGE, {
    variables: { pageId },
    ...options,
  });
};

/**
 * Hook to fetch SEO settings for all pages in a website
 * @param websiteId - The website ID
 * @param options - Apollo query options
 */
export const useGetAllPagesSeo = (
  websiteId: string,
  options?: QueryHookOptions<GetAllPagesSeoResponse, { websiteId: string }>
) => {
  return useQuery<GetAllPagesSeoResponse, { websiteId: string }>(
    GET_ALL_PAGES_SEO,
    {
      variables: { websiteId },
      ...options,
    }
  );
};

// ============================================
// MUTATION HOOKS - WEBSITE
// ============================================

/**
 * Hook to update website theme
 * @param options - Apollo mutation options with refetch
 */
export const useUpdateWebsiteTheme = (
  options?: MutationHookOptions<
    UpdateWebsiteThemeResponse,
    UpdateWebsiteThemeVariables
  >
) => {
  return useMutation<UpdateWebsiteThemeResponse, UpdateWebsiteThemeVariables>(
    UPDATE_WEBSITE_THEME,
    options
  );
};

/**
 * Hook to update website font
 * @param options - Apollo mutation options with refetch
 */
export const useUpdateWebsiteFont = (
  options?: MutationHookOptions<
    UpdateWebsiteFontResponse,
    UpdateWebsiteFontVariables
  >
) => {
  return useMutation<UpdateWebsiteFontResponse, UpdateWebsiteFontVariables>(
    UPDATE_WEBSITE_FONT,
    options
  );
};

/**
 * Hook to publish/unpublish website
 * @param options - Apollo mutation options with refetch
 */
export const usePublishWebsite = (
  options?: MutationHookOptions<PublishWebsiteResponse, PublishWebsiteVariables>
) => {
  return useMutation<PublishWebsiteResponse, PublishWebsiteVariables>(
    PUBLISH_WEBSITE,
    options
  );
};

/**
 * Hook to update website custom colors
 * @param options - Apollo mutation options with refetch
 */
export const useUpdateWebsiteCustomColors = (
  options?: MutationHookOptions<
    UpdateWebsiteCustomColorsResponse,
    UpdateWebsiteCustomColorsVariables
  >
) => {
  return useMutation<
    UpdateWebsiteCustomColorsResponse,
    UpdateWebsiteCustomColorsVariables
  >(UPDATE_WEBSITE_CUSTOM_COLORS, options);
};

// ============================================
// MUTATION HOOKS - NAVBAR & FOOTER
// ============================================

/**
 * Hook to update navbar settings
 * @param options - Apollo mutation options with refetch
 */
export const useUpdateNavbar = (
  options?: MutationHookOptions<UpdateNavbarResponse, UpdateNavbarVariables>
) => {
  return useMutation<UpdateNavbarResponse, UpdateNavbarVariables>(
    UPDATE_NAVBAR,
    options
  );
};

/**
 * Hook to update footer settings
 * @param options - Apollo mutation options with refetch
 */
export const useUpdateFooter = (
  options?: MutationHookOptions<UpdateFooterResponse, UpdateFooterVariables>
) => {
  return useMutation<UpdateFooterResponse, UpdateFooterVariables>(
    UPDATE_FOOTER,
    options
  );
};

// ============================================
// MUTATION HOOKS - PAGES
// ============================================

/**
 * Hook to create a new page
 * @param options - Apollo mutation options with refetch
 */
export const useCreatePage = (
  options?: MutationHookOptions<CreatePageResponse, CreatePageVariables>
) => {
  return useMutation<CreatePageResponse, CreatePageVariables>(
    CREATE_PAGE,
    options
  );
};

/**
 * Hook to update an existing page
 * @param options - Apollo mutation options with refetch
 */
export const useUpdatePage = (
  options?: MutationHookOptions<UpdatePageResponse, UpdatePageVariables>
) => {
  return useMutation<UpdatePageResponse, UpdatePageVariables>(
    UPDATE_PAGE,
    options
  );
};

/**
 * Hook to update SEO settings for a page
 * @param options - Apollo mutation options with refetch
 */
export const useUpdatePageSeo = (
  options?: MutationHookOptions<UpdatePageSeoResponse, UpdatePageSeoVariables>
) => {
  return useMutation<UpdatePageSeoResponse, UpdatePageSeoVariables>(
    UPDATE_PAGE_SEO,
    options
  );
};

/**
 * Hook to delete a page
 * @param options - Apollo mutation options with refetch
 */
export const useDeletePage = (
  options?: MutationHookOptions<DeletePageResponse, DeletePageVariables>
) => {
  return useMutation<DeletePageResponse, DeletePageVariables>(
    DELETE_PAGE,
    options
  );
};

/**
 * Hook to reorder pages
 * @param options - Apollo mutation options with refetch
 */
export const useReorderPages = (
  options?: MutationHookOptions<ReorderPagesResponse, ReorderPagesVariables>
) => {
  return useMutation<ReorderPagesResponse, ReorderPagesVariables>(
    REORDER_PAGES,
    options
  );
};

// ============================================
// MUTATION HOOKS - MODULES
// ============================================

/**
 * Hook to create a new module
 * @param options - Apollo mutation options with refetch
 */
export const useCreateModule = (
  options?: MutationHookOptions<CreateModuleResponse, CreateModuleVariables>
) => {
  return useMutation<CreateModuleResponse, CreateModuleVariables>(
    CREATE_MODULE,
    options
  );
};

/**
 * Hook to update an existing module
 * @param options - Apollo mutation options with refetch
 */
export const useUpdateModule = (
  options?: MutationHookOptions<UpdateModuleResponse, UpdateModuleVariables>
) => {
  return useMutation<UpdateModuleResponse, UpdateModuleVariables>(
    UPDATE_MODULE,
    options
  );
};

/**
 * Hook to reorder modules within a page
 * @param options - Apollo mutation options with refetch
 */
export const useReorderModules = (
  options?: MutationHookOptions<ReorderModulesResponse, ReorderModulesVariables>
) => {
  return useMutation<ReorderModulesResponse, ReorderModulesVariables>(
    REORDER_MODULES,
    options
  );
};

/**
 * Hook to delete a module
 * @param options - Apollo mutation options with refetch
 */
export const useDeleteModule = (
  options?: MutationHookOptions<DeleteModuleResponse, DeleteModuleVariables>
) => {
  return useMutation<DeleteModuleResponse, DeleteModuleVariables>(
    DELETE_MODULE,
    options
  );
};

/**
 * Hook to toggle a module's enabled status
 * @param options - Apollo mutation options with refetch
 */
export const useToggleModule = (
  options?: MutationHookOptions<ToggleModuleResponse, ToggleModuleVariables>
) => {
  return useMutation<ToggleModuleResponse, ToggleModuleVariables>(
    TOGGLE_MODULE,
    options
  );
};

// ============================================
// EXPORT ALL TYPES FOR CONVENIENCE
// ============================================

export type {
  Website,
  WebsiteBySlug,
  Page,
  Module,
  NavbarFooter,
  GetWebsiteResponse,
  GetWebsiteBySlugResponse,
  GetPageResponse,
  UpdateWebsiteThemeResponse,
  UpdateWebsiteThemeVariables,
  UpdateWebsiteFontResponse,
  UpdateWebsiteFontVariables,
  PublishWebsiteResponse,
  PublishWebsiteVariables,
  UpdateNavbarResponse,
  UpdateNavbarVariables,
  UpdateFooterResponse,
  UpdateFooterVariables,
  CreatePageResponse,
  CreatePageVariables,
  UpdatePageResponse,
  UpdatePageVariables,
  DeletePageResponse,
  DeletePageVariables,
  ReorderPagesResponse,
  ReorderPagesVariables,
  CreateModuleResponse,
  CreateModuleVariables,
  UpdateModuleResponse,
  UpdateModuleVariables,
  ReorderModulesResponse,
  ReorderModulesVariables,
  SEO,
  GetAllPagesSeoResponse,
  UpdatePageSeoResponse,
  UpdatePageSeoVariables,
} from "../quries/website";
