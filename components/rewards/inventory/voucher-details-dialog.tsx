"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  CheckCircle2,
  Trash2,
  Calendar,
  User,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Voucher {
  id: string;
  code: string;
  offerId: string;
  rewardTitle?: string;
  isUsed: boolean;
  assignedTo?: string;
  assignedAt?: string;
  expiryDate?: string;
  createdAt: string;
}

interface VoucherDetailsDialogProps {
  voucher: Voucher | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkAsUsed: (voucherId: string) => void;
  onDelete: (voucherId: string) => void;
}

export function VoucherDetailsDialog({
  voucher,
  open,
  onOpenChange,
  onMarkAsUsed,
  onDelete,
}: VoucherDetailsDialogProps) {
  const { toast } = useToast();

  if (!voucher) return null;

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Voucher code copied to clipboard.",
    });
  };

  const handleMarkAsUsed = () => {
    onMarkAsUsed(voucher.id);
    onOpenChange(false);
  };

  const handleDelete = () => {
    onDelete(voucher.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Voucher Details</DialogTitle>
          <DialogDescription>
            View and manage this voucher code.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Voucher Code */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">
              Voucher Code
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-4 py-3 rounded-lg bg-muted font-mono text-lg font-bold">
                {voucher.code}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(voucher.code)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">
                Status
              </label>
              <Badge
                variant="outline"
                className={cn(
                  "text-sm font-bold px-3 py-1",
                  voucher.isUsed
                    ? "text-muted-foreground bg-muted"
                    : "text-emerald-600 bg-emerald-50 border-emerald-200",
                )}
              >
                {voucher.isUsed ? "Used" : "Available"}
              </Badge>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">
                Reward
              </label>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {voucher.rewardTitle || "Unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* Assignment Info */}
          {voucher.assignedTo && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">
                Assigned To
              </label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{voucher.assignedTo}</p>
                  {voucher.assignedAt && (
                    <p className="text-xs text-muted-foreground">
                      Assigned on{" "}
                      {new Date(voucher.assignedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">
                Created
              </label>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {new Date(voucher.createdAt).toLocaleDateString()}
              </div>
            </div>

            {voucher.expiryDate && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Expires
                </label>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {new Date(voucher.expiryDate).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {!voucher.isUsed && (
            <Button
              variant="default"
              className="gap-2"
              onClick={handleMarkAsUsed}
            >
              <CheckCircle2 className="h-4 w-4" /> Mark as Used
            </Button>
          )}
          <Button
            variant="destructive"
            className="gap-2"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
