export enum ManualCouponType {
  ONE_TO_ONE = "ONE_TO_ONE",
  ONE_TO_MANY = "ONE_TO_MANY",
}

export enum ManualVoucherStatus {
  UNASSIGNED = "UNASSIGNED",
  ASSIGNED = "ASSIGNED",
  REDEEMED = "REDEEMED",
  EXPIRED = "EXPIRED",
  VOID = "VOID",
}

export interface ManualVoucherBatch {
  id: string;
  entityId: string;
  rewardId: string;
  name: string;
  description?: string | null;
  image?: string | null;
  url?: string | null;
  fileName?: string | null;
  couponType: ManualCouponType;
  inventoryRequired: boolean;
  totalCount: number;
  allocatedCount: number;
  redeemedCount: number;
  remainingCount: number;
  faceValue: number;
  currency: string;
  expiryDate?: string | null;
  status: string;
  metadata?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  reward?: {
    id: string;
    title: string;
    image?: string | null;
    tcCost?: number;
  } | null;
}

export interface ManualVoucher {
  id: string;
  entityId: string;
  rewardId: string;
  batchId?: string | null;
  couponType: ManualCouponType;
  code: string;
  cardNumber?: string | null;
  pin?: string | null;
  claimUrl?: string | null;
  faceValue: number;
  currency: string;
  inventoryRequired: boolean;
  totalInventory: number;
  remainingInventory: number;
  totalUsageLimit: number;
  perUserLimit: number;
  status: ManualVoucherStatus;
  isUsed: boolean;
  assignedTo?: string | null;
  assignedToUser?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    avatar?: string | null;
  } | null;
  assignedAt?: string | null;
  redeemedAt?: string | null;
  expiryDate?: string | null;
  metadata?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  reward?: {
    id: string;
    title: string;
    image?: string | null;
    tcCost?: number;
  } | null;
  batch?: ManualVoucherBatch | null;
}

export interface PaginatedManualVouchers {
  items: ManualVoucher[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedManualVoucherBatches {
  items: ManualVoucherBatch[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ManualVoucherEntryInput {
  code: string;
  cardNumber?: string;
  pin?: string;
  claimUrl?: string;
  faceValue?: number;
  currency?: string;
  expiryDate?: string;
  metadata?: string;
  inventoryRequired?: boolean;
  totalInventory?: number;
  perUserLimit?: number;
  totalUsageLimit?: number;
}

export interface CreateManualVoucherBatchInput {
  name: string;
  description?: string;
  image?: string;
  url?: string;
  fileName?: string;
  couponType?: ManualCouponType;
  inventoryRequired?: boolean;
  faceValue?: number;
  currency?: string;
  expiryDate?: string | null;
  count?: number;
  prefix?: string;
  couponCode?: string;
  totalUsageLimit?: number;
  entries?: ManualVoucherEntryInput[];
}

export interface CreateManualVoucherEntryInput {
  rewardId: string;
  batchId?: string;
  couponType?: ManualCouponType;
  code: string;
  cardNumber?: string;
  pin?: string;
  claimUrl?: string;
  faceValue?: number;
  currency?: string;
  inventoryRequired?: boolean;
  totalInventory?: number;
  perUserLimit?: number;
  totalUsageLimit?: number;
  expiryDate?: string;
  metadata?: string;
}

export interface UpdateManualVoucherInput {
  code?: string;
  cardNumber?: string;
  pin?: string;
  claimUrl?: string;
  faceValue?: number;
  currency?: string;
  inventoryRequired?: boolean;
  totalInventory?: number;
  remainingInventory?: number;
  perUserLimit?: number;
  totalUsageLimit?: number;
  status?: ManualVoucherStatus;
  expiryDate?: string;
  metadata?: string;
}

export interface ManualVouchersFilterInput {
  rewardId?: string;
  batchId?: string;
  couponType?: ManualCouponType;
  status?: ManualVoucherStatus;
  search?: string;
  page?: number;
  limit?: number;
}
