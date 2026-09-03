"use client";

import React from "react";
import { Plus, Trash2, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

interface BranchConditionInspectorProps {
  branchIndex: number;
  conditions: SurveyRuleConditionInput[];
  conditionOperator: "AND" | "OR";
  onBranchConditionsChange?: (
    branchIndex: number,
    conditions: SurveyRuleConditionInput[],
    conditionOperator: "AND" | "OR"
  ) => void;
  onDuplicateBranch?: (branchIndex: number) => void;
  onDeleteBranch?: (branchIndex: number) => void;
}

export const BranchConditionInspector: React.FC<
  BranchConditionInspectorProps
> = ({
  branchIndex,
  conditions,
  conditionOperator,
  onBranchConditionsChange,
  onDuplicateBranch,
  onDeleteBranch,
}) => {
  const handleOperatorChange = (op: "AND" | "OR") => {
    onBranchConditionsChange?.(branchIndex, conditions, op);
  };

  const handleAddCondition = (
    presetField?: string,
    presetOp?: string,
    presetVal?: any
  ) => {
    const newCond: SurveyRuleConditionInput = {
      field: presetField || "context.selectedOptions",
      operator: presetOp || "contains",
      value: presetVal !== undefined ? presetVal : "Mentorship",
    };
    onBranchConditionsChange?.(
      branchIndex,
      [...conditions, newCond],
      conditionOperator
    );
  };

  const handleRemoveCondition = (condIdx: number) => {
    onBranchConditionsChange?.(
      branchIndex,
      conditions.filter((_, i) => i !== condIdx),
      conditionOperator
    );
  };

  const handleUpdateCondition = (
    condIdx: number,
    field: keyof SurveyRuleConditionInput,
    val: any
  ) => {
    const updated = [...conditions];
    updated[condIdx] = {
      ...updated[condIdx],
      [field]: val,
    };
    if (
      field === "operator" &&
      (val === "is_not_empty" || val === "is_empty")
    ) {
      updated[condIdx].value = true;
    }
    onBranchConditionsChange?.(branchIndex, updated, conditionOperator);
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider text-cyan-700 dark:text-cyan-300 uppercase">
            Condition Branch #{branchIndex + 1}
          </span>
          <Badge
            variant="outline"
            className="text-[9px] font-bold bg-cyan-500/20 text-cyan-800 dark:text-cyan-200 border-cyan-500/40"
          >
            {conditions.length} filter{conditions.length === 1 ? "" : "s"}
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground">
          All action blocks under this column execute only if survey responses satisfy these criteria.
        </p>
      </div>

      {/* Operator Switch */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground">
          Criteria Match Mode
        </span>
        <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => handleOperatorChange("AND")}
            className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer",
              conditionOperator === "AND"
                ? "bg-card text-cyan-600 dark:text-cyan-400 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            ALL (AND)
          </button>
          <button
            type="button"
            onClick={() => handleOperatorChange("OR")}
            className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer",
              conditionOperator === "OR"
                ? "bg-card text-cyan-600 dark:text-cyan-400 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            ANY (OR)
          </button>
        </div>
      </div>

      {/* Shortcut Chips */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
          Quick Filter Presets
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() =>
              handleAddCondition(
                "context.selectedOptions",
                "contains",
                "Mentorship"
              )
            }
            className="px-2 py-1 rounded-md text-[10px] font-bold bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 transition-colors cursor-pointer"
          >
            🎯 Option: "Mentorship"
          </button>
          <button
            type="button"
            onClick={() =>
              handleAddCondition(
                "context.selectedOptions",
                "contains",
                "Developer"
              )
            }
            className="px-2 py-1 rounded-md text-[10px] font-bold bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 transition-colors cursor-pointer"
          >
            🎯 Option: "Developer"
          </button>
          <button
            type="button"
            onClick={() => handleAddCondition("context.rating", "gte", 4)}
            className="px-2 py-1 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors cursor-pointer"
          >
            ⭐ Rating &gt;= 4 ★
          </button>
          <button
            type="button"
            onClick={() =>
              handleAddCondition("context.isPromoter", "eq", true)
            }
            className="px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            🚀 Promoter (NPS 9-10)
          </button>
        </div>
      </div>

      {/* Condition List */}
      {conditions.length === 0 ? (
        <div className="p-4 rounded-xl border border-dashed border-cyan-500/30 bg-cyan-500/5 text-center space-y-2">
          <p className="text-xs font-medium text-foreground">
            Universal Branch (Runs for 100% of responses)
          </p>
          <p className="text-[11px] text-muted-foreground">
            Add criteria rules below to turn this into a conditional branch.
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleAddCondition()}
            className="text-xs h-8 gap-1.5 border-cyan-500/40 text-cyan-700 dark:text-cyan-300 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add First Branch Rule
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {conditions.map((condition, idx) => {
            const selectedField =
              SURVEY_CONDITION_FIELDS.find(
                (f) => f.value === condition.field
              ) || SURVEY_CONDITION_FIELDS[0];
            const isNoValue =
              condition.operator === "is_not_empty" ||
              condition.operator === "is_empty";

            return (
              <div
                key={idx}
                className="p-3 rounded-xl border border-cyan-500/30 bg-card space-y-2 relative group shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase">
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
                          handleUpdateCondition(
                            idx,
                            "value",
                            val === "true"
                          )
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
                          selectedField.type === "number"
                            ? "number"
                            : "text"
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
            className="w-full text-xs h-8 gap-1.5 border-dashed border-cyan-500/40 text-cyan-700 dark:text-cyan-300 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + Add Condition Rule
          </Button>
        </div>
      )}

      {/* Branch Actions Toolbar */}
      <div className="pt-3 border-t border-border space-y-2">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
          Branch Management
        </label>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onDuplicateBranch?.(branchIndex)}
            className="h-8 text-xs gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            Duplicate Branch
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onDeleteBranch?.(branchIndex)}
            className="h-8 text-xs gap-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Branch
          </Button>
        </div>
      </div>
    </div>
  );
};
