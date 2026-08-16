"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import { ClipboardList, Sparkles, Filter, PlusCircle, Upload, RefreshCw } from "lucide-react";
import Link from "next/link";
import { CtaButton as Button } from "@/components/ui/cta-button";
import { Button as UIButton } from "@/components/ui/button";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";

import { SurveyAIAgentButton } from "@/components/surveys/survey-ai-agent";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { useModuleStore } from "@/store/useModuleStore";
import { useGetSurveys, Survey } from "@/graphql/surveys/survey-queries";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const singularName = useModuleStore((state) => state.surveySingularName);
  const moduleName = useModuleStore((state) => state.surveyModuleName);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "ALL") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

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

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data, loading, refetch } = useGetSurveys();
  const rawSurveys = useMemo(() => data?.getSurveys?.data || [], [data]);

  const filteredSurveys = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    if (!q) return rawSurveys;
    return rawSurveys.filter(
      (s: Survey) =>
        s.title?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q),
    );
  }, [rawSurveys, debouncedSearch]);

  return (
    <EcosystemWrapper>
      {/* Header */}
      <EcosystemHeader
        title="Feedback Registry"
        badgeText="Community Insights"
        description="Review interaction datasets, sentiment tracking, and global response protocols."
        icon={ClipboardList}
        breadcrumbs={[{ label: moduleName, href: "/surveys" }, { label: "All" }]}
        actions={
          <div className="flex items-center gap-3 relative ml-auto">
            <UIButton
              variant="outline"
              size="icon"
              onClick={() => refetch?.()}
              className="h-9 w-9 rounded-lg border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", loading && "animate-spin")}
              />
            </UIButton>
            <Link href="/surveys/templates">
              <Button
                variant="outline"
                className="gap-1.5 uppercase tracking-widest text-[9px] font-bold"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                Templates
              </Button>
            </Link>
            <SurveyAIAgentButton />
          </div>
        }
      />

      {/* Action Bar */}
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
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <UIButton
              variant="outline"
              onClick={() => setShowExportModal(true)}
              className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </UIButton>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Item>
            <Link href="/surveys/create">
              <Button className="gap-1.5">
                <PlusCircle className="h-3.5 w-3.5" />
                Create {singularName}
              </Button>
            </Link>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Status active={filteredSurveys.length > 0}>
            Showing {filteredSurveys.length} of {rawSurveys.length} {moduleName}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {children}

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName={moduleName.toLowerCase()}
        description={`Export surveys and questionnaires as CSV. Includes title, description, status, and questions count.`}
        totalCount={rawSurveys.length}
        matchingCount={debouncedSearch.trim() ? filteredSurveys.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredSurveys;
          if (rows.length === 0) {
            toast.error("Nothing to export", { description: `No ${moduleName.toLowerCase()} found.` });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Title", getValue: (s: any) => s.title || "" },
            { header: "Description", getValue: (s: any) => s.description || "" },
            { header: "Status", getValue: (s: any) => s.status || (s.isPublished ? "PUBLISHED" : "DRAFT") },
            { header: "Questions Count", getValue: (s: any) => s.questions?.length ?? "" },
            { header: "Responses Count", getValue: (s: any) => s.submissionsCount ?? "" },
            { header: "Created At", getValue: (s: any) => s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 10) : "" },
          ]);
          downloadCsv(csv, `surveys-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${rows.length} ${moduleName.toLowerCase()} exported.` });
        }}
      />
    </EcosystemWrapper>
  );
}
