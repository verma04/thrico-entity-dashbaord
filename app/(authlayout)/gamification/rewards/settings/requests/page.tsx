"use client";

import React, { useState } from "react";
import { PendingRequests, BrandRewardsDialog } from "@/components/rewards/settings";
import {
  usePartnerNetwork,
  BRAND_REWARD_CATALOGUE,
} from "@/components/rewards/settings/partner-network-context";
import type { BrandReward } from "@/components/rewards/settings";

export default function RewardsSettingsRequestsPage() {
  const { requests, confirmPartnership, declineRequest } = usePartnerNetwork();

  // Dialog state — local to this page only
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const reviewingRequest = requests.find((r) => r.id === reviewingId) ?? null;
  const reviewingRewards: BrandReward[] =
    reviewingId ? (BRAND_REWARD_CATALOGUE[reviewingId] ?? []) : [];

  return (
    <div className="max-w-xl space-y-6">
      <PendingRequests
        requests={requests}
        onReview={setReviewingId}
        onDecline={declineRequest}
      />

      <BrandRewardsDialog
        open={reviewingId !== null}
        request={reviewingRequest}
        rewards={reviewingRewards}
        onClose={() => setReviewingId(null)}
        onConfirm={(reqId, selectedIds) => {
          confirmPartnership(reqId, selectedIds);
          setReviewingId(null);
        }}
      />
    </div>
  );
}
