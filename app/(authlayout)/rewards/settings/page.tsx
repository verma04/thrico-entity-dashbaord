"use client";

import React from "react";
import { ExternalOfferToggle } from "@/components/rewards/settings";
import { usePartnerNetwork } from "@/components/rewards/settings/partner-network-context";

export default function RewardsSettingsGeneralPage() {
  const { acceptExternal, setAcceptExternal } = usePartnerNetwork();

  return (
    <div className="max-w-2xl space-y-6">
      <ExternalOfferToggle
        enabled={acceptExternal}
        onToggle={setAcceptExternal}
      />
    </div>
  );
}
