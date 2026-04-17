import * as Yup from "yup";

export const couponSchema = Yup.object().shape({
  title: Yup.string().required("Give your reward a catchy title"),
  description: Yup.string().required("Tell users what they're getting"),
  tcCost: Yup.number().required("Set a cost in points").min(0),
  discountType: Yup.string().required("Select how the reward works"),
  discountValue: Yup.string().required("Enter the value"),
  validityDays: Yup.number().required("Set an expiration period").min(1),
  totalUsageLimit: Yup.number().min(0),
  perUserLimit: Yup.number().min(1),
  minAccountAge: Yup.number().min(0),
  minActivityRequired: Yup.number().min(0),
});

export interface Voucher {
  id: string;
  code: string;
  rewardId: string;
  rewardTitle?: string;
  isUsed: boolean;
  assignedTo?: string;
  assignedAt?: string;
  expiryDate?: string;
  createdAt: string;
}

export interface ParsedVoucher {
  code: string;
  amount?: string;
  expiryDate?: string;
  isValid: boolean;
  error?: string;
}

export type ActiveTab = "rewards" | "vouchers" | "inventory";

export const FILTER_OPTIONS = [
  "All",
  "Standard",
  "Scratch",
  "Spin",
  "Match",
] as const;
export type FilterOption = (typeof FILTER_OPTIONS)[number];
