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
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { ClipboardList } from "lucide-react";
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
      <div className="fixed inset-0 z-50 bg-background w-screen h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center animate-pulse shadow-sm">
          <ClipboardList className="w-6 h-6" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-sm font-bold text-foreground">Loading Survey Workflow</h3>
          <p className="text-xs text-muted-foreground">Fetching automation rule details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background w-screen h-screen p-0 m-0 flex flex-col overflow-hidden animate-in fade-in duration-200">
      <SurveyAutomationForm
        initialValues={rule}
        loading={updating}
        onSave={handleSave}
        onCancel={handleCancel}
        isEdit={true}
      />
    </div>
  );
};

export default withModulePermission(
  EditSurveyAutomationRulePage,
  "SURVEYS",
  "canEdit"
);
