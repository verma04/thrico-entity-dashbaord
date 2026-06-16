"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle,
  X,
  Undo2,
  UserX,
  ShieldCheck,
  ShieldOff,
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
import {
  changeDiscussionForumStatus,
  changeDiscussionForumVerification,
  getDiscussionForumDetailsByID,
} from "@/graphql/actions/discussion-form";
import { getModalTitle, getModalDescription } from "@/components/forums/utils";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";

type ActionType =
  | "APPROVE"
  | "DISABLE"
  | "ENABLE"
  | "REJECT"
  | "VERIFY"
  | "UNVERIFY"
  | "REAPPROVE";

function ForumDangerZonePage() {
  const singularName = useModuleStore((state) => state.forumSingularName);
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data, loading: fetchingForum } = getDiscussionForumDetailsByID({
    variables: {
      input: {
        discussionForumId: id,
      },
    },
    skip: !id,
  });

  const forum = data?.getDiscussionForumDetailsByID;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<ActionType>();
  const [actionReason, setActionReason] = useState("");

  const handleAction = (action: ActionType) => {
    setDialogAction(action);
    setIsModalOpen(true);
  };

  const onCompleted = () => {
    setIsModalOpen(false);
    setActionReason("");
  };

  const [changeStatus, { loading: statusLoading }] =
    changeDiscussionForumStatus({
      onCompleted,
    });

  const [changeVerification, { loading: verifyLoading }] =
    changeDiscussionForumVerification({
      onCompleted,
    });

  const confirmAction = () => {
    if (dialogAction === "VERIFY" || dialogAction === "UNVERIFY") {
      return changeVerification({
        variables: {
          input: {
            reason: actionReason,
            discussionForumId: id,
            action: dialogAction,
          },
        },
      });
    } else {
      changeStatus({
        variables: {
          input: {
            discussionForumId: id,
            action: dialogAction,
            reason: actionReason,
          },
        },
      });
    }
  };

  const isReasonRequired =
    dialogAction === "APPROVE" ||
    dialogAction === "REJECT" ||
    dialogAction === "VERIFY" ||
    dialogAction === "REAPPROVE";

  const loading = statusLoading || verifyLoading;

  const getActionButtonText = () => {
    switch (dialogAction) {
      case "APPROVE":
        return `Approve ${singularName}`;
      case "DISABLE":
        return `Disable ${singularName}`;
      case "ENABLE":
        return `Enable ${singularName}`;
      case "REJECT":
        return `Reject ${singularName}`;
      case "VERIFY":
        return `Verify ${singularName}`;
      case "UNVERIFY":
        return "Remove Verification";
      case "REAPPROVE":
        return `Re-approve ${singularName}`;
      default:
        return "Confirm";
    }
  };

  const getActionVariant = () => {
    if (
      dialogAction === "DISABLE" ||
      dialogAction === "REJECT" ||
      dialogAction === "UNVERIFY"
    ) {
      return "destructive";
    }
    return "default";
  };

  if (fetchingForum) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!forum) {
    return <div>{singularName} not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-destructive flex items-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          Moderation & Danger Zone
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Administrative actions to manage the visibility and status of this
          {singularName.toLowerCase()}.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Verification Options */}
        {forum.status === "APPROVED" &&
          (forum?.verification?.isVerified ? (
            <Card className="border-amber-200 bg-amber-50/30">
              <CardHeader>
                <CardTitle className="text-amber-900 flex items-center gap-2">
                  <ShieldOff className="h-5 w-5" />
                  Remove Verification
                </CardTitle>
                <CardDescription className="text-amber-700/80">
                  Remove the verified badge from this {singularName.toLowerCase()}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="bg-white border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-900"
                  onClick={() => handleAction("UNVERIFY")}
                >
                  Remove Verification
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Verify {singularName}
                </CardTitle>
                <CardDescription className="text-blue-700/80">
                  Mark this {singularName.toLowerCase()} as officially verified by administrators.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="bg-white border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-900"
                  onClick={() => handleAction("VERIFY")}
                >
                  Verify {singularName}
                </Button>
              </CardContent>
            </Card>
          ))}

        {/* Status Changes */}
        {forum.status === "PENDING" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-emerald-200 bg-emerald-50/30">
              <CardHeader>
                <CardTitle className="text-emerald-900 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Approve {singularName}
                </CardTitle>
                <CardDescription className="text-emerald-700/80">
                  Approve this {singularName.toLowerCase()} to be visible to the community.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900"
                  onClick={() => handleAction("APPROVE")}
                >
                  Approve {singularName}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <X className="h-5 w-5" />
                  Reject {singularName}
                </CardTitle>
                <CardDescription>
                  Reject this {singularName.toLowerCase()} submission. It will not be visible to the
                  community.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={() => handleAction("REJECT")}
                >
                  Reject {singularName}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {forum.status === "REJECTED" && (
          <Card className="border-emerald-200 bg-emerald-50/30">
            <CardHeader>
              <CardTitle className="text-emerald-900 flex items-center gap-2">
                <Undo2 className="h-5 w-5" />
                Re-approve {singularName}
              </CardTitle>
              <CardDescription className="text-emerald-700/80">
                Change the status of this {singularName.toLowerCase()} from rejected to approved.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900"
                onClick={() => handleAction("REAPPROVE")}
              >
                Re-approve {singularName}
              </Button>
            </CardContent>
          </Card>
        )}

        {forum.status === "APPROVED" && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <UserX className="h-5 w-5" />
                Disable {singularName}
              </CardTitle>
              <CardDescription>
                Disable this active {singularName.toLowerCase()}. Users will no longer be able to
                interact with it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={() => handleAction("DISABLE")}
              >
                Disable {singularName}
              </Button>
            </CardContent>
          </Card>
        )}

        {forum.status === "DISABLED" && (
          <Card className="border-emerald-200 bg-emerald-50/30">
            <CardHeader>
              <CardTitle className="text-emerald-900 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Enable {singularName}
              </CardTitle>
              <CardDescription className="text-emerald-700/80">
                Re-enable this disabled {singularName.toLowerCase()}, allowing users to interact with
                it again.
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
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction && getModalTitle(dialogAction)}
            </DialogTitle>
            <DialogDescription>
              {dialogAction && getModalDescription(dialogAction)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason for action
                {isReasonRequired && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </Label>
              <Textarea
                id="reason"
                rows={4}
                placeholder="Enter reason for this action..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className={
                  isReasonRequired && !actionReason.trim()
                    ? "border-red-500"
                    : ""
                }
              />
              {isReasonRequired && !actionReason.trim() && (
                <p className="text-sm text-red-500">Please enter a reason</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={getActionVariant()}
              onClick={confirmAction}
              disabled={(isReasonRequired && !actionReason.trim()) || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                getActionButtonText()
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withModulePermission(ForumDangerZonePage, "FORUMS", "canDelete");
