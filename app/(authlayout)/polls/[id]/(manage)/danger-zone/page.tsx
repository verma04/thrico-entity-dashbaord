"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  ShieldAlert,
  Trash2,
  CheckCircle,
  UserX,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { changePollStatus, deletePoll, getPollByIdForUser } from "@/graphql/actions/polls";
import { getModalTitle, getModalDescription } from "@/components/polls/utils";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";

function PollDangerZonePage() {
  const singularName = useModuleStore((state) => state.pollSingularName);
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data, loading: fetchingPoll } = getPollByIdForUser({
    variables: {
      input: {
        pollId: id,
      },
    },
    skip: !id,
  });

  const poll = data?.getPollByIdForUser;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<"DISABLE" | "ENABLE" | "DELETE">();
  const [actionReason, setActionReason] = useState("");

  const handleAction = (action: "DISABLE" | "ENABLE" | "DELETE") => {
    setDialogAction(action);
    setIsModalOpen(true);
  };

  const onCompleted = () => {
    setIsModalOpen(false);
    setActionReason("");
    if (dialogAction === "DELETE") {
      router.push("/polls");
    }
  };

  const [removePoll, { loading: deleting }] = deletePoll({
    onCompleted,
  });

  const [changeStatus, { loading: verifyBtn }] = changePollStatus({
    onCompleted,
  });

  const confirmAction = () => {
    if (dialogAction === "ENABLE" || dialogAction === "DISABLE") {
      return changeStatus({
        variables: {
          input: {
            reason: actionReason,
            pollId: id,
            action: dialogAction,
          },
        },
      });
    } else {
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

  const isReasonRequired = true;
  const loading = deleting || verifyBtn;

  if (fetchingPoll) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!poll) {
    return <div>{singularName} not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-destructive flex items-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          Danger Zone
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Irreversible and destructive actions for this {singularName.toLowerCase()}. Proceed with caution.
        </p>
      </div>

      <div className="grid gap-6">
        {poll.status === "APPROVED" && (
          <Card className="border-amber-200 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="text-amber-900 flex items-center gap-2">
                <UserX className="h-5 w-5" />
                Disable {singularName}
              </CardTitle>
              <CardDescription className="text-amber-700/80">
                Prevent users from seeing or interacting with this {singularName.toLowerCase()}. You can re-enable it later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="bg-white border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-900"
                onClick={() => handleAction("DISABLE")}
              >
                Disable {singularName}
              </Button>
            </CardContent>
          </Card>
        )}

        {poll.status === "DISABLED" && (
          <Card className="border-emerald-200 bg-emerald-50/30">
            <CardHeader>
              <CardTitle className="text-emerald-900 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Enable {singularName}
              </CardTitle>
              <CardDescription className="text-emerald-700/80">
                Make this {singularName.toLowerCase()} visible and interactive again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900"
                onClick={() => handleAction("ENABLE")}
              >
                Enable {singularName}
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Delete {singularName}
            </CardTitle>
            <CardDescription>
              Permanently delete this {singularName.toLowerCase()} and all associated data, including votes. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => handleAction("DELETE")}
            >
              Delete {singularName}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogAction && getModalTitle(dialogAction)}</DialogTitle>
            <DialogDescription>
              {dialogAction && getModalDescription(dialogAction)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason for action <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="reason"
                rows={4}
                placeholder="Enter reason for this action..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={
                dialogAction === "DISABLE" || dialogAction === "DELETE"
                  ? "destructive"
                  : "default"
              }
              onClick={confirmAction}
              disabled={isReasonRequired && !actionReason.trim()}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                <>
                  {dialogAction === "DELETE" && `Delete ${singularName}`}
                  {dialogAction === "DISABLE" && `Disable ${singularName}`}
                  {dialogAction === "ENABLE" && `Enable ${singularName}`}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withModulePermission(PollDangerZonePage, "POLLS", "canDelete");
