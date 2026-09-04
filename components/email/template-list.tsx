"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import {
  Plus,
  Mail,
  RefreshCw,
  Search,
  LayoutGrid,
  List as ListIcon,
  SlidersHorizontal,
  Upload,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Clock,
  PaintBucket,
} from "lucide-react";
import { useDebounce } from "use-debounce";
import {
  useGetEmailTemplates,
  useDeleteEmailTemplate,
  type EmailTemplate,
} from "@/graphql/actions/email";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { toast } from "sonner";
import { TemplateCard } from "./templates/template-card";
import { TemplatePreviewModal } from "./templates/template-preview-modal";
import { TemplateStarters } from "./templates/template-starters";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";

function getTimeAgo(dateString?: string): string {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

export const templateTableColumns = [
  { key: "template", header: "Template & Subject" },
  { key: "type", header: "Category / Type" },
  { key: "updatedAt", header: "Last Edited" },
  { key: "status", header: "Status" },
];

export default function TemplateList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "grid" || value === "ALL") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const view = (searchParams.get("view") as "grid" | "list") || "grid";
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(search, 400);

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "grid" ? null : v });

  const { data, loading, refetch } = useGetEmailTemplates();
  const [deleteTemplate] = useDeleteEmailTemplate();

  const [preview, setPreview] = useState<EmailTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    template: true,
    type: true,
    updatedAt: true,
    status: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const rawTemplates: EmailTemplate[] = data?.getEmailTemplates || [];

  const filteredTemplates = useMemo(() => {
    if (!debouncedSearch.trim()) return rawTemplates;
    const q = debouncedSearch.toLowerCase().trim();
    return rawTemplates.filter((t) => {
      const nameMatch = t.name?.toLowerCase().includes(q);
      const subjectMatch = t.subject?.toLowerCase().includes(q);
      return nameMatch || subjectMatch;
    });
  }, [rawTemplates, debouncedSearch]);

  const handleDelete = async () => {
    if (!templateToDelete) return;
    try {
      const { data } = await deleteTemplate({ variables: { id: templateToDelete } });
      if (data?.deleteEmailTemplate?.success) {
        toast.success("Template deleted successfully");
        refetch();
      } else {
        toast.error("Failed to delete template");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to delete template");
    } finally {
      setTemplateToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Action / Filter Bar ─────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search templates by name or subject…"
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
                {templateTableColumns.map((col) => (
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
            onClick={() => router.push("/email/templates/create")}
            className="h-[30px] gap-1.5 shrink-0 bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-[12px] font-semibold px-2.5 rounded-[4px] cursor-pointer hover:bg-[#202020]"
          >
            <Plus className="h-3 w-3" />
            Create Template
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
          <EcosystemActionBar.Status active={filteredTemplates.length > 0}>
            Showing {filteredTemplates.length} of {rawTemplates.length} Templates
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Container ───────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-0 border-none bg-transparent shadow-none ring-0 space-y-4">
        {loading ? (
          <div className="h-60 flex items-center justify-center">
            <RefreshCw className="h-5 w-5 text-muted-foreground animate-spin" />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-white dark:bg-zinc-900 rounded-[8px] border border-dashed border-[#d2d5d9] dark:border-zinc-800 text-center space-y-2.5">
            <div className="w-10 h-10 rounded-[6px] bg-[#f6f6f7] dark:bg-zinc-800 flex items-center justify-center text-[#616161]">
              <PaintBucket className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[13px] font-bold text-[#303030] dark:text-zinc-100">
                {search ? "No matching templates found" : "No email templates created yet"}
              </h3>
              <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 max-w-sm">
                {search
                  ? "Try clearing your search query or looking for different keywords."
                  : "Design and save reusable branded email layouts for your campaigns and automated announcements."}
              </p>
            </div>
            {!search && (
              <Button
                type="button"
                onClick={() => router.push("/email/templates/create")}
                className="h-[30px] px-3 text-[12px] font-semibold gap-1.5 mt-1 bg-[#303030] text-white rounded-[4px] cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                Create First Template
              </Button>
            )}
          </div>
        ) : view === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {/* New template tile */}
            <button
              onClick={() => router.push("/email/templates/create")}
              className="group rounded-xl border-2 border-dashed border-border bg-muted/20 flex flex-col items-center justify-center hover:border-primary/40 hover:bg-muted/40 transition-all cursor-pointer min-h-[220px]"
            >
              <div className="h-9 w-9 rounded-lg border border-border bg-background group-hover:bg-primary group-hover:border-primary flex items-center justify-center transition-all">
                <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
              </div>
              <p className="text-[11.5px] font-semibold text-muted-foreground mt-2 group-hover:text-foreground transition-colors">
                Create new template
              </p>
            </button>

            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreview={setPreview}
              />
            ))}
          </div>
        ) : (
          /* List View (Table) */
          <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-2xs">
            <Table>
              <TableHeader className="bg-[#f6f6f7]/50 dark:bg-zinc-900/50 border-b border-[#e1e3e5] dark:border-zinc-800">
                <TableRow className="hover:bg-transparent">
                  {visibleColumns.template && (
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2.5">
                      Template & Subject
                    </TableHead>
                  )}
                  {visibleColumns.type && (
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2.5">
                      Category
                    </TableHead>
                  )}
                  {visibleColumns.updatedAt && (
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2.5">
                      Last Edited
                    </TableHead>
                  )}
                  {visibleColumns.status && (
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2.5">
                      Status
                    </TableHead>
                  )}
                  <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2.5">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-[#e1e3e5] dark:divide-zinc-800/60">
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id} className="hover:bg-[#f6f6f7]/50 dark:hover:bg-zinc-800/30 transition-colors">
                    {visibleColumns.template && (
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-[4px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
                            <Mail className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12.5px] font-semibold text-foreground truncate max-w-[300px]">
                              {template.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate max-w-[300px]">
                              {template.subject || "No subject line defined"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.type && (
                      <TableCell className="py-2.5">
                        <Badge
                          variant="secondary"
                          className="text-[9.5px] bg-[#f6f6f7] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 text-[#303030] dark:text-zinc-400 font-semibold rounded-[3px]"
                        >
                          Newsletter
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.updatedAt && (
                      <TableCell className="py-2.5 text-[11.5px] text-[#616161] dark:text-zinc-400 font-medium">
                        {getTimeAgo(template.updatedAt)}
                      </TableCell>
                    )}
                    {visibleColumns.status && (
                      <TableCell className="py-2.5">
                        <Badge
                          variant="outline"
                          className="text-[9px] py-0 px-1.5 h-4 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 rounded-[3px]"
                        >
                          Active
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell className="py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setPreview(template)}
                          className="h-[28px] text-[11.5px] font-semibold border-[#aeb4b9] dark:border-zinc-700 rounded-[4px] cursor-pointer"
                        >
                          <Eye className="h-3 w-3 mr-1" /> Preview
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
                              onClick={() => router.push(`/email/templates/create?id=${template.id}`)}
                              className="text-[12px] font-semibold cursor-pointer"
                            >
                              <Pencil className="h-3 w-3 mr-2" /> Edit Template
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setPreview(template)}
                              className="text-[12px] font-semibold cursor-pointer"
                            >
                              <Eye className="h-3 w-3 mr-2" /> Quick Preview
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setTemplateToDelete(template.id)}
                              className="text-[12px] font-semibold text-[#d72c0d] focus:text-[#d72c0d] focus:bg-rose-50 dark:focus:bg-rose-950/20 cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3 mr-2" /> Delete Template
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Starter Templates */}
        <TemplateStarters />

        {/* Preview Modal */}
        <AnimatePresence>
          {preview && (
            <TemplatePreviewModal
              template={preview}
              onClose={() => setPreview(null)}
            />
          )}
        </AnimatePresence>

        {/* Delete Confirmation Alert Dialog */}
        <AlertDialog
          open={!!templateToDelete}
          onOpenChange={(open) => !open && setTemplateToDelete(null)}
        >
          <AlertDialogContent className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[14px] font-bold text-[#303030] dark:text-zinc-100">
                Delete Email Template?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[12px] text-[#616161] dark:text-zinc-400">
                Are you sure you want to delete this template? Any draft campaigns using this layout will lose their default structure.
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
          entityName="email templates"
          description="Export all saved email templates, subject lines, and metadata as CSV."
          totalCount={rawTemplates.length}
          onExport={(_scope, format) => {
            if (rawTemplates.length === 0) {
              toast.error("Nothing to export", {
                description: "No templates created yet.",
              });
              return;
            }
            const csv = buildCsv(rawTemplates, [
              { header: "Name", getValue: (t) => t.name || "" },
              { header: "Subject", getValue: (t) => t.subject || "" },
              { header: "Last Updated", getValue: (t) => t.updatedAt || "" },
              { header: "Is Active", getValue: (t) => (t.isActive ? "Yes" : "No") },
            ]);
            downloadCsv(
              csv,
              `email-templates-${new Date().toISOString().slice(0, 10)}`,
              format
            );
            toast.success("Export ready", {
              description: `${rawTemplates.length} templates exported.`,
            });
          }}
        />
      </EcosystemContainer>
    </div>
  );
}
