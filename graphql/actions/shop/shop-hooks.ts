import { useQuery, useMutation, MutationHookOptions } from "@apollo/client";
import {
  GET_SHOP_PRODUCTS,
  GET_SHOP_PRODUCT,
  GET_SHOP_BANNERS,
  CREATE_SHOP_PRODUCT,
  UPDATE_SHOP_PRODUCT,
  DELETE_SHOP_PRODUCT,
  CREATE_SHOP_PRODUCT_VARIANT,
  UPDATE_SHOP_PRODUCT_VARIANT,
  DELETE_SHOP_PRODUCT_VARIANT,
  CREATE_SHOP_BANNER,
  UPDATE_SHOP_BANNER,
  DELETE_SHOP_BANNER,
  REORDER_SHOP_BANNERS,
  UPDATE_SHOP_PRODUCT_MEDIA,
  UPDATE_SHOP_PRODUCT_OPTIONS,
} from "./shop-queries";

// ============================================================================
// Query Hooks
// ============================================================================

export const useShopProducts = (options?: {
  filter?: any;
  pagination?: { limit?: number; offset?: number };
}) => {
  return useQuery(GET_SHOP_PRODUCTS, {
    variables: {
      filter: options?.filter,
      pagination: options?.pagination,
    },
  });
};

export const useShopProduct = (id: string) => {
  return useQuery(GET_SHOP_PRODUCT, {
    variables: { id },
    skip: !id,
  });
};

export const useShopBanners = () => {
  return useQuery(GET_SHOP_BANNERS);
};

// ============================================================================
// Mutation Hooks
// ============================================================================

export const useCreateShopProduct = (options?: MutationHookOptions) => {
  return useMutation(CREATE_SHOP_PRODUCT, {
    ...options,
    refetchQueries: [{ query: GET_SHOP_PRODUCTS }],
  });
};

export const useUpdateShopProduct = (options?: MutationHookOptions) => {
  return useMutation(UPDATE_SHOP_PRODUCT, options);
};

export const useDeleteShopProduct = (options?: MutationHookOptions) => {
  return useMutation(DELETE_SHOP_PRODUCT, {
    ...options,
    refetchQueries: [{ query: GET_SHOP_PRODUCTS }],
  });
};

export const useCreateShopProductVariant = (options?: MutationHookOptions) => {
  return useMutation(CREATE_SHOP_PRODUCT_VARIANT, options);
};

export const useUpdateShopProductVariant = (options?: MutationHookOptions) => {
  return useMutation(UPDATE_SHOP_PRODUCT_VARIANT, options);
};

export const useDeleteShopProductVariant = (options?: MutationHookOptions) => {
  return useMutation(DELETE_SHOP_PRODUCT_VARIANT, options);
};

export const useCreateShopBanner = (options?: MutationHookOptions) => {
  return useMutation(CREATE_SHOP_BANNER, {
    ...options,
    refetchQueries: [{ query: GET_SHOP_BANNERS }],
  });
};

export const useUpdateShopBanner = (options?: MutationHookOptions) => {
  return useMutation(UPDATE_SHOP_BANNER, {
    ...options,
    refetchQueries: [{ query: GET_SHOP_BANNERS }],
  });
};

export const useDeleteShopBanner = (options?: MutationHookOptions) => {
  return useMutation(DELETE_SHOP_BANNER, {
    ...options,
    refetchQueries: [{ query: GET_SHOP_BANNERS }],
  });
};

export const useReorderShopBanners = (options?: MutationHookOptions) => {
  return useMutation(REORDER_SHOP_BANNERS, {
    ...options,
    refetchQueries: [{ query: GET_SHOP_BANNERS }],
  });
};

export const useUpdateShopProductMedia = (options?: MutationHookOptions) => {
  return useMutation(UPDATE_SHOP_PRODUCT_MEDIA, options);
};

export const useUpdateShopProductOptions = (options?: MutationHookOptions) => {
  return useMutation(UPDATE_SHOP_PRODUCT_OPTIONS, options);
};
