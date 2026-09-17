"use client";

import React from "react";
import {
  MoreHorizontal,
  Eye,
  Trash2,
  Clock,
  Radio,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Story } from "@/graphql/actions/stories";
import { safeFormat, safeFormatDistanceToNow } from "@/lib/date-utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StoryCardProps {
  story: Story;
  onSelectStory: (story: Story) => void;
  onDeleteStory?: (story: Story) => void;
}

export function getMediaUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `https://cdn.thrico.network${path.startsWith("/") ? "" : "/"}${path}`;
}

export function StoryCard({
  story,
  onSelectStory,
  onDeleteStory,
}: StoryCardProps) {
  const isLive =
    story.isActive && new Date(story.expiresAt).getTime() > Date.now();
  const author = story.user;
  const authorName =
    [author?.firstName, author?.lastName].filter(Boolean).join(" ") ||
    "Unknown User";



  const imageUrl = getMediaUrl(story.image);
  const avatarUrl = getMediaUrl(author?.avatar);

  return (
    <Card
      onClick={() => onSelectStory(story)}
      className="group cursor-pointer rounded-xl border border-border/60 bg-card hover:border-border hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
    >
      {/* Top Header: Author + Status + Dropdown */}
      <div className="p-3 pb-2 flex items-center justify-between gap-2 border-b border-border/40 bg-muted/20">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="h-7 w-7 border border-border/60 shrink-0">
            <AvatarImage src={avatarUrl} alt={authorName} className="object-cover" />
            <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">
              {authorName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
              {authorName}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              {author?.headline || author?.email || "Story Maker"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          {isLive ? (
            <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[9px] px-1.5 py-0 font-bold gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-muted text-muted-foreground text-[9px] px-1.5 py-0 font-medium">
              Expired
            </Badge>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground rounded-[4px]"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-lg">
              <DropdownMenuItem
                onClick={() => onSelectStory(story)}
                className="text-xs font-medium cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                Inspect Story
              </DropdownMenuItem>
              {onDeleteStory && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDeleteStory(story)}
                    className="text-xs font-medium text-rose-600 dark:text-rose-400 focus:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Delete Story
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Center: Portrait Media Thumbnail Container */}
      <div className="relative aspect-[4/5] sm:aspect-[9/14] w-full bg-zinc-950 overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={story.caption || "Story media"}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-500 gap-1">
            <Radio className="h-6 w-6 opacity-40" />
            <span className="text-[10px]">No media</span>
          </div>
        )}

        {/* Gradient shadow overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />


        {/* Caption snippet floating over image bottom */}
        {story.caption && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
            <p className="text-[11px] font-medium text-white/95 line-clamp-2 drop-shadow-sm leading-snug">
              {story.caption}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Footer: Timestamps & Meta */}
      <div className="p-3 pt-2.5 bg-card flex flex-col gap-1 border-t border-border/40">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1 truncate">
            <Calendar className="h-3 w-3 shrink-0 text-muted-foreground/70" />
            {safeFormat(story.createdAt, "MMM d, h:mm a")}
          </span>
          <span className="flex items-center gap-1 font-medium shrink-0">
            <Clock className="h-3 w-3 shrink-0 text-muted-foreground/70" />
            {isLive ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Expires {safeFormatDistanceToNow(story.expiresAt, { addSuffix: true })}
              </span>
            ) : (
              <span>
                Ended {safeFormatDistanceToNow(story.expiresAt, { addSuffix: true })}
              </span>
            )}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function StoryCardSkeleton() {
  return (
    <Card className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="p-3 flex items-center justify-between gap-2 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
        <Skeleton className="h-5 w-12 rounded" />
      </div>
      <Skeleton className="aspect-[4/5] sm:aspect-[9/14] w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      </div>
    </Card>
  );
}
