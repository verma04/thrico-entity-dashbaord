"use client";

import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  PauseCircle,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { discussionForumStatus } from "./ts-types";

export const getStatusTag = (status: discussionForumStatus) => {
  switch (status) {
    case "APPROVED":
      return (
        <Badge
          variant="default"
          className="gap-1.5 bg-green-500 hover:bg-green-600"
        >
          <CheckCircle className="h-3 w-3" />
          APPROVED
        </Badge>
      );
    case "PENDING":
      return (
        <Badge
          variant="default"
          className="gap-1.5 bg-amber-500 hover:bg-amber-600"
        >
          <PauseCircle className="h-3 w-3" />
          Pending
        </Badge>
      );

    case "REJECTED":
      return (
        <Badge
          variant="default"
          className="gap-1.5 bg-purple-500 hover:bg-purple-600"
        >
          <XCircle className="h-3 w-3" />
          Rejected
        </Badge>
      );

    case "DISABLED":
      return (
        <Badge
          variant="default"
          className="gap-1.5 bg-orange-500 hover:bg-orange-600"
        >
          <AlertCircle className="h-3 w-3" />
          Disabled
        </Badge>
      );
    case "ENABLED":
      return (
        <Badge
          variant="default"
          className="gap-1.5 bg-green-500 hover:bg-green-600"
        >
          <CheckCircle className="h-3 w-3" />
          APPROVED
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const getModalTitle = (
  dialogAction?:
    | "APPROVE"
    | "DISABLE"
    | "ENABLE"
    | "REJECT"
    | "VERIFY"
    | "UNVERIFY"
    | "REAPPROVE"
) => {
  switch (dialogAction) {
    case "APPROVE":
      return "Approve Discussion";

    case "DISABLE":
      return "Disable Discussion";
    case "ENABLE":
      return "Enable Discussion";

    case "REJECT":
      return "Reject Discussion";

    case "VERIFY":
      return "Verify Discussion";
    case "UNVERIFY":
      return "Remove Discussion Verification";
    case "REAPPROVE":
      return "Re-approve Discussion";

    default:
      return "Confirm Action";
  }
};

export const getModalDescription = (
  dialogAction?:
    | "APPROVE"
    | "DISABLE"
    | "ENABLE"
    | "REJECT"
    | "VERIFY"
    | "UNVERIFY"
    | "REAPPROVE"
) => {
  switch (dialogAction) {
    case "APPROVE":
      return "This will approve the discussion and make it visible to all users.";

    case "DISABLE":
      return "This will temporarily disable the discussion. It will not be visible until re-enabled.";
    case "ENABLE":
      return "This will re-enable the discussion and make it visible again.";

    case "REJECT":
      return "This will reject the discussion. It will not be published on the platform.";

    case "VERIFY":
      return "This will mark the discussion as verified, indicating it meets platform guidelines.";
    case "UNVERIFY":
      return "This will remove the verified status from the discussion.";
    case "REAPPROVE":
      return "This will change the discussion's status from rejected to approved, making it visible to users.";
    default:
      return "";
  }
};

export const getVerificationTag = (verified: boolean) => {
  if (verified) {
    return (
      <Badge
        variant="default"
        className="gap-1.5 bg-blue-500 hover:bg-blue-600"
      >
        <ShieldCheck className="h-3 w-3" />
        Verified
      </Badge>
    );
  }
  return <Badge variant="secondary">Unverified</Badge>;
};
