import { gql } from "@apollo/client";

// ============================================================================
// QUERIES
// ============================================================================

export const GET_SHOP_PRODUCTS = gql`
  query GetShopProducts(
    $filter: ShopProductFilterInput
    $pagination: PaginationInput
  ) {
    getShopProducts(filter: $filter, pagination: $pagination) {
      id
      entity
      title
      slug
      description
      price
      currency
      category
      tags
      status
      hasVariants
      isOutOfStock
      externalLink
      createdAt
      updatedAt
      createdBy
      numberOfViews
      numberOfVariants
      media {
        id
        url
        sortOrder
      }
      variants {
        id
        title
        sku
        price
        currency
        inventory
        isOutOfStock
        options
        image
        externalLink
      }
      options {
        id
        name
        values
      }
    }
  }
`;

export const GET_SHOP_PRODUCT = gql`
  query GetShopProduct($id: ID!) {
    getShopProduct(id: $id) {
      id
      entity
      title
      slug
      description
      price
      currency
      category
      tags
      status
      hasVariants
      numberOfViews
      numberOfVariants
      isOutOfStock
      externalLink
      createdAt
      updatedAt
      createdBy
      media {
        id
        url
        sortOrder
      }
      variants {
        id
        title
        sku
        price
        currency
        inventory
        isOutOfStock
        options
        image
        externalLink
      }
      options {
        id
        name
        values
      }
    }
  }
`;

export const GET_SHOP_BANNERS = gql`
  query GetShopBanners {
    getShopBanners {
      id
      entity
      title
      image
      linkedProductId
      sortOrder
      isActive
      createdAt
      updatedAt
      createdBy
      linkedProduct {
        id
        title
        slug
        price
        currency
        media {
          url
        }
      }
    }
  }
`;

// ============================================================================
// MUTATIONS
// ============================================================================

export const CREATE_SHOP_PRODUCT = gql`
  mutation CreateShopProduct($input: CreateShopProductInput!) {
    createShopProduct(input: $input) {
      id
      title
      slug
      description
      price
      currency
      category
      status
      createdAt
    }
  }
`;

export const UPDATE_SHOP_PRODUCT = gql`
  mutation UpdateShopProduct($id: ID!, $input: UpdateShopProductInput!) {
    updateShopProduct(id: $id, input: $input) {
      id
      title
      slug
      description
      price
      currency
      category
      status
      updatedAt
    }
  }
`;

export const DELETE_SHOP_PRODUCT = gql`
  mutation DeleteShopProduct($id: ID!) {
    deleteShopProduct(id: $id)
  }
`;

export const CREATE_SHOP_PRODUCT_VARIANT = gql`
  mutation CreateShopProductVariant($input: CreateShopProductVariantInput!) {
    createShopProductVariant(input: $input) {
      id
      productId
      title
      sku
      price
      currency
      inventory
      isOutOfStock
      options
      image
      externalLink
      createdAt
    }
  }
`;

export const UPDATE_SHOP_PRODUCT_VARIANT = gql`
  mutation UpdateShopProductVariant(
    $productId: ID!
    $input: [UpdateShopProductVariantInput!]!
  ) {
    updateShopProductVariant(productId: $productId, input: $input) {
      id
      title
      sku
      price
      currency
      inventory
      isOutOfStock
      options
      image
      externalLink
      updatedAt
    }
  }
`;

export const DELETE_SHOP_PRODUCT_VARIANT = gql`
  mutation DeleteShopProductVariant($id: ID!) {
    deleteShopProductVariant(id: $id)
  }
`;

export const CREATE_SHOP_BANNER = gql`
  mutation CreateShopBanner($input: CreateShopBannerInput!) {
    createShopBanner(input: $input) {
      id
      title
      image
      linkedProductId
      sortOrder
      isActive
      createdAt
    }
  }
`;

export const UPDATE_SHOP_BANNER = gql`
  mutation UpdateShopBanner($id: ID!, $input: UpdateShopBannerInput!) {
    updateShopBanner(id: $id, input: $input) {
      id
      title
      image
      linkedProductId
      sortOrder
      isActive
      updatedAt
    }
  }
`;

export const DELETE_SHOP_BANNER = gql`
  mutation DeleteShopBanner($id: ID!) {
    deleteShopBanner(id: $id)
  }
`;

export const REORDER_SHOP_BANNERS = gql`
  mutation ReorderShopBanners($bannerOrders: [BannerOrderInput!]!) {
    reorderShopBanners(bannerOrders: $bannerOrders) {
      id
      sortOrder
    }
  }
`;

export const UPDATE_SHOP_PRODUCT_MEDIA = gql`
  mutation UpdateShopProductMedia(
    $productId: ID!
    $media: [inputProdutMedia]!
  ) {
    updateShopProductMedia(productId: $productId, media: $media) {
      id
      productId
      url
      sortOrder
      createdAt
    }
  }
`;

export const UPDATE_SHOP_PRODUCT_OPTIONS = gql`
  mutation UpdateShopProductOptions(
    $input: [UpdateShopProductOptionInput!]!
    $productId: ID!
  ) {
    updateShopProductOptions(input: $input, productId: $productId) {
      id
      productId
      entity
      name
      values
      createdAt
      updatedAt
    }
  }
`;
