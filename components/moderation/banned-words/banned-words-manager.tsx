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
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  AlertTriangle,
  Ban,
  RotateCcw,
  ShieldAlert,
  Loader2,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  useGetBannedWords,
  useAddBannedWord,
  useUpdateBannedWord,
  useDeleteBannedWord,
} from "@/graphql/moderation/hooks";
import { BannedWord, Severity } from "@/graphql/moderation/types";
import { toast } from "sonner";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";

const SEVERITY_BADGE: Record<string, string> = {
  LOW: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
  MEDIUM: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  HIGH: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
};

const CATEGORIES = ["spam", "offensive", "explicit", "harassment", "other"];

export function BannedWordsManager() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading, refetch } = useGetBannedWords({
    limit: pageSize,
    offset: pageIndex * pageSize,
  });
  const [addWord, { loading: adding }] = useAddBannedWord();
  const [updateWord, { loading: updating }] = useUpdateBannedWord();
  const [deleteWord] = useDeleteBannedWord();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<BannedWord | null>(null);
  const [formData, setFormData] = useState({
    word: "",
    severity: "MEDIUM" as Severity,
    category: "other",
  });

  const words = data?.getBannedWords.items || [];
  const totalCount = data?.getBannedWords.totalCount || 0;
  const pageCount = Math.ceil(totalCount / pageSize);

  const filteredWords = words.filter((w) =>
    w.word.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenDialog = (word?: BannedWord) => {
    if (word) {
      setEditingWord(word);
      setFormData({
        word: word.word,
        severity: word.severity,
        category: word.category || "other",
      });
    } else {
      setEditingWord(null);
      setFormData({ word: "", severity: "MEDIUM", category: "other" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.word.trim()) return;

    try {
      if (editingWord) {
        await updateWord({
          variables: {
            id: editingWord.id,
            ...formData,
          },
        });
        toast.success("Banned keyword updated successfully");
      } else {
        await addWord({
          variables: formData,
        });
        toast.success("Banned keyword added to filter matrix");
      }
      setIsDialogOpen(false);
      refetch();
    } catch (err) {
      toast.error("Failed to save banned keyword");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this keyword filter?")) {
      try {
        await deleteWord({ variables: { id } });
        toast.success("Banned keyword removed");
        refetch();
      } catch (err) {
        toast.error("Failed to delete banned keyword");
      }
    }
  };

  const columns: ColumnDef<BannedWord>[] = [
    {
      accessorKey: "word",
      header: "Keyword / Regex Pattern",
      cell: ({ row }) => (
        <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 font-mono">
          {row.original.word}
        </span>
      ),
    },
    {
      accessorKey: "severity",
      header: "Severity Level",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border",
            SEVERITY_BADGE[row.original.severity],
          )}
        >
          {row.original.severity}
        </Badge>
      ),
    },
    {
      accessorKey: "category",
      header: "Classification",
      cell: ({ row }) => (
        <span className="capitalize text-xs text-zinc-600 dark:text-zinc-400 font-semibold">
          {row.original.category}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Enacted Date",
      cell: ({ row }) => (
        <span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium">
          {new Date(parseInt(row.original.createdAt)).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
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
        title="Banned Words & Filter Matrix"
        description="Configure automated text filters to detect, sanitize, and block inappropriate phrases in real-time."
        badgeText="Auto-Moderation"
        icon={Ban}
        breadcrumbs={[
          { label: "Moderation", href: "/moderation" },
          { label: "Banned Words" },
        ]}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <Input
              placeholder="Search keyword filters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 w-[220px] text-xs bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <EcosystemActionBar.Separator />
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold">
            <ShieldAlert className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
            {totalCount} Active Filters
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
            size="sm"
            onClick={() => handleOpenDialog()}
            className="h-8 gap-1.5 text-xs font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Banned Keyword
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shrink-0">
                <Ban className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  Real-time Filter Matrix
                </p>
                <p className="text-[11px] text-zinc-400">
                  Automated pattern matching across posts, comments, and profile narratives
                </p>
              </div>
            </div>
          </div>

          <div className="p-1">
            <DataTable
              columns={columns}
              data={filteredWords}
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

      {/* Polaris Modal for Add/Edit Banned Word */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md flex flex-col p-0 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
          <DialogHeader className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center">
                <Ban className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                  {editingWord ? "Edit Keyword Rule" : "Add Banned Keyword"}
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Define exact string or pattern to suppress automatically.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-4 bg-white dark:bg-zinc-950">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Word or Regex Pattern <span className="text-rose-500">*</span>
              </Label>
              <Input
                placeholder="e.g., spamkeyword, offensivephrase"
                value={formData.word}
                onChange={(e) =>
                  setFormData({ ...formData, word: e.target.value })
                }
                className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Severity Level
                </Label>
                <Select
                  value={formData.severity}
                  onValueChange={(v) =>
                    setFormData({ ...formData, severity: v as Severity })
                  }
                >
                  <SelectTrigger className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <SelectItem value="LOW" className="text-xs font-semibold">Low (Flag)</SelectItem>
                    <SelectItem value="MEDIUM" className="text-xs font-semibold">Medium (Filter)</SelectItem>
                    <SelectItem value="HIGH" className="text-xs font-semibold">High (Block)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Classification
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData({ ...formData, category: v })
                  }
                >
                  <SelectTrigger className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-zinc-200 dark:border-zinc-800">
                    {CATEGORIES.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="capitalize text-xs font-semibold"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="h-9 text-xs font-semibold border-zinc-200 dark:border-zinc-800"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={adding || updating || !formData.word.trim()}
              className="h-9 px-4 text-xs font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 flex items-center gap-1.5 shadow-xs"
            >
              {adding || updating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {editingWord ? "Save Changes" : "Enforce Rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </EcosystemWrapper>
  );
}
