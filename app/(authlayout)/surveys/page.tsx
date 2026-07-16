"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React from "react";
import SurveyAnalytics from "@/components/surveys/dashboard/analytics";

function SurveysDashboard() {
  return <SurveyAnalytics />;
}

export default withSubscriptionCheck(
  withModulePermission(SurveysDashboard, "SURVEYS", "canRead"),
  "surveys"
);
