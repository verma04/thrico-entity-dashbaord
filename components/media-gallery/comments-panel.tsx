"use client";

import React, { useState } from "react";
import moment from "moment";
import { MessageCircle, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useGetMediaGalleryImageComments,
  useDeleteMediaGalleryCommentAdmin,
} from "@/graphql/actions/mediaGallery";

interface CommentUser {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
}

interface ImageComment {
  id: string;
  content: string;
  createdAt?: string | null;
  user?: CommentUser | null;
}

interface CommentEdge {
  node: ImageComment;
  cursor?: string;
}

interface CommentsConnection {
  edges?: CommentEdge[];
  pageInfo?: {
    hasNextPage: boolean;
    endCursor?: string | null;
  };
  totalCount?: number;
}

interface CommentsData {
  getMediaGalleryImageComments?: CommentsConnection;
}

export function CommentsPanel({
  imageId,
  open,
  onClose,
}: {
  imageId: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const { data, loading, refetch, fetchMore } = useGetMediaGalleryImageComments(
    imageId ?? "",
    20,
    undefined,
  );
  const [deleteCommentAdmin] = useDeleteMediaGalleryCommentAdmin();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const connection = data?.getMediaGalleryImageComments;
  const edges = connection?.edges ?? [];
  const pageInfo = connection?.pageInfo;
  const totalCount = connection?.totalCount ?? 0;

  const handleLoadMore = () => {
    if (!pageInfo?.hasNextPage || !pageInfo.endCursor) return;
    fetchMore({
      variables: { after: pageInfo.endCursor },
      updateQuery: (
        prev: CommentsData,
        { fetchMoreResult }: { fetchMoreResult?: CommentsData },
      ) => {
        if (!fetchMoreResult) return prev;
        return {
          getMediaGalleryImageComments: {
            ...fetchMoreResult.getMediaGalleryImageComments,
            edges: [
              ...(prev.getMediaGalleryImageComments?.edges ?? []),
              ...(fetchMoreResult.getMediaGalleryImageComments?.edges ?? []),
            ],
          },
        };
      },
    });
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteCommentAdmin({ variables: { id } });
      toast.success("Comment removed");
      refetch();
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to remove comment");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col justify-between overflow-hidden border-l border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900"
      >
        {/* Tier 1: Sticky Header */}
        <div className="p-5 border-b border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <SheetTitle className="text-xs font-bold text-[#303030] dark:text-zinc-100">
                  Media Comments
                </SheetTitle>
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono px-1.5 py-0 bg-white dark:bg-zinc-800 text-[#616161] dark:text-zinc-300 border-[#d2d5d9] dark:border-zinc-700"
                >
                  {totalCount}
                </Badge>
              </div>
              <SheetDescription className="text-[11px] text-[#616161] dark:text-zinc-400">
                Review and moderate community member comments
              </SheetDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 rounded-md hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tier 2: Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {loading && edges.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-16 w-full rounded-lg bg-muted/60"
                />
              ))}
            </div>
          ) : edges.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-10 w-10 rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground/50 mb-2">
                <MessageCircle className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-[#303030] dark:text-zinc-200">
                No comments yet
              </p>
              <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5">
                Comments from members will appear here for moderation
              </p>
            </div>
          ) : (
            <>
              {edges.map((edge: CommentEdge) => {
                const comment = edge.node;
                return (
                  <div
                    key={comment.id}
                    className="p-3 rounded-lg border border-[#e1e3e5]/70 dark:border-zinc-800 bg-[#f9fafb]/60 dark:bg-zinc-900/60 space-y-2 group transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar className="h-6 w-6 shrink-0 border border-border/40">
                          <AvatarFallback className="text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                            {comment.user?.firstName?.[0] ?? "U"}
                            {comment.user?.lastName?.[0] ?? ""}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-semibold text-[#303030] dark:text-zinc-100 truncate">
                          {comment.user
                            ? `${comment.user.firstName ?? ""} ${comment.user.lastName ?? ""}`.trim()
                            : "Community Member"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10.5px] text-[#616161] dark:text-zinc-400">
                          {comment.createdAt
                            ? moment(comment.createdAt).fromNow()
                            : ""}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
                          disabled={deletingId === comment.id}
                          onClick={() => handleDelete(comment.id)}
                          title="Delete comment"
                        >
                          {deletingId === comment.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-[#303030] dark:text-zinc-200 leading-relaxed break-words pl-8">
                      {comment.content}
                    </p>
                  </div>
                );
              })}

              {/* Load More */}
              {pageInfo?.hasNextPage && (
                <div className="pt-2 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="h-8 text-xs font-medium border-[#d2d5d9] dark:border-zinc-700"
                  >
                    {loading && (
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    )}
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Tier 3: Sticky Footer */}
        <div className="p-3.5 border-t border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex items-center justify-between text-[11px] text-[#616161] dark:text-zinc-400">
          <span>Moderator View</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-7.5 px-3 text-xs border-[#d2d5d9] dark:border-zinc-700"
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
