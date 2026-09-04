import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_ADDON,
  CREATE_CUSTOM_REQUEST,
  GET_ADDON_PRICING,
  GET_COUNTRY_PACKAGES,
  GET_PLAN_OVERVIEW,
  GET_UPGRADE_PLAN_SUMMARY,
  GET_UPDATE_TO_YEARLY_SUMMARY,
  UPDATE_TO_YEARLY,
  UPDATE_TRAIL_TO_PACKAGE,
  UPGRADE_PLAN,
  VERIFY_RAZORPAY_PAYMENT,
  GET_COUNTRY,
} from "../../quries/plan";
import { CountryPackage } from "@/components/subscription/ts-types";

export const useCountryPackage = (options: any) =>
  useQuery(GET_COUNTRY_PACKAGES, options);

export const useUpdateTrialToPackage = (options: any) =>
  useMutation(UPDATE_TRAIL_TO_PACKAGE, options);

export const useUpdateToYearly = (options?: any) =>
  useMutation<UpdateToYearlyResponse>(UPDATE_TO_YEARLY, options);

export interface YearlySummaryAddon {
  addonId: string;
  name: string;
  type: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface UpdateToYearlySummary {
  basePrice: number;
  addonsPrice: number;
  taxAmount: number;
  totalAmount: number;
  taxName: string;
  taxPercentage: number;
  addons: YearlySummaryAddon[];
  planName: string;
  billingCycle: string;
}

export interface GetUpdateToYearlySummaryResponse {
  getUpdateToYearlySummary: UpdateToYearlySummary;
}

export const useUpdateToYearlySummary = () =>
  useQuery<GetUpdateToYearlySummaryResponse>(GET_UPDATE_TO_YEARLY_SUMMARY);

export interface UpdateToYearlyResponse {
  updateToYearly: {
    subscriptionId: string;
    packageId: string;
    planName: string;
    planType: string;
    billingCycle: string;
    price: number;
    startDate: string;
    endDate: string;
    status: string;
    billingId: string;
    billStatus: string;
    billAmount: number;
    razorpayOrder: {
      id: string;
      entity: string;
      amount: number;
      currency: string;
      receipt: string;
      status: string;
      created_at: number;
    } | null;
    addons: YearlySummaryAddon[];
    taxAmount: number;
    totalAmount: number;
    taxName: string;
    taxPercentage: number;
  };
}

export const useVerifyRazorpayPayment = (options: any) =>
  useMutation(VERIFY_RAZORPAY_PAYMENT, {
    ...options,
    update(cache, { data: { verifyRazorpayPayment } }) {
      window.location.reload();
      //     cache.writeQuery({
      //       query: GET_PLAN_OVERVIEW,
      //       data: { getPlanOverview: verifyRazorpayPayment },
      //     });
      //   } catch (error) {
      //     console.error(
      //       "Error updating cache after payment verification:",
      //       error
      //     );
      //   }
    },
  });
export interface LimitUsage {
  used: number;
  limit: number;
  percent: number;
}

export interface SubscriptionAddon {
  addonId: string;
  type: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isActive: boolean;
  addedAt: string;
  removedAt?: string;
  effectiveFrom: string;
}

export interface checkPlanOverview {
  planName: string;
  planType?: "Standard" | "Custom" | string;
  status:
    | "active"
    | "scheduled_downgrade"
    | "scheduled_upgrade"
    | "cancelled"
    | "suspended";
  billingCycle: "monthly" | "yearly";
  nextPaymentDate: string;
  price: number;
  adminUsers: LimitUsage;
  modulesUsed: LimitUsage;
  userUsage: LimitUsage;
  subscriptionType: "trail" | "paid";
  package: CountryPackage;
  addons?: SubscriptionAddon[];
}

export interface GetPlanOverviewQuery {
  getPlanOverview: checkPlanOverview | null;
}

export const usePlanOverview = () =>
  useQuery<GetPlanOverviewQuery>(GET_PLAN_OVERVIEW);

export const useCreateCustomRequest = (options: any) =>
  useMutation(CREATE_CUSTOM_REQUEST, options);

export const useUpgradePlanSummary = (options: any) =>
  useMutation(GET_UPGRADE_PLAN_SUMMARY, options);

export const useUpgradePlan = (options: any) =>
  useMutation(UPGRADE_PLAN, options);

export interface AddonPricing {
  countryCode: string;
  addonPricingId: string;
  type: string;
  name: string;
  description: string;
  unitLabel: string;
  monthlyUnitPrice: number;
  yearlyUnitPrice: number;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetAddonPricingQuery {
  getAddonPricing: {
    addons: AddonPricing[];
    currency: string;
  };
}

export const useAddonPricing = () =>
  useQuery<GetAddonPricingQuery>(GET_ADDON_PRICING);

export interface AddAddonResponse {
  addAddon: {
    success: boolean;
    message: string;
    billingId: string;
    amount: number;
    currency: string;
    razorpayOrder: {
      id: string;
      amount: number;
      currency: string;
    } | null;
  };
}

export const useAddAddon = (options?: any) =>
  useMutation<AddAddonResponse>(ADD_ADDON, options);

export interface CountryData {
  code: string;
  name: string;
  currency: string;
  taxName: string;
  taxPercentage: number;
  taxType: string;
  taxIncluded: boolean;
}

export interface GetCountryResponse {
  country: CountryData;
}

export const useCountry = () => useQuery<GetCountryResponse>(GET_COUNTRY);
