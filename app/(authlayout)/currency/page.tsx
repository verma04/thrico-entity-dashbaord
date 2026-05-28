"use client";

import React, { useState } from "react";
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

  const formattedDateRange = dateRange?.from && dateRange?.to
    ? {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      }
    : undefined;

  return (
    <EcosystemWrapper anonymized-1="currency-intelligence">
      <EcosystemHeader
        title="Economic Node"
        badgeText="Currency Stats"
        description="Monitor your entity's local economy — earnings, redemptions, and active circulation at a glance."
        icon={Coins}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">
              Verified Economic Ledger Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            <DateRangePicker 
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-4 rounded-lg border-zinc-200 font-bold text-[10px] uppercase tracking-widest text-zinc-600 gap-2 hover:bg-zinc-50 transition-all shadow-sm"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset Node
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-lg border-zinc-200 shadow-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-zinc-900 font-bold tracking-tight">
                    Reset currency nodes?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-500 text-sm">
                    This will synchronize all economic parameters, caps, and redemption protocols back to the platform core defaults.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-lg border-zinc-200 font-bold text-[10px] uppercase tracking-widest">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-zinc-900 hover:bg-zinc-800 rounded-lg font-bold text-[10px] uppercase tracking-widest"
                    onClick={() => reSeed()}
                    disabled={resetting}
                  >
                    {resetting ? "Syncing..." : "Initialize Reset"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8">
        <CurrencyDashboard timeRange={timeRange} dateRange={formattedDateRange} />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
