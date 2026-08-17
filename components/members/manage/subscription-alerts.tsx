"use client";

import React from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { InlineAlert } from "@/components/ui/inline-alert";

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
  if (!subscriptionInfo?.hasReachedLimit || isAiMode) {
    return null;
  }

  return (
    <InlineAlert
      variant="alert"
      title="Subscription Limit Reached:"
      dismissible
      className="mb-6"
      message={
        <>
          After you reach your subscription limit, your community becomes
          restricted for new members. If you have not upgraded your subscription
          plan, adding members (
          {subscriptionInfo.currentCount?.toLocaleString() || "0"} /{" "}
          {subscriptionInfo.maxUsersAllowed
            ? subscriptionInfo.maxUsersAllowed.toLocaleString()
            : "∞"}
          ) may stop working until your limit is restored. Upgrade your
          subscription plan before adding new members.{" "}
          <Link
            href="/settings/subscription"
            className="text-[#38bdf8] hover:text-[#7dd3fc] underline underline-offset-2 transition-colors"
          >
            Learn about managing your subscription. ↗
          </Link>
        </>
      }
    />
  );
}

export function SubscriptionFallbackMessage({
  subscriptionInfo,
  message,
  isAiMode = false,
}: {
  subscriptionInfo?: SubscriptionInfo | any;
  message?: string;
  isAiMode?: boolean;
}) {
  if (subscriptionInfo || !message || isAiMode) {
    return null;
  }

  return <InlineAlert variant="alert" message={message} className="mb-4" />;
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
