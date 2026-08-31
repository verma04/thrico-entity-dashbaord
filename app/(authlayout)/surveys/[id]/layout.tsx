"use client";

import React, { useState } from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Pencil,
  MessageSquare,
  BarChart3,
  Settings,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Layers,
  FileQuestion,
  Calendar,
  Eye,
} from "lucide-react";
import { useGetSurvey } from "@/graphql/surveys/survey-queries";
import { getThricoDomain, getCustomDomain } from "@/graphql/actions/domain";
import { useModuleStore } from "@/store/useModuleStore";
import {
  ManageItemLayout,
  type ManageTabItem,
} from "@/components/layout/manage-item-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const tabItems: ManageTabItem[] = [
  { key: "general-info", label: "General Info", icon: ClipboardList, path: "" },
  { key: "questions", label: "Questions", icon: Pencil, path: "questions" },
  {
    key: "responses",
    label: "Responses",
    icon: MessageSquare,
    path: "responses",
  },
  { key: "results", label: "Results", icon: BarChart3, path: "results" },
  { key: "settings", label: "Settings", icon: Settings, path: "settings" },
];

function SurveysLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const surveyId = pathname?.split("/")[2];
  const section = pathname
    ?.replace(`/surveys/${surveyId}`, "")
    .split("/")
    .filter(Boolean)[0];
  const currentTab = !section ? "general-info" : section;

  const { data, loading } = useGetSurvey({
    variables: { getSurveyId: surveyId || "" },
    skip: !surveyId,
  });

  const { data: thricoData } = getThricoDomain();
  const { data: customData } = getCustomDomain();
  const [copied, setCopied] = useState(false);

  const moduleName = useModuleStore((state) => state.surveyModuleName);
  const singularName = useModuleStore((state) => state.surveySingularName);

  const survey = data?.getSurvey;

  const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "thrico.community";

  const domainHost =
    customData?.getCustomDomain?.domain ||
    (thricoData?.getThricoDomain?.domain
      ? `${thricoData.getThricoDomain.domain}.${NEXT_PUBLIC_SITE_URL}`
      : "thrico.network");

  const shortCode = survey?.shortCode || survey?.slug;
  const publicUrl = shortCode
    ? `https://${domainHost}/open-survey/${shortCode}`
    : null;

  const handleCopyLink = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success("Survey public link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusColor =
    survey?.status === "PUBLISHED"
      ? "bg-emerald-500"
      : survey?.status === "DRAFT"
        ? "bg-amber-500"
        : survey?.status === "CLOSED"
          ? "bg-red-500"
          : "bg-primary";

  const isOutside =
    survey?.eligibility?.memberEligibility === "OUTSIDE_PLATFORM" ||
    survey?.eligibilityRule?.memberEligibility === "OUTSIDE_PLATFORM";

  const questionCount = survey?.form?.questions?.length ?? 0;
  const responseCount = survey?.responses?.length ?? 0;

  // Custom Header Actions
  const headerActions = (
    <div className="flex items-center gap-2">
      {isOutside && publicUrl && (
        <div className="flex items-center gap-1.5 bg-muted/50 border border-border/70 rounded-lg p-1 pr-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs font-medium gap-1.5 hover:bg-background rounded-md"
            onClick={handleCopyLink}
            title="Copy Public Survey Link"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span>{copied ? "Copied" : "Copy Link"}</span>
          </Button>

          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline px-1.5"
          >
            <span>Live Site</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  );

  // Custom Header Badges
  const badges = (
    <div className="flex items-center gap-1.5 flex-wrap">
      {survey?.status && (
        <Badge
          variant={survey.status === "PUBLISHED" ? "default" : "secondary"}
          className={cn(
            "px-2 py-0 text-[10px] font-semibold uppercase tracking-wider rounded-md",
            survey.status === "PUBLISHED"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
              : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
          )}
        >
          {survey.status}
        </Badge>
      )}

      {isOutside && (
        <Badge
          variant="outline"
          className="px-2 py-0 text-[10px] font-medium gap-1 rounded-md bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/30"
        >
          <Globe className="h-3 w-3" />
          <span>Outside Platform</span>
        </Badge>
      )}

      {survey?.form?.previewType && (
        <Badge
          variant="outline"
          className="px-2 py-0 text-[10px] font-medium gap-1 rounded-md bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30 hidden sm:inline-flex"
        >
          <Layers className="h-3 w-3" />
          <span>
            {survey.form.previewType === "MULTI_STEP"
              ? "Multi-Step"
              : "Scroll Long"}
          </span>
        </Badge>
      )}
    </div>
  );

  return (
    <ManageItemLayout
      title={survey?.title || `${singularName} Details`}
      loading={loading}
      loadingText={`Loading ${singularName}...`}
      defaultIcon={ClipboardList}
      iconContainerClassName="bg-primary/10 text-primary border-primary/20"
      badges={badges}
      statusColor={statusColor}
      headerActions={headerActions}
      subtitle={
        !loading && survey ? (
          <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
            {survey.startDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(survey.startDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {survey.startDate && survey.endDate && <span>·</span>}
            {survey.endDate && (
              <span>
                Ends{" "}
                {new Date(survey.endDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {(survey.startDate || survey.endDate) && <span>·</span>}
            <span className="flex items-center gap-1">
              <FileQuestion className="h-3 w-3" />
              {questionCount} {questionCount === 1 ? "question" : "questions"}
            </span>
          </div>
        ) : null
      }
      closeHref="/surveys/all"
      basePath={`/surveys/${surveyId}`}
      currentTab={currentTab}
      tabs={tabItems}
      containerClassName={
        currentTab === "responses" || currentTab === "results"
          ? "max-w-none w-full px-6 sm:px-8 py-6"
          : currentTab === "questions"
            ? "max-w-none w-full p-0"
            : "max-w-7xl mx-auto px-6 sm:px-8 py-6"
      }
      breadcrumbs={
        currentTab === "questions" ||
        currentTab === "responses" ||
        currentTab === "results"
          ? undefined
          : [
              { label: moduleName, href: "/surveys/all" },
              { label: survey?.title || `${singularName} Details` },
            ]
      }
    >
      {isOutside && publicUrl && currentTab !== "questions" && (
        <div className="mb-6 rounded-xl border border-cyan-500/25 bg-gradient-to-r from-cyan-500/10 via-sky-500/5 to-transparent p-3.5 shadow-2xs backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="size-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5 sm:mt-0 shadow-2xs">
                <Globe className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-foreground">
                    Public Outside Platform Survey
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30">
                    Live Web Link
                  </span>
                </div>
                <p className="text-[11.5px] text-muted-foreground">
                  Anyone on the web can view and submit this survey without signing in or requiring platform membership.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 pl-12 sm:pl-0 flex-wrap">
              <div className="flex items-center gap-1.5 bg-background border border-border rounded-lg px-2.5 py-1 text-xs font-mono text-foreground shadow-2xs">
                <span className="truncate max-w-[190px] sm:max-w-[260px]">
                  {domainHost}/open-survey/{shortCode}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs font-medium gap-1.5 bg-background hover:bg-muted rounded-lg cursor-pointer"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span>{copied ? "Copied" : "Copy Link"}</span>
              </Button>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-7 px-2.5 text-xs font-medium gap-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors shadow-2xs"
              >
                <span>Visit Link</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {children}
    </ManageItemLayout>
  );
}

export default withModulePermission(SurveysLayout, "SURVEYS", "canRead");
