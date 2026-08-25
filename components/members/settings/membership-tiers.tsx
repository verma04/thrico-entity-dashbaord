"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { useDebounce } from "use-debounce";
import {
  GET_MEMBERSHIP_TIERS,
  DELETE_MEMBERSHIP_TIER,
} from "@/graphql/membership-tier";
import {
  Plus,
  Edit2,
  Trash2,
  Award,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Upload,
  LayoutGrid,
  List as ListIcon,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type {
  ExportCsvScope,
  ExportCsvFormat,
} from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import TierMembersList from "./tier-members-list";
import { TierCard, TierSkeletonGrid } from "./tier-card";
import { TierMembersModal } from "./tier-members-modal";
import { TierModal } from "./tier-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";

export const tierTableColumns = [
  { key: "tier", header: "Tier Name & Badge" },
  { key: "description", header: "Description" },
  { key: "privileges", header: "Privileges" },
  { key: "status", header: "Default Status" },
];

export default function MembershipTiers() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── URL parameter updates helper ──────────────────────────────────────────
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "grid") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  // ── Derive view & search state from URL ───────────────────────────────────
  const view = (searchParams.get("view") as "grid" | "list") || "grid";
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "grid" ? null : v });

  // ── Queries & Mutations ───────────────────────────────────────────────────
  const { data, loading, refetch } = useQuery(GET_MEMBERSHIP_TIERS);
  const [deleteTier] = useMutation(DELETE_MEMBERSHIP_TIER);

  // ── Modals & State ────────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<any>(null);
  const [expandedTierId, setExpandedTierId] = useState<string | null>(null);
  const [tierToDelete, setTierToDelete] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedTierForMembers, setSelectedTierForMembers] = useState<
    any | null
  >(null);

  // ── List View Column Visibility ───────────────────────────────────────────
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    tier: true,
    description: true,
    privileges: true,
    status: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const rawTiers: any[] = data?.getMembershipTiers || [];

  const filteredTiers = useMemo(() => {
    if (!debouncedSearch.trim()) return rawTiers;
    const q = debouncedSearch.toLowerCase().trim();
    return rawTiers.filter((tier: any) => {
      const nameMatch = tier.name?.toLowerCase().includes(q);
      const descMatch = tier.description?.toLowerCase().includes(q);
      const benefitsMatch = Array.isArray(tier.benefits)
        ? tier.benefits.some((b: string) => b.toLowerCase().includes(q))
        : false;
      return nameMatch || descMatch || benefitsMatch;
    });
  }, [rawTiers, debouncedSearch]);

  const handleOpenModal = (tier: any = null) => {
    setEditingTier(tier);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!tierToDelete) return;
    try {
      await deleteTier({ variables: { id: tierToDelete } });
      toast.success("Membership tier deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setTierToDelete(null);
    }
  };

  return (
    <EcosystemWrapper className="gap-4">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title="Membership Tiers"
        badgeText="Access & Tiers"
        description={
          loading
            ? "Loading membership tiers…"
            : `${rawTiers.length} membership tier${rawTiers.length === 1 ? "" : "s"} configured.`
        }
        icon={Award}
        breadcrumbs={[
          { label: "Members", href: "/members/all" },
          { label: "Membership Tiers" },
        ]}
      />

      {/* ── Action / Filter Bar ─────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search tiers by name, perks, or description…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group align="right">
          {view === "list" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-[30px] gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-medium text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer"
                >
                  <SlidersHorizontal className="h-3 w-3" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] rounded-[6px]">
                <DropdownMenuLabel className="text-[10px] font-bold text-[#616161] uppercase tracking-wider px-2 py-1.5">
                  Toggle Columns
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {tierTableColumns.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={visibleColumns[col.key] !== false}
                    onCheckedChange={() => toggleColumn(col.key)}
                    className="text-[12px] font-medium cursor-pointer"
                  >
                    {col.header}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="outline"
            onClick={() => setShowExportModal(true)}
            className="h-[30px] gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-medium text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer"
          >
            <Upload className="h-3 w-3" />
            Export
          </Button>

          <Button
            onClick={() => handleOpenModal()}
            className="h-[30px] gap-1.5 shrink-0 bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-[12px] font-semibold px-2.5 rounded-[4px] cursor-pointer hover:bg-[#202020]"
          >
            <Plus className="h-3 w-3" />
            Create Tier
          </Button>

          <EcosystemActionBar.ViewToggle
            value={view}
            onChange={(v) => setView(v as "grid" | "list")}
            options={[
              { id: "grid", label: "Grid", icon: LayoutGrid },
              { id: "list", label: "List", icon: ListIcon },
            ]}
          />
          <EcosystemActionBar.Separator />
          <EcosystemActionBar.Status active={filteredTiers.length > 0}>
            Showing {filteredTiers.length} of {rawTiers.length} Tiers
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Container ───────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {loading ? (
          view === "grid" ? (
            <TierSkeletonGrid />
          ) : (
            <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-2xs p-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-[6px]" />
              ))}
            </div>
          )
        ) : filteredTiers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-white dark:bg-zinc-900 rounded-[8px] border border-dashed border-[#d2d5d9] dark:border-zinc-800 text-center space-y-2.5">
            <div className="w-10 h-10 rounded-[6px] bg-[#f6f6f7] dark:bg-zinc-800 flex items-center justify-center text-[#616161]">
              <Award className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[13px] font-bold text-[#303030] dark:text-zinc-100">
                {search ? "No matching tiers found" : "No membership tiers created yet"}
              </h3>
              <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 max-w-sm">
                {search
                  ? "Try clearing your search query or looking for different keywords."
                  : "Create your first membership tier to start organizing members and rewarding them with privileges."}
              </p>
            </div>
            {!search && (
              <Button
                type="button"
                onClick={() => handleOpenModal()}
                className="h-[30px] px-3 text-[12px] font-semibold gap-1.5 mt-1 bg-[#303030] text-white rounded-[4px] cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                Create Tier
              </Button>
            )}
          </div>
        ) : view === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredTiers.map((tier: any) => (
              <TierCard
                key={tier.id}
                tier={tier}
                onEdit={() => handleOpenModal(tier)}
                onDelete={() => setTierToDelete(tier.id)}
                onViewMembers={() => setSelectedTierForMembers(tier)}
              />
            ))}
          </div>
        ) : (
          /* List View (Table) */
          <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-2xs">
            <Table>
              <TableHeader className="bg-[#f6f6f7]/50 dark:bg-zinc-900/50 border-b border-[#e1e3e5] dark:border-zinc-800">
                <TableRow className="hover:bg-transparent">
                  {visibleColumns.tier && (
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2">
                      Tier
                    </TableHead>
                  )}
                  {visibleColumns.description && (
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2">
                      Description
                    </TableHead>
                  )}
                  {visibleColumns.privileges && (
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2">
                      Privileges
                    </TableHead>
                  )}
                  {visibleColumns.status && (
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2">
                      Status
                    </TableHead>
                  )}
                  <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-[#e1e3e5] dark:divide-zinc-800/60">
                {filteredTiers.map((tier: any) => (
                  <React.Fragment key={tier.id}>
                    <TableRow className="hover:bg-[#f6f6f7]/50 dark:hover:bg-zinc-800/30 transition-colors">
                      {visibleColumns.tier && (
                        <TableCell className="py-2.5">
                          <div className="flex items-center gap-2 font-semibold text-[12.5px]">
                            {tier.badgeIcon ? (
                              <img
                                src={
                                  tier.badgeIcon.startsWith("http")
                                    ? tier.badgeIcon
                                    : `https://cdn.thrico.network/${tier.badgeIcon}`
                                }
                                alt={tier.name}
                                className="w-7 h-7 rounded-[4px] object-cover border border-[#d2d5d9] dark:border-zinc-700"
                              />
                            ) : (
                              <div
                                className="w-7 h-7 rounded-[4px] flex items-center justify-center border border-[#d2d5d9] dark:border-zinc-700"
                                style={{
                                  backgroundColor: `${tier.badgeColor || "#303030"}15`,
                                  borderColor: `${tier.badgeColor || "#303030"}40`,
                                }}
                              >
                                <Award
                                  className="h-3.5 w-3.5"
                                  style={{ color: tier.badgeColor || "#303030" }}
                                />
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <span className="text-[#303030] dark:text-zinc-100">
                                {tier.name}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.description && (
                        <TableCell className="py-2.5 max-w-[220px] truncate text-[11.5px] text-[#616161] dark:text-zinc-400 font-medium">
                          {tier.description || "—"}
                        </TableCell>
                      )}
                      {visibleColumns.privileges && (
                        <TableCell className="py-2.5">
                          <div className="flex flex-wrap gap-1">
                            {tier.benefits?.length === 1 &&
                            tier.benefits[0]?.includes("<") ? (
                              <Badge
                                variant="secondary"
                                className="text-[9.5px] bg-[#f6f6f7] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 text-[#303030] dark:text-zinc-400 font-semibold rounded-[3px]"
                              >
                                Custom Perks
                              </Badge>
                            ) : (
                              <>
                                {tier.benefits
                                  ?.slice(0, 2)
                                  .map((b: string, i: number) => (
                                    <Badge
                                      key={i}
                                      variant="secondary"
                                      className="text-[9.5px] bg-[#f6f6f7] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 text-[#303030] dark:text-zinc-400 font-semibold rounded-[3px]"
                                    >
                                      {b}
                                    </Badge>
                                  ))}
                                {tier.benefits?.length > 2 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-[9.5px] bg-[#f6f6f7] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 text-[#616161] dark:text-zinc-400 font-semibold rounded-[3px]"
                                  >
                                    +{tier.benefits.length - 2} more
                                  </Badge>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.status && (
                        <TableCell className="py-2.5">
                          {tier.isDefault ? (
                            <Badge
                              variant="outline"
                              className="text-[9px] py-0 px-1 h-3.5 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 rounded-[3px]"
                            >
                              Default Tier
                            </Badge>
                          ) : (
                            <span className="text-[11.5px] text-[#8c9196] font-medium">
                              Standard
                            </span>
                          )}
                        </TableCell>
                      )}
                      <TableCell className="py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setExpandedTierId(
                                expandedTierId === tier.id ? null : tier.id,
                              )
                            }
                            className="h-[28px] text-[11.5px] font-semibold border-[#aeb4b9] dark:border-zinc-700 rounded-[4px] cursor-pointer"
                          >
                            {expandedTierId === tier.id ? (
                              <>
                                <ChevronUp className="h-3 w-3 mr-1" /> Hide Members
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-3 w-3 mr-1" /> View Members
                              </>
                            )}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-[#616161] hover:text-[#303030] dark:hover:text-zinc-100 rounded-[4px] cursor-pointer"
                              >
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800"
                            >
                              <DropdownMenuItem
                                onClick={() => handleOpenModal(tier)}
                                className="text-[12px] font-semibold cursor-pointer"
                              >
                                <Edit2 className="h-3 w-3 mr-2" /> Edit Tier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setSelectedTierForMembers(tier)}
                                className="text-[12px] font-semibold cursor-pointer"
                              >
                                <Users className="h-3 w-3 mr-2" /> Manage Members
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setTierToDelete(tier.id)}
                                className="text-[12px] font-semibold text-[#d72c0d] focus:text-[#d72c0d] focus:bg-rose-50 dark:focus:bg-rose-950/20 cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3 mr-2" /> Delete Tier
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedTierId === tier.id && (
                      <TableRow
                        key={`${tier.id}-members`}
                        className="bg-[#f6f6f7]/50 dark:bg-zinc-900/50"
                      >
                        <TableCell
                          colSpan={
                            1 +
                            (visibleColumns.tier ? 1 : 0) +
                            (visibleColumns.description ? 1 : 0) +
                            (visibleColumns.privileges ? 1 : 0) +
                            (visibleColumns.status ? 1 : 0)
                          }
                          className="p-0 border-b border-[#e1e3e5] dark:border-zinc-800"
                        >
                          <div
                            className="p-3 px-4 border-l-4"
                            style={{
                              borderLeftColor: tier.badgeColor || "#303030",
                            }}
                          >
                            <TierMembersList tierId={tier.id} />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Create / Edit Tier Modal */}
        <TierModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingTier={editingTier}
          onSuccess={refetch}
        />

        {/* View/Manage Members Modal */}
        <TierMembersModal
          isOpen={!!selectedTierForMembers}
          onClose={() => setSelectedTierForMembers(null)}
          tier={selectedTierForMembers}
        />

        {/* Delete Tier Confirmation Dialog */}
        <AlertDialog
          open={!!tierToDelete}
          onOpenChange={(open) => !open && setTierToDelete(null)}
        >
          <AlertDialogContent className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[14px] font-bold text-[#303030] dark:text-zinc-100">
                Delete Membership Tier?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[12px] text-[#616161] dark:text-zinc-400">
                Are you sure you want to delete this membership tier? Existing
                assigned members will revert to default status.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="h-[32px] text-[12px] font-semibold rounded-[4px]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="h-[32px] text-[12px] font-bold bg-[#d72c0d] hover:bg-[#b02209] text-white rounded-[4px]"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Export CSV Modal */}
        <ExportCsvModal
          open={showExportModal}
          onOpenChange={setShowExportModal}
          entityName="membership tiers"
          description="Export all membership tier definitions, privilege lists, badge colors, and icons as CSV."
          totalCount={rawTiers.length}
          onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
            if (rawTiers.length === 0) {
              toast.error("Nothing to export", {
                description: "No membership tiers created yet.",
              });
              return;
            }
            const csv = buildCsv(rawTiers, [
              { header: "Name", getValue: (t) => t.name || "" },
              { header: "Description", getValue: (t) => t.description || "" },
              {
                header: "Privileges",
                getValue: (t) =>
                  Array.isArray(t.benefits) ? t.benefits.join(" | ") : "",
              },
              { header: "Badge Color", getValue: (t) => t.badgeColor || "" },
              { header: "Badge Icon", getValue: (t) => t.badgeIcon || "" },
              {
                header: "Is Default",
                getValue: (t) => (t.isDefault ? "Yes" : "No"),
              },
            ]);
            downloadCsv(
              csv,
              `membership-tiers-${new Date().toISOString().slice(0, 10)}`,
              format,
            );
            toast.success("Export ready", {
              description: `${rawTiers.length} tier${rawTiers.length !== 1 ? "s" : ""} exported.`,
            });
          }}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
