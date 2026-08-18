"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  Trash2,
  CheckCircle2,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  changePollStatus,
  deletePoll,
  getPollByIdForUser,
} from "@/graphql/actions/polls";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";

function PollDangerZonePage() {
  const singularName = useModuleStore((state) => state.pollSingularName);
  const moduleName = useModuleStore((state) => state.pollModuleName);
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data, loading: fetchingPoll } = getPollByIdForUser({
    variables: {
      input: { pollId: id },
    },
    skip: !id,
  });

  const poll = data?.getPollByIdForUser;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<"DISABLE" | "ENABLE" | "DELETE">();
  const [actionReason, setActionReason] = useState("");

  const handleAction = (action: "DISABLE" | "ENABLE" | "DELETE") => {
    setDialogAction(action);
    setActionReason("");
    setIsModalOpen(true);
  };

  const onCompleted = () => {
    setIsModalOpen(false);
    setActionReason("");
    if (dialogAction === "DELETE") {
      toast.success(`${singularName} deleted permanently`);
      router.push("/polls/all");
    } else if (dialogAction === "DISABLE") {
      toast.success(`${singularName} disabled successfully`);
    } else {
      toast.success(`${singularName} re-enabled successfully`);
    }
  };

  const onError = (err: any) => {
    toast.error(err?.message || `Failed to perform ${dialogAction?.toLowerCase()} action`);
  };

  const [removePoll, { loading: deleting }] = deletePoll({
    onCompleted,
    onError,
  });

  const [changeStatus, { loading: changingStatus }] = changePollStatus({
    onCompleted,
    onError,
  });

  const confirmAction = () => {
    if (dialogAction === "ENABLE" || dialogAction === "DISABLE") {
      changeStatus({
        variables: {
          input: {
            reason: actionReason,
            pollId: id,
            action: dialogAction,
          },
        },
      });
    } else if (dialogAction === "DELETE") {
      removePoll({
        variables: {
          input: {
            pollId: id,
            reason: actionReason,
          },
        },
      });
    }
  };

  const loading = deleting || changingStatus;

  if (fetchingPoll) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center max-w-lg mx-auto">
        <AlertTriangle className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-60" />
        <h3 className="text-base font-semibold">{singularName} Not Found</h3>
        <p className="text-xs text-muted-foreground mt-1">
          This {singularName.toLowerCase()} could not be loaded or was previously removed.
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push("/polls/all")}>
          Back to {moduleName}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-card/60 backdrop-blur-sm border border-border/70 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Danger Zone
            </h2>
            <Badge variant="destructive" className="text-[10px] uppercase tracking-wider px-1.5 py-0">
              High Impact
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Destructive actions and access controls for &ldquo;{poll.title || poll.question}&rdquo;.
          </p>
        </div>

        <Badge variant="outline" className="text-xs text-muted-foreground py-1 px-2.5 shrink-0 self-start sm:self-auto">
          Current Status: <span className="font-semibold text-foreground ml-1">{poll.status || "ACTIVE"}</span>
        </Badge>
      </div>

      {/* Main Actions Container (Shopify Polaris Danger Card style) */}
      <div className="bg-card border border-destructive/20 rounded-xl shadow-sm overflow-hidden divide-y divide-border/60">
        {/* Toggle Availability Row */}
        {poll.status === "APPROVED" ? (
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <h4 className="text-sm font-semibold text-foreground">Disable this {singularName}</h4>
              </div>
              <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
                Temporarily hide this {singularName.toLowerCase()} from community members and prevent new votes. Existing votes will be preserved.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/50 text-xs shrink-0 self-start sm:self-auto h-8"
              onClick={() => handleAction("DISABLE")}
            >
              Disable {singularName}
            </Button>
          </div>
        ) : (
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-sm font-semibold text-foreground">Re-enable this {singularName}</h4>
              </div>
              <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
                Make this {singularName.toLowerCase()} visible and interactive again for all eligible voters.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-xs shrink-0 self-start sm:self-auto h-8"
              onClick={() => handleAction("ENABLE")}
            >
              Enable {singularName}
            </Button>
          </div>
        )}

        {/* Permanent Deletion Row */}
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-destructive/[0.02] transition-colors">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-destructive" />
              <h4 className="text-sm font-semibold text-destructive">Delete this {singularName}</h4>
            </div>
            <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
              Permanently remove this {singularName.toLowerCase()}, its options, and all {poll.totalVotes || 0} cast votes from the database. This action is irreversible.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="text-xs shrink-0 self-start sm:self-auto h-8 shadow-sm"
            onClick={() => handleAction("DELETE")}
          >
            Delete {singularName}
          </Button>
        </div>
      </div>

      {/* Confirmation Safety Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-destructive mb-1">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle className="text-base font-semibold">
                {dialogAction === "DELETE" && `Delete ${singularName}?`}
                {dialogAction === "DISABLE" && `Disable ${singularName}?`}
                {dialogAction === "ENABLE" && `Re-enable ${singularName}?`}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              {dialogAction === "DELETE" &&
                `This action cannot be undone. All votes, responses, and audit records for "${poll.title || poll.question}" will be permanently removed.`}
              {dialogAction === "DISABLE" &&
                `Community members will no longer be able to view or vote on this ${singularName.toLowerCase()} until it is re-enabled.`}
              {dialogAction === "ENABLE" &&
                `This ${singularName.toLowerCase()} will become active and accept incoming votes again.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="action-reason" className="text-xs font-medium text-foreground">
              Reason / Audit Note <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="action-reason"
              rows={3}
              placeholder={`Provide a brief reason for ${dialogAction?.toLowerCase()}ing this ${singularName.toLowerCase()}...`}
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              className="text-xs resize-none"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={() => setIsModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant={dialogAction === "ENABLE" ? "default" : "destructive"}
              size="sm"
              className="text-xs h-8 gap-1.5"
              onClick={confirmAction}
              disabled={loading || !actionReason.trim()}
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {dialogAction === "DELETE" && `Confirm Delete`}
              {dialogAction === "DISABLE" && `Confirm Disable`}
              {dialogAction === "ENABLE" && `Confirm Enable`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withModulePermission(PollDangerZonePage, "POLLS", "canDelete");
