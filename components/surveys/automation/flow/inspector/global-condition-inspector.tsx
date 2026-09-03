"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SurveyRuleConditionInput } from "@/graphql/survey-automation";
import {
  SURVEY_CONDITION_FIELDS,
  SURVEY_CONDITION_OPERATORS,
} from "./inspector-constants";
import { cn } from "@/lib/utils";

interface GlobalConditionInspectorProps {
  conditions: SurveyRuleConditionInput[];
  conditionOperator: "AND" | "OR";
  onConditionOperatorChange: (op: "AND" | "OR") => void;
  onConditionsChange: (conditions: SurveyRuleConditionInput[]) => void;
}

export const GlobalConditionInspector: React.FC<
  GlobalConditionInspectorProps
> = ({
  conditions,
  conditionOperator,
  onConditionOperatorChange,
  onConditionsChange,
}) => {
  const handleAddCondition = (presetField?: string) => {
    onConditionsChange([
      ...conditions,
      {
        field: presetField || "context.rating",
        operator: "gte",
        value: 4,
      },
    ]);
  };

  const handleRemoveCondition = (index: number) => {
    onConditionsChange(conditions.filter((_, i) => i !== index));
  };

  const handleUpdateCondition = (
    index: number,
    field: keyof SurveyRuleConditionInput,
    val: any
  ) => {
    const updated = [...conditions];
    updated[index] = {
      ...updated[index],
      [field]: val,
    };
    if (
      field === "operator" &&
      (val === "is_not_empty" || val === "is_empty")
    ) {
      updated[index].value = true;
    }
    onConditionsChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-foreground">
            Global Response Criteria
          </h4>
          <p className="text-[11px] text-muted-foreground">
            Filter by ratings, promoter status, or answers.
          </p>
        </div>

        {conditions.length > 1 && (
          <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => onConditionOperatorChange("AND")}
              className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer",
                conditionOperator === "AND"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              ALL (AND)
            </button>
            <button
              type="button"
              onClick={() => onConditionOperatorChange("OR")}
              className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer",
                conditionOperator === "OR"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              ANY (OR)
            </button>
          </div>
        )}
      </div>

      {conditions.length === 0 ? (
        <div className="p-4 rounded-xl border border-dashed border-border bg-muted/30 text-center space-y-2">
          <p className="text-xs font-medium text-foreground">
            No global criteria set.
          </p>
          <p className="text-[11px] text-muted-foreground">
            Workflow will evaluate all survey submissions and check individual action branches.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => handleAddCondition("context.rating")}
              className="text-[11px] h-7 gap-1"
            >
              <Plus className="w-3 h-3" />
              ⭐ High Rating (&gt;= 4)
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => handleAddCondition("context.isPromoter")}
              className="text-[11px] h-7 gap-1"
            >
              <Plus className="w-3 h-3" />
              🚀 NPS Promoter
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {conditions.map((condition, idx) => {
            const selectedField =
              SURVEY_CONDITION_FIELDS.find((f) => f.value === condition.field) ||
              SURVEY_CONDITION_FIELDS[0];
            const isNoValue =
              condition.operator === "is_not_empty" ||
              condition.operator === "is_empty";

            return (
              <div
                key={idx}
                className="p-3 rounded-xl border border-border bg-card space-y-2 relative group shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    Rule #{idx + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCondition(idx)}
                    className="h-6 w-6 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <Select
                  value={condition.field}
                  onValueChange={(val) =>
                    handleUpdateCondition(idx, "field", val)
                  }
                >
                  <SelectTrigger className="h-8 text-xs bg-background">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {SURVEY_CONDITION_FIELDS.map((f) => (
                      <SelectItem key={f.value} value={f.value} className="text-xs">
                        [{f.category}] {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={condition.operator}
                    onValueChange={(val) =>
                      handleUpdateCondition(idx, "operator", val)
                    }
                  >
                    <SelectTrigger className="h-8 text-xs bg-background">
                      <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {SURVEY_CONDITION_OPERATORS.map((op) => (
                        <SelectItem key={op.value} value={op.value} className="text-xs">
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {!isNoValue ? (
                    selectedField.type === "boolean" ? (
                      <Select
                        value={String(condition.value)}
                        onValueChange={(val) =>
                          handleUpdateCondition(idx, "value", val === "true")
                        }
                      >
                        <SelectTrigger className="h-8 text-xs bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true" className="text-xs">
                            Yes / True
                          </SelectItem>
                          <SelectItem value="false" className="text-xs">
                            No / False
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={
                          selectedField.type === "number" ? "number" : "text"
                        }
                        placeholder="Value..."
                        value={condition.value ?? ""}
                        onChange={(e) =>
                          handleUpdateCondition(
                            idx,
                            "value",
                            selectedField.type === "number"
                              ? Number(e.target.value)
                              : e.target.value
                          )
                        }
                        className="h-8 text-xs bg-background"
                      />
                    )
                  ) : (
                    <div className="h-8 px-2 flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                      Is Present
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddCondition()}
            className="w-full text-xs h-8 gap-1.5 border-dashed cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Global Criteria
          </Button>
        </div>
      )}
    </div>
  );
};
