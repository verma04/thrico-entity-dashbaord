"use client";

import React from "react";
import { FormikProps } from "formik";
import {
  FileCode,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Search,
  Bot,
  Info,
} from "lucide-react";
import {
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";
import { IntegrationsFormValues } from "./types";

interface IntegrationsSidebarProps {
  formik: FormikProps<IntegrationsFormValues>;
}

export function IntegrationsSidebar({ formik }: IntegrationsSidebarProps) {
  const hasGa = !!formik.values.googleAnalyticsId?.trim();
  const hasGsc = !!formik.values.googleSearchConsoleId?.trim();
  const hasRobots = !!formik.values.robotsTxt?.trim();

  const totalConnected = [hasGa, hasGsc, hasRobots].filter(
    Boolean
  ).length;

  return (
    <div className="space-y-4">
      {/* Overview Status Card */}
      <PolarisSidebarCard
        title="Integration Telemetry"
        badge={`${totalConnected}/3 Active`}
        icon={FileCode}
      >
        <div className="space-y-3">
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs py-1 border-b border-[#e1e3e5] dark:border-zinc-800">
              <span className="flex items-center gap-1.5 text-[#616161] dark:text-zinc-400 font-medium">
                <BarChart3 className="h-3.5 w-3.5" />
                Google Analytics 4
              </span>
              <span
                className={
                  hasGa
                    ? "text-emerald-600 font-semibold text-[11px]"
                    : "text-zinc-400 text-[11px]"
                }
              >
                {hasGa ? "Configured" : "Inactive"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1 border-b border-[#e1e3e5] dark:border-zinc-800">
              <span className="flex items-center gap-1.5 text-[#616161] dark:text-zinc-400 font-medium">
                <Search className="h-3.5 w-3.5" />
                Search Console
              </span>
              <span
                className={
                  hasGsc
                    ? "text-emerald-600 font-semibold text-[11px]"
                    : "text-zinc-400 text-[11px]"
                }
              >
                {hasGsc ? "Configured" : "Inactive"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <span className="flex items-center gap-1.5 text-[#616161] dark:text-zinc-400 font-medium">
                <Bot className="h-3.5 w-3.5" />
                robots.txt Rules
              </span>
              <span
                className={
                  hasRobots
                    ? "text-emerald-600 font-semibold text-[11px]"
                    : "text-zinc-400 text-[11px]"
                }
              >
                {hasRobots ? "Custom" : "Standard"}
              </span>
            </div>
          </div>
        </div>
      </PolarisSidebarCard>

      {/* Guidance Tip Card */}
      <PolarisTipCard title="SEO & Analytics Verification">
        After adding your Google Search Console verification tag and GA4 Measurement ID, republish your website or clear browser cache to verify the updated header meta tags.
      </PolarisTipCard>
    </div>
  );
}
