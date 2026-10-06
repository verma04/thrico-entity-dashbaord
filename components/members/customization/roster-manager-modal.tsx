"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useGetAllowedIdentifiers,
  useImportAllowedIdentifiersCsv,
  useDeleteAllowedIdentifier,
  useClearAllowedIdentifiers,
  AllowedIdentifierItem,
} from "@/graphql/actions";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Search,
  Download,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  X,
  FileCheck,
  Database,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RosterManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldKey: string;
  fieldLabel: string;
}

export function RosterManagerModal({
  isOpen,
  onClose,
  fieldKey,
  fieldLabel,
}: RosterManagerModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "manage">("upload");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const limit = 15;

  // CSV Upload state
  const [file, setFile] = useState<File | null>(null);
  const [csvRawText, setCsvRawText] = useState<string>("");
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [totalRowsCount, setTotalRowsCount] = useState<number>(0);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // GraphQL queries and mutations
  const {
    data: rosterData,
    loading: isLoadingRoster,
    refetch: refetchRoster,
  } = useGetAllowedIdentifiers({
    variables: {
      fieldKey,
      search: search.trim() || undefined,
      status: statusFilter === "ALL" ? undefined : statusFilter,
      page,
      limit,
    },
    skip: !isOpen || !fieldKey,
    fetchPolicy: "network-only",
  });

  const [importCsv, { loading: isImporting }] = useImportAllowedIdentifiersCsv();
  const [deleteIdentifier, { loading: isDeleting }] = useDeleteAllowedIdentifier();
  const [clearRoster, { loading: isClearing }] = useClearAllowedIdentifiers();

  const items: AllowedIdentifierItem[] = rosterData?.getAllowedIdentifiers?.items || [];
  const total = rosterData?.getAllowedIdentifiers?.total || 0;
  const totalPages = rosterData?.getAllowedIdentifiers?.totalPages || 1;

  // Handle file selection and parsing
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      toast.error("Please select a valid CSV (.csv) file.");
      return;
    }

    setFile(selectedFile);
    setIsParsing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = (event.target?.result as string) || "";
        setCsvRawText(text);

        const lines = text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);

        setTotalRowsCount(Math.max(0, lines.length - 1));

        // Preview top 5 rows
        const parsedPreview = lines.slice(0, 6).map((line) => {
          return line.split(",").map((c) => c.replace(/^["']|["']$/g, "").trim());
        });
        setPreviewRows(parsedPreview);
      } catch (err) {
        toast.error("Failed to parse CSV file content.");
      } finally {
        setIsParsing(false);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleDownloadSample = () => {
    const sampleContent = `identifier,name,email,department
EMP-1001,Jane Doe,jane.doe@example.com,Engineering
EMP-1002,John Smith,john.smith@example.com,Marketing
EMP-1003,Alex Morgan,alex.morgan@example.com,Operations`;

    const blob = new Blob([sampleContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sample_${fieldKey}_roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Sample CSV template downloaded.");
  };

  // Submit CSV Import
  const handleImportSubmit = async () => {
    if (!csvRawText || !fieldKey) {
      toast.error("Please upload a CSV file with identifier data.");
      return;
    }

    try {
      const res = await importCsv({
        variables: {
          fieldKey,
          csvContent: csvRawText,
          archiveFileName: file?.name || `${fieldKey}_roster.csv`,
        },
      });

      const result = res.data?.importAllowedIdentifiersCsv;
      if (result?.success) {
        toast.success(
          `Successfully uploaded! Processed ${result.totalProcessed} records (${result.insertedCount} inserted).`
        );
        setFile(null);
        setCsvRawText("");
        setPreviewRows([]);
        setTotalRowsCount(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
        refetchRoster();
        setActiveTab("manage");
      } else {
        toast.error(result?.message || "Failed to process CSV roster.");
      }
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Error importing CSV roster.");
    }
  };

  // Delete single identifier
  const handleDeleteItem = async (id: string, code: string) => {
    try {
      await deleteIdentifier({ variables: { id } });
      toast.success(`Identifier "${code}" removed from approved roster.`);
      refetchRoster();
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to delete identifier.");
    }
  };

  // Clear entire roster for this fieldKey
  const handleClearEntireRoster = async () => {
    try {
      await clearRoster({ variables: { fieldKey } });
      toast.success(`All approved identifiers for "${fieldLabel}" have been cleared.`);
      refetchRoster();
      setPage(1);
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to clear roster.");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="sm:max-w-2xl md:max-w-3xl w-full p-0 flex flex-col gap-0 border-l border-border/80 shadow-2xl bg-white dark:bg-zinc-950"
      >
        <SheetHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <SheetTitle className="text-base font-bold flex items-center gap-2">
                  <span>Approved Roster: {fieldLabel}</span>
                  <Badge
                    variant="outline"
                    className="font-mono text-[11px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    key: {fieldKey}
                  </Badge>
                </SheetTitle>
                <SheetDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Only users with an ID listed in this whitelist will be permitted to register or log in.
                </SheetDescription>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {/* Tabs: Upload vs Manage */}
        <Tabs
          value={activeTab}
          onValueChange={(val: string) => setActiveTab(val as "upload" | "manage")}
          className="w-full mt-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <TabsList className="bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg">
              <TabsTrigger
                value="upload"
                className="text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload CSV Roster</span>
              </TabsTrigger>
              <TabsTrigger
                value="manage"
                className="text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>View Roster ({total})</span>
              </TabsTrigger>
            </TabsList>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadSample}
              className="text-xs h-8 flex items-center gap-1.5 border-dashed"
            >
              <Download className="w-3.5 h-3.5 text-zinc-500" />
              <span>Download Sample CSV</span>
            </Button>
          </div>

          {/* TAB 1: UPLOAD CSV */}
          <TabsContent value="upload" className="space-y-4 focus-visible:outline-hidden">
            {/* Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3",
                file
                  ? "border-blue-500/60 bg-blue-50/30 dark:bg-blue-950/20"
                  : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-900/50"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="p-3.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                {file ? <FileCheck className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
              </div>

              {file ? (
                <div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB • {totalRowsCount} rows identified
                  </p>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1">
                    Click to choose a different CSV file
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    Click to select or drag & drop CSV roster
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                    Supports employee roster, student roll numbers, or worker identifiers.
                  </p>
                </div>
              )}
            </div>

            {/* CSV Format Guidelines Alert */}
            <div className="p-3.5 rounded-lg border border-blue-200/80 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 text-xs text-blue-900 dark:text-blue-200 space-y-1.5">
              <div className="font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Roster Gatekeeper Requirements:</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-blue-800 dark:text-blue-300">
                <li>
                  First column should contain the identifier (e.g. <code>employee_id</code>, <code>student_id</code>, <code>roll_no</code>).
                </li>
                <li>
                  Optional columns: <code>name</code>, <code>email</code>, <code>department</code>.
                </li>
                <li>
                  Identifiers are checked case-insensitively and indexed in PostgreSQL for &lt;3ms login verification.
                </li>
                <li>
                  Files are securely archived to S3 for organization audit history.
                </li>
              </ul>
            </div>

            {/* Preview Section */}
            {previewRows.length > 0 && (
              <div className="space-y-2 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3.5 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Preview Data (First 5 Rows):
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    {totalRowsCount} total records to ingest
                  </Badge>
                </div>

                <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-zinc-50 dark:bg-zinc-800/60">
                        {previewRows[0]?.map((col, idx) => (
                          <TableHead key={idx} className="text-[11px] h-8 font-bold">
                            {col || `Column ${idx + 1}`}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewRows.slice(1).map((row, rIdx) => (
                        <TableRow key={rIdx} className="h-8">
                          {row.map((cell, cIdx) => (
                            <TableCell key={cIdx} className="text-[11px] py-1 font-mono">
                              {cell || "-"}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs"
              >
                Close
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!file || !csvRawText || isImporting}
                onClick={handleImportSubmit}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {isImporting ? (
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Ingesting Roster...
                  </span>
                ) : (
                  `Upload & Sync ${totalRowsCount > 0 ? `(${totalRowsCount} IDs)` : ""}`
                )}
              </Button>
            </div>
          </TabsContent>

          {/* TAB 2: MANAGE ACTIVE ROSTER */}
          <TabsContent value="manage" className="space-y-4 focus-visible:outline-hidden">
            {/* Filters bar */}
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
              <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
                  <Input
                    placeholder="Search by ID, name, email..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="text-xs pl-8 h-8"
                  />
                </div>

                <Select
                  value={statusFilter}
                  onValueChange={(val) => {
                    setStatusFilter(val);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="text-xs h-8 w-[130px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <SelectItem value="ALL" className="text-xs">
                      All Status
                    </SelectItem>
                    <SelectItem value="ACTIVE" className="text-xs">
                      Active (Available)
                    </SelectItem>
                    <SelectItem value="CLAIMED" className="text-xs">
                      Claimed (Linked)
                    </SelectItem>
                    <SelectItem value="BLOCKED" className="text-xs">
                      Blocked
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => refetchRoster()}
                  className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  title="Refresh Roster"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", isLoadingRoster && "animate-spin")} />
                </Button>
              </div>

              {/* Clear Roster Danger Button */}
              {total > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="text-xs h-8 shrink-0"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Clear Roster
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-sm font-bold text-red-600">
                        Clear All Approved Identifiers?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-xs text-zinc-600 dark:text-zinc-400">
                        This will permanently delete all {total} approved roster entries for{" "}
                        <strong>{fieldLabel}</strong>. Users will no longer be validated against this list until a new CSV is uploaded.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleClearEntireRoster}
                        className="text-xs bg-red-600 hover:bg-red-700 text-white font-semibold"
                      >
                        Yes, Delete All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            {/* Table */}
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-50 dark:bg-zinc-800/60">
                    <TableHead className="text-[11px] font-bold">Identifier Code</TableHead>
                    <TableHead className="text-[11px] font-bold">Member Info</TableHead>
                    <TableHead className="text-[11px] font-bold">Status</TableHead>
                    <TableHead className="text-[11px] font-bold">Claimed By</TableHead>
                    <TableHead className="text-[11px] font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingRoster ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-xs text-zinc-500">
                        <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-blue-600" />
                        Loading approved roster...
                      </TableCell>
                    </TableRow>
                  ) : items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-xs text-zinc-500">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <FileSpreadsheet className="w-6 h-6 text-zinc-400" />
                          <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                            No approved identifiers found
                          </p>
                          <p className="text-[11px] text-zinc-400">
                            Upload a CSV whitelist to allow only verified users to register.
                          </p>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveTab("upload")}
                            className="text-xs h-7 mt-2"
                          >
                            Upload CSV Now
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => (
                      <TableRow key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                        <TableCell className="font-mono text-xs font-bold py-2">
                          {item.originalIdentifier || item.identifier}
                        </TableCell>
                        <TableCell className="text-xs py-2">
                          {item.name || item.email ? (
                            <div>
                              <span className="font-medium block">{item.name || "-"}</span>
                              <span className="text-[10px] text-zinc-500">{item.email || "-"}</span>
                            </div>
                          ) : (
                            <span className="text-zinc-400 text-[11px] italic">-</span>
                          )}
                        </TableCell>
                        <TableCell className="py-2">
                          {item.status === "CLAIMED" ? (
                            <Badge className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200">
                              Claimed
                            </Badge>
                          ) : item.status === "BLOCKED" ? (
                            <Badge variant="destructive" className="text-[10px]">
                              Blocked
                            </Badge>
                          ) : (
                            <Badge className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200">
                              Active / Available
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs py-2 text-zinc-500 font-mono text-[11px]">
                          {item.claimedByUserId ? (
                            <span title={item.claimedByUserId} className="truncate block max-w-[120px]">
                              {item.claimedByUserId.slice(0, 8)}...
                            </span>
                          ) : (
                            <span className="text-zinc-400 italic">Unclaimed</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDeleteItem(item.id, item.originalIdentifier || item.identifier)
                            }
                            className="h-7 w-7 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                <span>
                  Page {page} of {totalPages} ({total} records)
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="h-7 text-xs px-2.5"
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="h-7 text-xs px-2.5"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        </div>

        <SheetFooter className="p-4 border-t border-border/60 bg-muted/10 flex sm:flex-row items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>CSV records are validated securely against registration inputs</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs h-8 cursor-pointer"
          >
            Done
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
