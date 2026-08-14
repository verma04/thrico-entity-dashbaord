import { gql, useMutation, useQuery } from "@apollo/client";

// Queries
export const GET_SHOPIFY_CONNECTION = gql`
  query GetShopifyConnection {
    shopifyConnection {
      id
      shopDomain
      status
      installedAt
      lastSyncAt
    }
  }
`;

export const GET_SHOPIFY_SYNC_STATUS = gql`
  query GetShopifySyncStatus {
    shopifySyncStatus
  }
`;

// Mutations
export const CONNECT_SHOPIFY = gql`
  mutation ConnectShopify($shopDomain: String!) {
    connectShopify(shopDomain: $shopDomain)
  }
`;

export const DISCONNECT_SHOPIFY = gql`
  mutation DisconnectShopify {
    disconnectShopify
  }
`;

export const SYNC_SHOPIFY_CUSTOMERS = gql`
  mutation SyncShopifyCustomers {
    syncShopifyCustomers
  }
`;

export const SYNC_SHOPIFY_ORDERS = gql`
  mutation SyncShopifyOrders {
    syncShopifyOrders
  }
`;

export const SYNC_SHOPIFY_PRODUCTS = gql`
  mutation SyncShopifyProducts {
    syncShopifyProducts
  }
`;

export const CALLBACK_SHOPIFY = gql`
  mutation CallbackShopify($shopDomain: String!, $code: String!) {
    callbackShopify(shopDomain: $shopDomain, code: $code)
  }
`;

// Pagination Queries
export const GET_SHOPIFY_CUSTOMERS = gql`
  query GetShopifyCustomers($input: ShopifyPaginationInput) {
    getShopifyCustomers(input: $input) {
      data {
        id
        shopifyCustomerId
        email
        status
        createdAt
        lastSyncedAt
      }
      total
      limit
      offset
      hasMore
    }
  }
`;

export const GET_SHOPIFY_ORDERS = gql`
  query GetShopifyOrders($input: ShopifyPaginationInput) {
    getShopifyOrders(input: $input) {
      data {
        id
        shopifyOrderId
        userId
        user {
          id
          firstName
          lastName
          email
          avatar
        }
        totalPrice
        currency
        status
        reward
        createdAt
        updatedAt
      }
      total
      limit
      offset
      hasMore
    }
  }
`;

export const GET_SHOPIFY_PRODUCTS = gql`
  query GetShopifyProducts($input: ShopifyPaginationInput) {
    getShopifyProducts(input: $input) {
      data {
        id
        shopifyProductId
        title
        status
        createdAt
        updatedAt
      }
      total
      limit
      offset
      hasMore
    }
  }
`;

export const GET_SHOPIFY_STATS = gql`
  query ShopifyStats($timeRange: ShopifyTimeRange, $dateRange: ShopifyDateRangeInput) {
    shopifyStats(timeRange: $timeRange, dateRange: $dateRange) {
      totalCustomers
      syncedProducts
      ordersProcessed
      gamifiedRewardsClaimed
      customerGrowth
      productGrowth
      orderGrowth
      rewardGrowth
    }
  }
`;

// Hooks
export const useGetShopifyConnection = () => useQuery(GET_SHOPIFY_CONNECTION);
export const useGetShopifySyncStatus = (options?: any) => useQuery(GET_SHOPIFY_SYNC_STATUS, options);

export const useConnectShopify = () => useMutation(CONNECT_SHOPIFY);
export const useCallbackShopify = () => useMutation(CALLBACK_SHOPIFY);
export const useDisconnectShopify = () => useMutation(DISCONNECT_SHOPIFY);

export const useSyncShopifyCustomers = () => useMutation(SYNC_SHOPIFY_CUSTOMERS);
export const useSyncShopifyOrders = () => useMutation(SYNC_SHOPIFY_ORDERS);
export const useSyncShopifyProducts = () => useMutation(SYNC_SHOPIFY_PRODUCTS);

export enum ShopifyTimeRange {
  TODAY = "TODAY",
  YESTERDAY = "YESTERDAY",
  LAST_7_DAYS = "LAST_7_DAYS",
  LAST_30_DAYS = "LAST_30_DAYS",
  THIS_MONTH = "THIS_MONTH",
  LAST_MONTH = "LAST_MONTH",
  CUSTOM = "CUSTOM",
}

export interface ShopifyDateRangeInput {
  startDate: string;
  endDate: string;
}


export interface ShopifyPaginationInput {
  limit?: number;
  offset?: number;
}

export const useGetShopifyCustomers = (
  variables?: { input?: ShopifyPaginationInput },
  options?: any
) => useQuery(GET_SHOPIFY_CUSTOMERS, { variables, ...options });

export const useGetShopifyOrders = (
  variables?: { input?: ShopifyPaginationInput },
  options?: any
) => useQuery(GET_SHOPIFY_ORDERS, { variables, ...options });

export const useGetShopifyProducts = (
  variables?: { input?: ShopifyPaginationInput },
  options?: any
) => useQuery(GET_SHOPIFY_PRODUCTS, { variables, ...options });

export const useGetShopifyStats = (
  variables?: { timeRange?: ShopifyTimeRange; dateRange?: ShopifyDateRangeInput },
  options?: any
) => useQuery(GET_SHOPIFY_STATS, { variables, ...options });


