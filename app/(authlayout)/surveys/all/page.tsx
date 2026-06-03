"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { SurveysList } from "@/components/surveys/surveys-list";

function SurveysPage() {
  return <SurveysList />;
}

export default withSubscriptionCheck(
  withModulePermission(SurveysPage, "SURVEYS", "canRead"),
  "surveys"
);
