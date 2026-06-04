"use client";

import React, { useState } from "react";
import { useGetAllReports, ReportModule } from "@/graphql/actions";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { ShieldAlert, RotateCcw, LayoutGrid } from "lucide-react";
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
  canEdit = true,
}: {
  preselectedModule?: ReportModule;
  canEdit?: boolean;
}) {
  const [selectedModule, setSelectedModule] = useState<ReportModule | "ALL">(
    preselectedModule || "ALL",
  );
  const [search, setSearch] = useState("");

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
  const reports = data?.getAllReports?.reports || [];

  const filteredReports = reports.filter(
    (r) =>
      r.reason?.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()) ||
      r.module?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Reports"
        badgeText="Safety"
        description="View and manage reported content and users."
        icon={ShieldAlert}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-sm">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search reports..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            {!preselectedModule && (
              <Select
                value={selectedModule}
                onValueChange={(val: any) => setSelectedModule(val)}
              >
                <SelectTrigger className="h-9 w-[180px] rounded-xl border-border bg-card text-xs font-medium focus:ring-2 focus:ring-zinc-500/10 transition-all">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="All Modules" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border shadow-2xl p-1">
                  <SelectItem value="ALL" className="rounded-lg text-xs py-2">
                    All Modules
                  </SelectItem>
                  {availableModules.map((mod) => (
                    <SelectItem
                      key={mod}
                      value={mod}
                      className="rounded-lg text-xs py-2"
                    >
                      {mod}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-xl transition-all bg-card border-border"
              onClick={() => refetch()}
            >
              <RotateCcw size={14} className={cn(loading && "animate-spin")} />
            </Button>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Status active={filteredReports.length > 0}>
            {filteredReports.length} Reports
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <ReportsList
          data={filteredReports}
          loading={loading}
          canEdit={canEdit}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
