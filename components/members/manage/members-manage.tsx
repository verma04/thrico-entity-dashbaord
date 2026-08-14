"use client";

import React, { useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { userTableColumns } from "./user-list";
import { useGetAllUser } from "@/graphql/actions/membership/membership-queries";
import { useDebounce } from "use-debounce";
import { useQuery } from "@apollo/client";
import { GET_MEMBERSHIP_TIERS } from "@/graphql/membership-tier";
import {
  Users,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
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
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { Pagination } from "@/components/shared/admin-table/admin-table";
import {
  SubscriptionLimitBanner,
  SubscriptionFallbackMessage,
  SubscriptionUpgradeBlock,
} from "./subscription-alerts";
import { AdvancedFiltersPanel } from "./advanced-filters-panel";
import {
  STATUS_TABS,
  StatusValue,
  SectionHeader,
  ContentArea,
} from "./members-manage-ui";

// ─────────────────────────────────────────────────────────────────────────────
// Main User component
// ─────────────────────────────────────────────────────────────────────────────

import { useGetIndustries } from "@/graphql/quries/industries/industry-queries";

const User = ({
  status: initialStatus,
  subscriptionInfo,
}: {
  status?: string;
  subscriptionInfo?: any;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── Helper: update URL search params without full page reload ──────────
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (
          value === null ||
          value === "" ||
          value === "ALL" ||
          value === "0"
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

  // ── Derive state from URL search params ────────────────────────────────
  const page = Number(searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  const status: StatusValue =
    (searchParams.get("status") as StatusValue) ||
    (initialStatus as StatusValue) ||
    "ALL";
  const selectedTier = searchParams.get("tier") || "ALL";
  const selectedIndustry = searchParams.get("industry") || "ALL";
  const view = (searchParams.get("view") as "grid" | "list") || "list";

  // Search still uses local state for instant typing, but syncs to URL on debounce
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(search, 500);

  // Sync debounced search to URL
  React.useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null, page: null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  // Advanced filter arrays from URL (comma-separated)
  const selectedLocations =
    searchParams.get("locations")?.split(",").filter(Boolean) || [];
  const selectedCompanies =
    searchParams.get("companies")?.split(",").filter(Boolean) || [];
  const selectedColleges =
    searchParams.get("colleges")?.split(",").filter(Boolean) || [];
  const selectedFunctions =
    searchParams.get("functions")?.split(",").filter(Boolean) || [];
  const selectedInterests =
    searchParams.get("interests")?.split(",").filter(Boolean) || [];
  const selectedSkills =
    searchParams.get("skills")?.split(",").filter(Boolean) || [];

  const [showFilters, setShowFilters] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      serial: true,
      member: true,
      contact: true,
      location: true,
      industries: true,
      membershipTier: true,
      wallet: true,
      points: true,
      rank: true,
      badges: true,
      impact: true,
      status: true,
      verification: true,
      joined: true,
      source: true,
      referrer: true,
      lastSession: true,
      actions: true,
    },
  );

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ── Setters that write to URL params ───────────────────────────────────
  const setStatus = (v: StatusValue) => updateParams({ status: v, page: null });
  const setSelectedTier = (v: string) => updateParams({ tier: v, page: null });
  const setSelectedIndustry = (v: string) =>
    updateParams({ industry: v, page: null });
  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "list" ? null : v });
  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

  const setSelectedLocations = (v: string[]) =>
    updateParams({ locations: v.length ? v.join(",") : null, page: null });
  const setSelectedCompanies = (v: string[]) =>
    updateParams({ companies: v.length ? v.join(",") : null, page: null });
  const setSelectedColleges = (v: string[]) =>
    updateParams({ colleges: v.length ? v.join(",") : null, page: null });
  const setSelectedFunctions = (v: string[]) =>
    updateParams({ functions: v.length ? v.join(",") : null, page: null });
  const setSelectedInterests = (v: string[]) =>
    updateParams({ interests: v.length ? v.join(",") : null, page: null });
  const setSelectedSkills = (v: string[]) =>
    updateParams({ skills: v.length ? v.join(",") : null, page: null });

  const { data: industryData } = useGetIndustries();
  const industries = industryData?.getIndustries || [];

  const { data: tiersData } = useQuery(GET_MEMBERSHIP_TIERS);
  const tiers = tiersData?.getMembershipTiers || [];

  const { data, loading } = useGetAllUser({
    status: status === "ALL" ? "ALL" : status,
    industryId: selectedIndustry === "ALL" ? null : selectedIndustry,
    membershipTierId: selectedTier === "ALL" ? null : selectedTier,
    search: debouncedSearch.trim() || null,
    limit,
    offset,
    location: selectedLocations.length > 0 ? selectedLocations : null,
    company: selectedCompanies.length > 0 ? selectedCompanies : null,
    college: selectedColleges.length > 0 ? selectedColleges : null,
    functionTitle: selectedFunctions.length > 0 ? selectedFunctions : null,
    interestTitle: selectedInterests.length > 0 ? selectedInterests : null,
    skillName: selectedSkills.length > 0 ? selectedSkills : null,
  });

  const rawUsersList = data?.getAllUser?.data || [];

  const totalCount = data?.getAllUser?.totalCount || 0;
  const isLoading = loading;

  const hasActiveFilters =
    selectedIndustry !== "ALL" ||
    selectedLocations.length > 0 ||
    selectedCompanies.length > 0 ||
    selectedColleges.length > 0 ||
    selectedFunctions.length > 0 ||
    selectedInterests.length > 0 ||
    selectedSkills.length > 0;

  const clearAllFilters = () => {
    setSelectedIndustry("ALL");
    setSelectedLocations([]);
    setSelectedCompanies([]);
    setSelectedColleges([]);
    setSelectedFunctions([]);
    setSelectedInterests([]);
    setSelectedSkills([]);
  };

  const effectiveTotalCount = subscriptionInfo?.maxUsersAllowed
    ? Math.min(totalCount, subscriptionInfo.maxUsersAllowed)
    : totalCount;

  const pageTitle =
    status === "ALL"
      ? "Members"
      : `${status.charAt(0) + status.slice(1).toLowerCase()} Members`;

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title={pageTitle}
        badgeText="Member List"
        description={
          isLoading
            ? "Loading members…"
            : `${totalCount} total members in your community.`
        }
        icon={Users}
        breadcrumbs={[
          { label: "Members", href: "/members/all" },
          { label: pageTitle },
        ]}
      />

      {/* ── Action / Filter Bar ───────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search by name or email…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Primary filters */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as StatusValue)}
            >
              <SelectTrigger className="w-[130px] h-6 rounded-md border-border bg-card text-[11px] font-semibold text-foreground shadow-none focus:ring-2 focus:ring-ring/20">
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
              <SelectContent className="rounded-xl border-border shadow-lg p-1">
                {STATUS_TABS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="rounded-md text-[11px] font-semibold py-1"
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

          <EcosystemActionBar.Item>
            <Select
              value={selectedTier}
              onValueChange={(v) => setSelectedTier(v)}
            >
              <SelectTrigger className="w-[130px] h-6 rounded-md border-border bg-card text-[11px] font-semibold text-foreground shadow-none focus:ring-2 focus:ring-ring/20">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-lg p-1">
                <SelectItem
                  value="ALL"
                  className="rounded-md text-[11px] font-semibold py-1"
                >
                  All Tiers
                </SelectItem>
                {tiers.map((tier: any) => (
                  <SelectItem
                    key={tier.id}
                    value={tier.id}
                    className="rounded-md text-[11px] font-semibold py-1"
                  >
                    <div className="flex items-center gap-1.5">
                      {tier.badgeIcon && (
                        <span className="text-xs">{tier.badgeIcon}</span>
                      )}
                      {tier.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "h-6 px-2.5 rounded-md text-[11px] font-semibold gap-1.5 transition-all",
                showFilters
                  ? "bg-primary text-primary-foreground"
                  : "border-border",
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
              {hasActiveFilters && (
                <span className="ml-0.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                  {
                    [
                      ...(selectedIndustry !== "ALL" ? [selectedIndustry] : []),
                      ...selectedLocations,
                      ...selectedCompanies,
                      ...selectedColleges,
                      ...selectedFunctions,
                      ...selectedInterests,
                      ...selectedSkills,
                    ].length
                  }
                </span>
              )}
            </Button>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          {view === "list" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 gap-2 shrink-0 bg-card border-border shadow-none text-[11px] font-semibold text-foreground px-2"
                >
                  <SlidersHorizontal className="h-3 w-3" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                  Toggle Columns
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userTableColumns
                  .filter((c) => c.key !== "actions")
                  .map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.key}
                      checked={visibleColumns[col.key] !== false}
                      onCheckedChange={() => toggleColumn(col.key)}
                      className="text-xs font-medium cursor-pointer"
                    >
                      {col.header || col.key}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <EcosystemActionBar.ViewToggle
            value={view}
            onChange={setView}
            options={[
              { id: "grid", label: "Grid", icon: LayoutGrid },
              { id: "list", label: "List", icon: ListIcon },
            ]}
          />
          <EcosystemActionBar.Separator />
          <EcosystemActionBar.Status active={rawUsersList.length > 0}>
            Showing {rawUsersList.length} of {totalCount} Members
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Expanded Filters Panel ───────────────────────────────────────── */}
      <AdvancedFiltersPanel
        showFilters={showFilters}
        hasActiveFilters={hasActiveFilters}
        clearAllFilters={clearAllFilters}
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        industries={industries}
        selectedLocations={selectedLocations}
        setSelectedLocations={setSelectedLocations}
        selectedCompanies={selectedCompanies}
        setSelectedCompanies={setSelectedCompanies}
        selectedColleges={selectedColleges}
        setSelectedColleges={setSelectedColleges}
        selectedFunctions={selectedFunctions}
        setSelectedFunctions={setSelectedFunctions}
        selectedInterests={selectedInterests}
        setSelectedInterests={setSelectedInterests}
        selectedSkills={selectedSkills}
        setSelectedSkills={setSelectedSkills}
      />

      {/* Subscription Limit Warning Banner */}
      <SubscriptionLimitBanner subscriptionInfo={subscriptionInfo} />

      {/* Fallback to getAllUser message if no subscriptionInfo */}
      <SubscriptionFallbackMessage
        subscriptionInfo={subscriptionInfo}
        message={data?.getAllUser?.message}
      />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Section heading (non-ALL statuses only) */}
        <SectionHeader status={status} count={totalCount} loading={loading} />

        <ContentArea
          view={view}
          loading={isLoading}
          users={rawUsersList}
          visibleColumns={visibleColumns}
          offset={offset}
        />

        {/* Pagination Controls */}
        {!isLoading && effectiveTotalCount > 0 && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(effectiveTotalCount / limit)}
              totalItems={effectiveTotalCount}
              pageSize={limit}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}

        {/* Upgrade Block Bar */}
        <SubscriptionUpgradeBlock
          subscriptionInfo={subscriptionInfo}
          totalCount={totalCount}
          isLoading={isLoading}
        />
      </EcosystemContainer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </EcosystemWrapper>
  );
};

export default User;
