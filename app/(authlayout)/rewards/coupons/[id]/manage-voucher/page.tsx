"use client";

import React, { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Ticket,
  Upload,
  RotateCw,
  Sparkles,
  ChevronLeft,
  Trash2,
  Edit,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetRewardById,
  useGetVouchersPaginated,
  useUploadVouchers,
  useDeleteVoucher,
  useEditVoucher,
} from "@/graphql/actions/rewards";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import moment from "moment";

export default function ManageVoucherPage() {
  const params = useParams();
  const rewardId = params?.id as string;
  const router = useRouter();
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);

  const { data: rewardData, loading: rewardLoading } =
    useGetRewardById(rewardId);
  const reward = rewardData?.getRewardById;

  const { data: vouchersListData, refetch } = useGetVouchersPaginated({
    rewardId,
    pagination: { page: currentPage, limit: 10 },
  });

  const [uploadVouchers, { loading: uploading }] = useUploadVouchers();
  const [deleteVoucher, { loading: deleting }] = useDeleteVoucher();
  const [editVoucher, { loading: editing }] = useEditVoucher();

  const [deletingVoucher, setDeletingVoucher] = useState<any | null>(null);
  const [editingVoucher, setEditingVoucher] = useState<any | null>(null);

  const [editCode, setEditCode] = useState("");
  const [editCardNumber, setEditCardNumber] = useState("");
  const [editPin, setEditPin] = useState("");

  const [uploadStep, setUploadStep] = useState<
    "idle" | "validating" | "summary"
  >("idle");
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

    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean);
        if (lines.length < 2) {
          setUploadData([]);
          setValidCount(0);
          setUploadStep("summary");
          return;
        }

        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const codeIndex = headers.indexOf("code");
        const cardIndex = headers.indexOf("cardnumber");
        const pinIndex = headers.indexOf("pin");

        const data = lines
          .slice(1)
          .map((line) => {
            const parts = line.split(",").map((p) => p.trim());
            const code = codeIndex !== -1 ? parts[codeIndex] : parts[0];
            const cardNumber = cardIndex !== -1 ? parts[cardIndex] : undefined;
            const pin = pinIndex !== -1 ? parts[pinIndex] : undefined;
            return {
              code: code || "",
              cardNumber: cardNumber || null,
              pin: pin || null,
            };
          })
          .filter((item) => item.code);

        setUploadData(data);
        setValidCount(data.length);
        setUploadStep("summary");
      };
      reader.readAsText(file);
    }, 1200);
  };

  const downloadTemplate = () => {
    const csvContent =
      "code,cardNumber,pin\nVOUCHER-123,6034123456789999,847291\nVOUCHER-456,,";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vouchers_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const confirmUpload = async () => {
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
        title: "Upload Successful",
        description: `${validCount} vouchers have been added.`,
      });
      resetUpload();
      refetch();
    } catch {
      toast({
        title: "Upload Failure",
        variant: "destructive",
      });
    }
  };

  const resetUpload = () => {
    setUploadStep("idle");
    setUploadedFile(null);
    setValidCount(0);
    setUploadData([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteVoucher = async () => {
    if (!deletingVoucher) return;
    try {
      await deleteVoucher({
        variables: { voucherId: deletingVoucher.id },
      });
      toast({
        title: "Voucher Deleted",
        description: "The voucher has been successfully deleted.",
      });
      setDeletingVoucher(null);
      refetch();
    } catch (err: any) {
      toast({
        title: "Deletion Failed",
        description: err.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleEditVoucher = async () => {
    if (!editingVoucher) return;
    try {
      await editVoucher({
        variables: {
          voucherId: editingVoucher.id,
          input: {
            code: editCode,
            cardNumber: editCardNumber || null,
            pin: editPin || null,
          },
        },
      });
      toast({
        title: "Voucher Updated",
        description: "The voucher has been successfully updated.",
      });
      setEditingVoucher(null);
      refetch();
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };

  const startEditing = (v: any) => {
    setEditingVoucher(v);
    setEditCode(v.code || "");
    setEditCardNumber(v.cardNumber || "");
    setEditPin(v.pin || "");
  };

  if (rewardLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-black/5 p-10 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black/5 pb-20">
      <header className="bg-white dark:bg-[#0a0a0a] border-b border-border/40 sticky top-0 z-30 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
        <div className="px-6 h-16 flex items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/rewards/coupons">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-muted/50 hover:bg-muted shrink-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-[13px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                <Ticket className="h-4 w-4 text-indigo-500" />
                Manage Vouchers
              </h1>
              <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                Inventory for {reward?.title}
              </p>
            </div>
          </div>
          <Link href={`/rewards/coupons/${rewardId}/edit`}>
            <Button
              variant="outline"
              className="h-8 rounded-lg text-[11px] font-bold"
            >
              Back to Edit
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-6 py-10 space-y-8">
        {/* Upload Area */}
        <div className="bg-white dark:bg-muted/5 rounded-xl border border-border/40 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="space-y-0.5">
              <h3 className="text-[13px] font-bold text-foreground uppercase tracking-wider">
                Upload New Vouchers
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Drag and drop your CSV inventory file.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={downloadTemplate}
              className="text-[10px] font-bold text-indigo-600 uppercase hover:bg-indigo-50/50 h-8 rounded-lg"
            >
              Get CSV Template
            </Button>
          </div>

          {uploadStep === "idle" ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={cn(
                "border-2 border-dashed border-border/60 hover:border-indigo-500/40 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 bg-zinc-50/40 dark:bg-black/5 hover:bg-indigo-500/[0.01]",
                isDragging && "border-indigo-500 bg-indigo-500/[0.02]",
              )}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                accept=".csv,.txt"
                className="hidden"
              />
              <Upload className="h-8 w-8 text-indigo-500 mb-3 opacity-60" />
              <p className="text-[12px] font-bold text-foreground">
                Drag & drop your CSV file here, or{" "}
                <span className="text-indigo-600">browse</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Accepts .csv and .txt (each line is a voucher code)
              </p>
            </div>
          ) : uploadStep === "validating" ? (
            <div className="border border-border/40 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-zinc-50/20">
              <RotateCw className="h-6 w-6 text-indigo-600 animate-spin mb-3" />
              <p className="text-[12px] font-bold text-foreground">
                Analyzing codes...
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Parsing data structure and compiling codes.
              </p>
            </div>
          ) : (
            <div className="border border-border/40 rounded-xl p-6 space-y-5 bg-zinc-50/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Ticket className="h-5 w-5 text-emerald-500" />
                  <span className="text-[12px] font-bold text-foreground truncate max-w-[200px]">
                    {uploadedFile?.name}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetUpload}
                  className="text-[10px] font-bold text-muted-foreground uppercase hover:bg-muted h-8 px-3"
                >
                  Reset
                </Button>
              </div>

              <div className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-lg p-4 flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground font-medium">
                  Valid codes found:
                </span>
                <span className="font-black text-emerald-600 text-sm tabular-nums">
                  {validCount}
                </span>
              </div>

              <Button
                type="button"
                onClick={confirmUpload}
                disabled={uploading}
                className="w-full h-10 rounded-xl text-xs font-bold gap-2 shadow-sm"
              >
                {uploading && <RotateCw className="h-3 w-3 animate-spin" />}
                Confirm and Load {validCount} Vouchers
              </Button>
            </div>
          )}
        </div>

        {/* Inventory Table */}
        <div className="bg-white dark:bg-muted/5 rounded-xl border border-border/40 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border/40 bg-muted/10">
            <h3 className="text-[13px] font-bold text-foreground uppercase tracking-wider">
              Current Inventory (
              {vouchersListData?.getVouchersPaginated?.totalCount || 0})
            </h3>
          </div>
          {vouchersListData?.getVouchersPaginated?.vouchers &&
          vouchersListData.getVouchersPaginated.vouchers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-muted/20 border-b border-border/40">
                  <tr>
                    <th className="px-6 py-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                      Code
                    </th>
                    <th className="px-6 py-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                      Card Number
                    </th>
                    <th className="px-6 py-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                      PIN
                    </th>
                    <th className="px-6 py-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                      Status
                    </th>
                    <th className="px-6 py-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                      Redeemed By
                    </th>
                    <th className="px-6 py-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                      Created
                    </th>
                    <th className="px-6 py-3 font-bold text-muted-foreground text-right uppercase tracking-wider text-[10px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {vouchersListData.getVouchersPaginated.vouchers.map(
                    (v: any) => (
                      <tr
                        key={v.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-3 font-mono text-[11px] text-foreground font-medium">
                          {v.code}
                        </td>
                        <td className="px-6 py-3 font-mono text-[11px] text-muted-foreground">
                          {v.cardNumber || "-"}
                        </td>
                        <td className="px-6 py-3 font-mono text-[11px] text-muted-foreground">
                          {v.pin || "-"}
                        </td>
                        <td className="px-6 py-3">
                          {v.isUsed ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600">
                              Used
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                              Available
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          {v.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-[9px] font-bold text-indigo-600 dark:text-indigo-400 overflow-hidden shrink-0">
                                {v.assignedTo.avatar ? (
                                  <img
                                    src={`${process.env.NEXT_PUBLIC_CDN_URL}/${v.assignedTo.avatar}`}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  `${v.assignedTo.firstName?.[0] || ""}${v.assignedTo.lastName?.[0] || ""}`.toUpperCase()
                                )}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[11px] font-semibold text-foreground truncate">
                                  {v.assignedTo.firstName}{" "}
                                  {v.assignedTo.lastName}
                                </span>
                                {v.assignedAt && (
                                  <span className="text-[9px] text-muted-foreground">
                                    {moment(
                                      isNaN(Number(v.assignedAt))
                                        ? v.assignedAt
                                        : Number(v.assignedAt),
                                    ).format("MMM D, YYYY")}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground/40 font-medium">
                              -
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-muted-foreground text-[11px]">
                          {moment(
                            isNaN(Number(v.createdAt))
                              ? v.createdAt
                              : Number(v.createdAt),
                          ).format("MMMM Do YYYY, h:mm:ss a")}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={v.isUsed}
                              onClick={() => startEditing(v)}
                              className="h-8 w-8 text-muted-foreground hover:text-indigo-600 disabled:opacity-30"
                              title={
                                v.isUsed
                                  ? "Cannot edit a used voucher"
                                  : "Edit Voucher"
                              }
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={v.isUsed}
                              onClick={() => setDeletingVoucher(v)}
                              className="h-8 w-8 text-muted-foreground hover:text-rose-600 disabled:opacity-30"
                              title={
                                v.isUsed
                                  ? "Cannot delete a used voucher"
                                  : "Delete Voucher"
                              }
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>

              {/* Pagination controls */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-zinc-50/20">
                <div className="text-[11px] text-muted-foreground font-semibold">
                  Page {currentPage} of{" "}
                  {Math.ceil(
                    (vouchersListData?.getVouchersPaginated?.totalCount || 0) /
                      10,
                  ) || 1}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="h-8 text-[11px] font-bold"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={
                      !vouchersListData?.getVouchersPaginated?.hasNextPage
                    }
                    className="h-8 text-[11px] font-bold"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center flex flex-col items-center justify-center">
              <Sparkles className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="text-[12px] font-bold text-muted-foreground">
                No vouchers uploaded yet.
              </p>
              <p className="text-[11px] text-muted-foreground/60 mt-1">
                Upload a CSV file to add inventory.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingVoucher}
        onOpenChange={(open) => !open && setEditingVoucher(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[14px] uppercase tracking-wider font-bold">
              Edit Voucher Details
            </DialogTitle>
            <DialogDescription className="text-[11px] text-muted-foreground">
              Modify the codes of voucher credentials securely. Used vouchers
              cannot be altered.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-code"
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Code
              </Label>
              <Input
                id="edit-code"
                value={editCode}
                onChange={(e) => setEditCode(e.target.value)}
                placeholder="Voucher Code"
                className="h-9 border-border/40"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-card-number"
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                Card Number (Optional)
              </Label>
              <Input
                id="edit-card-number"
                value={editCardNumber}
                onChange={(e) => setEditCardNumber(e.target.value)}
                placeholder="Card Number"
                className="h-9 border-border/40"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-pin"
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                PIN (Optional)
              </Label>
              <Input
                id="edit-pin"
                value={editPin}
                onChange={(e) => setEditPin(e.target.value)}
                placeholder="PIN"
                className="h-9 border-border/40"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setEditingVoucher(null)}
              className="h-9 text-[11px] font-bold uppercase"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditVoucher}
              disabled={editing || !editCode}
              className="h-9 text-[11px] font-bold uppercase"
            >
              {editing && <RotateCw className="h-3 w-3 animate-spin mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={!!deletingVoucher}
        onOpenChange={(open) => !open && setDeletingVoucher(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[14px] uppercase tracking-wider font-bold text-rose-600 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              Destructive Action
            </DialogTitle>
            <DialogDescription className="text-[11px] text-muted-foreground">
              Are you sure you want to delete this voucher? This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="p-3 bg-rose-500/[0.03] border border-rose-500/10 rounded-xl space-y-1">
            <span className="text-[9px] uppercase font-bold text-rose-500">
              Voucher Code
            </span>
            <p className="text-[12px] font-mono font-bold text-foreground">
              {deletingVoucher?.code}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeletingVoucher(null)}
              className="h-9 text-[11px] font-bold uppercase"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteVoucher}
              disabled={deleting}
              className="h-9 text-[11px] font-bold uppercase bg-rose-600 hover:bg-rose-700"
            >
              {deleting && <RotateCw className="h-3 w-3 animate-spin mr-2" />}
              Delete Voucher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
