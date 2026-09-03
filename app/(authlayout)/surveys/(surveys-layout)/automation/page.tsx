"use client";

import React from "react";
import { SurveyAutomationManage } from "@/components/surveys/automation/survey-automation-manage";
import { withModulePermission } from "@/components/hoc/with-module-permission";

const SurveyAutomationPage = () => {
  return <SurveyAutomationManage />;
};

export default withModulePermission(
  SurveyAutomationPage,
  "SURVEYS",
  "canRead"
);
