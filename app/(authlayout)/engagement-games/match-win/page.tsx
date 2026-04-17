"use client";

import { MatchWinManager } from "@/components/rewards/match-win/match-win-manager";
import { Trophy } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export default function MatchWinPage() {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Match & Win"
        badgeText="Engagement"
        description="Configure the 3-column symbol matching game — set probabilities, rewards, and campaign windows."
        icon={Trophy}
      />

      <MatchWinManager />
    </EcosystemWrapper>
  );
}
