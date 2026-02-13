"use client";

import { EconomicConfiguration } from "@/components/settings/currency/economic-configuration";
import { useGetEntityCurrencyConfig } from "@/graphql/actions";
import { Coins } from "lucide-react";

export default function EconomicsPage() {
  const { data, loading } = useGetEntityCurrencyConfig();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Coins className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Economics</h1>
          <p className="text-sm text-muted-foreground">
            Configure your local currency branding and normalization factors.
          </p>
        </div>
      </div>
      <EconomicConfiguration data={data} loading={loading} />
    </div>
  );
}
