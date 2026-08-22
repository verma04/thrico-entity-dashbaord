"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  Ticket,
  Plus,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Upload,
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
import { useModuleStore } from "@/store/useModuleStore";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { Pagination } from "@/components/shared/admin-table/admin-table";
import { InlineAlert } from "@/components/ui/inline-alert";

import { useGetRewards, useUploadVouchers } from "@/graphql/actions/rewards";
import {
  STATUS_TABS,
  MECHANISM_OPTIONS,
  SORT_OPTIONS,
  RewardStatusValue,
  SectionHeader,
  ContentArea,
} from "./coupons-manage-ui";
import { getRewardTableColumns } from "./coupons-list";
import { ExportCouponsModal } from "./export-coupons-modal";
import { BatchUploadDialog } from "../batch-upload-dialog";

export interface CouponsManageProps {
  status?: string;
}

export function CouponsManage({ status: initialStatus }: CouponsManageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rewardsModuleName = useModuleStore((state) => state.rewardsModuleName || "Rewards");

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

  const mechanism = searchParams.get("mechanism") || "ALL";
  const eligibility = searchParams.get("eligibility") || "ALL";
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

  // Batch Upload States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadRewardId, setUploadRewardId] = useState("");
  const [uploadStep, setUploadStep] = useState<"idle" | "validating" | "summary">("idle");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [validCount, setValidCount] = useState(0);
  const [invalidCount, setInvalidCount] = useState(0);
  const [uploadData, setUploadData] = useState<any[]>([]);

  // Column visibility for List view
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    serial: true,
    reward: true,
    mechanism: true,
    cost: true,
    inventory: true,
    redeemed: true,
    eligibility: true,
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

  const setMechanism = (v: string) =>
    updateParams({ mechanism: v === "ALL" ? null : v, page: null });

  const setSortBy = (v: string) =>
    updateParams({ sort: v === "newest" ? null : v, page: null });

  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "grid" ? null : v });

  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

  // ── Fetch Rewards ─────────────────────────────────────────────────────────
  const {
    data: rewardsData,
    loading: rewardsLoading,
    refetch,
  } = useGetRewards({
    pagination: { page: 1, limit: 200 },
  });

  const [uploadVouchers, { loading: uploading }] = useUploadVouchers();

  const rawRewards = rewardsData?.getRewards || [];

  // ── Filter and Sort Rewards ───────────────────────────────────────────────
  const filteredRewards = useMemo(() => {
    let list = [...rawRewards];

    // Status filter
    if (status === "ACTIVE") {
      list = list.filter((r) => r.isActive);
    } else if (status === "INACTIVE") {
      list = list.filter((r) => !r.isActive);
    }

    // Mechanism filter
    if (mechanism !== "ALL") {
      list = list.filter((r) => {
        const mechs = Array.isArray(r.rewardMechanism)
          ? r.rewardMechanism
          : [r.rewardMechanism || "COUPON"];
        return mechs.includes(mechanism);
      });
    }

    // Eligibility filter
    if (eligibility !== "ALL") {
      list = list.filter((r) => (r.memberEligibility || "ALL") === eligibility);
    }

    // Search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.id?.toLowerCase().includes(q),
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
        case "cost-desc":
          return (b.tcCost ?? 0) - (a.tcCost ?? 0);
        case "cost-asc":
          return (a.tcCost ?? 0) - (b.tcCost ?? 0);
        case "redeemed-desc":
          return (b.redeemedCount ?? 0) - (a.redeemedCount ?? 0);
        default:
          return 0;
      }
    });
  }, [rawRewards, status, mechanism, debouncedSearch, sortBy]);

  // Paginated slice for current page
  const paginatedRewards = useMemo(() => {
    return filteredRewards.slice(offset, offset + limit);
  }, [filteredRewards, offset, limit]);

  const handleCreate = () => {
    router.push("/gamification/rewards/coupons/create");
  };

  const handleManageVouchers = (rewardId: string) => {
    router.push(`/gamification/rewards/coupons/${rewardId}/manage-voucher`);
  };

  const openUploadForReward = (rewardId: string) => {
    setUploadRewardId(rewardId);
    setIsUploadOpen(true);
  };

  // Batch Upload Handlers
  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setUploadStep("validating");

    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean);
        if (lines.length < 2) {
          setUploadData([]);
          setValidCount(0);
          setInvalidCount(0);
          setUploadStep("summary");
          return;
        }

        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const codeIndex = headers.indexOf("code");
        const cardIndex = headers.indexOf("cardnumber");
        const pinIndex = headers.indexOf("pin");

        const data = lines
          .slice(1)
          .map((line) => {
            const parts = line.split(",").map((p) => p.trim());
            const code = codeIndex !== -1 ? parts[codeIndex] : parts[0];
            const cardNumber = cardIndex !== -1 ? parts[cardIndex] : undefined;
            const pin = pinIndex !== -1 ? parts[pinIndex] : undefined;
            return {
              code: code || "",
              cardNumber: cardNumber || null,
              pin: pin || null,
            };
          })
          .filter((item) => item.code);

        setUploadData(data);
        setValidCount(data.length);
        setInvalidCount(0);
        setUploadStep("summary");
      };
      reader.readAsText(file);
    }, 1500);
  };

  const downloadTemplate = () => {
    const csvContent =
      "code,cardNumber,pin\nVOUCHER-123,6034123456789999,847291\nVOUCHER-456,,";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vouchers_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const confirmUpload = async () => {
    if (!uploadRewardId) {
      toast.error("Please select a target reward");
      return;
    }

    try {
      await uploadVouchers({
        variables: {
          input: {
            rewardId: uploadRewardId,
            vouchers: uploadData,
          },
        },
      });
      toast.success("Vouchers Ingested", {
        description: `${validCount} vouchers successfully added to inventory.`,
      });
      resetUpload();
      setIsUploadOpen(false);
      refetch();
    } catch (err: any) {
      toast.error("Ingestion Failure", {
        description: err.message || "Failed to upload vouchers.",
      });
    }
  };

  const resetUpload = () => {
    setUploadStep("idle");
    setUploadedFile(null);
    setValidCount(0);
    setUploadData([]);
  };

  const pageTitle =
    status === "ALL"
      ? `${rewardsModuleName} & Vouchers`
      : `${status.charAt(0) + status.slice(1).toLowerCase()} ${rewardsModuleName}`;

  const availableColumns = useMemo(
    () => getRewardTableColumns(openUploadForReward, handleManageVouchers),
    [],
  );

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title={pageTitle}
        badgeText="Economic Hub"
        description={`Monitor ${rewardsModuleName.toLowerCase()} distribution lifecycle, manage voucher credentials and inventory stock levels.`}
        icon={Ticket}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification/points-and-badges" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Coupons" },
        ]}
        actions={
          <CtaButton onClick={handleCreate}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            New Reward
          </CtaButton>
        }
      />

      {/* ── Notice Alert ─────────────────────────────────────────────────── */}
      <div className="space-y-4 px-3">
        <InlineAlert
          variant="alert"
          message="Voucher credentials are encrypted and automatically assigned on member claim. Ensure sufficient inventory stock is maintained for active rewards."
          className="rounded-xl"
        />
      </div>

      {/* ── Action / Filter Bar ───────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        {/* Search */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="w-full sm:w-60">
            <EcosystemActionBar.Search
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by title, description…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Filters Group */}
        <EcosystemActionBar.Group>
          {/* Mechanism Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={mechanism}
              onValueChange={(v) => setMechanism(v)}
            >
              <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Mechanism" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[160px]">
                {MECHANISM_OPTIONS.map((opt) => (
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

          {/* Status Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v)}
            >
              <SelectTrigger className="w-[125px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
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

          {/* Eligibility Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={eligibility}
              onValueChange={(v) => updateParams({ eligibility: v, page: null })}
            >
              <SelectTrigger className="w-[135px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Eligibility" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[160px]">
                <SelectItem
                  value="ALL"
                  className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                >
                  All Eligibilities
                </SelectItem>
                <SelectItem
                  value="VERIFIED"
                  className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                >
                  Verified Only
                </SelectItem>
                <SelectItem
                  value="TIERS"
                  className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                >
                  Specific Tiers
                </SelectItem>
                <SelectItem
                  value="SPECIFIC_CUSTOMERS"
                  className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                >
                  Specific Customers
                </SelectItem>
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
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[170px]">
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

          <EcosystemActionBar.Separator />

          {/* Live Status Count */}
          <EcosystemActionBar.Status active={filteredRewards.length > 0}>
            Showing {filteredRewards.length} of {rawRewards.length} Rewards
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Container ─────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Section Header (appears when filtered by non-ALL status) */}
        <SectionHeader
          status={status}
          count={filteredRewards.length}
          loading={rewardsLoading}
        />

        {/* Content Area (Grid vs List with Motion) */}
        <ContentArea
          view={view}
          loading={rewardsLoading}
          rewards={paginatedRewards}
          onOpenUploadForReward={openUploadForReward}
          onManageVouchers={handleManageVouchers}
          visibleColumns={visibleColumns}
          offset={offset}
        />

        {/* Pagination Controls */}
        {!rewardsLoading && filteredRewards.length > limit && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredRewards.length / limit)}
              totalItems={filteredRewards.length}
              pageSize={limit}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </EcosystemContainer>

      {/* ── Batch Upload Dialog ───────────────────────────────────────────── */}
      <BatchUploadDialog
        isOpen={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        uploadRewardId={uploadRewardId}
        setUploadRewardId={setUploadRewardId}
        inventoryItems={rawRewards}
        uploadStep={uploadStep}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        fileInputRef={fileInputRef}
        handleFileSelect={handleFileSelect}
        downloadTemplate={downloadTemplate}
        uploadedFile={uploadedFile}
        validCount={validCount}
        invalidCount={invalidCount}
        resetUpload={resetUpload}
        confirmUpload={confirmUpload}
        uploading={uploading}
      />

      {/* ── Export Modal ─────────────────────────────────────────────────── */}
      <ExportCouponsModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        rewards={filteredRewards}
        totalCount={rawRewards.length}
        matchingCount={
          debouncedSearch.trim() || status !== "ALL" || mechanism !== "ALL"
            ? filteredRewards.length
            : undefined
        }
      />
    </EcosystemWrapper>
  );
}

export default CouponsManage;
