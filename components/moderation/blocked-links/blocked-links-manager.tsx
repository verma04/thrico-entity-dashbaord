"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  Link as LinkIcon,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Save,
  Globe,
  Upload,
} from "lucide-react";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
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
import { cn } from "@/lib/utils";

export function BlockedLinksManager() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);

  const { data, loading, refetch } = useGetBlockedLinks({
    limit: pageSize,
    offset: pageIndex * pageSize,
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
  const pageCount = Math.ceil(totalCount / pageSize);

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
      toast.success(link.isBlocked ? "Route allowed / whitelisted" : "Route restricted");
      refetch();
    } catch (err) {
      toast.error("Failed to update route status");
    }
  };

  const columns: ColumnDef<BlockedLink>[] = [
    {
      accessorKey: "url",
      header: "URL / Domain Pattern",
      cell: ({ row }) => (
        <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 font-mono">
          {row.original.url}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Routing Type",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="capitalize text-[10px] h-4 font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
        >
          {row.original.type.toLowerCase()}
        </Badge>
      ),
    },
    {
      accessorKey: "isBlocked",
      header: "Policy Action",
      cell: ({ row }) => (
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border",
            row.original.isBlocked
              ? "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
              : "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100",
          )}
        >
          {row.original.isBlocked ? "Blocked" : "Whitelisted"}
        </span>
      ),
    },
    {
      accessorKey: "reason",
      header: "Internal Context",
      cell: ({ row }) => (
        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          {row.original.reason || "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2 text-[11px] font-semibold border-zinc-200 dark:border-zinc-800"
            onClick={() => handleToggleStatus(row.original)}
          >
            {row.original.isBlocked ? "Allow" : "Block"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            onClick={() => handleOpenDialog(row.original)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
            onClick={() => handleDelete(row.original.id)}
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
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <Input
              placeholder="Search domains or routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 w-[220px] text-xs bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <EcosystemActionBar.Separator />
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
            {totalCount} Managed Route Rules
          </div>
        </EcosystemActionBar.Group>
        <EcosystemActionBar.Group align="right">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-8 gap-1.5 text-xs font-semibold border-zinc-200 dark:border-zinc-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowExportModal(true)}
            className="h-8 gap-1.5 text-xs font-medium bg-card border-border shadow-2xs text-foreground px-2.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => handleOpenDialog()}
            className="h-8 gap-1.5 text-xs font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add URL Policy
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shrink-0">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  Domain & Route Registry
                </p>
                <p className="text-[11px] text-zinc-400">
                  Real-time destination filtering applied to user posts, media links, and comment links
                </p>
              </div>
            </div>
          </div>

          <div className="p-1">
            <DataTable
              columns={columns}
              data={filteredLinks}
              isLoading={loading}
              manualPagination
              totalRows={totalCount}
              pageCount={pageCount}
              pageIndex={pageIndex}
              onPageChange={setPageIndex}
              pageSize={pageSize}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPageIndex(0);
              }}
            />
          </div>
        </div>
      </EcosystemContainer>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl border-zinc-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {editingLink ? "Edit URL Route Rule" : "Add URL Rule Policy"}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Define domain matching pattern, routing type, and optional audit
              rationale.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Target URL / Domain
              </Label>
              <Input
                placeholder="e.g. spam-domain.com or https://example.com/bad"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
                className="h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Pattern Match Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(val: LinkType) =>
                  setFormData((prev) => ({ ...prev, type: val }))
                }
              >
                <SelectTrigger className="h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800">
                  <SelectItem value="DOMAIN" className="text-xs">
                    Domain (Entire Host)
                  </SelectItem>
                  <SelectItem value="URL" className="text-xs">
                    Exact URL
                  </SelectItem>
                  <SelectItem value="PATTERN" className="text-xs">
                    Regex Pattern
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Reason / Enforcement Note
              </Label>
              <Input
                placeholder="e.g. Phishing source reported by watchdog"
                value={formData.reason}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, reason: e.target.value }))
                }
                className="h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(false)}
              className="h-8 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={adding || updating || !formData.url.trim()}
              className="h-8 gap-1.5 text-xs font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800"
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
            toast.error("Nothing to export", { description: "No blocked links found." });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "URL / Domain", getValue: (l) => l.url || "" },
            { header: "Type", getValue: (l) => l.type || "" },
            { header: "Status", getValue: (l) => l.isBlocked ? "Blocked" : "Allowed" },
            { header: "Reason", getValue: (l) => l.reason || "" },
            { header: "Created At", getValue: (l) => l.createdAt ? new Date(parseInt(l.createdAt)).toISOString().slice(0, 10) : "" },
          ]);
          downloadCsv(csv, `blocked-links-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${rows.length} link policy rule${rows.length !== 1 ? "s" : ""} exported.` });
        }}
      />
    </EcosystemWrapper>
  );
}
