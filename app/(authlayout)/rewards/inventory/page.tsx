"use client";

import React, { useState, useRef } from "react";
import {
  Upload, FileDown, CheckCircle2, AlertCircle, X,
  FileText, Package, Activity, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InventoryTable } from "@/components/rewards/inventory/inventory-table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useGetRewards, useUploadVouchers } from "@/graphql/actions/rewards";
import { GET_VOUCHERS } from "@/graphql/quries/rewards/rewards-queries";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

interface ParsedVoucher {
  code: string;
  amount?: string;
  expiryDate?: string;
  isValid: boolean;
  error?: string;
}

export default function InventoryPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedRewardId, setSelectedRewardId] = useState("");
  const [uploadStep, setUploadStep] = useState<"idle" | "validating" | "summary">("idle");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedVouchers, setParsedVouchers] = useState<ParsedVoucher[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data, loading } = useGetRewards();
  const [uploadVouchers, { loading: uploading }] = useUploadVouchers();
  const inventoryItems = data?.getRewards?.filter((r: any) => r.inventoryRequired) || [];

  const parseCSV = (text: string): ParsedVoucher[] => {
    const lines = text.split("\n").filter((l) => l.trim());
    const start = lines[0]?.toLowerCase().includes("code") ? 1 : 0;
    return lines.slice(start).map((line) => {
      const [code, amount, expiryDate] = line.split(",").map((c) => c.trim());
      const v: ParsedVoucher = { code, amount, expiryDate, isValid: true };
      if (!code || code.length < 4) { v.isValid = false; v.error = "Code too short (min 4 chars)"; }
      if (expiryDate) {
        const d = new Date(expiryDate);
        if (isNaN(d.getTime())) { v.isValid = false; v.error = "Invalid date"; }
        else if (d < new Date()) { v.isValid = false; v.error = "Already expired"; }
      }
      return v;
    }).filter((v) => v.code);
  };

  const handleFileSelect = (file: File) => {
    if (!selectedRewardId) {
      toast({ title: "Select a reward first", variant: "destructive" }); return;
    }
    if (!file.name.endsWith(".csv")) {
      toast({ title: "CSV files only", variant: "destructive" }); return;
    }
    setUploadedFile(file);
    setUploadStep("validating");
    const reader = new FileReader();
    reader.onload = (e) => {
      setParsedVouchers(parseCSV(e.target?.result as string));
      setTimeout(() => setUploadStep("summary"), 800);
    };
    reader.readAsText(file);
  };

  const confirmUpload = async () => {
    try {
      const validCodes = parsedVouchers.filter((v) => v.isValid).map((v) => v.code);
      await uploadVouchers({
        variables: { input: { rewardId: selectedRewardId, vouchers: validCodes } },
        refetchQueries: [{ query: GET_VOUCHERS, variables: { rewardId: selectedRewardId } }],
      });
      toast({ title: `${validCodes.length} vouchers uploaded successfully` });
      resetUpload();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    }
  };

  const resetUpload = () => {
    setIsUploadOpen(false);
    setUploadStep("idle");
    setUploadedFile(null);
    setParsedVouchers([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const downloadTemplate = () => {
    const csv = "voucherCode,amount,expiryDate\nSAMPLE-001,100,2026-12-31\nSAMPLE-002,200,2026-12-31";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "voucher-template.csv" });
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = parsedVouchers.filter((v) => v.isValid).length;
  const invalidCount = parsedVouchers.length - validCount;

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Voucher Inventory"
        badgeText="Inventory"
        description="Track stock levels and upload new voucher codes for your rewards."
        icon={Package}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              {inventoryItems.length} inventory items tracked
            </span>
          </div>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <Button variant="outline" size="sm" onClick={downloadTemplate} className="gap-2">
            <FileDown className="h-3.5 w-3.5" />
            Template
          </Button>
          <Button size="sm" onClick={() => setIsUploadOpen(true)} className="gap-2">
            <Upload className="h-3.5 w-3.5" />
            Upload Codes
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 overflow-hidden">
        <InventoryTable items={inventoryItems} isLoading={loading} />
      </EcosystemContainer>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={(o) => { if (!o) resetUpload(); else setIsUploadOpen(true); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Voucher Codes</DialogTitle>
            <DialogDescription>
              Select a reward and upload a CSV file with columns: voucherCode, amount, expiryDate.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Reward Select */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Target Reward</Label>
              <Select value={selectedRewardId} onValueChange={setSelectedRewardId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a reward..." />
                </SelectTrigger>
                <SelectContent>
                  {inventoryItems.map((item: any) => (
                    <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Drop Zone */}
            {uploadStep === "idle" && (
              <>
                <input ref={fileInputRef} type="file" accept=".csv" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} />
                <div
                  className={cn(
                    "border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-all",
                    isDragging ? "border-indigo-400 bg-indigo-50" : "border-border hover:border-border/80 hover:bg-muted/30",
                  )}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
                >
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">
                      {isDragging ? "Drop to upload" : "Click or drag CSV file here"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Max 10MB · up to 10,000 codes</p>
                  </div>
                </div>
              </>
            )}

            {/* Validating */}
            {uploadStep === "validating" && (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <p className="text-sm text-muted-foreground">Validating file...</p>
              </div>
            )}

            {/* Summary */}
            {uploadStep === "summary" && (
              <div className="space-y-3">
                {uploadedFile && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={resetUpload}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}

                {validCount > 0 && (
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-emerald-200 bg-emerald-50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-900">{validCount.toLocaleString()} codes ready</p>
                      <p className="text-xs text-emerald-700/70">Validated and ready to upload</p>
                    </div>
                  </div>
                )}

                {invalidCount > 0 && (
                  <div className="p-4 rounded-lg border border-rose-200 bg-rose-50">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                      <p className="text-sm font-semibold text-rose-900">{invalidCount} errors found</p>
                    </div>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {parsedVouchers.filter((v) => !v.isValid).slice(0, 5).map((v, i) => (
                        <p key={i} className="text-xs text-rose-700 flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-rose-400 shrink-0" />
                          {v.code}: {v.error}
                        </p>
                      ))}
                      {invalidCount > 5 && <p className="text-xs text-rose-600 font-medium">+{invalidCount - 5} more errors</p>}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetUpload} disabled={uploading}>Cancel</Button>
            {uploadStep === "summary" && validCount > 0 && (
              <Button onClick={confirmUpload} disabled={uploading} className="gap-2">
                {uploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Upload {validCount} codes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </EcosystemWrapper>
  );
}
