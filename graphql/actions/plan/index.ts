import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_CUSTOM_REQUEST,
  GET_COUNTRY_PACKAGES,
  GET_PLAN_OVERVIEW,
  GET_UPGRADE_PLAN_SUMMARY,
  UPDATE_TO_YEARLY,
  UPDATE_TRAIL_TO_PACKAGE,
  UPGRADE_PLAN,
  VERIFY_RAZORPAY_PAYMENT,
} from "../../quries/plan";
import { CountryPackage } from "@/components/subscription/ts-types";

export const useCountryPackage = (options: any) =>
  useQuery(GET_COUNTRY_PACKAGES, options);

export const useUpdateTrialToPackage = (options: any) =>
  useMutation(UPDATE_TRAIL_TO_PACKAGE, options);

export const useUpdateToYearly = (options: any) =>
  useMutation(UPDATE_TO_YEARLY, options);

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

export interface checkPlanOverview {
  planName: string;
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
}

export interface GetPlanOverviewQuery {
  getPlanOverview: checkPlanOverview | null;
}

export const usePlanOverview = () =>
  useQuery<GetPlanOverviewQuery>(GET_PLAN_OVERVIEW, {});

export const useCreateCustomRequest = (options: any) =>
  useMutation(CREATE_CUSTOM_REQUEST, options);

export const useUpgradePlanSummary = (options: any) =>
  useMutation(GET_UPGRADE_PLAN_SUMMARY, options);

export const useUpgradePlan = (options: any) =>
  useMutation(UPGRADE_PLAN, options);
