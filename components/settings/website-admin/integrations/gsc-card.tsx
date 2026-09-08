"use client";

import React from "react";
import { FormikProps } from "formik";
import { Search, ExternalLink, CheckCircle2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  PolarisCard,
  PolarisInput,
} from "@/components/ui/platform/polaris-primitives";
import { IntegrationsFormValues } from "./types";

interface GscCardProps {
  formik: FormikProps<IntegrationsFormValues>;
}

export function GscCard({ formik }: GscCardProps) {
  const rawGsc = formik.values.googleSearchConsoleId?.trim() || "";

  // Helper to extract content if the user pasted an entire <meta ... content="..." /> tag
  const cleanGscToken = (input: string) => {
    if (input.includes('content="')) {
      const match = input.match(/content="([^"]+)"/);
      return match ? match[1] : input;
    }
    return input;
  };

  const gscToken = cleanGscToken(rawGsc);
  const isVerified = !!gscToken && !formik.errors.googleSearchConsoleId;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = cleanGscToken(e.target.value);
    formik.setFieldValue("googleSearchConsoleId", cleaned);
  };

  return (
    <PolarisCard
      title="Google Search Console"
      badge={
        <Badge
          variant="outline"
          className={
            isVerified
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 text-[10px] font-semibold flex items-center gap-1"
              : "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 text-[10px] font-semibold"
          }
        >
          {isVerified ? (
            <>
              <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              Verification Token Configured
            </>
          ) : (
            "Not Configured"
          )}
        </Badge>
      }
      description="Verify domain ownership with Google to access search queries, sitemap submissions, and Google indexing status."
      headerAction={
        <a
          href="https://search.google.com/search-console"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11.5px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 hover:underline"
        >
          <span>Search Console</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      }
    >
      <div className="space-y-3">
        <PolarisInput
          id="googleSearchConsoleId"
          name="googleSearchConsoleId"
          label="Site Verification Token or HTML Tag"
          placeholder="e.g. google-site-verification=abc123xyz or token string"
          value={formik.values.googleSearchConsoleId}
          onChange={handleInputChange}
          onBlur={formik.handleBlur}
          prefix={<Search className="h-4 w-4" />}
          error={
            formik.touched.googleSearchConsoleId &&
            formik.errors.googleSearchConsoleId
              ? String(formik.errors.googleSearchConsoleId)
              : null
          }
          helperText="Paste your HTML tag verification code from Search Console > Settings > Ownership verification > HTML tag."
        />

        {/* Live Meta Tag Injection Preview */}
        <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/70 dark:bg-zinc-800/40 p-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#616161] dark:text-zinc-400">
            <span className="font-semibold text-[#303030] dark:text-zinc-300">
              Injected Meta Tag (&lt;head&gt;):
            </span>
            <span className="font-mono text-[10px] text-zinc-400">
              HTML Verification
            </span>
          </div>
          <p className="text-[11.5px] font-mono text-zinc-600 dark:text-zinc-400 truncate bg-white dark:bg-zinc-900 px-2 py-1 rounded border border-[#e1e3e5] dark:border-zinc-800 select-all">
            {gscToken
              ? `<meta name="google-site-verification" content="${gscToken}" />`
              : '<meta name="google-site-verification" content="..." />'}
          </p>
        </div>
      </div>
    </PolarisCard>
  );
}
