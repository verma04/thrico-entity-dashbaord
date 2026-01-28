"use client";

import { SurveysHeader } from "@/components/surveys/surveys-header";
import { SurveysList } from "@/components/surveys/surveys-list";
import { motion } from "framer-motion";

export default function SurveysPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col min-h-full bg-background"
    >
      <SurveysHeader />
      <SurveysList />
    </motion.div>
  );
}
