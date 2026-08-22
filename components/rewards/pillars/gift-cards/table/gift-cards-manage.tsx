"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  Gift,
  Plus,
  Upload,
  Layers,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Zap,
  Wallet,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { Pagination } from "@/components/shared/admin-table/admin-table";
import {
  GIFT_CARD_STATUS_TABS,
  GiftCardStatusValue,
  SectionHeader,
  ContentArea,
} from "./gift-card-manage-ui";
import { GiftCardRuleItem, GiftCardIssuanceRecord } from "../types";
import { GiftCardGrid } from "./gift-card-grid";
import { GiftCardList } from "./gift-card-list";
import { GiftCardLedgerList } from "./gift-card-ledger-list";
import { ExportGiftCardsModal } from "./export-gift-cards-modal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGetDigitalCardRules,
  useDeleteDigitalCardRule,
  useGetRewardIssuances,
} from "@/graphql/actions/rewards/gift-cards";



const DEFAULT_GIFT_CARD_RULES: GiftCardRuleItem[] = [];
const INITIAL_LEDGER: GiftCardIssuanceRecord[] = [];



interface GiftCardsManageProps {
  walletBalance: number;
  onDeductBalance: (amount: number) => void;
  onTopUpClick: () => void;
  onCreateClick?: () => void;
  onEditClick?: (reward: GiftCardRuleItem) => void;
}

