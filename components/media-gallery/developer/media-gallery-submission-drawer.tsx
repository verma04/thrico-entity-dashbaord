"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  Check,
  X,
  Mail,
  User,
  FolderOpen,
  Calendar,
  ExternalLink,
  FileText,
  AlertCircle,
} from "lucide-react";
import { MediaGallerySubmissionItem } from "./media-gallery-developer-context";

interface MediaGallerySubmissionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: MediaGallerySubmissionItem | null;
  albumTitle?: string;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason?: string) => Promise<void>;
  isApproving: boolean;
  isRejecting: boolean;
}

export function MediaGallerySubmissionDrawer({
  open,
  onOpenChange,
  submission,
  albumTitle = "Community Uploads",
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: MediaGallerySubmissionDrawerProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!submission) return null;

  const isVideo =
    submission.type === "VIDEO" ||
    (submission.url && submission.url.match(/\.(mp4|webm|mov|m4v)$/i));

  const handleApprove = async () => {
    await onApprove(submission.id);
    onOpenChange(false);
  };

  const handleReject = async () => {
    await onReject(submission.id, rejectReason);
    setRejectReason("");
    setShowRejectInput(false);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-xl w-full flex flex-col p-0 bg-background"
      >
        {/* 1. Sticky Header */}
        <SheetHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <SheetTitle className="text-sm font-bold text-foreground">
                  Submission Moderation Review
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                  Inspect media content, author attribution, and verify compliance with community rules.
                </SheetDescription>
              </div>
            </div>

            <Badge
              variant="outline"
              className={
                submission.status === "PENDING_APPROVAL"
                  ? "border-amber-400/60 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-[10px]"
                  : submission.status === "APPROVED"
                  ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]"
                  : "border-rose-400/60 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold text-[10px]"
              }
            >
              {submission.status.replace("_", " ")}
            </Badge>
          </div>
        </SheetHeader>

        {/* 2. Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Media Preview Player */}
          <div className="rounded-xl border border-border/80 bg-zinc-950 overflow-hidden flex items-center justify-center min-h-[260px] max-h-[380px] shadow-2xs relative">
            {isVideo ? (
              <video
                src={submission.url}
                controls
                className="max-h-[380px] w-full object-contain"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={submission.url}
                alt={submission.caption || "Submitted photo"}
                className="max-h-[380px] w-full object-contain"
              />
            )}
            <a
              href={submission.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all text-xs flex items-center gap-1"
              title="Open full resolution in new tab"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Caption Card */}
          {submission.caption && (
            <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-2xs space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <FileText className="h-3 w-3 text-sky-500" />
                Submitted Caption & Description
              </span>
              <p className="text-xs text-foreground font-medium leading-relaxed">
                {submission.caption}
              </p>
            </div>
          )}

          {/* Contributor & Origin Metadata */}
          <div className="p-4 rounded-xl border border-border/70 bg-card shadow-2xs space-y-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Contributor & Origin Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/50">
                <User className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-muted-foreground block">Uploader Name</span>
                  <span className="font-semibold text-foreground truncate block">
                    {submission.externalUploaderName || "Anonymous Contributor"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/50">
                <Mail className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-muted-foreground block">Email Address</span>
                  <span className="font-semibold text-foreground truncate block">
                    {submission.externalUploaderEmail || "No email provided"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/50">
                <FolderOpen className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-muted-foreground block">Destination Album</span>
                  <span className="font-semibold text-foreground truncate block">
                    {albumTitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/50">
                <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-muted-foreground block">Submission Timestamp</span>
                  <span className="font-semibold text-foreground truncate block">
                    {new Date(submission.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rejection input area if toggled */}
          {showRejectInput && (
            <div className="p-3.5 rounded-xl border border-destructive/40 bg-destructive/5 space-y-2">
              <Label className="text-xs font-semibold text-destructive flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                Reason for Rejection (Optional note)
              </Label>
              <Input
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Blurry photo, inappropriate content, off-topic…"
                className="h-8 text-xs bg-background"
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowRejectInput(false)}
                  className="h-7 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isRejecting}
                  className="h-7 text-xs gap-1"
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Sticky Footer Actions */}
        <SheetFooter className="p-4 border-t border-border/60 bg-muted/10 flex sm:flex-row gap-2 justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-8 cursor-pointer"
          >
            Close
          </Button>

          <div className="flex items-center gap-2">
            {!showRejectInput && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRejectInput(true)}
                disabled={isRejecting || isApproving}
                className="h-8 text-xs gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>Decline</span>
              </Button>
            )}

            <Button
              size="sm"
              onClick={handleApprove}
              disabled={isApproving || isRejecting}
              className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-2xs font-medium"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{isApproving ? "Publishing…" : "Approve & Publish"}</span>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
