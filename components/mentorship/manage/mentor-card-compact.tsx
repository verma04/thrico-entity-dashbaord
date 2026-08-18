"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  Calendar,
} from "lucide-react";
import { MentorActions } from "../mentor-actions";
import { MentorDetailsDialog } from "../mentor-details-dialog";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MentorCardCompactProps {
  mentor: any;
  onEdit?: (mentor: any) => void;
  refetch?: () => void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string; bar: string }
> = {
  APPROVED: {
    label: "Approved",
    bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    bar: "#10b981",
  },
  PENDING: {
    label: "Pending",
    bg: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
    bar: "#f59e0b",
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
    bar: "#f43f5e",
  },
};

export function MentorCardCompact({
  mentor,
  onEdit,
  refetch,
}: MentorCardCompactProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const statusKey = mentor.isApproved
    ? "APPROVED"
    : mentor.isRequested
      ? "PENDING"
      : "REJECTED";

  const statusInfo = STATUS_CONFIG[statusKey] || {
    label: statusKey,
    bg: "bg-muted text-muted-foreground",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
    bar: "#6366f1",
  };

  const userObj = mentor.mentorUser?.user || null;
  const displayName =
    mentor.name ||
    mentor.displayName ||
    (userObj
      ? `${userObj.firstName || ""} ${userObj.lastName || ""}`.trim()
      : "Anonymous");

  const avatarUrl =
    mentor.image ||
    (userObj?.avatar
      ? userObj.avatar.startsWith("http")
        ? userObj.avatar
        : `https://cdn.thrico.network/${userObj.avatar}`
      : null);

  const skills: string[] = mentor.expertise || mentor.skills || [];

  return (
    <>
      <div
        onClick={() => setDetailsOpen(true)}
        className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
      >
        {/* Classification-card style top color bar */}
        <div
          className="absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
          style={{ backgroundColor: statusInfo.bar }}
        />

        {/* ── Card Header ─────────────────────────────────────────────────── */}
        <div className="p-3 pb-0 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight bg-primary/10 text-primary border border-primary/20">
              {mentor.categoryName || mentor.category?.title || "Mentor"}
            </span>

            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-muted text-muted-foreground border border-border">
              <span
                className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusInfo.dot)}
              />
              {statusInfo.label}
            </span>

            {mentor.isTopMentor && (
              <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                <Sparkles className="h-2.5 w-2.5 fill-amber-500" />
                Top
              </span>
            )}
          </div>

          <div className="bg-background/80 hover:bg-background rounded-md transition-colors shrink-0">
            <MentorActions
              mentor={mentor}
              onView={() => setDetailsOpen(true)}
              refetch={() => refetch?.()}
            />
          </div>
        </div>

        {/* ── Card Content Body ───────────────────────────────────────────── */}
        <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            {/* Avatar & Name Header */}
            <div className="flex items-center gap-2.5 pt-0.5">
              {userObj ? (
                <UserProfileHoverCard user={userObj}>
                  <Avatar className="h-10 w-10 rounded-full border border-border/60 shrink-0">
                    {avatarUrl ? (
                      <AvatarImage
                        src={avatarUrl}
                        alt={displayName}
                        className="object-cover"
                      />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {displayName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </UserProfileHoverCard>
              ) : (
                <Avatar className="h-10 w-10 rounded-full border border-border/60 shrink-0">
                  {avatarUrl ? (
                    <AvatarImage
                      src={avatarUrl}
                      alt={displayName}
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}

              <div className="flex flex-col min-w-0">
                <h3
                  className="text-xs sm:text-sm font-semibold text-foreground leading-snug truncate group-hover:text-primary transition-colors"
                  title={displayName}
                >
                  {displayName}
                </h3>
                <p className="text-[10px] text-muted-foreground truncate">
                  {mentor.title || mentor.intro || userObj?.email || "Mentor"}
                </p>
              </div>
            </div>

            {/* About / Description */}
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
              {mentor.about || mentor.intro || "No bio provided."}
            </p>

            {/* Skills & Expertise */}
            {skills && skills.length > 0 && (
              <div className="pt-0.5 flex flex-wrap gap-1">
                {skills.slice(0, 2).map((skill, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted/60 text-foreground/80 border border-border/50 truncate max-w-[120px]"
                    title={skill}
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 2 && (
                  <span className="text-[10px] font-medium text-muted-foreground self-center">
                    +{skills.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ── Card Footer ──────────────────────────────────────────────── */}
          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <GraduationCap className="h-3 w-3 shrink-0" />
              <span>{skills.length} skills</span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Calendar className="h-3 w-3 shrink-0" />
              <span>Joined {mentor.createdAt ? new Date(mentor.createdAt).toLocaleDateString() : "—"}</span>
            </div>
          </div>
        </div>
      </div>

      <MentorDetailsDialog
        mentor={mentor}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
}

export default MentorCardCompact;
