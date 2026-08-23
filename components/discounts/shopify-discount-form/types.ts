import * as Yup from "yup";

export type DiscountMethod = "CODE" | "AUTOMATIC";
export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";
export type AppliesToType = "ALL" | "SPECIFIC_COLLECTIONS" | "SPECIFIC_PRODUCTS";
export type PurchaseType = "ONE_TIME" | "SUBSCRIPTION" | "BOTH";
export type EligibilityType = "ALL" | "SPECIFIC_SEGMENTS" | "SPECIFIC_CUSTOMERS";
export type MinRequirementType = "NONE" | "AMOUNT" | "QUANTITY";

export interface SelectedItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  type: "collection" | "product" | "customer" | "segment";
}

export interface ShopifyDiscountFormValues {
  // Method
  discountMethod: DiscountMethod;
  code: string;
  title: string;

  // Value & Scope
  discountType: DiscountType;
  value: number | string;
  appliesTo: AppliesToType;
  selectedCollections: SelectedItem[];
  selectedProducts: SelectedItem[];
  purchaseType: PurchaseType;

  // Eligibility
  eligibility: EligibilityType;
  selectedCustomerSegments: SelectedItem[];
  selectedCustomers: SelectedItem[];

  // Minimum Requirements
  minRequirementType: MinRequirementType;
  minAmount: number | string;
  minQuantity: number | string;

  // Usage limits
  limitTotalUses: boolean;
  totalUsesLimit: number | string;
  limitOncePerCustomer: boolean;

  // Combinations
  combinesWithProductDiscounts: boolean;
  combinesWithOrderDiscounts: boolean;
  combinesWithShippingDiscounts: boolean;

  // Active Dates
  startDate: string;
  startTime: string;
  hasEndDate: boolean;
  endDate: string;
  endTime: string;

  // Sales Channels
  salesChannelAccess: boolean;
  channels: {
    onlineStore: boolean;
    pos: boolean;
    mobileApp: boolean;
    buyButton: boolean;
  };

  // Tags
  tags: string[];
}

export const initialShopifyDiscountValues: ShopifyDiscountFormValues = {
  discountMethod: "CODE",
  code: "",
  title: "",
  discountType: "PERCENTAGE",
  value: 20,
  appliesTo: "SPECIFIC_COLLECTIONS",
  selectedCollections: [
    {
      id: "col-1",
      title: "Summer 2026 Collection",
      subtitle: "14 products",
      type: "collection",
    },
  ],
  selectedProducts: [],
  purchaseType: "ONE_TIME",
  eligibility: "ALL",
  selectedCustomerSegments: [],
  selectedCustomers: [],
  minRequirementType: "NONE",
  minAmount: 50,
  minQuantity: 2,
  limitTotalUses: false,
  totalUsesLimit: 100,
  limitOncePerCustomer: false,
  combinesWithProductDiscounts: false,
  combinesWithOrderDiscounts: false,
  combinesWithShippingDiscounts: false,
  startDate: (() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  })(),
  startTime: "10:00 AM",
  hasEndDate: false,
  endDate: (() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  })(),
  endTime: "11:59 PM",
  salesChannelAccess: true,
  channels: {
    onlineStore: true,
    pos: false,
    mobileApp: false,
    buyButton: false,
  },
  tags: ["Summer", "VIP"],
};

export const shopifyDiscountSchema = Yup.object().shape({
  discountMethod: Yup.string().oneOf(["CODE", "AUTOMATIC"]).required(),
  code: Yup.string().when("discountMethod", {
    is: "CODE",
    then: (schema) =>
      schema
        .required("Discount code is required")
        .min(3, "Code must be at least 3 characters")
        .max(50, "Max 50 characters")
        .matches(/^[A-Za-z0-9_-]+$/, "Alphanumeric, dashes, and underscores only"),
    otherwise: (schema) => schema.notRequired(),
  }),
  title: Yup.string().when("discountMethod", {
    is: "AUTOMATIC",
    then: (schema) =>
      schema
        .required("Title is required for automatic discounts")
        .min(3, "Title must be at least 3 characters")
        .max(100, "Max 100 characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
  discountType: Yup.string().oneOf(["PERCENTAGE", "FIXED_AMOUNT"]).required(),
  value: Yup.number()
    .typeError("Enter a valid discount value")
    .required("Discount value is required")
    .positive("Value must be greater than 0")
    .when("discountType", {
      is: "PERCENTAGE",
      then: (schema) => schema.max(100, "Percentage discount cannot exceed 100%"),
    }),
  appliesTo: Yup.string().oneOf(["ALL", "SPECIFIC_COLLECTIONS", "SPECIFIC_PRODUCTS"]).required(),
  purchaseType: Yup.string().oneOf(["ONE_TIME", "SUBSCRIPTION", "BOTH"]).required(),
  eligibility: Yup.string().oneOf(["ALL", "SPECIFIC_SEGMENTS", "SPECIFIC_CUSTOMERS"]).required(),
  minRequirementType: Yup.string().oneOf(["NONE", "AMOUNT", "QUANTITY"]).required(),
  minAmount: Yup.number().when("minRequirementType", {
    is: "AMOUNT",
    then: (schema) =>
      schema
        .typeError("Enter a valid amount")
        .required("Minimum amount is required")
        .positive("Minimum amount must be greater than 0"),
    otherwise: (schema) => schema.notRequired(),
  }),
  minQuantity: Yup.number().when("minRequirementType", {
    is: "QUANTITY",
    then: (schema) =>
      schema
        .typeError("Enter a valid quantity")
        .required("Minimum quantity is required")
        .integer("Quantity must be a whole number")
        .positive("Minimum quantity must be at least 1"),
    otherwise: (schema) => schema.notRequired(),
  }),
  totalUsesLimit: Yup.number().when("limitTotalUses", {
    is: true,
    then: (schema) =>
      schema
        .typeError("Enter a valid usage limit")
        .required("Number of uses is required")
        .integer("Must be a whole number")
        .positive("Must be at least 1"),
    otherwise: (schema) => schema.notRequired(),
  }),
  startDate: Yup.string().required("Start date is required"),
  startTime: Yup.string().required("Start time is required"),
  endDate: Yup.string().when("hasEndDate", {
    is: true,
    then: (schema) =>
      schema
        .required("End date is required")
        .test("is-after-start", "End date must be on or after start date", function (val) {
          const { startDate } = this.parent;
          if (!startDate || !val) return true;
          return new Date(val) >= new Date(startDate);
        }),
    otherwise: (schema) => schema.notRequired(),
  }),
  endTime: Yup.string().when("hasEndDate", {
    is: true,
    then: (schema) => schema.required("End time is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
