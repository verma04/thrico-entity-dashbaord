"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserDetail,
  useChangeUserStatus,
  useChangeUserVerification,
} from "@/graphql/actions";
import { useGetUserSessions } from "@/graphql/actions/membership/membership-queries";
import {
  useLogoutUserSession,
  useLogoutAllUserSessions,
} from "@/graphql/actions/membership/membership-mutations";
import { safeFormat } from "@/lib/date-utils";
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
  Smartphone,
  LogOut,
} from "lucide-react";

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
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [reason, setReason] = useState("");
  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false);
  const [logoutAlertOpen, setLogoutAlertOpen] = useState(false);
  const [logoutTarget, setLogoutTarget] = useState<"ALL" | string | null>(null);

  const [fetchSessions, { data: sessionsData, loading: isSessionsLoading }] =
    useGetUserSessions(user?.user?.id);

  const [logoutSession, { loading: isLoggingOut }] = useLogoutUserSession({
    onCompleted: () => {
      fetchSessions();
      setLogoutAlertOpen(false);
      setLogoutTarget(null);
    },
  });

  const [logoutAllSessions, { loading: isLoggingOutAll }] =
    useLogoutAllUserSessions({
      onCompleted: () => {
        fetchSessions();
        setLogoutAlertOpen(false);
        setLogoutTarget(null);
      },
    });

  const handleConfirmLogout = () => {
    if (logoutTarget === "ALL") {
      logoutAllSessions({ variables: { userId: user.id } });
    } else if (logoutTarget) {
      logoutSession({ variables: { sessionId: logoutTarget } });
    }
  };

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
    if (
      selectedAction === Action.VERIFY ||
      selectedAction === Action.UNVERIFY
    ) {
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
      label: "View Sessions",
      icon: Smartphone,
      onClick: () => {
        setIsSessionsModalOpen(true);
        fetchSessions();
      },
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

      <Dialog open={isSessionsModalOpen} onOpenChange={setIsSessionsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Sessions</DialogTitle>
            <DialogDescription>
              Active and past sessions for {user.user.firstName}{" "}
              {user.user.lastName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
            {isSessionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : sessionsData?.getUserSessions &&
              sessionsData.getUserSessions.length > 0 ? (
              sessionsData.getUserSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-card"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">
                        {session.deviceName || "Unknown Device"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Last used:{" "}
                        {safeFormat(
                          session.lastUsed,
                          "MMM d, yyyy h:mm a",
                          "Never",
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.isActive && (
                      <span className="px-2 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded-full uppercase tracking-wider">
                        Active
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 text-light-50"
                      onClick={() => {
                        setLogoutTarget(session.id);
                        setLogoutAlertOpen(true);
                      }}
                      title="Logout this session"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8">
                No sessions found.
              </div>
            )}
          </div>
          <DialogFooter className="flex items-center sm:justify-between w-full mt-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setLogoutTarget("ALL");
                setLogoutAlertOpen(true);
              }}
              disabled={
                !sessionsData?.getUserSessions ||
                sessionsData.getUserSessions.length === 0
              }
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout All Sessions
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsSessionsModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={logoutAlertOpen} onOpenChange={setLogoutAlertOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Warning
            </DialogTitle>
            <DialogDescription className="text-foreground pt-2">
              This will logout the user from{" "}
              {logoutTarget === "ALL" ? "all active sessions" : "this session"}.
              <br />
              <br />
              <span className="font-semibold text-red-600">
                This action is not recommended.
              </span>{" "}
              Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              onClick={() => setLogoutAlertOpen(false)}
              disabled={isLoggingOut || isLoggingOutAll}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmLogout}
              disabled={isLoggingOut || isLoggingOutAll}
            >
              {(isLoggingOut || isLoggingOutAll) && (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              )}
              Confirm Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
