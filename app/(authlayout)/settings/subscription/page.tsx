"use client";

import PaidPlan from "@/components/subscription/paid-plan";
import Trail from "@/components/subscription/trail";
import { useCheckEntitySubscription } from "@/graphql/actions";
import {
  useGetStorageStats,
  useGetStorageSummary,
} from "@/graphql/storage/storage-hooks";
import { Loader2 } from "lucide-react";

const Page = () => {
  const { data, loading } = useCheckEntitySubscription();

  const subscription = data?.checkEntitySubscription;

  const { data: statsData } = useGetStorageStats();
  const { data: summaryData } = useGetStorageSummary();

  const storageStats = statsData?.getStorageStats;
  const storageSummary = summaryData?.getStorageSummary;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-primary/5 animate-ping" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Loading subscription...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {subscription?.subscriptionType === "trial" && (
        <Trail storageStats={storageStats} storageSummary={storageSummary} />
      )}
      {subscription?.subscriptionType === "paid" && (
        <PaidPlan storageStats={storageStats} storageSummary={storageSummary} />
      )}
    </>
  );
};

export default Page;
