"use client";

import { EconomicConfiguration } from "@/components/settings/currency/economic-configuration";
import { useGetEntityCurrencyConfig } from "@/graphql/actions";
import { Coins } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { useModuleStore } from "@/store/useModuleStore";

export default function EconomicsPage() {
  const currencyModuleName = useModuleStore((state) => state.currencyModuleName);
  const { data, loading } = useGetEntityCurrencyConfig();

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Economics"
        badgeText={`${currencyModuleName} Config`}
        description={`Configure your local ${currencyModuleName.toLowerCase()} branding and normalization factors.`}
        icon={Coins}
        breadcrumbs={[{ label: "Gamification", href: "/gamification" }, { label: "Currency", href: "/gamification/currency" }, { label: "Economics" }]}
      />
      <EcosystemContainer className="p-6">
        <div className="space-y-6">
          <EconomicConfiguration data={data} loading={loading} />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
