"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Feed from "./feed";
import type { FeedProps } from "./types";

interface FeedDetailModalProps {
  feed: FeedProps | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedDetailModal({
  feed,
  open,
  onOpenChange,
}: FeedDetailModalProps) {
  if (!feed) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-border bg-card rounded-2xl">
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-border/60">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Post Details
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <Feed feed={feed} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FeedDetailModal;
