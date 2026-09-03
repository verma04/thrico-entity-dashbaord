"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_SURVEY_AUTOMATION_RULE,
  GET_SURVEY_AUTOMATION_RULES,
  UPDATE_SURVEY_AUTOMATION_RULE,
  UpdateSurveyAutomationRuleInput,
} from "@/graphql/survey-automation";
import { SurveyAutomationForm } from "@/components/surveys/automation/survey-automation-form";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { ClipboardList, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const EditSurveyAutomationRulePage = () => {
  const router = useRouter();
  const params = useParams();
  const ruleId = params.id as string;

  const { data, loading: fetchingRule } = useQuery(
    GET_SURVEY_AUTOMATION_RULE,
    {
      variables: { id: ruleId },
      skip: !ruleId,
      fetchPolicy: "network-only",
    }
  );

  const [updateRule, { loading: updating }] = useMutation(
    UPDATE_SURVEY_AUTOMATION_RULE,
    {
      refetchQueries: [{ query: GET_SURVEY_AUTOMATION_RULES }],
      onCompleted: () => {
        toast.success("Survey automation rule updated successfully!");
        router.push("/surveys/automation");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to update survey automation rule");
      },
    }
  );

  const handleSave = async (input: UpdateSurveyAutomationRuleInput) => {
    await updateRule({
      variables: {
        id: ruleId,
        input,
      },
    });
  };

  const handleCancel = () => {
    router.push("/surveys/automation");
  };

  const rule = data?.getSurveyAutomationRule;

  if (fetchingRule) {
    return (
      <EcosystemWrapper className="gap-6">
        <EcosystemHeader
          title="Edit Survey Automation Rule"
          badgeText="Feedback Engine"
          description="Loading rule details…"
          icon={ClipboardList}
          breadcrumbs={[
            { label: "Surveys", href: "/surveys/all" },
            { label: "Automation", href: "/surveys/automation" },
            { label: "Edit Rule" },
          ]}
        />
        <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
          <div className="max-w-[1040px] mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper className="gap-6">
      <EcosystemHeader
        title={`Edit Rule: ${rule?.name || "Survey Rule"}`}
        badgeText="Rule Configuration"
        description="Modify response criteria, rating triggers, and automated reward actions."
        icon={ClipboardList}
        breadcrumbs={[
          { label: "Surveys", href: "/surveys/all" },
          { label: "Automation", href: "/surveys/automation" },
          { label: rule?.name || "Edit Rule" },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="h-8 gap-1.5 text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Rules
          </Button>
        }
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <SurveyAutomationForm
          initialValues={rule}
          loading={updating}
          onSave={handleSave}
          onCancel={handleCancel}
          isEdit={true}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default withModulePermission(
  EditSurveyAutomationRulePage,
  "SURVEYS",
  "canEdit"
);
