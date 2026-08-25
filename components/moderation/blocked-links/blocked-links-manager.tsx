"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Edit2,
  Link as LinkIcon,
  RotateCcw,
  ShieldCheck,
  Loader2,
  Save,
  Globe,
  Upload,
} from "lucide-react";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type {
  ExportCsvScope,
  ExportCsvFormat,
} from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import {
  useGetBlockedLinks,
  useAddBlockedLink,
  useUpdateBlockedLink,
  useDeleteBlockedLink,
} from "@/graphql/moderation/hooks";
import { BlockedLink, LinkType } from "@/graphql/moderation/types";
import { toast } from "sonner";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import {
  AdminTable,
  AdminTableColumn,
  AdminTableItem,
  AdminTableTag,
  Pagination,
} from "@/components/shared/admin-table/admin-table";
import { cn } from "@/lib/utils";

export function BlockedLinksManager() {
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const offset = (page - 1) * pageSize;
  const [searchQuery, setSearchQuery] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);

  const { data, loading, refetch } = useGetBlockedLinks({
    limit: pageSize,
    offset,
  });
  const [addLink, { loading: adding }] = useAddBlockedLink();
  const [updateLink, { loading: updating }] = useUpdateBlockedLink();
  const [deleteLink] = useDeleteBlockedLink();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<BlockedLink | null>(null);
  const [formData, setFormData] = useState({
    url: "",
    type: "DOMAIN" as LinkType,
    isBlocked: true,
    reason: "",
  });

  const links = data?.getBlockedLinks.items || [];
  const totalCount = data?.getBlockedLinks.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const filteredLinks = links.filter((l) =>
    l.url.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenDialog = (link?: BlockedLink) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        url: link.url,
        type: link.type,
        isBlocked: link.isBlocked,
        reason: link.reason || "",
      });
    } else {
      setEditingLink(null);
      setFormData({ url: "", type: "DOMAIN", isBlocked: true, reason: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.url.trim()) return;

    try {
      if (editingLink) {
        await updateLink({
          variables: {
            id: editingLink.id,
            ...formData,
          },
        });
        toast.success("Route security policy updated successfully");
      } else {
        await addLink({
          variables: formData,
        });
        toast.success("New route security policy enacted");
      }
      setIsDialogOpen(false);
      refetch();
    } catch (err) {
      toast.error("Failed to save route policy");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this route policy?")) {
      try {
        await deleteLink({ variables: { id } });
        toast.success("Route policy removed");
        refetch();
      } catch (err) {
        toast.error("Failed to delete route policy");
      }
    }
  };

  const handleToggleStatus = async (link: BlockedLink) => {
    try {
      await updateLink({
        variables: {
          id: link.id,
          isBlocked: !link.isBlocked,
        },
      });
      toast.success(
        link.isBlocked ? "Route allowed / whitelisted" : "Route restricted",
      );
      refetch();
    } catch (err) {
      toast.error("Failed to update route status");
    }
  };

  const columns: AdminTableColumn<BlockedLink>[] = [
    {
      key: "url",
      header: "URL / Domain Pattern",
      cell: (row) => (
        <AdminTableItem
          icon={Globe}
          title={row.url}
          titleClassName="font-mono text-[13px] font-semibold text-[#303030] dark:text-zinc-100"
          subtitle={row.reason || undefined}
        />
      ),
    },
    {
      key: "type",
      header: "Routing Type",
      cell: (row) => {
        const typeVariants: Record<
          string,
          "indigo" | "emerald" | "purple" | "default"
        > = {
          DOMAIN: "indigo",
          URL: "emerald",
          PATTERN: "purple",
        };
        return (
          <AdminTableTag variant={typeVariants[row.type] || "default"}>
            {row.type}
          </AdminTableTag>
        );
      },
    },
    {
      key: "isBlocked",
      header: "Policy Action",
      cell: (row) => (
        <AdminTableTag variant={row.isBlocked ? "rose" : "emerald"}>
          {row.isBlocked ? "Blocked" : "Whitelisted"}
        </AdminTableTag>
      ),
    },
    {
      key: "reason",
      header: "Internal Context",
      cell: (row) => (
        <span className="text-[12.5px] text-[#616161] font-medium">
          {row.reason || "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-28 text-right",
      className: "text-right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2 text-[11px] font-semibold rounded-[4px] border-[#d2d5d9] text-[#303030] hover:bg-[#f6f6f7]"
            onClick={() => handleToggleStatus(row)}
          >
            {row.isBlocked ? "Allow" : "Block"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-[#616161] hover:text-[#303030] hover:bg-[#f6f6f7] rounded-[6px]"
            onClick={() => handleOpenDialog(row)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-[#616161] hover:text-[#d72c0d] hover:bg-[#fff4f4] rounded-[6px]"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Blocked Links & Domain Policy"
        description="Restrict malicious domains, phishing redirects, or enforce whitelist-only external URLs across all user submissions."
        badgeText="Safety Center"
        icon={LinkIcon}
        breadcrumbs={[
          { label: "Moderation", href: "/moderation" },
          { label: "Blocked Links" },
        ]}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search domains or routes…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          <div className="flex items-center gap-1.5 text-[12.5px] text-[#616161] font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-[#616161]" />
            {totalCount} Managed Route Rules
          </div>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="h-8 gap-1.5 text-[12px] font-semibold border-[#d2d5d9] bg-white hover:bg-[#f6f6f7] text-[#303030] rounded-[6px]"
            >
              <RotateCcw
                className={cn("h-3.5 w-3.5", loading && "animate-spin")}
              />
              Refresh
            </Button>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Item>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowExportModal(true)}
              className="h-8 gap-1.5 text-[12px] font-semibold bg-white border-[#d2d5d9] text-[#303030] hover:bg-[#f6f6f7] px-2.5 rounded-[6px]"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Item>
            <Button
              type="button"
              size="sm"
              onClick={() => handleOpenDialog()}
              className="h-8 gap-1.5 text-[12px] font-semibold bg-[#303030] text-white hover:bg-[#202020] rounded-[6px] shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add URL Policy
            </Button>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border border-[#d2d5d9] dark:border-zinc-800 shadow-[0_1px_2px_rgba(0,0,0,0.04)] rounded-[12px] bg-white dark:bg-zinc-900 mt-3 overflow-hidden">
        <AdminTable
          columns={columns}
          data={filteredLinks}
          loading={loading}
          size="sm"
          keyExtractor={(row) => row.id}
          emptyIcon={Globe}
          emptyTitle="No route policies found"
          emptyDescription="No domain or URL restrictions enacted yet. Click 'Add URL Policy' to create one."
        />

        {totalPages > 1 && (
          <div className="p-3 border-t border-[#e1e3e5] dark:border-zinc-800 flex justify-end">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              isLoading={loading}
            />
          </div>
        )}
      </EcosystemContainer>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] p-5 rounded-[12px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-7 h-7 rounded-[6px] bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center">
                <LinkIcon className="h-3.5 w-3.5" />
              </div>
              <DialogTitle className="text-[15px] font-semibold text-[#303030] dark:text-zinc-100">
                {editingLink ? "Edit URL Route Rule" : "Add URL Rule Policy"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-[12px] text-[#616161]">
              Define domain matching pattern, routing type, and optional audit
              rationale.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-1">
            <div className="space-y-1.5">
              <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block">
                Target URL / Domain{" "}
                <span className="text-[#d72c0d] ml-0.5">*</span>
              </label>
              <Input
                placeholder="e.g. spam-domain.com or https://example.com/bad"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
                className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 font-mono rounded-[8px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block">
                Pattern Match Type
              </label>
              <Select
                value={formData.type}
                onValueChange={(val: LinkType) =>
                  setFormData((prev) => ({ ...prev, type: val }))
                }
              >
                <SelectTrigger className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-[8px] border border-[#d2d5d9]">
                  <SelectItem value="DOMAIN" className="text-[13px]">
                    Domain (Entire Host)
                  </SelectItem>
                  <SelectItem value="URL" className="text-[13px]">
                    Exact URL
                  </SelectItem>
                  <SelectItem value="PATTERN" className="text-[13px]">
                    Regex Pattern
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block">
                Reason / Enforcement Note
              </label>
              <Input
                placeholder="e.g. Phishing source reported by watchdog"
                value={formData.reason}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, reason: e.target.value }))
                }
                className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(false)}
              className="h-8 px-3 text-[12px] font-semibold rounded-[6px] border-[#d2d5d9] bg-white text-[#303030]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={adding || updating || !formData.url.trim()}
              className="h-8 px-3.5 gap-1.5 text-[12px] font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 rounded-[6px]"
            >
              {adding || updating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {editingLink ? "Update Policy" : "Save Policy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="blocked links"
        description="Export blocked links and route policies as CSV."
        totalCount={totalCount}
        matchingCount={searchQuery.trim() ? filteredLinks.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredLinks;
          if (rows.length === 0) {
            toast.error("Nothing to export", {
              description: "No blocked links found.",
            });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "URL / Domain", getValue: (l) => l.url || "" },
            { header: "Type", getValue: (l) => l.type || "" },
            {
              header: "Status",
              getValue: (l) => (l.isBlocked ? "Blocked" : "Allowed"),
            },
            { header: "Reason", getValue: (l) => l.reason || "" },
            {
              header: "Created At",
              getValue: (l) =>
                l.createdAt
                  ? new Date(parseInt(l.createdAt)).toISOString().slice(0, 10)
                  : "",
            },
          ]);
          downloadCsv(
            csv,
            `blocked-links-${new Date().toISOString().slice(0, 10)}`,
            format,
          );
          toast.success("Export ready", {
            description: `${rows.length} link policy rule${rows.length !== 1 ? "s" : ""} exported.`,
          });
        }}
      />
    </EcosystemWrapper>
  );
}
