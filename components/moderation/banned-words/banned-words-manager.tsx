import React, { useState } from "react";
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
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";

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
import {
  AdminTable,
  AdminTableColumn,
  AdminTableItem,
  AdminTableTag,
  AdminTableDate,
  Pagination,
} from "@/components/shared/admin-table/admin-table";

const CATEGORIES = ["spam", "offensive", "explicit", "harassment", "other"];

export function BannedWordsManager() {
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const offset = (page - 1) * pageSize;
  const [searchQuery, setSearchQuery] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);

  const { data, loading, refetch } = useGetBannedWords({
    limit: pageSize,
    offset,
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
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

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

  const columns: AdminTableColumn<BannedWord>[] = [
    {
      key: "word",
      header: "Keyword / Regex Pattern",
      cell: (row) => (
        <AdminTableItem
          icon={Ban}
          title={row.word}
          titleClassName="font-mono text-[12px] font-semibold"
        />
      ),
    },
    {
      key: "severity",
      header: "Severity Level",
      cell: (row) => {
        const severityVariants: Record<string, "rose" | "amber" | "default"> = {
          HIGH: "rose",
          MEDIUM: "amber",
          LOW: "default",
        };
        return (
          <AdminTableTag variant={severityVariants[row.severity] || "default"}>
            {row.severity}
          </AdminTableTag>
        );
      },
    },
    {
      key: "category",
      header: "Classification",
      cell: (row) => (
        <AdminTableTag variant="purple">
          {row.category}
        </AdminTableTag>
      ),
    },
    {
      key: "createdAt",
      header: "Enacted Date",
      cell: (row) => (
        <AdminTableDate
          date={
            row.createdAt && !isNaN(Number(row.createdAt))
              ? new Date(Number(row.createdAt))
              : row.createdAt
          }
        />
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-16 text-right",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
            onClick={() => handleOpenDialog(row)}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-md"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="h-3 w-3" />
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
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search keyword filters…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
            <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground" />
            {totalCount} Active Filters
          </div>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="h-8 gap-1.5 text-xs font-semibold border-border"
            >
              <RotateCcw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
              Refresh
            </Button>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Item>
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
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Item>
            <Button
              type="button"
              size="sm"
              onClick={() => handleOpenDialog()}
              className="h-8 gap-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Banned Keyword
            </Button>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border border-border shadow-sm rounded-xl bg-card mt-4 overflow-hidden">
        <AdminTable
          columns={columns}
          data={filteredWords}
          loading={loading}
          size="sm"
          keyExtractor={(row) => row.id}
          emptyIcon={Ban}
          emptyTitle="No keyword filters found"
          emptyDescription="No automated keyword filters configured yet. Click 'Add Banned Keyword' to create one."
        />

        {totalPages > 1 && (
          <div className="p-3 border-t border-border flex justify-end">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              isLoading={loading}
            />
          </div>
        )}
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

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="banned words"
        description="Export banned keyword filter matrix and severity weights as CSV."
        totalCount={totalCount}
        matchingCount={searchQuery.trim() ? filteredWords.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredWords;
          if (rows.length === 0) {
            toast.error("Nothing to export", { description: "No banned keywords found." });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Keyword / Phrase", getValue: (w) => w.word || "" },
            { header: "Severity", getValue: (w) => w.severity || "" },
            { header: "Category", getValue: (w) => w.category || "other" },
            { header: "Created At", getValue: (w) => w.createdAt ? new Date(parseInt(w.createdAt)).toISOString().slice(0, 10) : "" },
          ]);
          downloadCsv(csv, `banned-words-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${rows.length} keyword${rows.length !== 1 ? "s" : ""} exported.` });
        }}
      />
    </EcosystemWrapper>
  );
}
