"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, Share2 } from "lucide-react";
import Feed from "./feed";
import { FeedShareStatsView } from "./feed-share-stats";
import type { FeedProps } from "./types";

interface FeedDetailModalProps {
  feed: FeedProps | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "preview" | "shares";
}

export function FeedDetailModal({
  feed,
  open,
  onOpenChange,
  defaultTab = "preview",
}: FeedDetailModalProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
    }
  }, [open, defaultTab]);

  if (!feed) return null;

  const totalShares = feed.totalReShare || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-border bg-card rounded-2xl flex flex-col">
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-border/60 shrink-0">
          <div className="flex items-center justify-between gap-3 pr-6">
            <DialogTitle className="text-base font-semibold text-foreground">
              Post Details & Performance
            </DialogTitle>
            <Badge variant="outline" className="text-[11px] font-mono font-normal text-muted-foreground">
              ID: {feed.id}
            </Badge>
          </div>
        </DialogHeader>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
            <TabsList className="grid w-full grid-cols-2 h-10 p-1 bg-muted/60 rounded-xl">
              <TabsTrigger
                value="preview"
                className="flex items-center gap-2 text-xs font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Post Preview</span>
              </TabsTrigger>
              <TabsTrigger
                value="shares"
                className="flex items-center gap-2 text-xs font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs"
              >
                <Share2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Share Analytics & Sharers</span>
                {totalShares > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-4 px-1.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  >
                    {totalShares}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-4 focus-visible:outline-none">
              <div className="max-w-2xl mx-auto">
                <Feed feed={feed} />
              </div>
            </TabsContent>

            <TabsContent value="shares" className="mt-4 focus-visible:outline-none">
              <FeedShareStatsView feedId={feed.id.toString()} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FeedDetailModal;
