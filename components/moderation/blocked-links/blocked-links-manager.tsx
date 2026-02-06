"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Plus, Trash2, Edit2, Search, Link as LinkIcon } from "lucide-react";
import {
  useGetBlockedLinks,
  useAddBlockedLink,
  useUpdateBlockedLink,
  useDeleteBlockedLink,
} from "@/graphql/moderation/hooks";
import { BlockedLink, LinkType } from "@/graphql/moderation/types";
import { toast } from "sonner";

export function BlockedLinksManager() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading, error } = useGetBlockedLinks({
    limit: pageSize,
    offset: pageIndex * pageSize,
  });
  const [addLink] = useAddBlockedLink();
  const [updateLink] = useUpdateBlockedLink();
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
        toast.success("Blocked link updated");
      } else {
        await addLink({
          variables: formData,
        });
        toast.success("Blocked link added");
      }
      setIsDialogOpen(false);
    } catch (err) {
      toast.error("Failed to save blocked link");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this link?")) {
      try {
        await deleteLink({ variables: { id } });
        toast.success("Link deleted");
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
    } catch (err) {
      toast.error("Failed to update link status");
    }
  };

  const columns: ColumnDef<BlockedLink>[] = [
    {
      accessorKey: "url",
      header: "URL / Domain",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.url}</span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.type.toLowerCase()}
        </Badge>
      ),
    },
    {
      accessorKey: "isBlocked",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isBlocked ? "destructive" : "secondary"}>
          {row.original.isBlocked ? "Blocked" : "Whitelisted"}
        </Badge>
      ),
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.reason || "-"}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(row.original)}
          >
            {row.original.isBlocked
              ? row.original.type === "DOMAIN"
                ? "Whitelist"
                : "Allow"
              : "Block"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenDialog(row.original)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  if (error) return <div>Error loading blocked links.</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-blue-500" />
                Blocked Links
              </CardTitle>
              <CardDescription>
                Manage domains and URLs that are restricted or whitelisted in
                comments and posts
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* TanStack Table */}
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
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLink ? "Edit Link Rule" : "Add Link Rule"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>URL, Domain or Pattern</Label>
              <Input
                placeholder="e.g. example.com, *.spam.gg, https://..."
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) =>
                    setFormData({ ...formData, type: v as LinkType })
                  }
                >
                  <SelectTrigger>
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
                <Label>Initial Action</Label>
                <div className="flex items-center gap-2 h-10">
                  <Switch
                    checked={formData.isBlocked}
                    onCheckedChange={(c) =>
                      setFormData({ ...formData, isBlocked: c })
                    }
                  />
                  <span className="text-sm font-medium">
                    {formData.isBlocked ? "Block" : "Allow"}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reason (Optional)</Label>
              <Input
                placeholder="Why is this link being managed?"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingLink ? "Save Changes" : "Save Rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
