"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import {
  GraduationCap,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Upload,
  Plus,
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
import { cn } from "@/lib/utils";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { Pagination } from "@/components/shared/admin-table/admin-table";
import { useModuleStore } from "@/store/useModuleStore";

import {
  useGetAllMentor,
  useGetMentorCategories,
  Mentor,
} from "@/graphql/mentorship/mentorship-quiries";
import { MentorEditor } from "../mentor-editor";
import {
  STATUS_TABS,
  SORT_OPTIONS,
  MentorStatusValue,
  SectionHeader,
  ContentArea,
} from "./mentors-manage-ui";
import { getMentorTableColumns } from "./mentors-list";
import { ExportMentorsModal } from "./export-mentors-modal";

export interface MentorsManageProps {
  status?: string;
}

export function MentorsManage({ status: initialStatus }: MentorsManageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const moduleName = useModuleStore((state) => state.mentorshipModuleName);
  const singularName = useModuleStore((state) => state.mentorshipSingularName);

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

  const selectedCategory = searchParams.get("category") || "ALL";
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

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Column visibility for List view
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    serial: true,
    mentor: true,
    category: true,
    skills: true,
    status: true,
    topMentor: true,
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

  const setSelectedCategory = (v: string) =>
    updateParams({ category: v === "ALL" ? null : v, page: null });

  const setSortBy = (v: string) =>
    updateParams({ sort: v === "newest" ? null : v, page: null });

  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "grid" ? null : v });

  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

  // ── Fetch Mentors & Categories ────────────────────────────────────────────
  const { data: mentorsData, loading, refetch } = useGetAllMentor({
    variables: {
      input: {
        status: status === "ALL" ? undefined : status,
        category: selectedCategory === "ALL" ? undefined : selectedCategory,
        limit: 100,
        offset: 0,
      },
    },
    fetchPolicy: "network-only",
  });

  const { data: categoriesData } = useGetMentorCategories();
  const categories = categoriesData?.getMentorCategories || [];

  const rawMentors = mentorsData?.getAllMentor || [];
  const totalCount = rawMentors.length;

  const handleEdit = (mentor: Mentor) => {
    setEditingMentor(mentor);
    setIsEditorOpen(true);
  };

  // ── Filter and Sort Mentors ───────────────────────────────────────────────
  const mentors = useMemo(() => {
    return rawMentors.map((m: any) => ({
      ...m,
      name:
        m.displayName ||
        `${m.mentorUser?.user?.firstName || ""} ${m.mentorUser?.user?.lastName || ""}`.trim() ||
        "Anonymous",
      image: m.mentorUser?.user?.avatar
        ? `https://cdn.thrico.network/${m.mentorUser?.user?.avatar}`
        : undefined,
      title: m.intro || "Mentor",
      categoryName: m.category?.title || "Uncategorized",
      status: m.isApproved ? "approved" : m.isRequested ? "pending" : "rejected",
      expertise: m.skills || [],
    }));
  }, [rawMentors]);

  const filteredMentors = useMemo(() => {
    let list = [...mentors];

    // Status filter
    if (status !== "ALL") {
      const matchKey = status.toLowerCase();
      list = list.filter((m) => m.status === matchKey);
    }

    // Category filter
    if (selectedCategory !== "ALL") {
      list = list.filter(
        (m) =>
          m.category?.id === selectedCategory ||
          m.category?.title === selectedCategory,
      );
    }

    // Search filter
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name?.toLowerCase().includes(term) ||
          m.title?.toLowerCase().includes(term) ||
          m.about?.toLowerCase().includes(term) ||
          m.categoryName?.toLowerCase().includes(term) ||
          m.mentorUser?.user?.email?.toLowerCase().includes(term) ||
          m.expertise?.some((s: string) => s.toLowerCase().includes(term)),
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
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        default:
          return 0;
      }
    });
  }, [mentors, status, selectedCategory, debouncedSearch, sortBy]);

  // Paginated slice for current page
  const paginatedMentors = useMemo(() => {
    return filteredMentors.slice(offset, offset + limit);
  }, [filteredMentors, offset, limit]);

  const pageTitle =
    status === "ALL"
      ? `${moduleName} Network`
      : `${status.charAt(0) + status.slice(1).toLowerCase()} ${moduleName}`;

  const availableColumns = useMemo(
    () => getMentorTableColumns(singularName, handleEdit, refetch),
    [singularName, handleEdit, refetch],
  );

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title={pageTitle}
        badgeText="Expert Network"
        description={
          loading
            ? `Loading ${singularName.toLowerCase()}s…`
            : `${totalCount} total ${singularName.toLowerCase()}s in your expert directory.`
        }
        icon={GraduationCap}
        breadcrumbs={[
          { label: moduleName, href: "/mentorship/all" },
          { label: "All Mentors" },
        ]}
      />

      {/* ── Action / Filter Bar ───────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        {/* Search */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={`Search ${singularName.toLowerCase()}s by name, skill…`}
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

          {/* Category Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={selectedCategory}
              onValueChange={(v) => setSelectedCategory(v)}
            >
              <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[150px]">
                <SelectItem
                  value="ALL"
                  className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                >
                  All Categories
                </SelectItem>
                {categories.map((cat: any) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id}
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          {/* Sort Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v)}
            >
              <SelectTrigger className="w-[130px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[140px]">
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

          {/* Onboard CTA Button */}
          <Link href="/mentorship/add-mentor">
            <CtaButton>
              <Plus className="h-3.5 w-3.5" />
              Onboard {singularName}
            </CtaButton>
          </Link>

          <EcosystemActionBar.Separator />

          {/* Live Status Count */}
          <EcosystemActionBar.Status active={filteredMentors.length > 0}>
            Showing {filteredMentors.length} of {totalCount} {singularName}s
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Container ─────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Section Header (appears when filtered by non-ALL status) */}
        <SectionHeader
          status={status}
          count={filteredMentors.length}
          loading={loading}
        />

        {/* Content Area (Grid vs List with Motion) */}
        <ContentArea
          view={view}
          loading={loading}
          mentors={paginatedMentors}
          onEdit={handleEdit}
          refetch={refetch}
          visibleColumns={visibleColumns}
          offset={offset}
        />

        {/* Pagination Controls */}
        {!loading && filteredMentors.length > limit && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredMentors.length / limit)}
              totalItems={filteredMentors.length}
              pageSize={limit}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </EcosystemContainer>

      {/* ── Editor Modal ─────────────────────────────────────────────────── */}
      <MentorEditor
        mentor={editingMentor}
        open={isEditorOpen}
        onOpenChange={(open) => {
          setIsEditorOpen(open);
          if (!open) setEditingMentor(null);
        }}
        onRefetch={refetch}
      />

      {/* ── Export Modal ─────────────────────────────────────────────────── */}
      <ExportMentorsModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        mentors={filteredMentors}
        totalCount={totalCount}
        matchingCount={
          debouncedSearch.trim() ||
          status !== "ALL" ||
          selectedCategory !== "ALL"
            ? filteredMentors.length
            : undefined
        }
      />
    </EcosystemWrapper>
  );
}

export default MentorsManage;
