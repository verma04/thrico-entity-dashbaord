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
import { Plus, Trash2, Edit2, Search, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  useGetBannedWords,
  useAddBannedWord,
  useUpdateBannedWord,
  useDeleteBannedWord,
} from "@/graphql/moderation/hooks";
import { BannedWord, Severity } from "@/graphql/moderation/types";
import { toast } from "sonner";

const SEVERITY_COLORS: Record<string, string> = {
  LOW: "text-yellow-600 bg-yellow-50 border-yellow-200",
  MEDIUM: "text-orange-600 bg-orange-50 border-orange-200",
  HIGH: "text-red-600 bg-red-50 border-red-200",
};

const CATEGORIES = ["spam", "offensive", "explicit", "harassment", "other"];

export function BannedWordsManager() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading, error } = useGetBannedWords({
    limit: pageSize,
    offset: pageIndex * pageSize,
  });
  const [addWord] = useAddBannedWord();
  const [updateWord] = useUpdateBannedWord();
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

  // Note: Searching server-side would be better, but let's keep it consistent
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
    } catch (err) {
      toast.error("Failed to save banned word");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this word?")) {
      try {
        await deleteWord({ variables: { id } });
        toast.success("Banned word deleted");
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
        <span className="font-medium">{row.original.word}</span>
      ),
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] uppercase font-bold px-1.5 py-0 h-5",
            SEVERITY_COLORS[row.original.severity],
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
        <span className="capitalize text-muted-foreground">
          {row.original.category}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Added",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {new Date(parseInt(row.original.createdAt)).toLocaleDateString()}
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

  if (error) return <div>Error loading banned words.</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Banned Words
              </CardTitle>
              <CardDescription>
                Manage words and phrases that are automatically filtered from
                user content
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Word
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search banned words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Stats (Simplified to current page for now or using totalCount) */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{totalCount}</div>
              <div className="text-sm text-muted-foreground">Total Words</div>
            </div>
            {/* The individual severity counts would ideally come from the stats summary or a specialized count query */}
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {words.filter((w) => w.severity === "HIGH").length}+
              </div>
              <div className="text-sm text-red-600">High (this page)</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {words.filter((w) => w.severity === "MEDIUM").length}+
              </div>
              <div className="text-sm text-orange-600">Medium (this page)</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {words.filter((w) => w.severity === "LOW").length}+
              </div>
              <div className="text-sm text-yellow-600">Low (this page)</div>
            </div>
          </div>

          {/* TanStack Table */}
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
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingWord ? "Edit Banned Word" : "Add Banned Word"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Word or Phrase</Label>
              <Input
                placeholder="Enter word or phrase..."
                value={formData.word}
                onChange={(e) =>
                  setFormData({ ...formData, word: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Severity</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(v) =>
                    setFormData({ ...formData, severity: v as Severity })
                  }
                >
                  <SelectTrigger>
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
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData({ ...formData, category: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="capitalize">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingWord ? "Save Changes" : "Add Word"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
