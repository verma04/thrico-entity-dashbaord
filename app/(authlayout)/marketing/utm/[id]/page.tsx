"use client";

import React from "react";
import { useCampaignDetail } from "./layout";
import { Campaign360Dashboard } from "@/components/marketing/utm/campaign-360-dashboard";

export default function CampaignAnalyticsPage() {
  const { campaign } = useCampaignDetail();

  return (
    <Campaign360Dashboard
      campaignSlug={campaign.utmCampaign}
    />
  );
}
