import React from "react";
import { Metadata } from "next";
import { HowItWorksView } from "@/components/rewards/how-it-works";

export const metadata: Metadata = {
  title: "How Rewards & Games Work | Thrico Dashboard",
  description:
    "Visual architectural guide to the 3 reward pillars, interactive mini-games, anti-fraud guardrails, and digital wallet lifecycle in Thrico.",
};

export default function RewardsHowItWorksPage() {
  return <HowItWorksView />;
}
