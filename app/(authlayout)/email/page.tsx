"use client";

import React from "react";
import { Mail, RotateCcw, Send, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import EmailDashboard from "@/components/email/email-dashboard";
import { cn } from "@/lib/utils";

function EmailPage() {
  const router = useRouter();
  const { dateRange, timeRange, handleDateChange } = useUrlDateRange(7);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    window.dispatchEvent(new CustomEvent("refresh-email-dashboard"));
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title="Email Campaign & Deliverability Hub"
        description="Full-spectrum transmission analytics, campaign performance, and quota health"
        icon={Mail}
        badgeText="Email Hub"
        breadcrumbs={[{ label: "Email", href: "/email" }, { label: "Dashboard" }]}
        actions={
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-indigo-600 rounded-lg transition-all"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RotateCcw
                size={14}
                className={cn(isRefreshing && "animate-spin")}
              />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/email/templates")}
              className="h-9 rounded-lg text-xs gap-1.5 font-medium"
            >
              <Plus className="h-3.5 w-3.5" />
              Templates
            </Button>
            <Button
              size="sm"
              onClick={() => router.push("/email/send")}
              className="h-9 rounded-lg gap-2 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900"
            >
              <Send className="h-3.5 w-3.5" />
              Send Campaign
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-8">
        <EmailDashboard dateRange={dateRange} timeRange={timeRange} />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withModulePermission(EmailPage, "EMAIL", "canRead");
