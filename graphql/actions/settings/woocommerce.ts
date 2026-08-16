import { gql, useMutation, useQuery } from "@apollo/client";

// Queries
export const GET_WOOCOMMERCE_CONNECTION = gql`
  query GetWooCommerceConnection {
    wooCommerceConnection {
      id
      siteUrl
      status
      installedAt
      lastSyncAt
    }
  }
`;

export const GET_WOOCOMMERCE_SYNC_STATUS = gql`
  query GetWooCommerceSyncStatus {
    wooCommerceSyncStatus
  }
`;

// Mutations
export const CONNECT_WOOCOMMERCE = gql`
  mutation ConnectWooCommerce(
    $siteUrl: String!
    $consumerKey: String!
    $consumerSecret: String!
  ) {
    connectWooCommerce(
      siteUrl: $siteUrl
      consumerKey: $consumerKey
      consumerSecret: $consumerSecret
    )
  }
`;

export const DISCONNECT_WOOCOMMERCE = gql`
  mutation DisconnectWooCommerce {
    disconnectWooCommerce
  }
`;

export const SYNC_WOOCOMMERCE_CUSTOMERS = gql`
  mutation SyncWooCommerceCustomers {
    syncWooCommerceCustomers
  }
`;

export const SYNC_WOOCOMMERCE_ORDERS = gql`
  mutation SyncWooCommerceOrders {
    syncWooCommerceOrders
  }
`;

export const SYNC_WOOCOMMERCE_PRODUCTS = gql`
  mutation SyncWooCommerceProducts {
    syncWooCommerceProducts
  }
`;

// Pagination Queries
export const GET_WOOCOMMERCE_STATS = gql`
  query WooCommerceStats(
    $timeRange: WooCommerceTimeRange
    $dateRange: WooCommerceDateRangeInput
  ) {
    wooCommerceStats(timeRange: $timeRange, dateRange: $dateRange) {
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

export const GET_WOOCOMMERCE_CUSTOMERS = gql`
  query GetWooCommerceCustomers($input: WooCommercePaginationInput) {
    getWooCommerceCustomers(input: $input) {
      data {
        id
        wooCustomerId
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

export const GET_WOOCOMMERCE_ORDERS = gql`
  query GetWooCommerceOrders($input: WooCommercePaginationInput) {
    getWooCommerceOrders(input: $input) {
      data {
        id
        wooOrderId
        userId
        user {
          id
          firstName
          lastName
          email
          username
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

export const GET_WOOCOMMERCE_PRODUCTS = gql`
  query GetWooCommerceProducts($input: WooCommercePaginationInput) {
    getWooCommerceProducts(input: $input) {
      data {
        id
        wooProductId
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

export const GET_WOOCOMMERCE_COUPONS = gql`
  query GetWooCommerceCoupons($input: WooCommercePaginationInput) {
    getWooCommerceCoupons(input: $input) {
      total
      limit
      offset
      hasMore
      data {
        id
        code
        discountType
        amount
        description
        dateExpires
        usageCount
        usageLimit
        usageLimitPerUser
        individualUse
        minimumAmount
        currency
      }
    }
  }
`;

export const GET_ALL_WOOCOMMERCE_COUPONS = gql`
  query GetAllWooCommerceCoupons {
    getAllWooCommerceCoupons {
      id
      code
      discountType
      amount
      description
      dateExpires
      usageCount
      usageLimit
      usageLimitPerUser
      individualUse
      minimumAmount
      currency
    }
  }
`;

// Hooks
export const useGetWooCommerceConnection = (options?: any) =>
  useQuery(GET_WOOCOMMERCE_CONNECTION, options);
export const useGetWooCommerceSyncStatus = (options?: any) =>
  useQuery(GET_WOOCOMMERCE_SYNC_STATUS, options);

export const useConnectWooCommerce = () => useMutation(CONNECT_WOOCOMMERCE);
export const useDisconnectWooCommerce = () => useMutation(DISCONNECT_WOOCOMMERCE);

export const useSyncWooCommerceCustomers = () =>
  useMutation(SYNC_WOOCOMMERCE_CUSTOMERS);
export const useSyncWooCommerceOrders = () =>
  useMutation(SYNC_WOOCOMMERCE_ORDERS);
export const useSyncWooCommerceProducts = () =>
  useMutation(SYNC_WOOCOMMERCE_PRODUCTS);

export enum WooCommerceTimeRange {
  TODAY = "TODAY",
  YESTERDAY = "YESTERDAY",
  LAST_7_DAYS = "LAST_7_DAYS",
  LAST_30_DAYS = "LAST_30_DAYS",
  THIS_MONTH = "THIS_MONTH",
  LAST_MONTH = "LAST_MONTH",
  CUSTOM = "CUSTOM",
}

export interface WooCommerceDateRangeInput {
  startDate: string;
  endDate: string;
}

export interface WooCommercePaginationInput {
  limit?: number;
  offset?: number;
}

export interface WooCommerceCoupon {
  id: string;
  code: string;
  discountType: string;
  amount: string;
  description?: string | null;
  dateExpires?: string | null;
  usageCount?: number;
  usageLimit?: number | null;
  usageLimitPerUser?: number | null;
  individualUse?: boolean;
  minimumAmount?: string | null;
  currency?: string | null;
}

export interface PaginatedWooCommerceCoupons {
  data: WooCommerceCoupon[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface GetWooCommerceCouponsResponse {
  getWooCommerceCoupons: PaginatedWooCommerceCoupons;
}

export interface GetAllWooCommerceCouponsResponse {
  getAllWooCommerceCoupons: WooCommerceCoupon[];
}

export const useGetWooCommerceCustomers = (
  variables?: { input?: WooCommercePaginationInput },
  options?: any
) => useQuery(GET_WOOCOMMERCE_CUSTOMERS, { variables, ...options });

export const useGetWooCommerceOrders = (
  variables?: { input?: WooCommercePaginationInput },
  options?: any
) => useQuery(GET_WOOCOMMERCE_ORDERS, { variables, ...options });

export const useGetWooCommerceProducts = (
  variables?: { input?: WooCommercePaginationInput },
  options?: any
) => useQuery(GET_WOOCOMMERCE_PRODUCTS, { variables, ...options });

export const useGetWooCommerceStats = (
  variables?: { timeRange?: WooCommerceTimeRange; dateRange?: WooCommerceDateRangeInput },
  options?: any
) => useQuery(GET_WOOCOMMERCE_STATS, { variables, ...options });

export const useGetWooCommerceCoupons = (
  variables?: { input?: WooCommercePaginationInput },
  options?: any
) =>
  useQuery<GetWooCommerceCouponsResponse>(GET_WOOCOMMERCE_COUPONS, {
    variables,
    ...options,
  });

export const useGetAllWooCommerceCoupons = (options?: any) =>
  useQuery<GetAllWooCommerceCouponsResponse>(GET_ALL_WOOCOMMERCE_COUPONS, options);
