"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import {
  CREATE_SURVEY_AUTOMATION_RULE,
  GET_SURVEY_AUTOMATION_RULES,
  CreateSurveyAutomationRuleInput,
  UpdateSurveyAutomationRuleInput,
} from "@/graphql/survey-automation";
import { SurveyAutomationForm } from "@/components/surveys/automation/survey-automation-form";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { ClipboardList, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const CreateSurveyAutomationRulePage = () => {
  const router = useRouter();

  const [createRule, { loading }] = useMutation(
    CREATE_SURVEY_AUTOMATION_RULE,
    {
      refetchQueries: [{ query: GET_SURVEY_AUTOMATION_RULES }],
      onCompleted: () => {
        toast.success("Survey automation rule created successfully!");
        router.push("/surveys/automation");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to create survey automation rule");
      },
    }
  );

  const handleSave = async (
    input: CreateSurveyAutomationRuleInput | UpdateSurveyAutomationRuleInput
  ) => {
    await createRule({
      variables: { input: input as CreateSurveyAutomationRuleInput },
    });
  };

  const handleCancel = () => {
    router.push("/surveys/automation");
  };

  return (
    <EcosystemWrapper className="gap-6">
      <EcosystemHeader
        title="Create Survey Automation"
        badgeText="New Feedback Flow"
        description="Configure automated tier upgrades, reward emails, circle memberships, and tags on survey response events."
        icon={ClipboardList}
        breadcrumbs={[
          { label: "Surveys", href: "/surveys/all" },
          { label: "Automation", href: "/surveys/automation" },
          { label: "Create Rule" },
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
          loading={loading}
          onSave={handleSave}
          onCancel={handleCancel}
          isEdit={false}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default withModulePermission(
  CreateSurveyAutomationRulePage,
  "SURVEYS",
  "canCreate"
);
