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
import { Plus, Trash2, Edit2, Search, AlertTriangle, Ban, Filter, RotateCcw } from "lucide-react";
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

const SEVERITY_BADGE: Record<string, string> = {
  LOW: "bg-blue-50 text-blue-700 border-blue-100",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-100",
  HIGH: "bg-rose-50 text-rose-700 border-rose-100",
};

const CATEGORIES = ["spam", "offensive", "explicit", "harassment", "other"];

export function BannedWordsManager() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading, error, refetch } = useGetBannedWords({
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
        toast.success("Banned word updated");
      } else {
        await addWord({
          variables: formData,
        });
        toast.success("Banned word added");
      }
      setIsDialogOpen(false);
      refetch();
    } catch (err) {
      toast.error("Failed to save banned word");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this word?")) {
      try {
        await deleteWord({ variables: { id } });
        toast.success("Banned word deleted");
        refetch();
      } catch (err) {
        toast.error("Failed to delete banned word");
      }
    }
  };

  const columns: ColumnDef<BannedWord>[] = [
    {
      accessorKey: "word",
      header: "Word/Phrase",
      cell: ({ row }) => (
        <span className="font-semibold text-foreground">{row.original.word}</span>
      ),
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] uppercase font-bold px-1.5 h-4",
            SEVERITY_BADGE[row.original.severity],
          )}
        >
          {row.original.severity}
        </Badge>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="capitalize text-xs text-muted-foreground font-medium">
          {row.original.category}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Added Date",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs font-medium">
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
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleOpenDialog(row.original)}
          >
            <Edit2 className="h-3 w-3.5" />
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
    <div className="min-h-screen flex flex-col">
       <EcosystemHeader
        title="Banned Words"
        description="Configure automated text filters to detect and block inappropriate content in real-time."
        badgeText="Auto-Mod"
        icon={Ban}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
           <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search filters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 w-[200px] text-xs"
              />
            </div>
            <EcosystemActionBar.Separator />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
               <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
               {totalCount} active filters
            </div>
        </EcosystemActionBar.Group>
        <EcosystemActionBar.Group align="right">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="h-8 gap-1.5">
             <RotateCcw className="h-3.5 w-3.5" />
             Refresh
          </Button>
          <Button size="sm" onClick={() => handleOpenDialog()} className="h-8 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Word
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                   <Ban className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                   <p className="text-sm font-semibold text-foreground">Filter Matrix</p>
                   <p className="text-xs text-muted-foreground">Automated keyword detection across all posts and comments</p>
                </div>
             </div>
          </div>
          <div className="p-1">
            <DataTable
              columns={columns}
              data={words}
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
               {editingWord ? "Edit Filter" : "Add Filter"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Word or Phrase</Label>
              <Input
                placeholder="Enter regex or literal string..."
                value={formData.word}
                onChange={(e) =>
                  setFormData({ ...formData, word: e.target.value })
                }
                className="h-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Severity</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(v) =>
                    setFormData({ ...formData, severity: v as Severity })
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData({ ...formData, category: v })
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="capitalize font-medium">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="font-semibold">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={adding || updating} className="font-bold min-w-[100px]">
              {adding || updating ? "Saving..." : (editingWord ? "Save Changes" : "Add Filter")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
