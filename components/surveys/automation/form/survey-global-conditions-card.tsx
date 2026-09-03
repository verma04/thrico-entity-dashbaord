"use client";

import React from "react";
import { Filter } from "lucide-react";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { ConditionBuilder } from "@/components/members/settings/rules/condition-builder";
import { SurveyRuleConditionInput } from "@/graphql/survey-automation";

interface SurveyGlobalConditionsCardProps {
  conditions: SurveyRuleConditionInput[];
  conditionOperator: "AND" | "OR";
  onConditionOperatorChange: (op: "AND" | "OR") => void;
  onConditionsChange: (conditions: SurveyRuleConditionInput[]) => void;
}

export const SurveyGlobalConditionsCard: React.FC<
  SurveyGlobalConditionsCardProps
> = ({
  conditions,
  conditionOperator,
  onConditionOperatorChange,
  onConditionsChange,
}) => {
  return (
    <PolarisFormCard
      step={2}
      title="Targeting Criteria & Conditions"
      description="Filter responses based on ratings, promoter/detractor flags, or answers."
      icon={Filter}
    >
      <div className="space-y-3">
        <ConditionBuilder
          conditions={conditions}
          conditionOperator={conditionOperator}
          onConditionOperatorChange={onConditionOperatorChange}
          onChange={onConditionsChange}
        />
      </div>
    </PolarisFormCard>
  );
};
