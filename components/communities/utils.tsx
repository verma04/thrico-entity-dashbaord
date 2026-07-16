export const getModalTitle = (
  dialogAction?:
    | "APPROVE"
    | "DISABLE"
    | "ENABLE"
    | "REJECT"
    | "VERIFY"
    | "UNVERIFY"
    | "REAPPROVE"
    | "PAUSE",
  singularName: string = "Community"
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
    | "PAUSE",
  singularName: string = "community"
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
    default:
      return "";
  }
};
