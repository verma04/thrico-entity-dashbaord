export interface GiftCardBrand {
  id: string;
  name: string;
  category: "E-Commerce" | "Food & Dining" | "Fashion & Lifestyle" | "Entertainment & Tech" | "Travel & Mobility";
  logoUrl?: string;
  color: string;
  denominations: number[];
  feePercent: number; // e.g. 5%
}

export interface GiftCardRuleItem {
  id: string;
  title: string;
  brand: string;
  category: string;
  denomination: number; // e.g. 500
  serviceFee: number; // e.g. 25
  totalCostPerWin: number; // e.g. 525
  validityMonths: number; // e.g. 12
  isActive: boolean;
  totalIssued: number;
  totalSpent: number;
  gameAssignments: string[];
  createdAt: string;
}

export interface GiftCardIssuanceRecord {
  id: string;
  memberName: string;
  memberEmail: string;
  brand: string;
  cardValue: number;
  serviceFee: number;
  totalDeducted: number;
  status: "DELIVERED" | "RESERVED" | "FAILED_RELEASED";
  idempotencyKey: string;
  giftCardCode?: string;
  pin?: string;
  gameSource: string;
  issuedAt: string;
  claimedAt?: string;
}

export interface EntityRewardWallet {
  balance: number;
  totalDeposited: number;
  totalSpent: number;
  activeReservations: number;
  currency: string;
}
