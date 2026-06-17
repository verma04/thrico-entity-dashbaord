"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserDetail,
  useChangeUserStatus,
  useChangeUserVerification,
} from "@/graphql/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MoreHorizontal,
  Eye,
  Check,
  X,
  Lock,
  Unlock,
  AlertCircle,
  RefreshCw,
  Shield,
  ExternalLink,
  Network,
} from "lucide-react";
import { UserClassificationsSheet } from "./user-classifications-sheet";

enum Action {
  APPROVE = "APPROVE",
  BLOCK = "BLOCK",
  DISABLE = "DISABLE",
  ENABLE = "ENABLE",
  UNBLOCK = "UNBLOCK",
  REJECT = "REJECT",
  FLAG = "FLAG",
  VERIFY = "VERIFY",
  UNVERIFY = "UNVERIFY",
  REAPPROVE = "REAPPROVE",
}

export default function UserActions({ user }: { user: UserDetail }) {
  const router = useRouter();
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isClassificationsSheetOpen, setIsClassificationsSheetOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [reason, setReason] = useState("");

  const [changeStatus, { loading: isStatusLoading }] = useChangeUserStatus({
    onCompleted: () => {
      setIsActionModalOpen(false);
      setReason("");
      setSelectedAction(null);
    },
  });

  const [changeVerification, { loading: isVerificationLoading }] =
    useChangeUserVerification({
      onCompleted: () => {
        setIsActionModalOpen(false);
        setReason("");
        setSelectedAction(null);
      },
    });

  const isLoading = isStatusLoading || isVerificationLoading;

  const handleAction = (action: Action) => {
    setSelectedAction(action);
    setIsActionModalOpen(true);
  };

  const confirmAction = () => {
    if (selectedAction === Action.VERIFY || selectedAction === Action.UNVERIFY) {
      changeVerification({
        variables: {
          input: {
            userId: user.id,
            action: selectedAction,
            reason,
          },
        },
      });
      return;
    }

    changeStatus({
      variables: {
        input: {
          userId: user.id,
          action: selectedAction,
          reason,
        },
      },
    });
  };

  const isReasonRequired =
    selectedAction &&
    [
      Action.BLOCK,
      Action.APPROVE,
      Action.REJECT,
      Action.FLAG,
      Action.VERIFY,
    ].includes(selectedAction);

  interface ActionItem {
    label?: string;
    icon?: any;
    onClick?: () => void;
    color?: string;
    type?: "separator";
  }

  const actions: ActionItem[] = [
    {
      label: "View Profile",
      icon: ExternalLink,
      onClick: () => router.push(`/members/${user.id}`),
    },
    {
      label: "View Nodes",
      icon: Network,
      onClick: () => setIsClassificationsSheetOpen(true),
    },
    { type: "separator" },
  ];

  if (user.status === "PENDING") {
    actions.push(
      {
        label: "Approve",
        icon: Check,
        onClick: () => handleAction(Action.APPROVE),
        color: "text-green-600",
      },
      {
        label: "Reject",
        icon: X,
        onClick: () => handleAction(Action.REJECT),
        color: "text-red-600",
      },
      {
        label: "Block",
        icon: Lock,
        onClick: () => handleAction(Action.BLOCK),
        color: "text-red-700",
      },
    );
  }

  if (user.status === "BLOCKED") {
    actions.push(
      {
        label: "Unblock",
        icon: Unlock,
        onClick: () => handleAction(Action.UNBLOCK),
        color: "text-green-600",
      },
      {
        label: "Reject",
        icon: X,
        onClick: () => handleAction(Action.REJECT),
        color: "text-red-600",
      },
    );
  } else if (user.status === "REJECTED") {
    actions.push(
      {
        label: "Block",
        icon: Lock,
        onClick: () => handleAction(Action.BLOCK),
        color: "text-red-600",
      },
      {
        label: "Re-approve",
        icon: RefreshCw,
        onClick: () => handleAction(Action.REAPPROVE),
        color: "text-blue-600",
      },
    );
  }

  if (user.status === "APPROVED") {
    actions.push(
      {
        label: user.verification?.isVerified ? "Remove Verification" : "Verify",
        icon: Shield,
        onClick: () =>
          handleAction(
            user.verification?.isVerified ? Action.UNVERIFY : Action.VERIFY,
          ),
      },
      {
        label: "Block",
        icon: Lock,
        onClick: () => handleAction(Action.BLOCK),
        color: "text-red-600",
      },
      {
        label: "Disable",
        icon: Lock,
        onClick: () => handleAction(Action.DISABLE),
        color: "text-orange-600",
      },
    );
  }

  if (user.status === "DISABLED") {
    actions.push(
      {
        label: "Enable",
        icon: Check,
        onClick: () => handleAction(Action.ENABLE),
        color: "text-green-600",
      },
      {
        label: "Block",
        icon: Lock,
        onClick: () => handleAction(Action.BLOCK),
        color: "text-red-600",
      },
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((action, idx) =>
            action.type === "separator" ? (
              <DropdownMenuSeparator key={idx} />
            ) : (
              <DropdownMenuItem key={idx} onClick={action.onClick}>
                <action.icon className={`h-4 w-4 mr-2 ${action.color || ""}`} />
                {action.label}
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              {selectedAction === Action.APPROVE &&
                "This will approve the user's account and grant them access to the platform."}
              {selectedAction === Action.REJECT &&
                "This will reject the user's registration. They will need to register again to access the platform."}
              {selectedAction === Action.BLOCK &&
                "This will block the user from accessing the platform. They will not be able to log in."}
              {selectedAction === Action.UNBLOCK &&
                "This will unblock the user's account and restore their access to the platform."}
              {selectedAction === Action.DISABLE &&
                "This will temporarily disable the user's account. They will not be able to log in until re-enabled."}
              {selectedAction === Action.ENABLE &&
                "This will re-enable the user's account and restore their access to the platform."}
              {selectedAction === Action.FLAG &&
                "This will flag the user's account for further review by the admin team."}
              {selectedAction === Action.VERIFY &&
                "This will add a verification badge to the user's profile."}
              {selectedAction === Action.UNVERIFY &&
                "This will remove the verification badge from the user's profile."}
              {selectedAction === Action.REAPPROVE &&
                "This will change the user's status from rejected to approved."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {isReasonRequired && (
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for action</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason for this action..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsActionModalOpen(false);
                setReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              disabled={(isReasonRequired && !reason.trim()) || isLoading}
              variant={
                selectedAction === Action.BLOCK ||
                selectedAction === Action.REJECT ||
                selectedAction === Action.DISABLE
                  ? "destructive"
                  : "default"
              }
            >
              {isLoading && <RefreshCw className="h-4 w-4 animate-spin mr-2" />}
              {selectedAction === Action.APPROVE && "Approve"}
              {selectedAction === Action.REJECT && "Reject"}
              {selectedAction === Action.BLOCK && "Block"}
              {selectedAction === Action.UNBLOCK && "Unblock"}
              {selectedAction === Action.DISABLE && "Disable"}
              {selectedAction === Action.ENABLE && "Enable"}
              {selectedAction === Action.FLAG && "Flag"}
              {selectedAction === Action.VERIFY && "Verify"}
              {selectedAction === Action.UNVERIFY && "Remove Verification"}
              {selectedAction === Action.REAPPROVE && "Re-approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UserClassificationsSheet
        user={user}
        open={isClassificationsSheetOpen}
        onOpenChange={setIsClassificationsSheetOpen}
      />
    </>
  );
}
