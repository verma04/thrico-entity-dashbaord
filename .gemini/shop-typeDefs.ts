//
// This file contains the Shop GraphQL Type Definitions
// Copy this to: /Users/pulseplay/thrico/thrico-backend/services/admin-graphql/src/schema/shop/typeDefs.ts
//

export const shopTypeDefs = `#graphql
  # Enums
  enum ShopProductStatus {
    DRAFT
    ACTIVE
    ARCHIVED
    OUT_OF_STOCK
  }

  # Types
  type ShopProduct {
    id: ID!
    entity: ID!
    title: String!
    slug: String!
    description: String
    price: String!
    currency: String!
    category: String!
    tags: [String!]
    status: ShopProductStatus!
    hasVariants: Boolean!
    isOutOfStock: Boolean!
    externalLink: String
    createdAt: String!
    updatedAt: String!
    createdBy: ID
    media: [ShopProductMedia!]
    variants: [ShopProductVariant!]
    options: [ShopProductOption!]
  }

  type ShopProductMedia {
    id: ID!
    productId: ID!
    url: String!
    sortOrder: Int!
    createdAt: String!
  }

  type ShopProductVariant {
    id: ID!
    productId: ID!
    entity: ID!
    title: String!
    sku: String
    price: String!
    currency: String!
    inventory: Int!
    isOutOfStock: Boolean!
    options: JSON!
    image: String
    externalLink: String
    createdAt: String!
    updatedAt: String!
  }

  type ShopProductOption {
    id: ID!
    productId: ID!
    entity: ID!
    name: String!
    values: JSON!
    createdAt: String!
    updatedAt: String!
  }

  type ShopBanner {
    id: ID!
    entity: ID!
    title: String!
    image: String!
    linkedProductId: ID
    sortOrder: Int!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
    createdBy: ID
    linkedProduct: ShopProduct
  }

  # Input Types
  input ShopProductFilterInput {
    status: ShopProductStatus
    category: String
  }

  input PaginationInput {
    limit: Int
    offset: Int
  }

  input CreateShopProductInput {
    title: String!
    slug: String
    description: String
    price: String!
    currency: String
    category: String!
    tags: [String!]
    status: ShopProductStatus
    hasVariants: Boolean
    isOutOfStock: Boolean
    externalLink: String
    media: [String!]
  }

  input UpdateShopProductInput {
    title: String
    slug: String
    description: String
    price: String
    currency: String
    category: String
    tags: [String!]
    status: ShopProductStatus
    hasVariants: Boolean
    isOutOfStock: Boolean
    externalLink: String
  }

  input CreateShopProductVariantInput {
    productId: ID!
    title: String!
    sku: String
    price: String!
    currency: String
    inventory: Int
    isOutOfStock: Boolean
    options: JSON!
    image: String
    externalLink: String
  }

  input UpdateShopProductVariantInput {
    title: String
    sku: String
    price: String
    currency: String
    inventory: Int
    isOutOfStock: Boolean
    options: JSON
    image: String
    externalLink: String
  }

  input CreateShopBannerInput {
    title: String!
    image: String!
    linkedProductId: ID
    sortOrder: Int
    isActive: Boolean
  }

  input UpdateShopBannerInput {
    title: String
    image: String
    linkedProductId: ID
    sortOrder: Int
    isActive: Boolean
  }

  input BannerOrderInput {
    id: ID!
    sortOrder: Int!
  }

  # Queries
  type Query {
    getShopProducts(filter: ShopProductFilterInput, pagination: PaginationInput): [ShopProduct!]!
    getShopProduct(id: ID!): ShopProduct
    getShopBanners: [ShopBanner!]!
  }

  # Mutations
  type Mutation {
    createShopProduct(input: CreateShopProductInput!): ShopProduct!
    updateShopProduct(id: ID!, input: UpdateShopProductInput!): ShopProduct!
    deleteShopProduct(id: ID!): Boolean!
    
    createShopProductVariant(input: CreateShopProductVariantInput!): ShopProductVariant!
    updateShopProductVariant(id: ID!, input: UpdateShopProductVariantInput!): ShopProductVariant!
    deleteShopProductVariant(id: ID!): Boolean!
    
    createShopBanner(input: CreateShopBannerInput!): ShopBanner!
    updateShopBanner(id: ID!, input: UpdateShopBannerInput!): ShopBanner!
    deleteShopBanner(id: ID!): Boolean!
    reorderShopBanners(bannerOrders: [BannerOrderInput!]!): [ShopBanner!]!
  }
`;
a