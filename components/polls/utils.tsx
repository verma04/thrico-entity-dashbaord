"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, CheckCircle2 } from "lucide-react";

export const getStatusTag = (status: "DISABLED" | "APPROVED") => {
  switch (status) {
    case "DISABLED":
      return (
        <Badge
          variant="outline"
          className="gap-1 text-orange-600 border-orange-600"
        >
          <XCircle className="h-3 w-3" />
          Disabled
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge
          variant="outline"
          className="gap-1 text-green-600 border-green-600"
        >
          <CheckCircle className="h-3 w-3" />
          Approved
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getModalTitle = (
  dialogAction?: "DISABLE" | "ENABLE" | "DELETE"
) => {
  switch (dialogAction) {
    case "DISABLE":
      return "Disable Poll";
    case "ENABLE":
      return "Enable Poll";
    case "DELETE":
      return "Delete Poll";
    default:
      return "Confirm Action";
  }
};

export const getModalDescription = (
  dialogAction?: "DISABLE" | "ENABLE" | "DELETE"
) => {
  switch (dialogAction) {
    case "DISABLE":
      return "This will temporarily disable the Poll. It will not be visible until re-enabled.";
    case "ENABLE":
      return "This will re-enable the Poll and make it visible again.";
    case "DELETE":
      return "Will permanently delete the Poll and all its associated data. This action cannot be undone.";
    default:
      return "";
  }
};

export const getVerificationTag = (verified: boolean) => {
  if (verified) {
    return (
      <Badge variant="outline" className="gap-1 text-blue-600 border-blue-600">
        <CheckCircle2 className="h-3 w-3" />
        Verified
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-muted-foreground">
      Unverified
    </Badge>
  );
};
