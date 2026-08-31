"use client";

import React from "react";
import { useParams } from "next/navigation";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { SurveySettings } from "@/components/surveys/manage/survey-settings";

function SettingsPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="w-full">
      <SurveySettings surveyId={id} />
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(SettingsPage, "SURVEYS", "canEdit"),
  "surveys",
);
