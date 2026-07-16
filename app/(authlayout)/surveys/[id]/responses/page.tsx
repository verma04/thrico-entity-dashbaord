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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <SurveyResponsesView surveyId={id} />
    </motion.div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(SurveyResponsesPage, "SURVEYS", "canRead"),
  "surveys"
);
