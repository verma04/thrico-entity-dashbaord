"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  FileDown,
  Info,
  Loader2,
  FileText,
  X,
  CheckCircle2,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface BatchUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  uploadRewardId: string;
  setUploadRewardId: (id: string) => void;
  inventoryItems: any[];
  uploadStep: "idle" | "validating" | "summary";
  isDragging: boolean;
  setIsDragging: (val: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelect: (file: File) => void;
  downloadTemplate: () => void;
  uploadedFile: File | null;
  validCount: number;
  invalidCount: number;
  resetUpload: () => void;
  confirmUpload: () => void;
  uploading: boolean;
}

export function BatchUploadDialog({
  isOpen,
  onOpenChange,
  uploadRewardId,
  setUploadRewardId,
  inventoryItems,
  uploadStep,
  isDragging,
  setIsDragging,
  fileInputRef,
  handleFileSelect,
  downloadTemplate,
  uploadedFile,
  validCount,
  invalidCount,
  resetUpload,
  confirmUpload,
  uploading,
}: BatchUploadDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl border-border shadow-2xl p-0 overflow-hidden">
        <div className="p-8 space-y-6">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <Upload className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">
                  Batch Ingestion
                </DialogTitle>
                <DialogDescription className="text-xs font-medium text-muted-foreground mt-1">
                  Upload voucher codes via CSV. Ensure your file follows the standard template format.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Target Reward
              </Label>
              <Select value={uploadRewardId} onValueChange={setUploadRewardId}>
                <SelectTrigger className="h-11 rounded-xl border-border bg-zinc-50 font-medium">
                  <SelectValue placeholder="Select a reward..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl p-1 shadow-xl">
                  {inventoryItems.map((item: any) => (
                    <SelectItem
                      key={item.id}
                      value={item.id}
                      className="rounded-lg py-2 font-medium text-sm"
                    >
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <AnimatePresence mode="wait">
              {uploadStep === "idle" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileSelect(f);
                    }}
                  />
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-colors",
                      isDragging
                        ? "border-indigo-500 bg-indigo-50/50"
                        : "border-border hover:border-indigo-400 hover:bg-zinc-50",
                    )}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const f = e.dataTransfer.files[0];
                      if (f) handleFileSelect(f);
                    }}
                  >
                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <FileDown className="h-5 w-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">
                        {isDragging ? "Drop to upload" : "Click or drag CSV file"}
                      </p>
                      <p className="text-[10px] font-medium text-muted-foreground mt-1">
                        Only .csv files are supported
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/50">
                    <Info className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-[11px] text-indigo-700 font-semibold leading-none">Template Guidance</p>
                      <p className="text-[10px] text-indigo-600/80 font-medium">
                        Use the standard template to avoid validation errors.{" "}
                        <span onClick={downloadTemplate} className="font-bold underline cursor-pointer">
                          Download Sample
                        </span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {uploadStep === "validating" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 gap-4"
                >
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    Checking file...
                  </p>
                </motion.div>
              )}

              {uploadStep === "summary" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 border border-border">
                    <div className="h-10 w-10 rounded-lg bg-white border border-border flex items-center justify-center shadow-sm">
                      <FileText className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">
                        {uploadedFile?.name}
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">
                        {(uploadedFile ? uploadedFile.size / 1024 : 0).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:text-rose-600"
                      onClick={resetUpload}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                      <span className="text-2xl font-bold text-emerald-600 tabular-nums">
                        {validCount}
                      </span>
                      <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-tight mt-1">
                        Valid Records
                      </p>
                    </div>
                    <div className={cn(
                      "p-4 rounded-xl border",
                      invalidCount > 0 ? "bg-rose-50 border-rose-100" : "bg-zinc-50 border-border opacity-50"
                    )}>
                      <span className={cn(
                        "text-2xl font-bold tabular-nums",
                        invalidCount > 0 ? "text-rose-600" : "text-muted-foreground"
                      )}>
                        {invalidCount}
                      </span>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mt-1">
                        Errors Found
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-zinc-50 p-6 flex items-center justify-end gap-3 border-t border-border">
          <Button
            variant="ghost"
            onClick={resetUpload}
            disabled={uploading}
            className="rounded-xl font-bold text-xs uppercase"
          >
            Cancel
          </Button>
          {uploadStep === "summary" && validCount > 0 && (
            <Button
              onClick={confirmUpload}
              disabled={uploading}
              className="h-11 px-8 rounded-xl gap-2 font-bold shadow-sm"
            >
              {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
              Upload {validCount} Vouchers
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
