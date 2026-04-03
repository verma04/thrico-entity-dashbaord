"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Calendar as CalendarIcon,
  History,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RedemptionsTable } from "@/components/rewards/redemptions/redemptions-table";
import { useGetRedemptions } from "@/graphql/actions/rewards";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function RedemptionsPage() {
  const [date, setDate] = useState<Date>();
  const { data, loading } = useGetRedemptions();
  const redemptions = data?.getRedemptions || [];

  return (
    <EcosystemWrapper anonymized-1="redemptions-ledger">
      <EcosystemHeader
        title="Redemption History"
        badgeText="Reward History"
        description="View and track all reward redemptions and fulfillment statuses across the platform."
        icon={History}
      >
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-10 px-6 rounded-xl border-white/20 bg-white/5 text-white font-bold text-[11px] uppercase tracking-wider gap-3 hover:bg-white/10 transition-all"
          >
            <Download className="h-4 w-4" />
            Export History
          </Button>
        </div>
      </EcosystemHeader>

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 <History className="h-3.5 w-3.5 text-indigo-500" />
                 <span>Ledger History • Redemptions Archive</span>
              </div>
           </div>
        </div>
      </EcosystemActionBar>

      <RedemptionsTable redemptions={redemptions} isLoading={loading} />
    </EcosystemWrapper>
  );
}
