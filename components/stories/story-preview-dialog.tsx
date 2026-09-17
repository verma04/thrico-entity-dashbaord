"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Calendar,
  Clock,
  Trash2,
  Radio,
  FileText,
} from "lucide-react";
import { Story } from "@/graphql/actions/stories";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import { getMediaUrl } from "./story-card";
import { safeFormat, safeFormatDistanceToNow } from "@/lib/date-utils";

interface StoryPreviewDialogProps {
  story: Story | null;
  onClose: () => void;
  onDeleteStory?: (story: Story) => void;
}

export function StoryPreviewDialog({
  story,
  onClose,
  onDeleteStory,
}: StoryPreviewDialogProps) {
  if (!story) return null;

  const isLive =
    story.isActive && new Date(story.expiresAt).getTime() > Date.now();
  const author = story.user;
  const authorName =
    [author?.firstName, author?.lastName].filter(Boolean).join(" ") ||
    "Unknown User";

  const imageUrl = getMediaUrl(story.image);
  const avatarUrl = getMediaUrl(author?.avatar);

  return (
    <Dialog open={!!story} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl border border-border/80 bg-card shadow-2xl">
        {/* Header Strip */}
        <div className="p-5 border-b border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-foreground">
                  {story.caption || "Story Details"}
                </h3>
                <AdminStatusBadge
                  status={isLive ? "Live" : "Expired"}
                  variant={isLive ? "success" : "neutral"}
                  className="text-[10px]"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Posted by {authorName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onDeleteStory && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onDeleteStory(story);
                }}
                className="h-8 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900 gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Story
              </Button>
            )}
          </div>
        </div>

        {/* Content Body: Two Columns */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Clean Story Phone Mockup (col-span-5) */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[260px] aspect-[9/16] rounded-3xl bg-zinc-950 border-4 border-zinc-800 shadow-xl overflow-hidden flex flex-col justify-between">
              {/* Top notch simulation */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 h-3.5 w-20 bg-zinc-900 rounded-full z-30" />

              {/* Story Image Layer */}
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={story.caption || "Story media"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
                  <Radio className="h-8 w-8 opacity-40 mb-1" />
                  <span className="text-xs">No media preview</span>
                </div>
              )}

              {/* Subtle gradient overlay at bottom for caption legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Story Bottom Bar in Mockup */}
              <div className="relative z-30 p-3 pt-6 mt-auto">
                {story.caption && (
                  <p className="text-xs font-semibold text-white line-clamp-3 drop-shadow mb-2">
                    {story.caption}
                  </p>
                )}
                <div className="flex items-center gap-2 text-[10px] text-white/80">
                  <Avatar className="h-5 w-5 border border-white/40">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="text-[8px]">
                      {authorName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium truncate">{authorName}</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 text-center">
              Story preview
            </p>
          </div>

          {/* Right Column: Non-Technical Business Details (col-span-7) */}
          <div className="md:col-span-7 space-y-4">
            {/* Author Card */}
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Author & Creator
                </span>
                <Badge variant="outline" className="text-[9px] font-bold">
                  Story Maker
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 border border-border/80">
                  <AvatarImage src={avatarUrl} alt={authorName} />
                  <AvatarFallback className="font-bold text-xs bg-muted">
                    {authorName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground">
                    {authorName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {author?.email || "No email on record"}
                  </p>
                  {author?.headline && (
                    <p className="text-xs text-muted-foreground/80 mt-0.5 italic truncate">
                      "{author.headline}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Story Caption */}
            {story.caption && (
              <div className="rounded-xl border border-border/60 bg-muted/10 p-4 space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-3 w-3 text-indigo-500" />
                  Caption
                </span>
                <p className="text-xs font-medium text-foreground leading-relaxed">
                  {story.caption}
                </p>
              </div>
            )}

            {/* Publication & Expiration Timeline */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border/60 bg-muted/10 p-3 space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-indigo-500" />
                  Posted At
                </span>
                <p className="text-xs font-semibold text-foreground">
                  {safeFormat(story.createdAt, "MMM d, yyyy · h:mm a")}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {safeFormatDistanceToNow(story.createdAt, { addSuffix: true })}
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/10 p-3 space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Clock className="h-3 w-3 text-amber-500" />
                  Status
                </span>
                <p className="text-xs font-semibold text-foreground">
                  {safeFormat(story.expiresAt, "MMM d, yyyy · h:mm a")}
                </p>
                <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  {isLive
                    ? `Active (ends ${safeFormatDistanceToNow(story.expiresAt, { addSuffix: true })})`
                    : "Expired archive"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
