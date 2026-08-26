"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import moment from "moment";
import {
  ClipboardList,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Upload,
  Plus,
  Sparkles,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { Pagination } from "@/components/shared/admin-table/admin-table";
import { useModuleStore } from "@/store/useModuleStore";
import { MemberEligibilitySelect } from "@/components/gamification/shared/member-eligibility-select";

import { useGetSurveys, Survey } from "@/graphql/surveys/survey-queries";
import {
  useDeleteSurvey,
  useEditSurvey,
  usePublishSurvey,
  useDraftSurvey,
  useShareSurveyAsFeed,
} from "@/graphql/surveys/survey-mutations";
import { SurveySheet } from "../survey-sheet";
import { SurveyDialogs } from "../survey-dialogs";
import {
  STATUS_TABS,
  SORT_OPTIONS,
  SurveyStatusValue,
  SectionHeader,
  ContentArea,
} from "./surveys-manage-ui";
import { getSurveyTableColumns } from "./surveys-list";
import { ExportSurveysModal } from "./export-surveys-modal";

export interface SurveysManageProps {
  status?: string;
  shareSurveyAsFeed?: boolean;
}

export function SurveysManage({
  status: initialStatus,
  shareSurveyAsFeed,
}: SurveysManageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const moduleName = useModuleStore((state) => state.surveyModuleName);
  const singularName = useModuleStore((state) => state.surveySingularName);

  // ── Update URL parameters helper ──────────────────────────────────────────
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (
          value === null ||
          value === "" ||
          value === "ALL" ||
          value === "all" ||
          value === "0" ||
          value === "grid" ||
          value === "newest"
        ) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  // ── Derive state from URL search params ───────────────────────────────────
  const page = Number(searchParams.get("page") || "1");
  const limit = 24;
  const offset = (page - 1) * limit;

  const status =
    searchParams.get("status") ||
    initialStatus ||
    "ALL";

  const memberEligibility =
    searchParams.get("memberEligibility") ||
    searchParams.get("eligibility") ||
    "ALL";

  const sortBy = searchParams.get("sort") || "newest";
  const view = (searchParams.get("view") as "grid" | "list") || "grid";

  // Search input state with debounce
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  // Sync debounced search to URL
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null, page: null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  // Dialog & Sheet states
  const [surveyToDelete, setSurveyToDelete] = useState<string | null>(null);
  const [editingDetailsSurvey, setEditingDetailsSurvey] =
    useState<Survey | null>(null);
  const [sharingSurvey, setSharingSurvey] = useState<Survey | null>(null);
  const [shareDescription, setShareDescription] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);

  // Details form state
  const [details, setDetails] = useState({
    title: "",
    description: "",
    startDate: null as moment.Moment | null,
    endDate: null as moment.Moment | null,
    memberEligibility: "ALL",
    membershipTierId: [] as string[],
    eligibleTierIds: [] as string[],
    eligibleUserIds: [] as string[],
    eligibleSegmentIds: [] as string[],
  });

  useEffect(() => {
    if (editingDetailsSurvey) {
      const elig =
        editingDetailsSurvey.eligibility ||
        editingDetailsSurvey.eligibilityRule;
      setDetails({
        title: editingDetailsSurvey.title || "",
        description: editingDetailsSurvey.description || "",
        startDate: editingDetailsSurvey.startDate
          ? moment(editingDetailsSurvey.startDate)
          : null,
        endDate: editingDetailsSurvey.endDate
          ? moment(editingDetailsSurvey.endDate)
          : null,
        memberEligibility: elig?.memberEligibility || "ALL",
        membershipTierId:
          elig?.membershipTierId || elig?.eligibleTierIds || [],
        eligibleTierIds:
          elig?.eligibleTierIds || elig?.membershipTierId || [],
        eligibleUserIds: elig?.eligibleUserIds || [],
        eligibleSegmentIds: elig?.eligibleSegmentIds || [],
      });
    }
  }, [editingDetailsSurvey]);

  // Column visibility for List view
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    serial: true,
    survey: true,
    status: true,
    duration: true,
    created: true,
    actions: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ── Setters ───────────────────────────────────────────────────────────────
  const setStatus = (v: string) =>
    updateParams({ status: v === "ALL" ? null : v, page: null });

  const setMemberEligibility = (v: string) =>
    updateParams({
      memberEligibility: v === "ALL" ? null : v,
      page: null,
    });

  const setSortBy = (v: string) =>
    updateParams({ sort: v === "newest" ? null : v, page: null });

  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "grid" ? null : v });

  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

  // ── Fetch Surveys ─────────────────────────────────────────────────────────
  const { data, loading, refetch } = useGetSurveys({
    variables: {
      input: {
        limit: 100,
        offset: 0,
        search: debouncedSearch.trim() || null,
        status: status === "ALL" ? null : status,
        memberEligibility:
          memberEligibility === "ALL" ? null : memberEligibility,
      },
    },
    fetchPolicy: "network-only",
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const [deleteSurvey, { loading: isDeleting }] = useDeleteSurvey({
    onCompleted: () => {
      toast.success(`${singularName} deleted successfully`);
      setSurveyToDelete(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || `Failed to delete ${singularName.toLowerCase()}`);
    },
  });

  const [editSurvey, { loading: isUpdating }] = useEditSurvey({
    onCompleted: () => {
      toast.success(`${singularName} updated successfully`);
      setEditingDetailsSurvey(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || `Failed to update ${singularName.toLowerCase()}`);
    },
  });

  const [publishSurvey] = usePublishSurvey({
    onCompleted: () => {
      toast.success(`${singularName} published successfully`);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || `Failed to publish ${singularName.toLowerCase()}`);
    },
  });

  const [draftSurvey] = useDraftSurvey({
    onCompleted: () => {
      toast.success(`${singularName} moved to draft successfully`);
      refetch();
    },
    onError: (error) => {
      toast.error(
        error.message || `Failed to move ${singularName.toLowerCase()} to draft`,
      );
    },
  });

  const [shareSurvey, { loading: isSharing }] = useShareSurveyAsFeed({
    onCompleted: () => {
      toast.success(`${singularName} shared to feed successfully`);
      setSharingSurvey(null);
      setShareDescription("");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || `Failed to share ${singularName.toLowerCase()}`);
    },
  });

  const handleUpdateDetails = () => {
    if (!editingDetailsSurvey || !canUpdate) return;
    editSurvey({
      variables: {
        id: editingDetailsSurvey.id,
        input: {
          title: details.title,
          description: details.description,
          startDate: details.startDate?.toISOString(),
          endDate: details.endDate?.toISOString(),
          eligibility: {
            memberEligibility: details.memberEligibility as any,
            membershipTierId:
              details.membershipTierId || details.eligibleTierIds || [],
            eligibleTierIds:
              details.eligibleTierIds || details.membershipTierId || [],
            eligibleUserIds: details.eligibleUserIds || [],
            eligibleSegmentIds: details.eligibleSegmentIds || [],
          },
        },
      },
    });
  };

  const isDateRangeInvalid =
    details.startDate && details.endDate
      ? !details.endDate.isAfter(details.startDate)
      : false;

  const canUpdate =
    !!details.title &&
    !!details.startDate &&
    !!details.endDate &&
    !isDateRangeInvalid &&
    !isUpdating;

  const allSurveys: Survey[] = data?.getSurveys?.surveys || [];
  const totalCount = allSurveys.length;

  // ── Filter and Sort Surveys ───────────────────────────────────────────────
  const filteredSurveys = useMemo(() => {
    let list = [...allSurveys];

    // Status filter
    if (status !== "ALL") {
      list = list.filter((s) => s.status === status);
    }

    // Eligibility filter
    if (memberEligibility !== "ALL") {
      list = list.filter((s) => {
        const ruleElig =
          s.eligibility?.memberEligibility ||
          s.eligibilityRule?.memberEligibility ||
          "ALL";
        return ruleElig === memberEligibility;
      });
    }

    // Search filter
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.title?.toLowerCase().includes(term) ||
          s.description?.toLowerCase().includes(term),
      );
    }

    // Sorting
    return list.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
          );
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        default:
          return 0;
      }
    });
  }, [allSurveys, status, debouncedSearch, sortBy]);

  // Paginated slice for current page
  const paginatedSurveys = useMemo(() => {
    return filteredSurveys.slice(offset, offset + limit);
  }, [filteredSurveys, offset, limit]);

  const pageTitle =
    status === "ALL"
      ? moduleName
      : `${status.charAt(0) + status.slice(1).toLowerCase()} ${moduleName}`;

  const availableColumns = useMemo(
    () =>
      getSurveyTableColumns(
        singularName,
        setEditingDetailsSurvey,
        setSurveyToDelete,
        (id) => publishSurvey({ variables: { publishSurveyId: id } }),
        (id) => draftSurvey({ variables: { draftSurveyId: id } }),
        setSharingSurvey,
        shareSurveyAsFeed,
        refetch,
      ),
    [
      singularName,
      publishSurvey,
      draftSurvey,
      shareSurveyAsFeed,
      refetch,
    ],
  );

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title={pageTitle}
        badgeText="Feedback & Forms"
        description={
          loading
            ? `Loading ${moduleName.toLowerCase()}…`
            : `${totalCount} total ${moduleName.toLowerCase()} in your feedback channels.`
        }
        icon={ClipboardList}
        breadcrumbs={[
          { label: moduleName, href: "/surveys/all" },
          { label: pageTitle },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/surveys/templates">
              <Button
                variant="outline"
                className="h-9 gap-1.5 rounded-lg border-border text-xs font-medium text-foreground hover:bg-muted"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Templates
              </Button>
            </Link>
          </div>
        }
      />

      {/* ── Action / Filter Bar ───────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        {/* Search */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={`Search ${moduleName.toLowerCase()}…`}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Status Filter */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v)}
            >
              <SelectTrigger className="w-[130px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <div className="flex items-center gap-2">
                  {STATUS_TABS.find((t) => t.value === status)?.dot && (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        STATUS_TABS.find((t) => t.value === status)?.dot,
                      )}
                    />
                  )}
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[140px]">
                {STATUS_TABS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {opt.dot && (
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full shrink-0",
                            opt.dot,
                          )}
                        />
                      )}
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          {/* Member Eligibility Filter */}
          <EcosystemActionBar.Item>
            <MemberEligibilitySelect
              value={memberEligibility}
              onValueChange={setMemberEligibility}
            />
          </EcosystemActionBar.Item>

          {/* Sort Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v)}
            >
              <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[145px]">
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        {/* Right controls */}
        <EcosystemActionBar.Group align="right">
          {/* Columns Toggle for List View */}
          {view === "list" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                  Toggle Columns
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableColumns
                  .filter((c) => c.key !== "actions")
                  .map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.key}
                      checked={visibleColumns[col.key] !== false}
                      onCheckedChange={() => toggleColumn(col.key)}
                      className="text-xs font-medium cursor-pointer"
                    >
                      {typeof col.header === "string" ? col.header : col.key}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Export Button */}
          <Button
            variant="outline"
            onClick={() => setShowExportModal(true)}
            className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Export
          </Button>

          {/* View Toggle */}
          <EcosystemActionBar.ViewToggle
            value={view}
            onChange={(v) => setView(v as "grid" | "list")}
            options={[
              { id: "grid", label: "Grid", icon: LayoutGrid },
              { id: "list", label: "List", icon: ListIcon },
            ]}
          />

          {/* Create CTA Button */}
          <Link href="/surveys/create">
            <CtaButton>
              <Plus className="h-3.5 w-3.5" />
              Create {singularName}
            </CtaButton>
          </Link>

          <EcosystemActionBar.Separator />

          {/* Live Status Count */}
          <EcosystemActionBar.Status active={filteredSurveys.length > 0}>
            Showing {filteredSurveys.length} of {totalCount} {moduleName}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Container ─────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Section Header (appears when filtered by non-ALL status) */}
        <SectionHeader
          status={status}
          count={filteredSurveys.length}
          loading={loading}
        />

        {/* Content Area (Grid vs List with Motion) */}
        <ContentArea
          view={view}
          loading={loading}
          surveys={paginatedSurveys}
          onEditDetails={setEditingDetailsSurvey}
          onDelete={setSurveyToDelete}
          onPublish={(id) => publishSurvey({ variables: { publishSurveyId: id } })}
          onDraft={(id) => draftSurvey({ variables: { draftSurveyId: id } })}
          onShare={setSharingSurvey}
          refetch={refetch}
          visibleColumns={visibleColumns}
          offset={offset}
        />

        {/* Pagination Controls */}
        {!loading && filteredSurveys.length > limit && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredSurveys.length / limit)}
              totalItems={filteredSurveys.length}
              pageSize={limit}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </EcosystemContainer>

      {/* ── Survey Details Sheet ──────────────────────────────────────────── */}
      <SurveySheet
        survey={editingDetailsSurvey}
        isOpen={!!editingDetailsSurvey}
        onClose={() => setEditingDetailsSurvey(null)}
        details={details}
        onDetailsChange={setDetails}
        onUpdate={handleUpdateDetails}
        isUpdating={isUpdating}
        isDateRangeInvalid={isDateRangeInvalid}
        canUpdate={canUpdate}
      />

      {/* ── Survey Dialogs (Delete / Share) ───────────────────────────────── */}
      <SurveyDialogs
        surveyToDelete={surveyToDelete}
        onCancelDelete={() => setSurveyToDelete(null)}
        onConfirmDelete={() => {
          if (surveyToDelete)
            deleteSurvey({ variables: { id: surveyToDelete } });
        }}
        isDeleting={isDeleting}
        sharingSurvey={sharingSurvey}
        onCancelShare={() => setSharingSurvey(null)}
        onConfirmShare={() => {
          if (sharingSurvey) {
            shareSurvey({
              variables: {
                surveyId: sharingSurvey.id,
                shouldShare: true,
                description: shareDescription,
              },
            });
          }
        }}
        isSharing={isSharing}
        shareDescription={shareDescription}
        onShareDescriptionChange={setShareDescription}
      />

      {/* ── Export Modal ─────────────────────────────────────────────────── */}
      <ExportSurveysModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        surveys={filteredSurveys}
        totalCount={totalCount}
        matchingCount={
          debouncedSearch.trim() || status !== "ALL"
            ? filteredSurveys.length
            : undefined
        }
      />
    </EcosystemWrapper>
  );
}

export default SurveysManage;
