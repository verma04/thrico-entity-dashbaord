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

// Hooks
export const useGetShopifyConnection = () => useQuery(GET_SHOPIFY_CONNECTION);
export const useGetShopifySyncStatus = (options?: any) => useQuery(GET_SHOPIFY_SYNC_STATUS, options);

export const useConnectShopify = () => useMutation(CONNECT_SHOPIFY);
export const useCallbackShopify = () => useMutation(CALLBACK_SHOPIFY);
export const useDisconnectShopify = () => useMutation(DISCONNECT_SHOPIFY);

export const useSyncShopifyCustomers = () => useMutation(SYNC_SHOPIFY_CUSTOMERS);
export const useSyncShopifyOrders = () => useMutation(SYNC_SHOPIFY_ORDERS);
export const useSyncShopifyProducts = () => useMutation(SYNC_SHOPIFY_PRODUCTS);
