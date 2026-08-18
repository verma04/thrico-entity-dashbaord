"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  Award,
  Plus,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Upload,
  Settings,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
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
import { InlineAlert } from "@/components/ui/inline-alert";

import {
  useGetEntityGamificationModules,
  useGetBadges,
  useToggleBadge,
  Badge,
} from "@/graphql/actions";
import {
  STATUS_TABS,
  SORT_OPTIONS,
  BadgeStatusValue,
  SectionHeader,
  ContentArea,
} from "./badges-manage-ui";
import { getBadgeTableColumns } from "./badges-table-list";
import { BadgeStats } from "./badge-stats";
import { BadgeNotificationModal } from "./badge-notification-modal";
import { ExportBadgesModal } from "./export-badges-modal";

export interface BadgesManagerProps {
  status?: string;
}

export function BadgesManager({ status: initialStatus }: BadgesManagerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  const selectedModule = searchParams.get("module") || "ALL";
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
  const [showExportModal, setShowExportModal] = useState(false);
  const [notificationModalBadge, setNotificationModalBadge] =
    useState<Badge | null>(null);

  // Column visibility for List view
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    serial: true,
    badge: true,
    source: true,
    origin: true,
    criteria: true,
    notifications: true,
    status: true,
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

  const setSelectedModule = (v: string) =>
    updateParams({ module: v === "ALL" ? null : v, page: null });

  const setSortBy = (v: string) =>
    updateParams({ sort: v === "newest" ? null : v, page: null });

  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "grid" ? null : v });

  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

  // ── Fetch Data ────────────────────────────────────────────────────────────
  const { data: gamificationModulesData } = useGetEntityGamificationModules({});

  const {
    data: badgesData,
    refetch: refetchBadges,
    loading: badgesLoading,
  } = useGetBadges();

  const [toggleBadge, { loading: toggling }] = useToggleBadge({
    onCompleted: () => {
      refetchBadges();
      toast.success("Badge status updated");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleToggleActive = async (id: string) => {
    await toggleBadge({ variables: { id } });
  };

  const badges = (badgesData?.getBadges || []) as Badge[];

  const subscriptionSources = useMemo(() => {
    const modules =
      gamificationModulesData?.getEntityGamificationModules?.modules || [];
    const integrations =
      gamificationModulesData?.getEntityGamificationModules?.integrations || [];

    const formattedModules = modules.map((m: any) => ({
      id: m.id,
      uuid: m.uuid,
      name: m.name ? m.name.charAt(0).toUpperCase() + m.name.slice(1) : m.name,
      icon: m.icon || "Settings",
      type: "MODULE" as const,
    }));

    const formattedIntegrations = integrations.map((i: any) => ({
      id: i.id,
      uuid: i.uuid,
      slug: i.slug,
      name: i.name ? i.name.charAt(0).toUpperCase() + i.name.slice(1) : i.name,
      icon: i.icon || "Boxes",
      type: "INTEGRATION" as const,
    }));

    const allSources = [...formattedModules, ...formattedIntegrations];
    const seen = new Set<string>();
    const uniqueSources: typeof allSources = [];
    for (const source of allSources) {
      const key = (source.id || source.uuid || source.slug || source.name || "").toLowerCase();
      if (key && !seen.has(key)) {
        seen.add(key);
        uniqueSources.push(source);
      }
    }

    return uniqueSources;
  }, [gamificationModulesData]);

  // ── Filter and Sort Badges ────────────────────────────────────────────────
  const filteredBadges = useMemo(() => {
    let list = [...badges];

    // Status filter
    if (status === "ACTIVE") {
      list = list.filter((b) => b.isActive);
    } else if (status === "DISABLED") {
      list = list.filter((b) => !b.isActive);
    }

    // Module filter
    if (selectedModule === "SOURCE_MODULE") {
      list = list.filter((b) => {
        const moduleInfo = subscriptionSources.find(
          (s) =>
            s.id?.toLowerCase() === b.module?.toLowerCase() ||
            s.uuid?.toLowerCase() === b.module?.toLowerCase() ||
            (s as any).slug?.toLowerCase() === b.module?.toLowerCase(),
        );
        const source = b.source || moduleInfo?.type || "MODULE";
        return source === "MODULE";
      });
    } else if (selectedModule === "SOURCE_INTEGRATION") {
      list = list.filter((b) => {
        const moduleInfo = subscriptionSources.find(
          (s) =>
            s.id?.toLowerCase() === b.module?.toLowerCase() ||
            s.uuid?.toLowerCase() === b.module?.toLowerCase() ||
            (s as any).slug?.toLowerCase() === b.module?.toLowerCase(),
        );
        const source = b.source || moduleInfo?.type || "MODULE";
        return source === "INTEGRATION";
      });
    } else if (selectedModule !== "ALL") {
      list = list.filter(
        (b) =>
          b.module?.toLowerCase() === selectedModule.toLowerCase() ||
          subscriptionSources.find(
            (s) => s.id?.toLowerCase() === selectedModule.toLowerCase(),
          )?.uuid?.toLowerCase() === b.module?.toLowerCase() ||
          subscriptionSources.find(
            (s) => s.uuid?.toLowerCase() === selectedModule.toLowerCase(),
          )?.id?.toLowerCase() === b.module?.toLowerCase() ||
          subscriptionSources.find(
            (s) => (s as any).slug?.toLowerCase() === selectedModule.toLowerCase(),
          )?.id?.toLowerCase() === b.module?.toLowerCase() ||
          subscriptionSources.find(
            (s) => (s as any).slug?.toLowerCase() === selectedModule.toLowerCase(),
          )?.uuid?.toLowerCase() === b.module?.toLowerCase(),
      );
    }

    // Search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.name?.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q) ||
          b.action?.toLowerCase().includes(q) ||
          b.module?.toLowerCase().includes(q) ||
          b.source?.toLowerCase().includes(q),
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
        case "points":
          return (
            (b.points || b.targetValue || 0) - (a.points || a.targetValue || 0)
          );
        default:
          return 0;
      }
    });
  }, [badges, status, selectedModule, debouncedSearch, sortBy, subscriptionSources]);

  // Paginated slice for current page
  const paginatedBadges = useMemo(() => {
    return filteredBadges.slice(offset, offset + limit);
  }, [filteredBadges, offset, limit]);

  const handleCreate = () => {
    router.push("/gamification/points-and-badges/badges/create");
  };

  const handleEdit = (badge: Badge) => {
    router.push(`/gamification/points-and-badges/badges/edit/${badge.id}`);
  };

  const pageTitle =
    status === "ALL"
      ? "Badges"
      : `${status.charAt(0) + status.slice(1).toLowerCase()} Badges`;

  const availableColumns = useMemo(
    () =>
      getBadgeTableColumns(
        subscriptionSources,
        handleEdit,
        setNotificationModalBadge,
        handleToggleActive,
        toggling,
      ),
    [subscriptionSources, toggling],
  );

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title={pageTitle}
        badgeText="Recognition"
        description={
          badgesLoading
            ? "Loading badges…"
            : `${badges.length} total recognition badges across your ecosystem.`
        }
        icon={Award}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification/points-and-badges" },
          { label: "Badges" },
        ]}
        actions={
          <CtaButton onClick={handleCreate}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Badge
          </CtaButton>
        }
      />

      {/* ── Stats Cards & Notice Alert ────────────────────────────────────── */}
      <div className="space-y-4 px-3">
        <BadgeStats badges={badges} />

        <InlineAlert
          variant="alert"
          message="Badges are permanent records once issued to members. To stop issuing a badge without affecting existing recipients, safely disable it via the status toggle."
          className="rounded-xl"
        />
      </div>

      {/* ── Action / Filter Bar ───────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        {/* Search */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by name, module, or criteria…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Filters Group */}
        <EcosystemActionBar.Group>
          {/* Module Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={selectedModule}
              onValueChange={(val) => setSelectedModule(val)}
            >
              <SelectTrigger className="w-[150px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[170px] max-h-72">
                <SelectItem
                  value="ALL"
                  className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                >
                  All Modules & Integrations
                </SelectItem>
                <SelectItem
                  value="SOURCE_MODULE"
                  className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                >
                  All Modules
                </SelectItem>
                {subscriptionSources.some((s) => s.type === "INTEGRATION") && (
                  <SelectItem
                    value="SOURCE_INTEGRATION"
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    All Integrations
                  </SelectItem>
                )}
                <DropdownMenuSeparator className="my-1" />
                {subscriptionSources.map((m) => (
                  <SelectItem
                    key={m.id}
                    value={m.id}
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    {m.name}
                    {m.type === "INTEGRATION" ? " (Integration)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          {/* Status Filter */}
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

          {/* Sort Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v)}
            >
              <SelectTrigger className="w-[150px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[160px]">
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

          {/* Add Badge CTA Button */}
          <CtaButton onClick={handleCreate}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Badge
          </CtaButton>

          <EcosystemActionBar.Separator />

          {/* Live Status Count */}
          <EcosystemActionBar.Status active={filteredBadges.length > 0}>
            Showing {filteredBadges.length} of {badges.length} Badges
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Container ─────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Section Header (appears when filtered by non-ALL status) */}
        <SectionHeader
          status={status}
          count={filteredBadges.length}
          loading={badgesLoading}
        />

        {/* Content Area (Grid vs List with Motion) */}
        <ContentArea
          view={view}
          loading={badgesLoading}
          badges={paginatedBadges}
          modules={subscriptionSources}
          onEdit={handleEdit}
          onOpenNotifications={setNotificationModalBadge}
          onToggleActive={handleToggleActive}
          toggling={toggling}
          visibleColumns={visibleColumns}
          offset={offset}
        />

        {/* Pagination Controls */}
        {!badgesLoading && filteredBadges.length > limit && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredBadges.length / limit)}
              totalItems={filteredBadges.length}
              pageSize={limit}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </EcosystemContainer>

      {/* ── Notification Edit Modal ───────────────────────────────────────── */}
      <BadgeNotificationModal
        badge={notificationModalBadge}
        open={!!notificationModalBadge}
        onOpenChange={(open) => !open && setNotificationModalBadge(null)}
        onSuccess={() => {
          refetchBadges();
        }}
      />

      {/* ── Export Modal ─────────────────────────────────────────────────── */}
      <ExportBadgesModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        badges={filteredBadges}
        totalCount={badges.length}
        matchingCount={
          debouncedSearch.trim() || status !== "ALL" || selectedModule !== "ALL"
            ? filteredBadges.length
            : undefined
        }
      />
    </EcosystemWrapper>
  );
}

export default BadgesManager;
