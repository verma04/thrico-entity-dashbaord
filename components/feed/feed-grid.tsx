"use client";

import Link from "next/link";
import { MessageSquarePlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Feed from "./feed";
import type { FeedProps } from "./types";

interface FeedGridProps {
  feeds: FeedProps[];
  emptyTitle?: string;
  emptyDescription?: string;
  onRefresh?: () => void;
}

export function FeedGrid({
  feeds,
  emptyTitle = "No posts found",
  emptyDescription = "No community posts match your current search or filter criteria. Try adjusting your filters or create a new post.",
  onRefresh,
}: FeedGridProps) {
  if (!feeds || feeds.length === 0) {
    return (
      <div className="rounded-[10px] border border-dashed border-[#d2d5d9] dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 p-12 text-center max-w-2xl mx-auto">
        <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <MessageSquarePlus className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-bold text-[#303030] dark:text-zinc-100 tracking-tight">{emptyTitle}</h4>
        <p className="text-xs text-[#616161] dark:text-zinc-400 mt-1 max-w-sm mx-auto leading-relaxed">
          {emptyDescription}
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            asChild
            size="sm"
            className="rounded-lg h-8.5 px-3.5 text-xs font-medium bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs cursor-pointer gap-1.5"
          >
            <Link href="/feed/create">
              <Plus className="h-3.5 w-3.5" />
              Create Post
            </Link>
          </Button>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="rounded-lg h-8.5 px-3 text-xs font-semibold border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[#303030] dark:text-zinc-200 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 shadow-2xs cursor-pointer"
            >
              Refresh
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 max-w-2xl mx-auto">
      {feeds.map((feed) => (
        <Feed key={feed.id} feed={feed} />
      ))}
    </div>
  );
}

export default FeedGrid;
