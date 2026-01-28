"use client";

import React from "react";
import { useParams } from "next/navigation";
import { SurveyResultsView } from "@/components/surveys/results/survey-results-view";
import { motion } from "framer-motion";

export default function SurveyResultsPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <SurveyResultsView surveyId={id} />
    </motion.div>
  );
}
