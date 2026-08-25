"use client";

import { EconomicConfiguration } from "@/components/settings/currency/economic-configuration";
import { useGetEntityCurrencyConfig } from "@/graphql/actions";
import { Coins } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
import { useModuleStore } from "@/store/useModuleStore";

export default function EconomicsPage() {
  const currencyModuleName = useModuleStore(
    (state) => state.currencyModuleName || "Currency",
  );
  const { data, loading } = useGetEntityCurrencyConfig();

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Economics"
        badgeText={`${currencyModuleName} Config`}
        description={`Maintain your gamification ${currencyModuleName.toLowerCase()} normalization factor and currency label.`}
        icon={Coins}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Currency", href: "/gamification/currency" },
          { label: "Economics" },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        {loading ? (
          <PolarisFormSkeleton showHeader={false} />
        ) : (
          <EconomicConfiguration data={data} loading={false} />
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
