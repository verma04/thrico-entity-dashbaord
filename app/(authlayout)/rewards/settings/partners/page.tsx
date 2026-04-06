"use client";

import React from "react";
import { ActivePartnersTable } from "@/components/rewards/settings";
import { usePartnerNetwork } from "@/components/rewards/settings/partner-network-context";

export default function RewardsSettingsPartnersPage() {
  const { partners } = usePartnerNetwork();

  return (
    <div className="space-y-6">
      <ActivePartnersTable partners={partners} />
    </div>
  );
}
