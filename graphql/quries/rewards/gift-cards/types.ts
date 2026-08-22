export interface DigitalCardRule {
  id: string;
  entityId: string;
  provider: string;
  providerProductId: string;
  brandName: string;
  title: string;
  description?: string | null;
  image?: string | null;
  faceValue: number;
  serviceFee: number;
  totalCost: number;
  currency: string;
  country: string;
  validityDays: number;
  isActive: boolean;
  status: string;
  metadata?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface PaginatedDigitalCardRules {
  items: DigitalCardRule[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EntityRewardWallet {
  id: string;
  entityId: string;
  balance: number;
  currency: string;
  totalFunded: number;
  totalSpent: number;
  totalFeesPaid: number;
  lowBalanceThreshold?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface RewardLedgerUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  avatar?: string | null;
}

export interface RewardLedgerEntry {
  id: string;
  entityId: string;
  userId?: string | null;
  user?: RewardLedgerUser | null;
  issuanceId?: string | null;
  entryType: string;
  rewardValue: number;
  serviceFee: number;
  totalAmount: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceId: string;
  notes?: string | null;
  createdAt: string;
}

export interface PaginatedRewardLedger {
  items: RewardLedgerEntry[];
  total: number;
}

export interface RewardIssuanceReward {
  id: string;
  title: string;
  image?: string | null;
  tcCost?: number | null;
}

export interface RewardIssuance {
  id: string;
  entityId: string;
  userId: string;
  user?: RewardLedgerUser | null;
  rewardId: string;
  reward?: RewardIssuanceReward | null;
  gameType?: string | null;
  provider: string;
  providerProductId?: string | null;
  code?: string | null;
  pin?: string | null;
  cardUrl?: string | null;
  faceValue: number;
  serviceFee: number;
  currency: string;
  status: string;
  issuedAt?: string | null;
  claimedAt?: string | null;
  redeemedAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
}

export interface PaginatedRewardIssuances {
  items: RewardIssuance[];
  total: number;
}

export interface ProviderProduct {
  id: string;
  provider: string;
  productId: string;
  brand: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  country: string;
  currency: string;
  minPrice: number;
  maxPrice: number;
  denominations?: number[] | null;
  terms?: string | null;
  isActive: boolean;
}

export interface ProviderConnection {
  id: string;
  entityId: string;
  provider: string;
  merchantId?: string | null;
  environment: string;
  status: string;
  providerBalance?: number | null;
  lastSyncAt?: string | null;
  lastBalanceSync?: string | null;
}

export interface RewardIssuanceResult {
  success: boolean;
  issuanceId?: string | null;
  rewardId?: string | null;
  rewardTitle?: string | null;
  rewardType?: string | null;
  provider?: string | null;
  code?: string | null;
  pin?: string | null;
  cardUrl?: string | null;
  faceValue?: number | null;
  serviceFee?: number | null;
  currency?: string | null;
  status?: string | null;
  expiresAt?: string | null;
  error?: string | null;
}

export interface CreateDigitalCardRuleInput {
  provider?: string;
  providerProductId: string;
  brandName: string;
  title: string;
  description?: string;
  image?: string;
  faceValue: number;
  currency?: string;
  country?: string;
  validityDays?: number;
  isActive?: boolean;
  metadata?: string;
}

export interface UpdateDigitalCardRuleInput {
  title?: string;
  description?: string;
  image?: string;
  faceValue?: number;
  currency?: string;
  country?: string;
  validityDays?: number;
  isActive?: boolean;
  status?: string;
  metadata?: string;
}

export interface RewardWalletTopupOrderResult {
  orderId: string;
  amount: number;
  amountInPaise: number;
  currency: string;
  razorpayKeyId: string;
  entityId: string;
}

export interface CreateWalletTopupOrderInput {
  amount: number;
  currency?: string;
  notes?: string;
}

export interface VerifyWalletTopupPaymentInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  amount: number;
  notes?: string;
}

export interface ConnectProviderInput {
  provider: string;
  apiKey: string;
  apiSecret: string;
  merchantId?: string;
  environment?: string;
}

export interface IssueRewardInput {
  userId: string;
  rewardId: string;
  gameType?: string;
  gamePlayId?: string;
  source?: string;
}

export interface SimulateRewardIssuanceInput {
  rewardId: string;
  userId?: string;
  gameType?: string;
}

