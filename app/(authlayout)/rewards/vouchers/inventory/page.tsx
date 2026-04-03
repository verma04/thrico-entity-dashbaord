"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FileDown,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Package,
  Activity,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InventoryTable } from "@/components/rewards/inventory/inventory-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useGetRewards, useUploadVouchers } from "@/graphql/actions/rewards";
import { GET_VOUCHERS } from "@/graphql/quries/rewards/rewards-queries";
import {
  Select as UISelect,
  SelectContent as UISelectContent,
  SelectItem as UISelectItem,
  SelectTrigger as UISelectTrigger,
  SelectValue as UISelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

interface ParsedVoucher {
  code: string;
  amount?: string;
  expiryDate?: string;
  isValid: boolean;
  error?: string;
}

export default function InventoryPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedRewardId, setSelectedRewardId] = useState<string>("");
  const [uploadStep, setUploadStep] = useState<
    "idle" | "validating" | "summary"
  >("idle");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedVouchers, setParsedVouchers] = useState<ParsedVoucher[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data, loading } = useGetRewards();
  const [uploadVouchers, { loading: uploading }] = useUploadVouchers();

  const inventoryItems =
    data?.getRewards?.filter((r: any) => r.inventoryRequired) || [];

  const parseCSV = (text: string): ParsedVoucher[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    const vouchers: ParsedVoucher[] = [];

    // Skip header row if it exists
    const startIndex = lines[0]?.toLowerCase().includes("code") ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const columns = lines[i].split(",").map((col) => col.trim());
      const code = columns[0];

      if (!code) continue;

      const voucher: ParsedVoucher = {
        code,
        amount: columns[1] || undefined,
        expiryDate: columns[2] || undefined,
        isValid: true,
      };

      // Validate code format
      if (code.length < 4) {
        voucher.isValid = false;
        voucher.error = "Code too short (min 4 characters)";
      }

      // Validate expiry date if provided
      if (voucher.expiryDate) {
        const expiryDate = new Date(voucher.expiryDate);
        if (isNaN(expiryDate.getTime())) {
          voucher.isValid = false;
          voucher.error = "Invalid date format";
        } else if (expiryDate < new Date()) {
          voucher.isValid = false;
          voucher.error = "Expired date";
        }
      }

      vouchers.push(voucher);
    }

    return vouchers;
  };

  const handleFileSelect = (file: File) => {
    if (!selectedRewardId) {
      toast({
        title: "Error",
        description: "Please select a reward first.",
        variant: "destructive",
      });
      return;
    }

    if (!file.name.endsWith(".csv")) {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setUploadStep("validating");

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const vouchers = parseCSV(text);
      setParsedVouchers(vouchers);
      setTimeout(() => {
        setUploadStep("summary");
      }, 1000);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const confirmUpload = async () => {
    try {
      const validVouchers = parsedVouchers
        .filter((v) => v.isValid)
        .map((v) => v.code);

      await uploadVouchers({
        variables: {
          input: {
            rewardId: selectedRewardId,
            vouchers: validVouchers,
          },
        },
        refetchQueries: [
          {
            query: GET_VOUCHERS,
            variables: { rewardId: selectedRewardId },
          },
        ],
      });
      toast({
        title: "Upload Successful",
        description: `${validVouchers.length} vouchers have been added to your inventory.`,
      });
      resetUpload();
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message || "There was an error uploading vouchers.",
        variant: "destructive",
      });
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
    const csvContent =
      "voucherCode,amount,expiryDate\nSAMPLE-001,100,2026-12-31\nSAMPLE-002,200,2026-12-31";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voucher-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = parsedVouchers.filter((v) => v.isValid).length;
  const invalidCount = parsedVouchers.length - validCount;

  return (
    <EcosystemWrapper anonymized-1="voucher-inventory">
      <EcosystemHeader
        title="Reward Inventory"
        badgeText="Inventory"
        description="Track stock levels and upload new voucher codes for rewards."
        icon={Package}
      >
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="h-10 px-6 rounded-xl border-white/20 bg-white/5 text-white font-bold text-[11px] uppercase tracking-wider gap-3 hover:bg-white/10 transition-all shadow-xl shadow-white/10"
            onClick={downloadTemplate}
          >
            <FileDown className="h-4 w-4" />
            Download Template
          </Button>
          <Button
            onClick={() => setIsUploadOpen(true)}
            className="h-10 px-6 rounded-xl bg-white text-slate-900 font-bold text-[11px] uppercase tracking-wider gap-3 hover:bg-slate-100 transition-all shadow-xl shadow-white/10 group active:scale-95"
          >
            <Upload className="h-4 w-4 transition-transform group-hover:-translate-y-1 duration-300" />
            Upload Codes
          </Button>
        </div>
      </EcosystemHeader>

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <Activity className="h-4 w-4 text-emerald-500" />
              <span>{inventoryItems.length} Tracked Inventory Items</span>
            </div>
          </div>
        </div>
      </EcosystemActionBar>

      <InventoryTable items={inventoryItems} isLoading={loading} />

      <Dialog
        open={isUploadOpen}
        onOpenChange={(open) => {
          if (!open) resetUpload();
          else setIsUploadOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
              <Upload className="h-24 w-24" />
            </div>
            <DialogHeader className="relative z-10">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Upload Voucher Codes
              </DialogTitle>
              <DialogDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
                Upload a CSV file with columns: voucherCode, amount, expiryDate.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">
                Target Reward
              </Label>
              <UISelect
                value={selectedRewardId}
                onValueChange={setSelectedRewardId}
              >
                <UISelectTrigger className="h-12 rounded-2xl border-slate-200 font-bold text-slate-900">
                  <UISelectValue placeholder="Choose a reward catalog item..." />
                </UISelectTrigger>
                <UISelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                  {inventoryItems.map((item: any) => (
                    <UISelectItem
                      key={item.id}
                      value={item.id}
                      className="font-bold text-slate-600"
                    >
                      {item.title}
                    </UISelectItem>
                  ))}
                </UISelectContent>
              </UISelect>
            </div>

            {uploadStep === "idle" && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
                <div
                  className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                    isDragging
                      ? "border-indigo-500 bg-indigo-50 scale-[1.02]"
                      : "border-slate-200/80 hover:bg-slate-50/50 hover:border-slate-300"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-600">
                    <Upload className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900 leading-tight">
                      {isDragging
                        ? "RELEASE TO UPLOAD"
                        : "Click or drag CSV to upload codes"}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                      Batch Processing Limit: 10,000 codes
                    </p>
                  </div>
                </div>
              </>
            )}

            {uploadStep === "validating" && (
              <div className="flex flex-col items-center justify-center py-12 gap-5">
                <div className="h-12 w-12 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                  Validating file...
                </p>
              </div>
            )}

            {uploadStep === "summary" && (
              <div className="space-y-4">
                {uploadedFile && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 shadow-sm">
                    <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-900 truncate tracking-tight">
                        {uploadedFile.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {(uploadedFile.size / 1024).toFixed(1)} KB • CSV Format
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-colors"
                      onClick={resetUpload}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {validCount > 0 && (
                  <div className="p-5 rounded-3xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-emerald-900 tracking-tight">
                        {validCount.toLocaleString()} Codes Ready
                      </p>
                      <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-tight mt-0.5">
                        Verified and ready for deployment to vault.
                      </p>
                    </div>
                  </div>
                )}

                {invalidCount > 0 && (
                  <div className="p-5 rounded-3xl bg-rose-50/50 border border-rose-100 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-500/20">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-rose-900 tracking-tight">
                        {invalidCount} Anomalies Found
                      </p>
                      <div className="text-[10px] font-bold text-rose-600/70 uppercase tracking-tight mt-2 space-y-1 max-h-32 overflow-y-auto pr-2">
                        {parsedVouchers
                          .filter((v) => !v.isValid)
                          .slice(0, 5)
                          .map((v, i) => (
                            <p key={i} className="flex items-center gap-2">
                              <span className="h-1 w-1 bg-rose-400 rounded-full" />
                              {v.code}: {v.error}
                            </p>
                          ))}
                        {invalidCount > 5 && (
                          <p className="font-black pt-1">
                            + {invalidCount - 5} ADDITIONAL ERRORS
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              onClick={resetUpload}
              disabled={uploading}
              className="rounded-xl font-bold h-11 px-6 hover:bg-white text-slate-500"
            >
              Cancel
            </Button>
            {uploadStep === "summary" && validCount > 0 && (
              <Button
                onClick={confirmUpload}
                disabled={uploading}
                className="rounded-xl font-bold h-11 px-8 bg-slate-900 hover:bg-black text-white shadow-xl shadow-slate-200 transition-all active:scale-95"
              >
                {uploading ? "UPLOADING..." : `ADD ${validCount} CODES`}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </EcosystemWrapper>
  );
}
