"use client";

import React from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { discussionForm } from "../ts-types";
import { ForumActions } from "./forum-actions";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ForumCardCompactProps {
  forum: discussionForm;
  refetch?: () => void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  APPROVED: {
    label: "Approved",
    bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  PENDING: {
    label: "Pending",
    bg: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  DISABLED: {
    label: "Disabled",
    bg: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500",
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
};

export function ForumCardCompact({ forum, refetch }: ForumCardCompactProps) {
  const router = useRouter();

  const statusInfo = STATUS_CONFIG[forum.status?.toUpperCase()] || {
    label: forum.status || "Unknown",
    bg: "bg-muted text-muted-foreground",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  };

  const isApproved = forum.status === "APPROVED";

  return (
    <div
      onClick={() => router.push(`/forums/${forum.id}/manage`)}
      className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
    >
      {/* Classification-card style top color bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
        style={{
          backgroundColor: isApproved
            ? "#10b981"
            : forum.status === "PENDING"
              ? "#f59e0b"
              : forum.status === "REJECTED"
                ? "#f43f5e"
                : "#f97316",
        }}
      />

      {/* ── Card Header (no image container) ────────────────────────────── */}
      <div className="p-3 pb-0 flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight bg-primary/10 text-primary border border-primary/20">
            {forum.category?.name || "General"}
          </span>

          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-muted text-muted-foreground border border-border">
            <span
              className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusInfo.dot)}
            />
            {statusInfo.label}
          </span>

          {forum.verification?.isVerified && (
            <span className="flex items-center gap-0.5 text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded">
              <CheckCircle2 className="h-2.5 w-2.5" />
              Verified
            </span>
          )}
        </div>

        <div className="bg-background/80 hover:bg-background rounded-md transition-colors shrink-0">
          <ForumActions forum={forum} refetch={refetch} />
        </div>
      </div>

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Title */}
          <h3
            className="text-xs sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors"
            title={forum.title}
          >
            {forum.title}
          </h3>

          {/* Content snippet */}
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
            {forum.content?.replace(/<[^>]*>?/gm, "") || "No content."}
          </p>

          {/* Creator info */}
          <div className="pt-1">
            {!forum.user ? (
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                <Avatar className="h-4 w-4 rounded-full border border-primary/20">
                  <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-bold">
                    EN
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-foreground/80">Anonymous</span>
              </div>
            ) : (
              <UserProfileHoverCard user={forum.user}>
                <div
                  className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium cursor-pointer hover:text-primary transition-colors max-w-full truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Avatar className="h-4 w-4 rounded-full border border-border/60 shrink-0">
                    <AvatarImage
                      src={
                        forum.user.avatar?.startsWith("http")
                          ? forum.user.avatar
                          : `https://cdn.thrico.network/${forum.user.avatar}`
                      }
                      alt={`${forum.user.firstName || ""} ${forum.user.lastName || ""}`}
                    />
                    <AvatarFallback className="text-[8px] bg-muted font-bold">
                      {forum.user.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">
                    {forum.user.firstName} {forum.user.lastName}
                  </span>
                </div>
              </UserProfileHoverCard>
            )}
          </div>
        </div>

        {/* ── Card Footer ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ThumbsUp className="h-3 w-3 shrink-0" />
              <span>{forum.upVotes || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
              <ThumbsDown className="h-3 w-3 shrink-0" />
              <span>{forum.downVotes || 0}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{moment(forum.createdAt).format("MMM D")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForumCardCompact;
