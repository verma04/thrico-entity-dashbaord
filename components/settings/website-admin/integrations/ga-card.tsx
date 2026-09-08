"use client";

import React from "react";
import { FormikProps } from "formik";
import { BarChart3, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  PolarisCard,
  PolarisInput,
} from "@/components/ui/platform/polaris-primitives";
import { IntegrationsFormValues } from "./types";

interface GaCardProps {
  formik: FormikProps<IntegrationsFormValues>;
}

export function GaCard({ formik }: GaCardProps) {
  const gaId = formik.values.googleAnalyticsId?.trim() || "";
  const isConnected = !!gaId && !formik.errors.googleAnalyticsId;

  return (
    <PolarisCard
      title="Google Analytics 4 (GA4)"
      badge={
        <Badge
          variant="outline"
          className={
            isConnected
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 text-[10px] font-semibold flex items-center gap-1"
              : "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 text-[10px] font-semibold"
          }
        >
          {isConnected ? (
            <>
              <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              Stream Connected
            </>
          ) : (
            "Not Connected"
          )}
        </Badge>
      }
      description="Connect your Google Analytics 4 data stream to monitor real-time traffic, user engagement, and conversion metrics."
      headerAction={
        <a
          href="https://analytics.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11.5px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 hover:underline"
        >
          <span>Open GA4 Console</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      }
    >
      <div className="space-y-3">
        <PolarisInput
          id="googleAnalyticsId"
          name="googleAnalyticsId"
          label="GA4 Measurement Protocol ID"
          placeholder="G-XXXXXXXXXX"
          value={formik.values.googleAnalyticsId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          prefix={<BarChart3 className="h-4 w-4" />}
          error={
            formik.touched.googleAnalyticsId && formik.errors.googleAnalyticsId
              ? String(formik.errors.googleAnalyticsId)
              : null
          }
          helperText="Found in Google Analytics > Admin > Data Streams > Web Stream > Measurement ID."
        />

        {/* Live Code Ingestion Preview */}
        <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/70 dark:bg-zinc-800/40 p-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#616161] dark:text-zinc-400">
            <span className="font-semibold text-[#303030] dark:text-zinc-300">
              Automated Header Tag Injection:
            </span>
            <span className="font-mono text-[10px] text-zinc-400">
              gtag.js
            </span>
          </div>
          <p className="text-[11.5px] font-mono text-zinc-600 dark:text-zinc-400 truncate bg-white dark:bg-zinc-900 px-2 py-1 rounded border border-[#e1e3e5] dark:border-zinc-800">
            {gaId
              ? `https://www.googletagmanager.com/gtag/js?id=${gaId}`
              : "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"}
          </p>
        </div>
      </div>
    </PolarisCard>
  );
}
