"use client";

import React, { useState } from "react";
import { useModuleStore } from "@/store/useModuleStore";
import { CurrencyDashboard } from "@/components/settings/currency/currency-dashboard";
import { Button } from "@/components/ui/button";
import { useReSeedDefaultCurrency, TimeRange } from "@/graphql/actions";
import { toast } from "sonner";
import { RotateCcw, Coins, ShieldCheck } from "lucide-react";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { useUrlDateRange } from "@/hooks/use-url-date-range";

const timeRangeMap: Record<string, TimeRange> = {
  "24h": TimeRange.LAST_24_HOURS,
  "7d": TimeRange.LAST_7_DAYS,
  "30d": TimeRange.LAST_30_DAYS,
  "90d": TimeRange.LAST_90_DAYS,
};

export default function CurrencySettingsPage() {
  const currencyModuleName = useModuleStore(
    (state) => state.currencyModuleName,
  );
  const [reSeed, { loading: resetting }] = useReSeedDefaultCurrency({
    onCompleted: () => toast.success("Currency settings reset to defaults"),
    onError: (err: any) => toast.error(err.message),
  });

  const { dateRange, timeRange, handleDateChange } = useUrlDateRange(7);

  const formattedDateRange =
    dateRange?.from && dateRange?.to
      ? {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        }
      : undefined;

  return (
    <EcosystemWrapper anonymized-1="currency-intelligence">
      <EcosystemHeader
        title={`${currencyModuleName} Dashboard`}
        badgeText={`${currencyModuleName} Stats`}
        description={`Insights on ${currencyModuleName.toLowerCase()} earned and redeemed across the ecosystem.`}
        icon={Coins}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Currency" },
        ]}
        actions={
          <EcosystemActionBar
            shadow="none"
            className="p-0 border-none bg-transparent gap-2"
          >
            <div className="hidden sm:flex items-center gap-3">
              <DateRangePicker
                date={dateRange}
                onDateChange={handleDateChange}
                defaultValue="LAST_7_DAYS"
              />
            </div>
          </EcosystemActionBar>
        }
      />

      <EcosystemContainer className="p-6 lg:p-8">
        <CurrencyDashboard
          timeRange={timeRangeMap[timeRange]}
          dateRange={formattedDateRange}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