export const GiftCardsManage: React.FC<GiftCardsManageProps> = ({
  walletBalance,
  onDeductBalance,
  onTopUpClick,
  onCreateClick,
  onEditClick,
}) => {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Helper: update URL query params seamlessly
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
    [searchParams, pathname, router]
  );

  // Derive state from URL or fallbacks
  const view = (searchParams.get("view") as "grid" | "list") || "grid";
  const status = (searchParams.get("status") as GiftCardStatusValue) || "ALL";
  const page = Number(searchParams.get("page") || "1");
  const limit = 12;

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(search, 300);

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null, page: null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  // Table Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    serial: true,
    offer: true,
    denomination: true,
    cost: true,
    category: true,
    issued: true,
    validity: true,
    status: true,
    created: true,
    actions: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const [isExportOpen, setIsExportOpen] = useState(false);

  // GraphQL Data
  const { data: rulesData, loading: rulesLoading, refetch: refetchRules } =
    useGetDigitalCardRules({
      page: 1,
      limit: 100,
      search: debouncedSearch || undefined,
    });
  const [deleteDigitalCardRule] = useDeleteDigitalCardRule();
  const { data: issuancesData } = useGetRewardIssuances();

  const [localRules, setLocalRules] = useState<GiftCardRuleItem[]>(
    DEFAULT_GIFT_CARD_RULES
  );
  const [ledgerRecords, setLedgerRecords] = useState<GiftCardIssuanceRecord[]>(
    INITIAL_LEDGER
  );

  // Sync backend rules when available
  useEffect(() => {
    if (rulesData?.getDigitalCardRules?.items) {
      const backendMapped: GiftCardRuleItem[] =
        rulesData.getDigitalCardRules.items.map((r: any) => {
          let meta: any = {};
          try {
            if (r.metadata) meta = JSON.parse(r.metadata);
          } catch (_) {}
          return {
            id: r.id,
            title: r.title,
            brand: r.brandName || "Brand",
            category: meta.category || "E-Commerce",
            denomination: Number(r.faceValue || 0),
            serviceFee: Number(r.serviceFee || (r.faceValue * 0.05)),
            totalCostPerWin: Number(r.totalCost || (r.faceValue * 1.05)),
            validityMonths: Math.round((r.validityDays || 365) / 30),
            isActive: r.isActive ?? true,
            totalIssued: 0,
            totalSpent: 0,
            gameAssignments: meta.gameAssignments || ["Spin the Wheel"],
            createdAt: r.createdAt || new Date().toISOString(),
          };
        });
      setLocalRules(backendMapped);
    }
  }, [rulesData]);

  // Sync backend issuances when available
  useEffect(() => {
    if (issuancesData?.getRewardIssuances?.items) {
      const mappedIssuances: GiftCardIssuanceRecord[] =
        issuancesData.getRewardIssuances.items.map((iss: any) => ({
          id: iss.id,
          memberName: iss.user ? `${iss.user.firstName || ""} ${iss.user.lastName || ""}`.trim() || "Member" : "Member",
          memberEmail: iss.user?.email || "member@thrico.com",
          brand: iss.reward?.title || iss.provider || "Digital Card",
          cardValue: Number(iss.faceValue || 0),
          serviceFee: Number(iss.serviceFee || 0),
          totalDeducted: Number(iss.faceValue || 0) + Number(iss.serviceFee || 0),
          status: (iss.status === "DELIVERED" || iss.status === "CLAIMED") ? "DELIVERED" : (iss.status === "RESERVED" ? "RESERVED" : "FAILED_RELEASED"),
          idempotencyKey: `REW-${iss.id}`,
          giftCardCode: iss.code || undefined,
          pin: iss.pin || undefined,
          gameSource: iss.gameType || "Engagement Game",
          issuedAt: iss.issuedAt || iss.createdAt || new Date().toISOString(),
          claimedAt: iss.claimedAt || undefined,
        }));
      setLedgerRecords(mappedIssuances);
    }
  }, [issuancesData]);


  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      ALL: localRules.length,
      ECOMMERCE: localRules.filter((r) => r.category === "E-Commerce").length,
      FOOD: localRules.filter((r) => r.category === "Food & Dining").length,
      LIFESTYLE: localRules.filter((r) => r.category === "Fashion & Lifestyle").length,
      ACTIVE: localRules.filter((r) => r.isActive).length,
      LEDGER: ledgerRecords.length,
    };
  }, [localRules, ledgerRecords]);

  // Filter & Search
  const filteredRules = useMemo(() => {
    if (status === "LEDGER") return [];

    return localRules.filter((r) => {
      // Category / status filter
      if (status === "ECOMMERCE" && r.category !== "E-Commerce") return false;
      if (status === "FOOD" && r.category !== "Food & Dining") return false;
      if (status === "LIFESTYLE" && r.category !== "Fashion & Lifestyle") return false;
      if (status === "ACTIVE" && !r.isActive) return false;

      // Search filter
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchBrand = r.brand.toLowerCase().includes(q);
        const matchCat = r.category.toLowerCase().includes(q);
        return matchTitle || matchBrand || matchCat;
      }

      return true;
    });
  }, [localRules, status, debouncedSearch]);

  // Pagination slice for rules
  const totalPages = Math.ceil(filteredRules.length / limit) || 1;
  const paginatedRules = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredRules.slice(start, start + limit);
  }, [filteredRules, page, limit]);

  const handleDelete = async (id: string) => {
    try {
      if (!id.startsWith("gc-")) {
        await deleteDigitalCardRule({ variables: { id } });
      }
    } catch (e) {
      console.warn("Delete rule backend warning:", e);
    }
    setLocalRules((prev) => prev.filter((r) => r.id !== id));
    toast.success("Gift card offer deleted successfully.");
  };



  return (
    <div className="space-y-4">
      {/* ── Action / Filter Bar ── */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search gift card brand or category..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          {/* Status Dropdown Selector */}
          <Select
            value={status}
            onValueChange={(val) => updateParams({ status: val, page: null })}
          >
            <SelectTrigger className="h-8 text-xs font-semibold bg-card border-border shadow-2xs w-[170px]">
              <SelectValue placeholder="All Offers" />
            </SelectTrigger>
            <SelectContent>
              {GIFT_CARD_STATUS_TABS.map((tab) => (
                <SelectItem key={tab.value} value={tab.value} className="text-xs">
                  <div className="flex items-center gap-2">
                    {tab.dot && (
                      <span className={cn("h-2 w-2 rounded-full", tab.dot)} />
                    )}
                    <span>{tab.label}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      ({tabCounts[tab.value as keyof typeof tabCounts] || 0})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Columns Visibility Selector (List View Only) */}
          {view === "list" && status !== "LEDGER" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs font-bold text-muted-foreground">
                  Visible Columns
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.denomination}
                  onCheckedChange={() => toggleColumn("denomination")}
                  className="text-xs font-medium cursor-pointer"
                >
                  Card Value
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.cost}
                  onCheckedChange={() => toggleColumn("cost")}
                  className="text-xs font-medium cursor-pointer"
                >
                  Cost Per Win
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.category}
                  onCheckedChange={() => toggleColumn("category")}
                  className="text-xs font-medium cursor-pointer"
                >
                  Category
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.issued}
                  onCheckedChange={() => toggleColumn("issued")}
                  className="text-xs font-medium cursor-pointer"
                >
                  Total Issued
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.validity}
                  onCheckedChange={() => toggleColumn("validity")}
                  className="text-xs font-medium cursor-pointer"
                >
                  Validity
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.status}
                  onCheckedChange={() => toggleColumn("status")}
                  className="text-xs font-medium cursor-pointer"
                >
                  Status
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Export CSV Button */}
          <Button
            variant="outline"
            onClick={() => setIsExportOpen(true)}
            className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5 cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" />
            Export
          </Button>

          {/* ViewToggle: Grid / List (Only for rules, not ledger) */}
          {status !== "LEDGER" && (
            <EcosystemActionBar.ViewToggle
              value={view}
              onChange={(v) => updateParams({ view: v })}
              options={[
                { id: "grid", label: "Grid", icon: LayoutGrid },
                { id: "list", label: "List", icon: ListIcon },
              ]}
            />
          )}

          <EcosystemActionBar.Separator />

          {/* Wallet Balance Status Indicator */}
          <EcosystemActionBar.Status active={walletBalance > 1000}>
            Wallet: ₹{walletBalance.toLocaleString("en-IN")}
          </EcosystemActionBar.Status>

          {/* Create CTA Button */}
          {onCreateClick && (
            <Button
              onClick={onCreateClick}
              className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5 text-xs font-semibold h-8 shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Configure Gift Card
            </Button>
          )}
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Quick Filter Tabs Bar with Status Counts ───────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {GIFT_CARD_STATUS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = status === tab.value;
          const count = tabCounts[tab.value as keyof typeof tabCounts] || 0;

          return (
            <button
              key={tab.value}
              onClick={() => updateParams({ status: tab.value, page: null })}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer border",
                isActive
                  ? "bg-violet-600 text-white border-violet-600 shadow-xs"
                  : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border/70"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Section Header ─────────────────────────────────────────── */}
      <SectionHeader
        count={status === "LEDGER" ? ledgerRecords.length : filteredRules.length}
        label={status === "LEDGER" ? "Issuance Transaction" : "Gift Card Offer"}
        isFiltered={status !== "ALL" || !!debouncedSearch}
      />

      {/* ── Content Area: Grid, List or Ledger View ────────────────── */}
      <ContentArea loading={rulesLoading} viewMode={view}>
        {status === "LEDGER" ? (
          <GiftCardLedgerList records={ledgerRecords} />
        ) : view === "grid" ? (
          <GiftCardGrid
            rewards={paginatedRules}
            onCreateClick={onCreateClick}
            onEdit={onEditClick}
            onDelete={handleDelete}
          />
        ) : (
          <GiftCardList
            rewards={paginatedRules}
            visibleColumns={visibleColumns}
            onEdit={onEditClick}
            onDelete={handleDelete}
          />
        )}
      </ContentArea>

      {/* ── Bottom Pagination Bar ──────────────────────────────────── */}
      {status !== "LEDGER" && totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={filteredRules.length}
            pageSize={limit}
            onPageChange={(p) => {
              updateParams({ page: String(p) });
            }}
          />
        </div>
      )}

      {/* ── Export CSV Modal ───────────────────────────────────────── */}
      <ExportGiftCardsModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        rules={filteredRules}
        ledgerRecords={ledgerRecords}
      />
    </div>
  );
};
