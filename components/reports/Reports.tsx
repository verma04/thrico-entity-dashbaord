"use client";

import React, { useState } from "react";
import { useGetAllReports, ReportModule } from "@/graphql/actions";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { ShieldAlert, RotateCcw, LayoutGrid, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReportsList from "./reports-list";
import { cn } from "@/lib/utils";
import { useModuleStore } from "@/store/useModuleStore";

export default function Reports({
  preselectedModule,
  canEdit = true,
  breadcrumbs,
}: {
  preselectedModule?: ReportModule;
  canEdit?: boolean;
  breadcrumbs?: { label: string; href?: string }[];
}) {
  const moduleName = useModuleStore((state) => state.communityModuleName);

  const [selectedModule, setSelectedModule] = useState<ReportModule | "ALL">(
    preselectedModule || "ALL",
  );
  const [search, setSearch] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);

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
        breadcrumbs={breadcrumbs}
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
                <SelectTrigger className="h-8 w-[180px] rounded-md border-border bg-card text-xs font-medium focus:ring-1 focus:ring-ring transition-all shadow-2xs">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="All Modules" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-md p-1">
                  <SelectItem value="ALL" className="rounded-sm text-xs py-1">
                    All Modules
                  </SelectItem>
                  {availableModules.map((mod) => (
                    <SelectItem
                      key={mod}
                      value={mod}
                      className="rounded-sm text-xs py-1"
                    >
                      {mod === "COMMUNITY" ? moduleName.toUpperCase() : mod}
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
              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-md transition-all bg-card border-border shadow-2xs"
              onClick={() => refetch()}
            >
              <RotateCcw size={14} className={cn(loading && "animate-spin")} />
            </Button>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              onClick={() => setShowExportModal(true)}
              className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
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

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="reports"
        description="Export reported content and safety incidents as CSV. Includes reason, description, module, reporter, status, and date."
        totalCount={reports.length}
        matchingCount={search.trim() ? filteredReports.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredReports;
          if (rows.length === 0) {
            toast.error("Nothing to export", { description: "No reports found." });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Reason", getValue: (r) => r.reason || "" },
            { header: "Description", getValue: (r) => r.description || "" },
            { header: "Module", getValue: (r) => r.module === "COMMUNITY" ? moduleName : (r.module || "") },
            { header: "Reporter First Name", getValue: (r) => r.reporter?.firstName || "" },
            { header: "Reporter Last Name", getValue: (r) => r.reporter?.lastName || "" },
            { header: "Reporter Email", getValue: (r) => r.reporter?.email || "" },
            { header: "Target ID", getValue: (r) => r.targetId || "" },
            { header: "Status", getValue: (r) => r.status || "PENDING" },
            { header: "Created At", getValue: (r) => r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : "" },
          ]);
          downloadCsv(csv, `reports-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${rows.length} report${rows.length !== 1 ? "s" : ""} exported.` });
        }}
      />
    </EcosystemWrapper>
  );
}
