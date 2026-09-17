"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Story, useDeleteStory, useDeleteStories } from "@/graphql/actions/stories";
import { toast } from "sonner";

interface DeleteStoryDialogProps {
  story: Story | null;
  bulkIds?: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteStoryDialog({
  story,
  bulkIds,
  open,
  onOpenChange,
  onSuccess,
}: DeleteStoryDialogProps) {
  const [deleteStoryMutation, { loading: isDeletingSingle }] = useDeleteStory();
  const [deleteStoriesMutation, { loading: isDeletingBulk }] = useDeleteStories();

  const isBulk = Array.isArray(bulkIds) && bulkIds.length > 0;
  const isSubmitting = isDeletingSingle || isDeletingBulk;

  const handleDelete = async () => {
    try {
      if (isBulk && bulkIds) {
        const res = await deleteStoriesMutation({
          variables: { ids: bulkIds },
        });
        const count = res.data?.deleteStories?.count ?? bulkIds.length;
        toast.success(`Successfully deleted ${count} stories`);
      } else if (story) {
        await deleteStoryMutation({
          variables: { id: story.id },
        });
        toast.success("Story deleted successfully");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      console.error("Failed to delete story:", err);
      toast.error(err.message || "Failed to delete story");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-border/80 bg-card p-6 shadow-xl">
        <DialogHeader className="space-y-2">
          <div className="h-10 w-10 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-900 mb-1">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-base font-bold text-foreground">
            {isBulk
              ? `Delete ${bulkIds?.length} Selected Stories?`
              : "Delete Story?"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {isBulk ? (
              <>
                Are you sure you want to delete{" "}
                <span className="font-semibold text-foreground">
                  {bulkIds?.length} selected stories
                </span>
                ? This will permanently untrack storage, purge the associated media,
                and remove them from members' active feed. This action cannot be
                undone.
              </>
            ) : (
              <>
                Are you sure you want to permanently delete story{" "}
                <span className="font-mono text-foreground font-semibold">
                  "{story?.caption || story?.id.slice(0, 10)}"
                </span>
                ? This will remove the story from both active member feeds and past archives.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex items-center justify-end gap-2 mt-4 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="text-xs h-9 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="text-xs h-9 rounded-lg gap-1.5 font-semibold"
          >
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            {isBulk ? `Delete ${bulkIds?.length} Stories` : "Delete Story"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
