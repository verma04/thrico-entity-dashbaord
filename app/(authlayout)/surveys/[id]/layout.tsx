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
            ? "max-w-none w-full px-4 py-2"
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
      {children}
    </ManageItemLayout>
  );
}

export default withModulePermission(SurveysLayout, "SURVEYS", "canRead");
