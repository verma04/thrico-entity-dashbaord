"use client";

import React from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import {
  BarChart3,
  Calendar,
} from "lucide-react";
import { poll, Status } from "../ts-types";
import { PollActions } from "./poll-actions";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface PollCardCompactProps {
  poll: poll;
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
  DISABLED: {
    label: "Disabled",
    bg: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500",
  },
};

export function PollCardCompact({ poll, refetch }: PollCardCompactProps) {
  const router = useRouter();

  const isApproved = poll.status === Status.APPROVED;

  const statusInfo = STATUS_CONFIG[poll.status] || {
    label: poll.status || "Unknown",
    bg: "bg-muted text-muted-foreground",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  };

  const isAdmin = poll.addedBy === "ENTITY" || !poll.user;

  return (
    <div
      onClick={() => router.push(`/polls/${poll.id}/manage`)}
      className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
    >
      {/* Classification-card style top color bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
        style={{
          backgroundColor: isApproved ? "#10b981" : "#f97316",
        }}
      />

      {/* ── Card Header ─────────────────────────────────────────────────── */}
      <div className="p-3 pb-0 flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={cn(
              "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight border",
              isAdmin
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
            )}
          >
            {isAdmin ? "Admin" : "Community"}
          </span>

          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-muted text-muted-foreground border border-border">
            <span
              className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusInfo.dot)}
            />
            {statusInfo.label}
          </span>
        </div>

        <div className="bg-background/80 hover:bg-background rounded-md transition-colors shrink-0">
          <PollActions poll={poll} refetch={refetch} />
        </div>
      </div>

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Title */}
          <h3
            className="text-xs sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors"
            title={poll.title}
          >
            {poll.title}
          </h3>

          {/* Question / Description */}
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
            {poll.question || "No description provided."}
          </p>

          {/* Options snippet */}
          {poll.options && poll.options.length > 0 && (
            <div className="pt-1 flex flex-wrap gap-1">
              {poll.options.slice(0, 2).map((opt, i) => (
                <div
                  key={i}
                  className="text-[10px] font-medium px-2 py-0.5 rounded bg-muted/60 text-foreground/80 border border-border/50 truncate max-w-[130px]"
                  title={opt.text}
                >
                  {opt.text}
                </div>
              ))}
              {poll.options.length > 2 && (
                <span className="text-[10px] font-medium text-muted-foreground self-center">
                  +{poll.options.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Creator info */}
          <div className="pt-0.5">
            {!poll.user ? (
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                <Avatar className="h-4 w-4 rounded-full border border-primary/20">
                  <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-bold">
                    EN
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-foreground/80">Entity Admin</span>
              </div>
            ) : (
              <UserProfileHoverCard user={poll.user}>
                <div
                  className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium cursor-pointer hover:text-primary transition-colors max-w-full truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Avatar className="h-4 w-4 rounded-full border border-border/60 shrink-0">
                    <AvatarImage
                      src={
                        poll.user.avatar?.startsWith("http")
                          ? poll.user.avatar
                          : `https://cdn.thrico.network/${poll.user.avatar}`
                      }
                      alt={`${poll.user.firstName || ""} ${poll.user.lastName || ""}`}
                    />
                    <AvatarFallback className="text-[8px] bg-muted font-bold">
                      {poll.user.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">
                    {poll.user.firstName} {poll.user.lastName}
                  </span>
                </div>
              </UserProfileHoverCard>
            )}
          </div>
        </div>

        {/* ── Card Footer ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1 text-foreground/80 font-medium">
            <BarChart3 className="h-3 w-3 text-primary shrink-0" />
            <span>{poll.totalVotes || 0}</span>
            <span className="text-[10px] text-muted-foreground font-normal">
              votes
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{moment(poll.createdAt).format("MMM D")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PollCardCompact;
