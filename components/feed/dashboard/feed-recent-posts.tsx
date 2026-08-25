"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, Eye } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FeedPostItem {
  id: string;
  body?: string;
  createdAt?: string;
  author?: {
    name?: string;
    avatar?: string;
  };
  reactionsCount?: number;
  commentsCount?: number;
}

interface FeedRecentPostsProps {
  loading: boolean;
  posts: FeedPostItem[];
}

export function FeedRecentPosts({ loading, posts }: FeedRecentPostsProps) {
  return (
    <section className="space-y-3">
      <DashboardSectionHeading
        title="Recent Feed Posts"
        icon={<MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />}
        rightElement={
          <Link href="/feed/all">
            <span className="text-xs text-primary font-medium hover:underline cursor-pointer">
              View all
            </span>
          </Link>
        }
      />
      <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-14 rounded-xl bg-muted/50 border border-border animate-pulse"
                />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-xs font-medium">No recent feed activities recorded</p>
            </div>
          ) : (
            <div className="space-y-2">
              {posts.slice(0, 5).map((post) => {
                const authorName = post.author?.name || "Community Member";
                const dateStr = post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Just now";

                return (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-xs transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-8 w-8 border border-border shrink-0">
                        <AvatarImage
                          src={post.author?.avatar}
                          alt={authorName}
                        />
                        <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-medium uppercase">
                          {authorName.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {authorName}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            • {dateStr}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                          {post.body || "Shared a new update in the community feed"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-muted-foreground shrink-0 ml-3">
                      <span className="flex items-center gap-1 text-[10px] font-medium tabular-nums px-2 py-0.5 rounded-full bg-muted">
                        <Eye size={10} />
                        {(post.reactionsCount || 0) + (post.commentsCount || 0)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
