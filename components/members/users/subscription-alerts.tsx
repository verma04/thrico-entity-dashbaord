"use client";

import React, { useState } from "react";
import { AlertTriangle, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  isAiMode?: boolean;
}) {
  const [isVisible, setIsVisible] = useState(true);

  if (!subscriptionInfo?.hasReachedLimit || isAiMode || !isVisible) {
    return null;
  }

  return (
    <div className="relative flex items-start gap-3 rounded-[3px] border border-[#584824] bg-[#221f15] p-4 text-[13px] leading-5 text-[#dcd1b3] shadow-sm mb-6">
      <div className="mt-0.5 shrink-0">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.11116 1.77778C7.50658 1.0927 8.4934 1.0927 8.88882 1.77778L15.698 13.5654C16.0827 14.2312 15.6022 15.1111 14.8091 15.1111H1.19082C0.397732 15.1111 -0.0827563 14.2312 0.301931 13.5654L7.11116 1.77778Z" fill="#F5A623"/>
          <path d="M8 5.77777V10.2222" stroke="#221f15" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="8" cy="12.4444" r="0.888889" fill="#221f15"/>
        </svg>
      </div>
      <div className="pr-6">
        <span className="font-bold text-white">Subscription Limit Reached:</span> After you reach your subscription limit, your community becomes restricted for new members. If you have not upgraded your subscription plan, adding members ({subscriptionInfo.currentCount?.toLocaleString() || "0"} / {subscriptionInfo.maxUsersAllowed ? subscriptionInfo.maxUsersAllowed.toLocaleString() : "∞"}) may stop working until your limit is restored. Upgrade your subscription plan before adding new members.{" "}
        <Link href="/settings/subscription" className="text-[#38bdf8] hover:text-[#7dd3fc] underline underline-offset-2 transition-colors">
          Learn about managing your subscription. ↗
        </Link>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-4 text-[#71717a] hover:text-[#a1a1aa] transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
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
