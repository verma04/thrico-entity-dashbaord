"use client";

import { Suspense } from "react";
import SurveysDashboard from "@/components/surveys/dashboard";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

/**
 * Surveys & Feedback Dashboard Page
 * Route: /surveys
 */
function SurveysDashboardPage() {
  return (
    <Suspense fallback={null}>
      <SurveysDashboard />
    </Suspense>
  );
}

export default withSubscriptionCheck(
  withModulePermission(SurveysDashboardPage, "SURVEYS", "canRead"),
  "surveys"
);
