"use client";

import React, { useEffect, useRef } from "react";
import { useFormik } from "formik";
import { integrationsValidationSchema, IntegrationsFormValues } from "./types";
import { GaCard } from "./ga-card";
import { GscCard } from "./gsc-card";
import { RobotsTxtCard } from "./robots-txt-card";
import { IntegrationsSidebar } from "./integrations-sidebar";

interface IntegrationsFormProps {
  initialValues: IntegrationsFormValues;
  onChange: (values: IntegrationsFormValues) => void;
  websiteUrl?: string;
}

export function IntegrationsForm({
  initialValues,
  onChange,
  websiteUrl,
}: IntegrationsFormProps) {
  const formik = useFormik<IntegrationsFormValues>({
    initialValues: {
      googleAnalyticsId: initialValues.googleAnalyticsId || "",
      googleSearchConsoleId: initialValues.googleSearchConsoleId || "",
      robotsTxt:
        initialValues.robotsTxt ||
        "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\n\nSitemap: https://yourdomain.com/sitemap.xml",
    },
    validationSchema: integrationsValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onChange(values);
    },
  });

  const prevValuesRef = useRef(formik.values);

  // Notify parent of updates ONLY when the form has been modified by the user
  useEffect(() => {
    if (!formik.dirty) return;
    const prev = prevValuesRef.current;
    const curr = formik.values;
    if (
      prev.googleAnalyticsId !== curr.googleAnalyticsId ||
      prev.googleSearchConsoleId !== curr.googleSearchConsoleId ||
      prev.robotsTxt !== curr.robotsTxt
    ) {
      prevValuesRef.current = curr;
      onChange(curr);
    }
  }, [formik.dirty, formik.values, onChange]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column - Main Configuration Cards (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <GaCard formik={formik} />
          <GscCard formik={formik} />
          <RobotsTxtCard formik={formik} websiteUrl={websiteUrl} />
        </div>

        {/* Right Column - Sticky Telemetry & Guidance (4 Cols) */}
        <div className="lg:col-span-4 sticky top-6">
          <IntegrationsSidebar formik={formik} />
        </div>
      </div>
    </form>
  );
}
