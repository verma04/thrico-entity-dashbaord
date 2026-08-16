"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import { getPolls } from "../../graphql/actions/polls";
import { BarChart3, Plus, RefreshCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import List from "./poll-list";
import { PollProps, By } from "./ts-types";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useModuleStore } from "@/store/useModuleStore";

const Poll: React.FC<PollProps> = ({ by: initialBy }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const moduleName = useModuleStore((state) => state.pollModuleName);
  const singularName = useModuleStore((state) => state.pollSingularName);

  const byParam = searchParams.get("by");
  const byFilter = (byParam as By) || initialBy || By.ENTITY;
  const setByFilter = (v: By) =>
    updateParams({ by: v === By.ENTITY ? null : v });

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(search, 500);
  const [showExportModal, setShowExportModal] = useState(false);

  // Sync debounced search to URL
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const { data, loading, refetch } = getPolls({
    variables: {
      input: {
        by: byFilter,
      },
    },
  });

  const polls = data?.getPolls || [];
  const isAdmin = byFilter === By.ENTITY;

  const filteredPolls = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    if (!q) return polls;
    return polls.filter(
      (p: any) =>
        p.title?.toLowerCase().includes(q) ||
        p.question?.toLowerCase().includes(q),
    );
  }, [polls, debouncedSearch]);

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={moduleName}
        description={`Manage and view administrative and community ${moduleName.toLowerCase()}.`}
        badgeText={isAdmin ? "Admin" : "Community"}
        icon={BarChart3}
        breadcrumbs={[
          { label: moduleName, href: "/polls" },
          { label: "All" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch?.()}
              className="h-9 w-9 rounded-lg border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", loading && "animate-spin")}
              />
            </Button>
          </div>
        }
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder={`Search ${moduleName.toLowerCase()}…`}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <EcosystemActionBar.Select
              value={byFilter}
              onValueChange={(value: any) => setByFilter(value as By)}
              options={[
                { value: By.ENTITY, label: `Admin ${moduleName}` },
                { value: By.USER, label: `User ${moduleName}` },
                { value: By.ALL, label: `All ${moduleName}` },
              ]}
              placeholder={`Filter ${moduleName}`}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
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
          <EcosystemActionBar.Item>
            <Link href="/polls/create">
              <CtaButton size="md" className="gap-1.5 h-8 px-3 text-xs">
                <Plus className="h-3.5 w-3.5" />
                Create {singularName}
              </CtaButton>
            </Link>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Status active={filteredPolls.length > 0}>
            Showing {filteredPolls.length} of {polls.length} {moduleName}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-6 py-2">
          <List data={filteredPolls} isLoading={loading} />
        </div>
      </EcosystemContainer>

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName={moduleName.toLowerCase()}
        description={`Export polls as CSV. Includes question, options, total votes, and creation date.`}
        totalCount={polls.length}
        matchingCount={debouncedSearch.trim() ? filteredPolls.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredPolls;
          if (rows.length === 0) {
            toast.error("Nothing to export", { description: `No ${moduleName.toLowerCase()} found.` });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Question", getValue: (p) => p.question || p.title || "" },
            { header: "Options", getValue: (p) => (p.options || []).map((o: any) => o.text || o.title || o).join("; ") },
            { header: "Total Votes", getValue: (p) => p.totalVotes ?? (p.votesCount ?? "") },
            { header: "Author", getValue: (p) => p.creator ? `${p.creator.firstName || ""} ${p.creator.lastName || ""}`.trim() : "" },
            { header: "Created At", getValue: (p) => p.createdAt ? new Date(p.createdAt).toISOString().slice(0, 10) : "" },
          ]);
          downloadCsv(csv, `polls-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${rows.length} ${moduleName.toLowerCase()} exported.` });
        }}
      />
    </EcosystemWrapper>
  );
};

export default Poll;
