"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React from "react";
import { useParams } from "next/navigation";
import { SurveyResponsesView } from "@/components/surveys/responses/survey-responses-view";
import { motion } from "framer-motion";

function SurveyResponsesPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="w-full h-full">
      <SurveyResponsesView surveyId={id} />
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(SurveyResponsesPage, "SURVEYS", "canRead"),
  "surveys",
);
