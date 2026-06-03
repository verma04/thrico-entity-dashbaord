"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React from "react";
import MentorshipAnalytics from "@/components/mentorship/mentorship-analytics";

function MentorshipPage() {
  return <MentorshipAnalytics />;
}

export default withSubscriptionCheck(
  withModulePermission(MentorshipPage, "MENTORSHIP", "canRead"),
  "mentorship"
);
