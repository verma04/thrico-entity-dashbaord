"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  EnterpriseLeaderboardConfig,
  useDeleteEnterpriseLeaderboard,
} from "@/graphql/actions/enterprise-leaderboard";
import { toast } from "sonner";
import { AlertTriangle, Archive } from "lucide-react";

interface DeleteLeaderboardDialogProps {
  leaderboard: EnterpriseLeaderboardConfig | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteLeaderboardDialog({
  leaderboard,
  open,
  onOpenChange,
  onSuccess,
}: DeleteLeaderboardDialogProps) {
  const [deleteLeaderboard, { loading }] = useDeleteEnterpriseLeaderboard({
    onCompleted: () => {
      toast.success("Leaderboard archived successfully");
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to archive leaderboard");
    },
  });

  const handleDelete = () => {
    if (!leaderboard) return;
    deleteLeaderboard({
      variables: {
        id: leaderboard.id,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] border-border bg-card">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
              <Archive className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                Archive Leaderboard
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Disable and archive this enterprise ranking board.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to archive{" "}
            <strong className="text-foreground">{leaderboard?.name}</strong> (
            <code className="font-mono text-xs text-primary">{leaderboard?.code}</code>
            )?
          </p>
          <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-400 text-xs flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              SDK requests for this leaderboard code will return an archived status. Historical scores and snapshots will remain preserved.
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="text-xs font-medium"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="text-xs font-medium gap-1.5"
          >
            {loading ? "Archiving..." : "Archive Leaderboard"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
