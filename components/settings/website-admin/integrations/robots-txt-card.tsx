"use client";

import React from "react";
import { FormikProps } from "formik";
import { FileCode, Sparkles, AlertTriangle, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PolarisCard,
  PolarisTextarea,
} from "@/components/ui/platform/polaris-primitives";
import { toast } from "sonner";
import { IntegrationsFormValues } from "./types";

interface RobotsTxtCardProps {
  formik: FormikProps<IntegrationsFormValues>;
  websiteUrl?: string;
}

export function RobotsTxtCard({ formik, websiteUrl = "https://thrico.community" }: RobotsTxtCardProps) {
  const content = formik.values.robotsTxt || "";

  const hasUserAgent = /User-agent:\s*.+/i.test(content);
  const blocksAll = /Disallow:\s*\/\s*$/m.test(content);
  const hasSitemap = /Sitemap:\s*https?:\/\/.+/i.test(content);

  const applyPreset = (presetType: "standard" | "allow-all" | "block-all") => {
    const sitemapUrl = `${websiteUrl}/sitemap.xml`;
    let presetContent = "";

    if (presetType === "standard") {
      presetContent = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\n\nSitemap: ${sitemapUrl}`;
    } else if (presetType === "allow-all") {
      presetContent = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}`;
    } else if (presetType === "block-all") {
      presetContent = `User-agent: *\nDisallow: /`;
    }

    formik.setFieldValue("robotsTxt", presetContent);
    toast.success("robots.txt template applied");
  };

  return (
    <PolarisCard
      title="robots.txt Crawl Directives"
      badge={
        <Badge
          variant="outline"
          className={
            blocksAll
              ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 text-[10px] font-semibold flex items-center gap-1"
              : hasUserAgent
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 text-[10px] font-semibold flex items-center gap-1"
                : "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 text-[10px] font-semibold"
          }
        >
          {blocksAll ? (
            <>
              <AlertTriangle className="h-3 w-3 text-amber-600" />
              Crawlers Blocked
            </>
          ) : hasUserAgent ? (
            <>
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              Directives Active
            </>
          ) : (
            "Default"
          )}
        </Badge>
      }
      description="Instruct search engines (Googlebot, Bingbot, etc.) which sections and paths can or cannot be indexed."
      headerAction={
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => applyPreset("standard")}
            className="h-6 px-2 text-[11px] rounded-[5px] border-[#d2d5d9] dark:border-zinc-700 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 font-medium"
          >
            Safe Standard
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => applyPreset("allow-all")}
            className="h-6 px-2 text-[11px] rounded-[5px] border-[#d2d5d9] dark:border-zinc-700 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 font-medium"
          >
            Allow All
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        {blocksAll && (
          <div className="rounded-[8px] border border-amber-200 bg-amber-50/70 dark:bg-amber-950/30 dark:border-amber-900/50 p-3 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Notice: All search crawlers are blocked.</p>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                <code>Disallow: /</code> prevents search engines from indexing any page on your website. Use only during maintenance or private staging.
              </p>
            </div>
          </div>
        )}

        <PolarisTextarea
          id="robotsTxt"
          name="robotsTxt"
          label="robots.txt Content"
          rows={7}
          className="font-mono text-[12px] leading-relaxed"
          placeholder={"User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: https://yourdomain.com/sitemap.xml"}
          value={formik.values.robotsTxt}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.robotsTxt && formik.errors.robotsTxt
              ? String(formik.errors.robotsTxt)
              : null
          }
          helperText="Served publicly at /robots.txt to guide search engine bots."
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
          <div className="p-2 rounded-[6px] border border-[#e1e3e5] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-900 flex items-center justify-between">
            <span className="text-[#616161] dark:text-zinc-400">User-Agent Rule:</span>
            <span className="font-semibold font-mono text-[#303030] dark:text-zinc-200">
              {hasUserAgent ? "Configured" : "Missing"}
            </span>
          </div>

          <div className="p-2 rounded-[6px] border border-[#e1e3e5] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-900 flex items-center justify-between">
            <span className="text-[#616161] dark:text-zinc-400">Sitemap Link:</span>
            <span className="font-semibold font-mono text-[#303030] dark:text-zinc-200">
              {hasSitemap ? "Included" : "None"}
            </span>
          </div>

          <div className="p-2 rounded-[6px] border border-[#e1e3e5] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-900 flex items-center justify-between">
            <span className="text-[#616161] dark:text-zinc-400">Total Characters:</span>
            <span className="font-semibold font-mono text-[#303030] dark:text-zinc-200">
              {content.length}/5000
            </span>
          </div>
        </div>
      </div>
    </PolarisCard>
  );
}
