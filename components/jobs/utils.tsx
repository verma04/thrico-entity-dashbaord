import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";

export const getModalDescription = (
  dialogAction?:
    | "APPROVE"
    | "DISABLE"
    | "ENABLE"
    | "REJECT"
    | "VERIFY"
    | "UNVERIFY"
    | "REAPPROVE"
    | "PAUSE"
    | "UNBLOCK"
) => {
  switch (dialogAction) {
    case "APPROVE":
      return "This will approve the job and make it visible to all users.";
    case "DISABLE":
      return "This will temporarily disable the job. It will not be visible until re-enabled.";
    case "ENABLE":
      return "This will re-enable the job and make it visible again.";
    case "REJECT":
      return "This will reject the job. It will not be published on the platform.";
    case "VERIFY":
      return "This will mark the job as verified, indicating it meets platform guidelines.";
    case "UNVERIFY":
      return "This will remove the verified status from the job.";
    case "REAPPROVE":
      return "This will change the job's status from rejected to approved, making it visible to users.";
    case "PAUSE":
      return "This will pause the job. It will not be accessible until resumed.";
    case "UNBLOCK":
      return "This will unblock the job and make it visible again.";
    default:
      return "";
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
    | "PAUSE"
    | "UNBLOCK"
) => {
  switch (dialogAction) {
    case "APPROVE":
      return "Approve Job";
    case "DISABLE":
      return "Disable Job";
    case "ENABLE":
      return "Enable Job";
    case "REJECT":
      return "Reject Job";
    case "VERIFY":
      return "Verify Job";
    case "UNVERIFY":
      return "Remove Job Verification";
    case "REAPPROVE":
      return "Re-approve Job";
    case "PAUSE":
      return "Pause Job";
    case "UNBLOCK":
      return "Unblock Job";
    default:
      return "Confirm Action";
  }
};

export const getStatusTag = (status?: string) => {
  switch (status) {
    case "APPROVED":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="destructive">
          <AlertCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    case "PENDING":
      return (
        <Badge variant="outline">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "DISABLED":
      return (
        <Badge variant="secondary">
          <AlertCircle className="w-3 h-3 mr-1" />
          Disabled
        </Badge>
      );
    case "BLOCKED":
      return (
        <Badge variant="destructive">
          <AlertCircle className="w-3 h-3 mr-1" />
          Blocked
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getVerificationTag = (isVerified: boolean) => {
  return isVerified ? (
    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
      <CheckCircle2 className="w-3 h-3 mr-1" />
      Verified
    </Badge>
  ) : (
    <Badge variant="outline">Unverified</Badge>
  );
};
