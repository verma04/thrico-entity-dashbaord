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
import {
  RedemptionsTable,
} from "@/components/rewards/redemptions/redemptions-table";
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
        title="Redemption Ledger"
        badgeText="Fulfillment"
        description="A complete audit trail of every system redemption. Monitor success rates and fulfillment status."
        icon={History}
      >
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 px-6 rounded-xl border-white/20 bg-white/5 text-white font-black text-[11px] uppercase tracking-wider gap-3 hover:bg-white/10 transition-all">
            <Download className="h-4 w-4" />
            Export Audit Log
          </Button>
        </div>
      </EcosystemHeader>

      <EcosystemActionBar shadow="none">
        <div className="flex flex-wrap items-center gap-6 w-full">
          {/* Search */}
          <div className="relative group flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input 
              placeholder="Search user, email or reward..." 
              className="pl-11 h-12 bg-white border-slate-200 rounded-2xl font-bold text-slate-900 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all" 
            />
          </div>

          <div className="h-8 w-px bg-slate-200" />

          {/* Quick Filters */}
          <div className="flex items-center gap-4">
            <Select>
              <SelectTrigger className="h-11 w-[160px] bg-white border-slate-200 rounded-xl font-bold text-slate-600 focus:ring-indigo-500/10">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                <SelectItem value="all" className="font-bold">All Types</SelectItem>
                <SelectItem value="external" className="font-bold text-slate-500">External (Voucher)</SelectItem>
                <SelectItem value="internal" className="font-bold text-slate-500">Internal Reward</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="h-11 w-[160px] bg-white border-slate-200 rounded-xl font-bold text-slate-600 focus:ring-indigo-500/10">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                <SelectItem value="all" className="font-bold">All Status</SelectItem>
                <SelectItem value="success" className="font-bold text-emerald-600">Success</SelectItem>
                <SelectItem value="pending" className="font-bold text-amber-600">Pending</SelectItem>
                <SelectItem value="failed" className="font-bold text-rose-600">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-11 px-4 rounded-xl border-slate-200 bg-white font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm",
                    !date && "text-slate-400",
                  )}
                >
                  <CalendarIcon className="mr-3 h-4 w-4 text-slate-400" />
                  {date ? format(date, "PPP") : <span>Filter by Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-slate-100 shadow-2xl mt-2" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {date && (
            <Button 
              variant="ghost" 
              onClick={() => setDate(undefined)}
              className="h-11 px-4 text-rose-500 font-bold hover:bg-rose-50 rounded-xl gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 overflow-hidden border-none shadow-xl shadow-slate-200/50 rounded-4xl bg-white ring-1 ring-slate-100">
        <RedemptionsTable redemptions={redemptions} isLoading={loading} />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
