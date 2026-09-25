"use client";

import React, { useState } from "react";
import { RotateCcw, Send, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { CtaButton } from "@/components/ui/cta-button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import { WhatsAppDashboard } from "@/components/whatsapp";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function WhatsAppPage() {
  const router = useRouter();
  const { dateRange, timeRange, handleDateChange } = useUrlDateRange(7);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsRefreshing(false);
    toast.success("WhatsApp channel analytics refreshed");
  };

  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title="WhatsApp Campaign & Messaging Hub"
        description="Full-spectrum message transmission analytics, Meta template performance, and WABA channel health"
        icon={WhatsAppIcon as React.ElementType}
        badgeText="WhatsApp Hub"
        breadcrumbs={[
          { label: "Marketing", href: "/marketing/utm" },
          { label: "WhatsApp", href: "/marketing/whatsapp" },
          { label: "Dashboard" },
        ]}
        actions={
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
            <CtaButton
              variant="outline"
              size="icon-sm"
              className="h-9 w-9 text-zinc-400 hover:text-emerald-600 rounded-lg transition-all"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RotateCcw
                size={14}
                className={cn(isRefreshing && "animate-spin")}
              />
            </CtaButton>
            <CtaButton
              variant="outline"
              size="sm"
              onClick={() => router.push("/marketing/whatsapp/templates")}
              className="h-9 rounded-lg text-xs gap-1.5 font-medium"
            >
              <Plus className="h-3.5 w-3.5" />
              Templates
            </CtaButton>
            <CtaButton
              size="sm"
              onClick={() => router.push("/marketing/whatsapp/send")}
              className="h-9 rounded-lg gap-2 text-xs font-semibold bg-[#25D366] text-white hover:bg-[#1ebe5a]"
            >
              <Send className="h-3.5 w-3.5" />
              Send Message
            </CtaButton>
          </div>
        }
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-8">
        <WhatsAppDashboard dateRange={dateRange} timeRange={timeRange} />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
