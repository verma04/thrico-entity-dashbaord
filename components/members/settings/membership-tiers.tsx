"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
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
  Search,
  X,
  Users,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TierMembersList from "./tier-members-list";
import { TierCard, TierSkeletonGrid } from "./tier-card";
import { TierMembersModal } from "./tier-members-modal";
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
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
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
import { TierModal } from "./tier-modal";

export default function MembershipTiers() {
  const { data, loading, refetch } = useQuery(GET_MEMBERSHIP_TIERS);
  const [deleteTier] = useMutation(DELETE_MEMBERSHIP_TIER);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<any>(null);
  const [expandedTierId, setExpandedTierId] = useState<string | null>(null);
  const [tierToDelete, setTierToDelete] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedTierForMembers, setSelectedTierForMembers] = useState<any | null>(null);

  const rawTiers: any[] = data?.getMembershipTiers || [];

  const filteredTiers = useMemo(() => {
    if (!searchQuery.trim()) return rawTiers;
    const q = searchQuery.toLowerCase().trim();
    return rawTiers.filter((tier: any) => {
      const nameMatch = tier.name?.toLowerCase().includes(q);
      const descMatch = tier.description?.toLowerCase().includes(q);
      const benefitsMatch = Array.isArray(tier.benefits)
        ? tier.benefits.some((b: string) => b.toLowerCase().includes(q))
        : false;
      return nameMatch || descMatch || benefitsMatch;
    });
  }, [rawTiers, searchQuery]);

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
    <EcosystemWrapper>
      <EcosystemHeader
        title="Membership Tiers"
        description="Configure membership tiers, distinctive status insignias, and exclusive benefits."
        badgeText="Access & Tiers"
        icon={Award}
        breadcrumbs={[
          { label: "Members", href: "/members/all" },
          { label: "Tiers" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowExportModal(true)}
              className="h-9 px-3 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button
              type="button"
              onClick={() => handleOpenModal()}
              className="h-9 px-4 text-xs font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xs flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Tier
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        {/* Controls Toolbar: Search & View Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tiers by name, perks, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-9 text-xs bg-card border-border"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs text-muted-foreground font-medium">
              {filteredTiers.length} {filteredTiers.length === 1 ? "Tier" : "Tiers"}
            </span>

            {/* Grid / List View Toggle */}
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as "grid" | "list")}
              className="bg-muted p-0.5 rounded-lg border border-border"
            >
              <TabsList className="bg-transparent border-none h-auto p-0 gap-0.5">
                <TabsTrigger
                  value="grid"
                  className="h-8 px-3 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-2xs data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium"
                >
                  <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
                  Grid
                </TabsTrigger>
                <TabsTrigger
                  value="list"
                  className="h-8 px-3 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-2xs data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium"
                >
                  <ListIcon className="h-3.5 w-3.5 mr-1.5" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content View: Grid vs List */}
        {loading ? (
          viewMode === "grid" ? (
            <TierSkeletonGrid />
          ) : (
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs p-6 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          )
        ) : filteredTiers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-2xl border border-dashed border-border text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground">
              <Award className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">
                {searchQuery ? "No matching tiers found" : "No membership tiers created yet"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                {searchQuery
                  ? "Try clearing your search query or looking for different keywords."
                  : "Create your first membership tier to start organizing members and rewarding them with privileges."}
              </p>
            </div>
            {!searchQuery && (
              <Button
                type="button"
                onClick={() => handleOpenModal()}
                className="h-8 px-3 text-xs font-semibold gap-1.5 mt-2"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Tier
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
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
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs">
            <Table>
              <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Tier</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Description</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Privileges</TableHead>
                  <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-zinc-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {filteredTiers.map((tier: any) => (
                  <React.Fragment key={tier.id}>
                    <TableRow className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2.5 font-bold text-xs">
                          {tier.badgeIcon ? (
                            <img
                              src={
                                tier.badgeIcon.startsWith("http")
                                  ? tier.badgeIcon
                                  : `https://cdn.thrico.network/${tier.badgeIcon}`
                              }
                              alt={tier.name}
                              className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                            />
                          ) : (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center border"
                              style={{
                                backgroundColor: `${tier.badgeColor || "#6366f1"}15`,
                                borderColor: `${tier.badgeColor || "#6366f1"}40`,
                              }}
                            >
                              <Award
                                className="h-4 w-4"
                                style={{ color: tier.badgeColor || "#6366f1" }}
                              />
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-900 dark:text-zinc-100">
                              {tier.name}
                            </span>
                            {tier.isDefault && (
                              <Badge
                                variant="outline"
                                className="text-[9px] py-0 px-1 h-3.5 font-semibold text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
                              >
                                Default
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        {tier.description || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {tier.benefits?.length === 1 &&
                          tier.benefits[0]?.includes("<") ? (
                            <Badge variant="secondary" className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold">
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
                                    className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold"
                                  >
                                    {b}
                                  </Badge>
                                ))}
                              {tier.benefits?.length > 2 && (
                                <Badge variant="secondary" className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold">
                                  +{tier.benefits.length - 2} more
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setExpandedTierId(
                                expandedTierId === tier.id ? null : tier.id,
                              )
                            }
                            className="h-8 text-xs font-semibold border-zinc-200 dark:border-zinc-800"
                          >
                            {expandedTierId === tier.id ? (
                              <>
                                <ChevronUp className="h-3.5 w-3.5 mr-1" /> Hide Members
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-3.5 w-3.5 mr-1" /> View Members
                              </>
                            )}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl border border-zinc-200 dark:border-zinc-800">
                              <DropdownMenuItem
                                onClick={() => handleOpenModal(tier)}
                                className="text-xs font-semibold cursor-pointer"
                              >
                                <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit Tier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setSelectedTierForMembers(tier)}
                                className="text-xs font-semibold cursor-pointer"
                              >
                                <Users className="h-3.5 w-3.5 mr-2" /> Manage Members
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setTierToDelete(tier.id)}
                                className="text-xs font-semibold text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/20 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete Tier
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedTierId === tier.id && (
                      <TableRow
                        key={`${tier.id}-members`}
                        className="bg-zinc-50/50 dark:bg-zinc-900/50"
                      >
                        <TableCell colSpan={4} className="p-0 border-b border-zinc-100 dark:border-zinc-800">
                          <div
                            className="p-4 px-6 border-l-4"
                            style={{ borderLeftColor: tier.badgeColor || "#18181b" }}
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

        {/* View/Manage Members Modal (for Grid View & Quick Action) */}
        <TierMembersModal
          isOpen={!!selectedTierForMembers}
          onClose={() => setSelectedTierForMembers(null)}
          tier={selectedTierForMembers}
        />

        {/* Delete Tier Confirmation Dialog */}
        <AlertDialog open={!!tierToDelete} onOpenChange={(open) => !open && setTierToDelete(null)}>
          <AlertDialogContent className="rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Delete Membership Tier?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                Are you sure you want to delete this membership tier? Existing assigned members will revert to default status.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="h-9 text-xs font-semibold">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="h-9 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
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
              toast.error("Nothing to export", { description: "No membership tiers created yet." });
              return;
            }
            const csv = buildCsv(rawTiers, [
              { header: "Name", getValue: (t) => t.name || "" },
              { header: "Description", getValue: (t) => t.description || "" },
              { header: "Privileges", getValue: (t) => Array.isArray(t.benefits) ? t.benefits.join(" | ") : "" },
              { header: "Badge Color", getValue: (t) => t.badgeColor || "" },
              { header: "Badge Icon", getValue: (t) => t.badgeIcon || "" },
              { header: "Is Default", getValue: (t) => t.isDefault ? "Yes" : "No" },
            ]);
            downloadCsv(csv, `membership-tiers-${new Date().toISOString().slice(0, 10)}`, format);
            toast.success("Export ready", { description: `${rawTiers.length} tier${rawTiers.length !== 1 ? "s" : ""} exported.` });
          }}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
