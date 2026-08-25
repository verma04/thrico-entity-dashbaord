import * as Yup from "yup";

export const couponSchema = Yup.object().shape({
  title: Yup.string().required("Give your reward a catchy title"),
  description: Yup.string().required("Tell users what they're getting"),
  tcCost: Yup.number()
    .required("Set a cost in points")
    .min(1, "Price must be at least 1 TC"),
  discountType: Yup.string().nullable(),
  discountValue: Yup.string().nullable(),
  validityDays: Yup.number().required("Set an expiration period").min(1),
  totalUsageLimit: Yup.number().min(0),
  perUserLimit: Yup.number().min(0),
  minAccountAge: Yup.number().min(0),
  minActivityRequired: Yup.number().min(0),
  url: Yup.string().url("Please enter a valid URL").nullable(),
  howToClaim: Yup.string().nullable(),
  isActive: Yup.boolean(),
  expiryDate: Yup.string().nullable(),
  memberEligibility: Yup.string().default("ALL"),
  membershipTierId: Yup.array().when("memberEligibility", {
    is: "TIERS",
    then: (schema) =>
      schema
        .min(1, "Please select at least one membership tier")
        .required("Please select at least one membership tier"),
    otherwise: (schema) => schema.notRequired(),
  }),
  eligibleTierIds: Yup.array().when("memberEligibility", {
    is: "TIERS",
    then: (schema) =>
      schema
        .min(1, "Please select at least one membership tier")
        .required("Please select at least one membership tier"),
    otherwise: (schema) => schema.notRequired(),
  }),
  eligibleUserIds: Yup.array().when("memberEligibility", {
    is: "SPECIFIC_CUSTOMERS",
    then: (schema) =>
      schema
        .min(1, "Please select at least one customer")
        .required("Please select at least one customer"),
    otherwise: (schema) => schema.notRequired(),
  }),
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
