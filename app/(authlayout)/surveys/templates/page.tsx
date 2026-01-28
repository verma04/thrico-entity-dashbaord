"use client";

import React from "react";
import { TemplateGallery } from "@/components/surveys/templates/template-gallery";
import { motion } from "framer-motion";

export default function SurveyTemplatesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 min-h-screen bg-background"
    >
      <TemplateGallery />
    </motion.div>
  );
}
