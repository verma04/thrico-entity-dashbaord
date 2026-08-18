"use client";

import Link from "next/link";
import { MessageSquarePlus, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
      <Card className="border border-dashed border-border/80 shadow-none bg-muted/20 rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 text-primary">
            <MessageSquarePlus className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">{emptyTitle}</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {emptyDescription}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="rounded-xl h-9 text-xs font-semibold gap-1.5"
            >
              <Link href="/feed/create">
                <Plus className="h-3.5 w-3.5" />
                Create Post
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
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
