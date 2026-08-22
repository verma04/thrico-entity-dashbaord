export enum StoreDiscountType {
  FIXED_AMOUNT = "FIXED_AMOUNT",
  PERCENTAGE = "PERCENTAGE",
  FREE_SHIPPING = "FREE_SHIPPING",
}

export enum StoreProvider {
  SHOPIFY = "SHOPIFY",
  WOOCOMMERCE = "WOOCOMMERCE",
}

export interface StoreDiscountRule {
  id: string;
  entityId: string;
  title: string;
  description?: string | null;
  image?: string | null;
  discountType: StoreDiscountType;
  discountValue: number;
  currency: string;
  minCartSubtotal?: number | null;
  maxDiscountCap?: number | null;
  codePrefix: string;
  storeProvider: StoreProvider;
  connectedDomain?: string | null;
  singleUsePerCustomer: boolean;
  validityDays: number;
  isActive: boolean;
  status: string;
  metadata?: string | null;
  totalAllocated: number;
  totalRedeemed: number;
  createdAt: string;
  updatedAt?: string | null;
}

export interface PaginatedStoreDiscountRules {
  items: StoreDiscountRule[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateStoreDiscountRuleInput {
  title: string;
  description?: string;
  image?: string;
  discountType: StoreDiscountType;
  discountValue: number;
  currency?: string;
  minCartSubtotal?: number;
  maxDiscountCap?: number;
  codePrefix?: string;
  storeProvider?: StoreProvider;
  connectedDomain?: string;
  singleUsePerCustomer?: boolean;
  validityDays?: number;
  isActive?: boolean;
  metadata?: string;
}

export interface UpdateStoreDiscountRuleInput {
  title?: string;
  description?: string;
  image?: string;
  discountType?: StoreDiscountType;
  discountValue?: number;
  currency?: string;
  minCartSubtotal?: number;
  maxDiscountCap?: number;
  codePrefix?: string;
  storeProvider?: StoreProvider;
  connectedDomain?: string;
  singleUsePerCustomer?: boolean;
  validityDays?: number;
  isActive?: boolean;
  status?: string;
  metadata?: string;
}
