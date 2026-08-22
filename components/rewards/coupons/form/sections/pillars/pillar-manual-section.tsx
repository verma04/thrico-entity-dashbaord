"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Ticket,
  Upload,
  Search,
  ExternalLink,
  RotateCw,
  FileSpreadsheet,
  Plus,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUploadVouchers, useGetVouchers } from "@/graphql/actions/rewards";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PillarManualSectionProps {
  formik: any;
  rewardId?: string;
  manualVouchers: any[];
  manualLoading: boolean;
  err: (field: string) => React.ReactNode;
}

export function PillarManualSection({
  formik,
  rewardId,
  manualVouchers,
  manualLoading,
  err,
}: PillarManualSectionProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCreationType, setActiveCreationType] = useState<"NONE" | "PROMO" | "CSV">("NONE");

  // CSV Upload State
  const [uploadVouchers, { loading: uploading }] = useUploadVouchers();
  const { data: vouchersListData } = useGetVouchers({
    rewardId: rewardId || "",
    pagination: { page: 1, limit: 100 },
  });
  const [uploadStep, setUploadStep] = useState<"idle" | "validating" | "summary">("idle");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [validCount, setValidCount] = useState(0);
  const [uploadData, setUploadData] = useState<any[]>([]);

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
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setUploadStep("validating");

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
        const vouchers: any[] = [];

        const startIndex =
          lines[0]?.toLowerCase().includes("code") ? 1 : 0;

        for (let i = startIndex; i < lines.length; i++) {
          const parts = lines[i].split(",").map((p) => p.trim());
          if (parts[0]) {
            vouchers.push({
              code: parts[0],
              cardNumber: parts[1] || undefined,
              pin: parts[2] || undefined,
            });
          }
        }

        setValidCount(vouchers.length);
        setUploadData(vouchers);
        setUploadStep("summary");
      } catch (err) {
        toast({
          title: "File Parse Error",
          description: "Could not parse CSV file. Please follow the template format.",
          variant: "destructive",
        });
        resetUpload();
      }
    };
    reader.readAsText(file);
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setUploadStep("idle");
    setValidCount(0);
    setUploadData([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const confirmUpload = async () => {
    if (!rewardId) {
      toast({
        title: "Save Reward First",
        description: "Please create this reward before uploading unique voucher inventory.",
        variant: "destructive",
      });
      return;
    }

    try {
      await uploadVouchers({
        variables: {
          input: {
            rewardId,
            vouchers: uploadData,
          },
        },
      });
      toast({
        title: "Vouchers Loaded",
        description: `Successfully loaded ${validCount} vouchers into inventory.`,
      });
      resetUpload();
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to load vouchers.",
        variant: "destructive",
      });
    }
  };

  const downloadTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,code,cardNumber,pin\nSAVE10-ABC1,123456789,1234\nSAVE10-ABC2,123456780,5678\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "voucher_codes_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-3 pt-3 border-t border-border/70 animate-in fade-in-50 duration-200">
      {/* ── 1. Link from Existing Manual Vouchers ─────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2.5">
          <Label className="text-xs font-bold text-foreground block">
            Select from Existing Manual Vouchers ({manualVouchers.length})
          </Label>
          <Link
            href="/gamification/rewards/pillars/manual"
            target="_blank"
            className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Manage All Pools</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="relative max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Filter vouchers by code/batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs bg-card border-border"
          />
        </div>

        {manualLoading ? (
          <div className="p-4 text-center border border-border/70 rounded-lg bg-card">
            <RotateCw className="h-4 w-4 animate-spin mx-auto text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">Loading vouchers...</p>
          </div>
        ) : manualVouchers.length === 0 ? (
          <div className="p-3 text-center border border-dashed border-border/80 rounded-lg bg-muted/10">
            <p className="text-xs text-muted-foreground">
              No existing manual vouchers found. Create a custom promo or upload a CSV below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
            {manualVouchers
              .filter((v: any) =>
                !searchQuery ||
                v.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.batch?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.reward?.title?.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((voucher: any) => {
                const isSelected =
                  formik.values.selectedRuleId === voucher.id ||
                  (formik.values.couponCode === voucher.code && !formik.values.selectedRuleId);

                return (
                  <div
                    key={voucher.id}
                    onClick={() => {
                      formik.setFieldValue("selectedRuleId", voucher.id);
                      formik.setFieldValue("couponCode", voucher.code);
                      formik.setFieldValue("couponType", voucher.couponType || "ONE_TO_ONE");
                      formik.setFieldValue("inventoryRequired", voucher.couponType === "ONE_TO_ONE");
                      if (voucher.faceValue) {
                        formik.setFieldValue("discountValue", String(voucher.faceValue));
                      }
                      if (!formik.values.title && (voucher.reward?.title || voucher.code)) {
                        formik.setFieldValue(
                          "title",
                          voucher.reward?.title || `₹${voucher.faceValue || ""} ${voucher.code} Voucher`
                        );
                      }
                      setActiveCreationType("NONE");
                      toast({
                        title: "Voucher Selected",
                        description: `Linked ${voucher.code}.`,
                      });
                    }}
                    className={cn(
                      "p-2 rounded-lg border text-left transition-all cursor-pointer space-y-1 flex flex-col justify-between",
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/30 ring-1 ring-emerald-600/30 shadow-xs"
                        : "border-border/70 bg-card hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-xs font-bold text-foreground truncate block">
                        {voucher.code}
                      </span>
                      <Badge
                        className={cn(
                          "text-[8px] font-bold px-1 py-0 uppercase",
                          voucher.isUsed
                            ? "bg-rose-500/10 text-rose-600"
                            : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        )}
                      >
                        {voucher.isUsed ? "Claimed" : "Available"}
                      </Badge>
                    </div>

                    <div className="pt-1 border-t border-border/40 flex items-center justify-between text-[9px] text-muted-foreground font-mono">
                      <span className="truncate max-w-[100px]">{voucher.batch?.name || "Pool"}</span>
                      <span>₹{voucher.faceValue || "--"}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* ── 2. Bottom: Custom Parameters & Create New (Promo / CSV) ──────── */}
      <div className="p-2.5 rounded-xl border border-border/80 bg-muted/20 space-y-2">
        <div className="flex items-center gap-1.5 flex-wrap">
            <Button
              type="button"
              size="sm"
              variant={activeCreationType === "PROMO" ? "default" : "outline"}
              onClick={() => {
                const next = activeCreationType === "PROMO" ? "NONE" : "PROMO";
                setActiveCreationType(next);
                if (next === "PROMO") {
                  formik.setFieldValue("couponType", "ONE_TO_MANY");
                  formik.setFieldValue("inventoryRequired", false);
                  formik.setFieldValue("selectedRuleId", "");
                }
              }}
              className="h-7 px-2 text-[10px] font-semibold gap-1"
            >
              <Tag className="h-3 w-3" />
              Custom Promo Code
            </Button>

            <Button
              type="button"
              size="sm"
              variant={activeCreationType === "CSV" ? "default" : "outline"}
              onClick={() => {
                const next = activeCreationType === "CSV" ? "NONE" : "CSV";
                setActiveCreationType(next);
                if (next === "CSV") {
                  formik.setFieldValue("couponType", "ONE_TO_ONE");
                  formik.setFieldValue("inventoryRequired", true);
                  formik.setFieldValue("selectedRuleId", "");
                  formik.setFieldValue("couponCode", "");
                }
              }}
              className="h-7 px-2 text-[10px] font-semibold gap-1"
            >
              <Upload className="h-3 w-3" />
              Upload CSV Batch
            </Button>
          </div>

        {/* Option A: Custom Promo Code */}
        {activeCreationType === "PROMO" && (
          <div className="p-2.5 rounded-lg border border-border bg-card space-y-1.5 animate-in fade-in-50">
            <Label
              htmlFor="couponCode"
              className="text-xs font-bold text-foreground"
            >
              Global Shared Promo Code *
            </Label>
            <Input
              id="couponCode"
              placeholder="e.g. SUMMER2026, THRICOPARTNER"
              className="h-8 bg-card border-border text-xs font-mono uppercase tracking-wider font-bold shadow-none max-w-sm"
              {...formik.getFieldProps("couponCode")}
            />
            <p className="text-[10px] text-muted-foreground">
              All winners receive this single promo code.
            </p>
            {err("couponCode")}
          </div>
        )}

        {/* Option B: Upload CSV */}
        {activeCreationType === "CSV" && (
          <div className="p-2.5 rounded-lg border border-border bg-card space-y-2 animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-bold text-foreground block">
                  CSV Serial Pool Ingestion
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  Columns: code, cardNumber, pin
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                className="text-[10px] font-semibold border-border h-6 px-2 rounded-md"
              >
                <FileSpreadsheet className="h-3 w-3 mr-1" />
                Template
              </Button>
            </div>

            {uploadStep === "idle" ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={cn(
                  "border border-dashed border-border hover:border-foreground rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-muted/20",
                  isDragging && "border-foreground bg-muted/40"
                )}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileChange}
                  accept=".csv,.txt"
                  className="hidden"
                />
                <Upload className="h-4 w-4 text-foreground mb-1 opacity-80" />
                <p className="text-xs font-semibold text-foreground">
                  Drag & drop CSV, or <span className="underline">browse</span>
                </p>
              </div>
            ) : uploadStep === "validating" ? (
              <div className="border border-border rounded-lg p-3 flex flex-col items-center justify-center text-center bg-muted/20">
                <RotateCw className="h-4 w-4 text-foreground animate-spin mb-1" />
                <p className="text-xs font-semibold text-foreground">
                  Analyzing codes...
                </p>
              </div>
            ) : (
              <div className="border border-border rounded-lg p-2.5 space-y-2 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground truncate max-w-[200px]">
                    {uploadedFile?.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={resetUpload}
                    className="text-xs text-muted-foreground h-6 px-1.5"
                  >
                    Reset
                  </Button>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-md p-1.5 flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium text-[11px]">
                    Valid codes detected:
                  </span>
                  <span className="font-bold text-emerald-600 text-xs font-mono">
                    {validCount}
                  </span>
                </div>

                <Button
                  type="button"
                  onClick={confirmUpload}
                  disabled={uploading}
                  className="w-full h-7 rounded-md text-xs font-bold bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
                >
                  {uploading && (
                    <RotateCw className="h-3 w-3 animate-spin mr-1.5" />
                  )}
                  Confirm & Load {validCount} Vouchers
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
