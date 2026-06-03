"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React from "react";
import { MentorsManager } from "@/components/mentorship/mentors-manager";

function AllMentorsPage() {
  return <MentorsManager />;
}

export default withSubscriptionCheck(
  withModulePermission(AllMentorsPage, "MENTORSHIP", "canRead"),
  "mentorship"
);
