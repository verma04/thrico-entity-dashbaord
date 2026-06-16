import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";

export const getModalDescription = (
  singularName: string,
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
      return `This will approve the ${singularName.toLowerCase()} and make it visible to all users.`;
    case "DISABLE":
      return `This will temporarily disable the ${singularName.toLowerCase()}. It will not be visible until re-enabled.`;
    case "ENABLE":
      return `This will re-enable the ${singularName.toLowerCase()} and make it visible again.`;
    case "REJECT":
      return `This will reject the ${singularName.toLowerCase()}. It will not be published on the platform.`;
    case "VERIFY":
      return `This will mark the ${singularName.toLowerCase()} as verified, indicating it meets platform guidelines.`;
    case "UNVERIFY":
      return `This will remove the verified status from the ${singularName.toLowerCase()}.`;
    case "REAPPROVE":
      return `This will change the ${singularName.toLowerCase()}'s status from rejected to approved, making it visible to users.`;
    case "PAUSE":
      return `This will pause the ${singularName.toLowerCase()}. It will not be accessible until resumed.`;
    case "UNBLOCK":
      return `This will unblock the ${singularName.toLowerCase()} and make it visible again.`;
    default:
      return "";
  }
};

export const getModalTitle = (
  singularName: string,
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
      return `Remove ${singularName} Verification`;
    case "REAPPROVE":
      return `Re-approve ${singularName}`;
    case "PAUSE":
      return `Pause ${singularName}`;
    case "UNBLOCK":
      return `Unblock ${singularName}`;
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
