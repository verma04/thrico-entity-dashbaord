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

    default:
      return "Confirm Action";
  }
};
