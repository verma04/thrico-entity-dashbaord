"use client";

import React, { useState } from "react";
import moment from "moment";
import {
  PlaySquare,
  Play,
  Eye,
  Video,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Moment } from "@/graphql/actions/moments";
import { MomentActions } from "./moment-actions";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import { useModuleStore } from "@/store/useModuleStore";
import { cn } from "@/lib/utils";

interface MomentCardCompactProps {
  moment: Moment;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export function MomentCardCompact({
  moment: item,
  onClick,
  onDelete,
}: MomentCardCompactProps) {
  const singularName = useModuleStore((state) => state.momentSingularName);
  const isPublished = item?.status === "PUBLISHED";
  const [imgError, setImgError] = useState(false);

  const creatorName =
    `${item?.owner?.firstName ?? ""} ${item?.owner?.lastName ?? ""}`.trim() ||
    "Unknown";

  const thumbUrl =
    !imgError && item?.thumbnailUrl
      ? getPreferredMediaUrl(item.thumbnailUrl)
      : null;

  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer p-2.5"
    >
      {/* Classification-card style top color bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
        style={{ backgroundColor: isPublished ? "#10b981" : "#f59e0b" }}
      />

      {/* ── Top Cover / Video Thumbnail Area ────────────────────────────── */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden rounded-lg bg-zinc-950 flex items-center justify-center">
        {/* Ambient blurred background of the image filling the sides */}
        {thumbUrl && (
          <img
            src={thumbUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-40 pointer-events-none"
          />
        )}

        {/* Foreground sharp image with left/right space */}
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt={item?.caption || singularName}
            className="relative z-10 h-full w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 gap-1.5 text-muted-foreground/60">
            <Video className="h-7 w-7" />
            <span className="text-[9px] font-bold uppercase tracking-wider">
              No Preview
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none z-10" />

        {/* Hover play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
          <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
            <Play className="h-4 w-4 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Floating Media Badge (Top-Left) */}
        <div className="absolute top-2 left-2 z-20 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-2 py-1 flex items-center gap-1.5 shadow-xs leading-none">
          <PlaySquare className="h-3 w-3 text-white" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-white">
            Video
          </span>
        </div>

        {/* Action button (Top-Right) */}
        <div
          className="absolute top-2 right-2 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 rounded-md shadow-xs transition-colors">
            <MomentActions
              moment={item}
              onPreview={onClick}
              onDelete={onDelete}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white/90 hover:text-white hover:bg-white/20 rounded-md transition-colors"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              }
            />
          </div>
        </div>

        {/* Status pill on bottom of image */}
        <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1.5 pointer-events-none">
          <span
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold backdrop-blur-md bg-black/60 text-white border border-white/10 shadow-2xs",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full shrink-0",
                isPublished ? "bg-emerald-400" : "bg-amber-400",
              )}
            />
            {isPublished ? "Live" : "Draft"}
          </span>
        </div>
      </div>

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="pt-2.5 px-0.5 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Caption */}
          <h3
            className="text-xs sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors"
            title={item.caption}
          >
            {item.caption || "Untitled Moment"}
          </h3>

          {/* Creator info */}
          <div className="pt-0.5">
            {!item.owner ? (
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                <Avatar className="h-4 w-4 rounded-full border border-primary/20">
                  <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-bold">
                    EN
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-foreground/80">Entity</span>
              </div>
            ) : (
              <UserProfileHoverCard user={item.owner}>
                <div
                  className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium cursor-pointer hover:text-primary transition-colors max-w-full truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Avatar className="h-4 w-4 rounded-full border border-border/60 shrink-0">
                    <AvatarImage
                      src={
                        item.owner.avatar?.startsWith("http")
                          ? item.owner.avatar
                          : `https://cdn.thrico.network/${item.owner.avatar}`
                      }
                      alt={creatorName}
                    />
                    <AvatarFallback className="text-[8px] bg-muted font-bold">
                      {item.owner.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{creatorName}</span>
                </div>
              </UserProfileHoverCard>
            )}
          </div>
        </div>

        {/* ── Card Footer ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1 text-foreground/80 font-medium">
            <Eye className="h-3 w-3 text-muted-foreground shrink-0" />
            <span>{item.totalViews || 0}</span>
            <span className="text-[10px] text-muted-foreground font-normal">
              views
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{moment(item.createdAt).format("MMM D")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MomentCardCompact;
