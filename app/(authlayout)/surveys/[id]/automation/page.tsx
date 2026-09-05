"use client";

import React from "react";
import { useParams } from "next/navigation";
import { SurveyAutomationManage } from "@/components/surveys/automation/survey-automation-manage";
import { useGetSurvey } from "@/graphql/surveys/survey-queries";
import { withModulePermission } from "@/components/hoc/with-module-permission";

const ScopedSurveyAutomationPage = () => {
  const params = useParams();
  const surveyId = params.id as string;

  const { data } = useGetSurvey({
    variables: { getSurveyId: surveyId },
    skip: !surveyId,
  });

  const survey = data?.getSurvey;

  return (
    <SurveyAutomationManage
      scopedSurveyId={surveyId}
      scopedSurveyName={survey?.title || "Survey"}
    />
  );
};

export default withModulePermission(
  ScopedSurveyAutomationPage,
  "SURVEYS",
  "canRead"
);
