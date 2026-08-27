"use client";

import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Pencil,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";
import { useGetSurvey } from "@/graphql/surveys/survey-queries";
import { useModuleStore } from "@/store/useModuleStore";
import {
  ManageItemLayout,
  type ManageTabItem,
} from "@/components/layout/manage-item-layout";

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

  const moduleName = useModuleStore((state) => state.surveyModuleName);
  const singularName = useModuleStore((state) => state.surveySingularName);

  const survey = data?.getSurvey;

  const statusColor =
    survey?.status === "PUBLISHED"
      ? "bg-emerald-500"
      : survey?.status === "DRAFT"
        ? "bg-amber-500"
        : survey?.status === "CLOSED"
          ? "bg-red-500"
          : "bg-primary";

  return (
    <ManageItemLayout
      fixed={false}
      title={survey?.title || `${singularName} Details`}
      loading={loading}
      loadingText={`Loading ${singularName}...`}
      defaultIcon={ClipboardList}
      status={survey?.status}
      statusVariant={survey?.status === "PUBLISHED" ? "default" : "secondary"}
      statusColor={statusColor}
      subtitle={
        !loading && survey ? (
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            {survey.startDate && (
              <span>
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
          </p>
        ) : null
      }
      closeHref="/surveys/all"
      basePath={`/surveys/${surveyId}`}
      currentTab={currentTab}
      tabs={tabItems}
      contentContainerClassName={
        currentTab === "questions" ? "max-w-none w-full p-0 py-0 px-0" : undefined
      }
      breadcrumbs={
        currentTab === "questions"
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
