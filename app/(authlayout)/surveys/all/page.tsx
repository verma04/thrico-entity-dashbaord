"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import SurveysManage from "@/components/surveys/manage/surveys-manage";

function SurveysAllPage() {
  return <SurveysManage status="ALL" />;
}

export default withSubscriptionCheck(
  withModulePermission(SurveysAllPage, "SURVEYS", "canRead"),
  "surveys",
);
