"use client";

import React, { useState } from "react";
import { useGetAllReports, ReportModule } from "@/graphql/actions";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import {
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Filter,
  Timer,
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
        title="Safety Reports"
        badgeText="Critical Events"
        description="Monitor and resolve user reports, content violations, and system flags across the entity."
        icon={ShieldAlert}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">
              Verified Compliance Node Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!preselectedModule && (
              <Select
                value={selectedModule}
                onValueChange={(val: any) => setSelectedModule(val)}
              >
                <SelectTrigger className="h-9 w-[200px] rounded-lg border-zinc-200 bg-white text-xs font-semibold shadow-sm text-zinc-600">
                  <Filter className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL" className="text-xs">
                    All Categories
                  </SelectItem>
                  {availableModules.map((mod) => (
                    <SelectItem key={mod} value={mod} className="text-xs">
                      {mod}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-indigo-600 rounded-lg transition-all"
              onClick={() => refetch()}
            >
              <RotateCcw size={14} className={cn(loading && "animate-spin")} />
            </Button>
          </div>
        </div>
      </EcosystemActionBar>

      <ReportsList data={data?.getAllReports?.reports || []} />
    </EcosystemWrapper>
  );
}
