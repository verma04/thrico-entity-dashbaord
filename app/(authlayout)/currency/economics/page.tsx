"use client";

import { EconomicConfiguration } from "@/components/settings/currency/economic-configuration";
import { useGetEntityCurrencyConfig } from "@/graphql/actions";
import { Coins } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export default function EconomicsPage() {
  const { data, loading } = useGetEntityCurrencyConfig();

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Economics"
        badgeText="Currency Config"
        description="Configure your local currency branding and normalization factors."
        icon={Coins}
      />
      <EcosystemContainer className="p-6">
        <div className="space-y-6">
          <EconomicConfiguration data={data} loading={loading} />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
