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
} from "lucide-react";
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

export function BlockedLinksManager() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading, error, refetch } = useGetBlockedLinks({
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
        toast.success("Blocked link updated");
      } else {
        await addLink({
          variables: formData,
        });
        toast.success("Blocked link added");
      }
      setIsDialogOpen(false);
      refetch();
    } catch (err) {
      toast.error("Failed to save blocked link");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this link?")) {
      try {
        await deleteLink({ variables: { id } });
        toast.success("Link deleted");
        refetch();
      } catch (err) {
        toast.error("Failed to delete link");
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
      toast.success(link.isBlocked ? "Link whitelisted" : "Link blocked");
      refetch();
    } catch (err) {
      toast.error("Failed to update link status");
    }
  };

  const columns: ColumnDef<BlockedLink>[] = [
    {
      accessorKey: "url",
      header: "URL / Domain",
      cell: ({ row }) => (
        <span className="font-semibold text-foreground text-sm">
          {row.original.url}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="capitalize text-[10px] h-4 font-bold border-muted-foreground/20"
        >
          {row.original.type.toLowerCase()}
        </Badge>
      ),
    },
    {
      accessorKey: "isBlocked",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.isBlocked ? "destructive" : "secondary"}
          className={
            row.original.isBlocked
              ? "bg-rose-50 text-rose-700 border-rose-100 h-4 text-[9px] font-bold uppercase"
              : "bg-emerald-50 text-emerald-700 border-emerald-100 h-4 text-[9px] font-bold uppercase"
          }
        >
          {row.original.isBlocked ? "Blocked" : "Whitelisted"}
        </Badge>
      ),
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-medium">
          {row.original.reason || "-"}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-[11px] font-semibold"
            onClick={() => handleToggleStatus(row.original)}
          >
            {row.original.isBlocked ? "Allow" : "Block"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleOpenDialog(row.original)}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:text-rose-600"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col gap-4">
      <EcosystemHeader
        title="Blocked Links"
        description="Restrict malicious domains or enforce whitelist-only URL patterns across the platform."
        badgeText="Safety Center"
        icon={LinkIcon}
        breadcrumbs={[
          { label: "Moderation", href: "/moderation" },
          { label: "Blocked Links" }
        ]}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search domains..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 w-[200px] text-xs"
            />
          </div>
          <EcosystemActionBar.Separator />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
            {totalCount} managed routes
          </div>
        </EcosystemActionBar.Group>
        <EcosystemActionBar.Group align="right">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-8 gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => handleOpenDialog()}
            className="h-8 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Rule
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <LinkIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Route Policy
                </p>
                <p className="text-xs text-muted-foreground">
                  Domain-level restrictions for user-generated links
                </p>
              </div>
            </div>
          </div>
          <div className="p-1">
            <DataTable
              columns={columns}
              data={links}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {editingLink ? "Edit Route Policy" : "New Route Policy"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                URL, Domain or Pattern
              </Label>
              <Input
                placeholder="e.g. *.spam.gg, example.com"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="h-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Type
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) =>
                    setFormData({ ...formData, type: v as LinkType })
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DOMAIN">Domain</SelectItem>
                    <SelectItem value="URL">Specific URL</SelectItem>
                    <SelectItem value="PATTERN">Regex Pattern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Initial Action
                </Label>
                <div className="flex items-center gap-3 h-10 px-1">
                  <Switch
                    checked={formData.isBlocked}
                    onCheckedChange={(c) =>
                      setFormData({ ...formData, isBlocked: c })
                    }
                  />
                  <span className="text-sm font-semibold text-foreground">
                    {formData.isBlocked ? "Restrict" : "Whitelist"}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Reason (Optional)
              </Label>
              <Input
                placeholder="Internal note..."
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                className="h-10"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
              className="font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={adding || updating}
              className="font-bold min-w-[100px]"
            >
              {adding || updating
                ? "Saving..."
                : editingLink
                  ? "Save Changes"
                  : "Create Rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
