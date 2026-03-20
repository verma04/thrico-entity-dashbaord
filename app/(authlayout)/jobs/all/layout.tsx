"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Clock,
  XCircle,
  List,
  ChevronDown,
  Filter,
  Check,
  StopCircle,
  Briefcase,
  Search,
  RefreshCw,
} from "lucide-react";

import Stats from "@/components/jobs/stats";
import Create from "@/components/jobs/create/create-job";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";

const statusOptions = [
  {
    value: "ALL",
    label: "All Jobs",
    icon: List,
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    value: "APPROVED",
    label: "Approved",
    icon: CheckCircle,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    value: "PENDING",
    label: "Pending",
    icon: Clock,
    color: "text-amber-600 bg-amber-50",
  },
  {
    value: "DISABLED",
    label: "Disabled",
    icon: XCircle,
    color: "text-orange-600 bg-orange-50",
  },
  {
    value: "REJECTED",
    label: "Rejected",
    icon: XCircle,
    color: "text-rose-600 bg-rose-50",
  },
  {
    value: "PAUSED",
    label: "Paused",
    icon: StopCircle,
    color: "text-slate-600 bg-slate-50",
  },
];

function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "ALL";
  const searchQuery = searchParams.get("q") || "";

  const currentStatus =
    statusOptions.find((opt) => opt.value === status) || statusOptions[0];

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "ALL" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/jobs/all?${params.toString()}`);
  };

  return (
    <EcosystemWrapper>
      {/* Premium Header */}
      <EcosystemHeader
        title="Jobs"
        badgeText="Recruitment Ecosystem"
        description="Oversee and optimize your global talent identification and acquisition workflow."
        icon={Briefcase}
        actions={<Create />}
      />

      {/* Action Bar */}
      <EcosystemActionBar>
        <div className="relative w-full md:w-[450px] group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <Input
            placeholder="Search by role, company, location or technical skills..."
            value={searchQuery}
            onChange={(e) => updateFilters({ q: e.target.value })}
            className="h-14 pl-14 pr-6 rounded-3xl border-2 border-slate-100 bg-white/80 backdrop-blur-xl focus-visible:ring-4 focus-visible:ring-indigo-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:border-indigo-500/20"
          />
        </div>

        <div className="h-10 w-px bg-slate-200/60 hidden md:block mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-14 px-6 rounded-3xl border-2 border-slate-100 bg-white hover:bg-slate-50 shadow-sm flex items-center gap-4 transition-all hover:border-indigo-200 group"
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105",
                  currentStatus.color,
                )}
              >
                <currentStatus.icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col items-start mr-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                  Filter Type
                </span>
                <span className="text-sm font-black text-slate-800 leading-none">
                  {currentStatus.label}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[280px] rounded-3xl border-slate-100 shadow-2xl p-2.5 animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <div className="px-4 py-3 mb-2 border-b border-slate-50">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Registry Categories
              </p>
            </div>
            {statusOptions.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => updateFilters({ status: opt.value })}
                className={cn(
                  "flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all mb-1 group/item",
                  status === opt.value
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "hover:bg-slate-50 text-slate-600 hover:text-slate-900",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center shadow-sm",
                      status === opt.value
                        ? opt.color
                        : "bg-slate-100 group-hover/item:bg-white",
                    )}
                  >
                    <opt.icon className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-sm tracking-tight">
                    {opt.label}
                  </span>
                </div>
                {status === opt.value && (
                  <div className="h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center shadow-sm">
                    <Check className="h-3 w-3 text-white stroke-[3px]" />
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-4 pr-4">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-2xl border-2 border-slate-100 hover:border-indigo-100 text-slate-400 hover:text-indigo-600 shadow-sm"
          >
            <Filter className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 px-6 py-3 bg-slate-900 rounded-[1.25rem] shadow-xl shadow-slate-900/10 text-xs font-black text-white uppercase tracking-widest">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Live Postings
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer>{children}</EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default RootLayout;
