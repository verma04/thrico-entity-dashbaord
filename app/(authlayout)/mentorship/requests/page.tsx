"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import React from "react";
import { RequestsManager } from "@/components/mentorship/requests-manager";

function MentorshipRequestPage() {
  return <RequestsManager />;
}

export default withSubscriptionCheck(
  withModulePermission(MentorshipRequestPage, "MENTORSHIP", "canRead"),
  "mentorship"
);
