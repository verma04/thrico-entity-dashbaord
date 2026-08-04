"use client";

import { MatchWinManager } from "@/components/rewards/match-win/match-win-manager";
import { Trophy } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";

export default function MatchWinPage() {
  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const currencyName = currencyConfig?.getEntityCurrencyConfig?.currencyName || "tokens";

  return (
    <EcosystemWrapper>
      <MatchWinManager />
    </EcosystemWrapper>
  );
}
