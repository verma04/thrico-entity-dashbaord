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
) => {
  switch (dialogAction) {
    case "APPROVE":
      return "Approve Community";

    case "DISABLE":
      return "Disable Community";
    case "ENABLE":
      return "Enable Community";

    case "REJECT":
      return "Reject Community";

    case "VERIFY":
      return "Verify Community";
    case "UNVERIFY":
      return "Remove Community Verification";
    case "REAPPROVE":
      return "Re-approve Community";
    case "PAUSE":
      return "Pause Community";

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
    | "PAUSE"
) => {
  switch (dialogAction) {
    case "APPROVE":
      return "This will approve the community and make it visible to all users.";

    case "DISABLE":
      return "This will temporarily disable the community. It will not be visible until re-enabled.";
    case "ENABLE":
      return "This will re-enable the community and make it visible again.";

    case "REJECT":
      return "This will reject the community. It will not be published on the platform.";

    case "VERIFY":
      return "This will mark the community as verified, indicating it meets platform guidelines.";
    case "UNVERIFY":
      return "This will remove the verified status from the community.";
    case "REAPPROVE":
      return "This will change the community's status from rejected to approved, making it visible to users.";
    case "PAUSE":
      return "This will pause the community. It will not be accessible until resumed.";
    default:
      return "";
  }
};
