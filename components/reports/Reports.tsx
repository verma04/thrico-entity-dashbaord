"use client";

import React, { useState } from "react";
import { useGetAllReports, ReportModule } from "@/graphql/actions";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  EcosystemKPI,
  EcosystemCard,
  EcosystemStatusIndicator,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Zap,
  ShieldCheck,
  Sparkles,
  LayoutGrid,
  RotateCcw,
  Filter,
  Timer,
  Layers,
  Search,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReportsList from "./reports-list";
import { cn } from "@/lib/utils";

export default function Reports({
  preselectedModule,
}: {
  preselectedModule?: ReportModule;
}) {
  const [selectedModule, setSelectedModule] = useState<ReportModule | "ALL">(
    preselectedModule || "ALL",
  );

  const queryModule = selectedModule === "ALL" ? undefined : selectedModule;

  const { data, loading, refetch } = useGetAllReports({
    variables: {
      limit: 100,
      page: 1,
      module: queryModule,
    },
    fetchPolicy: "network-only",
  });

  const availableModules = Object.values(ReportModule) as ReportModule[];

  return (
    <EcosystemWrapper anonymized-1="reports-intelligence">
      <EcosystemHeader
        title="Moderation Intelligence"
        badgeText="Security Registry"
        description="Monitor anomaly detection velocity, report instantiation protocols, and architectural resolution expansion across the global registry."
        icon={ShieldAlert}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <EcosystemStatusIndicator
              status="active"
              label="Reality Core: Operational"
            />
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Verified Network Integrity</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!preselectedModule && (
              <Select
                value={selectedModule}
                onValueChange={(val: any) => setSelectedModule(val)}
              >
                <SelectTrigger className="h-10 w-[220px] rounded-xl border-slate-200 font-bold text-slate-600 bg-white shadow-sm">
                  <Filter className="h-4 w-4 mr-2 text-indigo-500" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                  <SelectItem
                    value="ALL"
                    className="font-bold uppercase text-[10px]"
                  >
                    All Registry Tiers
                  </SelectItem>
                  {availableModules.map((mod) => (
                    <SelectItem
                      key={mod}
                      value={mod}
                      className="font-bold uppercase text-[10px]"
                    >
                      {mod} Protocol
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <div className="h-4 w-px bg-slate-200 mx-1" />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm bg-white"
              onClick={() => refetch()}
            >
              <RotateCcw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          </div>
        </div>
      </EcosystemActionBar>

      <ReportsList data={data?.getAllReports?.reports || []} />
    </EcosystemWrapper>
  );
}
