"use client";

import React, { useState } from "react";
import { useModuleStore } from "@/store/useModuleStore";
import { CurrencyDashboard } from "@/components/settings/currency/currency-dashboard";
import { Button } from "@/components/ui/button";
import { useReSeedDefaultCurrency, TimeRange } from "@/graphql/actions";
import { toast } from "sonner";
import { RotateCcw, Coins, ShieldCheck } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";

export default function CurrencySettingsPage() {
  const currencyModuleName = useModuleStore(
    (state) => state.currencyModuleName,
  );
  const [reSeed, { loading: resetting }] = useReSeedDefaultCurrency({
    onCompleted: () => toast.success("Currency settings reset to defaults"),
    onError: (err: any) => toast.error(err.message),
  });

  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (!range?.from || !range?.to) return;
    const diffDays = Math.round(
      (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays <= 1) setTimeRange(TimeRange.LAST_24_HOURS);
    else if (diffDays <= 7) setTimeRange(TimeRange.LAST_7_DAYS);
    else if (diffDays <= 30) setTimeRange(TimeRange.LAST_30_DAYS);
    else if (diffDays <= 90) setTimeRange(TimeRange.LAST_90_DAYS);
  };

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
        description={`Monitor your entity's local economy — ${currencyModuleName.toLowerCase()} earnings, redemptions, and active circulation at a glance.`}
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
          timeRange={timeRange}
          dateRange={formattedDateRange}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
