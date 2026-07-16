"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { MessageCircle, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  useGetMediaGalleryImageComments,
  useDeleteMediaGalleryCommentAdmin,
} from "@/graphql/actions/mediaGallery";

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
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
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
    } catch (err: any) {
      toast.error(err.message || "Failed to remove comment");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Image Comments ({totalCount})
          </SheetTitle>
        </SheetHeader>
        <Separator />
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {loading && edges.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : edges.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
              <MessageCircle className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No comments yet</p>
            </div>
          ) : (
            <>
              {edges.map((edge: any) => {
                const comment = edge.node;
                return (
                  <div key={comment.id} className="flex gap-3 group">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                        {comment.user?.firstName?.[0] ?? "U"}
                        {comment.user?.lastName?.[0] ?? ""}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800">
                          {comment.user
                            ? `${comment.user.firstName ?? ""} ${comment.user.lastName ?? ""}`.trim()
                            : "Unknown User"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {comment.createdAt
                            ? format(new Date(comment.createdAt), "MMM d, yyyy")
                            : ""}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 break-words">
                        {comment.content}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      disabled={deletingId === comment.id}
                      onClick={() => handleDelete(comment.id)}
                    >
                      {deletingId === comment.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </Button>
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
                  >
                    {loading && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
