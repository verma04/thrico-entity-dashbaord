"use client";

import React from "react";
import { AlertTriangle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export interface SubscriptionInfo {
  hasReachedLimit?: boolean;
  message?: string;
  currentCount?: number;
  maxUsersAllowed?: number;
}

export function SubscriptionLimitBanner({
  subscriptionInfo,
  isAiMode,
}: {
  subscriptionInfo?: SubscriptionInfo | any;
  isAiMode: boolean;
}) {
  const router = useRouter();

  if (!subscriptionInfo?.hasReachedLimit || isAiMode) {
    return null;
  }

  return (
    <div className="bg-amber-50   border-amber-200 text-amber-800  p-4 text-sm font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-4  shadow-sm">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600" />
        <div>
          <p className="font-bold text-amber-900 text-base">
            Subscription Limit Reached
          </p>
          <p className="text-amber-700 text-xs mt-0.5">
            {subscriptionInfo.message ||
              "You have reached the maximum number of users allowed by your subscription."}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
        <div className="flex items-center gap-4 bg-amber-100/60 px-5 py-2.5 rounded-lg border border-amber-200/60 shrink-0">
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-amber-600/80 tracking-widest mb-0.5">
              Current
            </p>
            <p className="text-xl font-black text-amber-900 leading-none">
              {subscriptionInfo.currentCount?.toLocaleString() || "0"}
            </p>
          </div>
          <div className="w-px h-8 bg-amber-300/60"></div>
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-amber-600/80 tracking-widest mb-0.5">
              Max Allowed
            </p>
            <p className="text-xl font-black text-amber-900 leading-none">
              {subscriptionInfo.maxUsersAllowed
                ? subscriptionInfo.maxUsersAllowed.toLocaleString()
                : "∞"}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="bg-white hover:bg-amber-100/50 text-amber-900 border-amber-300 hover:border-amber-400 transition-all shadow-sm h-[52px]"
          onClick={() => router.push("/settings/subscription")}
        >
          Manage
        </Button>
      </div>
    </div>
  );
}

export function SubscriptionFallbackMessage({
  subscriptionInfo,
  message,
  isAiMode,
}: {
  subscriptionInfo?: SubscriptionInfo | any;
  message?: string;
  isAiMode: boolean;
}) {
  if (subscriptionInfo || !message || isAiMode) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm font-medium flex items-center gap-2 mb-4 shadow-sm">
      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
      <span>{message}</span>
    </div>
  );
}

export function SubscriptionUpgradeBlock({
  subscriptionInfo,
  totalCount,
  isLoading,
}: {
  subscriptionInfo?: SubscriptionInfo | any;
  totalCount: number;
  isLoading: boolean;
}) {
  const router = useRouter();

  if (
    isLoading ||
    !subscriptionInfo?.hasReachedLimit ||
    totalCount <= (subscriptionInfo.maxUsersAllowed || 0)
  ) {
    return null;
  }

  const maxAllowed = subscriptionInfo.maxUsersAllowed || 0;
  const unlockCount = totalCount - maxAllowed;

  return (
    <div className="mt-6 p-8 rounded-xl border border-dashed border-amber-300 bg-gradient-to-b from-amber-50/50 to-amber-100/50 flex flex-col items-center justify-center text-center space-y-4 shadow-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      <div className="h-12 w-12 rounded-full bg-white shadow-sm border border-amber-200 flex items-center justify-center relative z-10">
        <Lock className="h-5 w-5 text-amber-600" />
      </div>
      <div className="relative z-10">
        <h3 className="text-base font-bold text-amber-900">
          Unlock {unlockCount} More Records
        </h3>
        <p className="text-sm text-amber-700 max-w-md mt-1.5 leading-relaxed">
          Your current plan limits visibility to the first {maxAllowed} members.
          Upgrade your subscription to access your entire directory.
        </p>
      </div>
      <Button
        variant="default"
        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm transition-all relative z-10"
        onClick={() => router.push("/settings/subscription")}
      >
        Upgrade Subscription
      </Button>
    </div>
  );
}
