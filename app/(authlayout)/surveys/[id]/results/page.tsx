"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React from "react";
import { useParams } from "next/navigation";
import { SurveyResultsView } from "@/components/surveys/results/survey-results-view";
import { motion } from "framer-motion";

function SurveyResultsPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="w-full h-full">
      <SurveyResultsView surveyId={id} />
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(SurveyResultsPage, "SURVEYS", "canRead"),
  "surveys",
);
