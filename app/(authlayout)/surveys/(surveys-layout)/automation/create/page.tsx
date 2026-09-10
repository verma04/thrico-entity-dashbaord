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
import { withModulePermission } from "@/components/hoc/with-module-permission";
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
    <div className="fixed inset-0 z-50 bg-background w-screen h-screen p-0 m-0 flex flex-col overflow-hidden animate-in fade-in duration-200">
      <SurveyAutomationForm
        loading={loading}
        onSave={handleSave}
        onCancel={handleCancel}
        isEdit={false}
      />
    </div>
  );
};

export default withModulePermission(
  CreateSurveyAutomationRulePage,
  "SURVEYS",
  "canCreate"
);
