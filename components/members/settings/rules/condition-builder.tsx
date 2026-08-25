"use client";

import React from "react";
import {
  Plus,
  Trash2,
  Sliders,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  School,
  Building,
  MapPin,
  Mail,
  Tag,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MemberRuleConditionInput } from "@/graphql/member-automation";

export interface ConditionFieldOption {
  value: string;
  label: string;
  category: string;
  placeholder: string;
  type: "text" | "select" | "tags";
  icon?: any;
  options?: { value: string; label: string }[];
}

export const CONDITION_FIELDS: ConditionFieldOption[] = [
  {
    value: "profile.college",
    label: "College / University",
    category: "Education",
    placeholder: "e.g. Stanford University, MIT, Harvard",
    type: "text",
    icon: School,
  },
  {
    value: "profile.graduationYear",
    label: "Graduation Year",
    category: "Education",
    placeholder: "e.g. 2024, 2025, 2026",
    type: "text",
    icon: School,
  },
  {
    value: "profile.gender",
    label: "Gender",
    category: "Demographics",
    placeholder: "Select gender",
    type: "select",
    options: [
      { value: "MALE", label: "Male" },
      { value: "FEMALE", label: "Female" },
      { value: "NON_BINARY", label: "Non-binary" },
      { value: "OTHER", label: "Other" },
      { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
    ],
  },
  {
    value: "profile.city",
    label: "City / Location",
    category: "Demographics",
    placeholder: "e.g. San Francisco, London, Mumbai",
    type: "text",
    icon: MapPin,
  },
  {
    value: "profile.country",
    label: "Country",
    category: "Demographics",
    placeholder: "e.g. United States, India, United Kingdom",
    type: "text",
    icon: MapPin,
  },
  {
    value: "profile.company",
    label: "Company / Organization",
    category: "Professional",
    placeholder: "e.g. Google, Stripe, Microsoft",
    type: "text",
    icon: Building,
  },
  {
    value: "profile.jobTitle",
    label: "Job Title / Role",
    category: "Professional",
    placeholder: "e.g. Software Engineer, Product Manager, Founder",
    type: "text",
    icon: Briefcase,
  },
  {
    value: "profile.industry",
    label: "Industry Sector",
    category: "Professional",
    placeholder: "e.g. FinTech, Healthcare, AI",
    type: "text",
    icon: Building,
  },
  {
    value: "userToEntity.tag",
    label: "Current Member Tag",
    category: "Attributes",
    placeholder: "e.g. alumni, mentor, student",
    type: "text",
    icon: Tag,
  },
  {
    value: "user.email",
    label: "Email Domain / Pattern",
    category: "Account",
    placeholder: "e.g. @stanford.edu, @company.com",
    type: "text",
    icon: Mail,
  },
];

export const CONDITION_OPERATORS = [
  { value: "equals", label: "Equals (=)" },
  { value: "not_equals", label: "Does Not Equal (≠)" },
  { value: "contains", label: "Contains (text match)" },
  { value: "in", label: "In list (comma separated)" },
  { value: "not_in", label: "Not in list" },
  { value: "is_not_empty", label: "Is Set / Not Empty" },
  { value: "is_empty", label: "Is Empty / Not Set" },
];

interface ConditionBuilderProps {
  conditions: MemberRuleConditionInput[];
  conditionOperator: "AND" | "OR";
  onConditionOperatorChange: (op: "AND" | "OR") => void;
  onChange: (conditions: MemberRuleConditionInput[]) => void;
}

export const ConditionBuilder: React.FC<ConditionBuilderProps> = ({
  conditions,
  conditionOperator,
  onConditionOperatorChange,
  onChange,
}) => {
  const handleAddCondition = (presetField?: string) => {
    onChange([
      ...conditions,
      {
        field: presetField || "profile.college",
        operator: "contains",
        value: "",
      },
    ]);
  };

  const handleRemoveCondition = (index: number) => {
    const updated = conditions.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleUpdateCondition = (
    index: number,
    field: keyof MemberRuleConditionInput,
    val: any
  ) => {
    const updated = [...conditions];
    updated[index] = {
      ...updated[index],
      [field]: val,
    };
    // Reset value if field changes to an empty-check operator
    if (
      field === "operator" &&
      (val === "is_not_empty" || val === "is_empty")
    ) {
      updated[index].value = true;
    }
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-zinc-500" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Eligibility Conditions
          </h3>
          <Badge
            variant="secondary"
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          >
            {conditions.length} {conditions.length === 1 ? "Condition" : "Conditions"}
          </Badge>
        </div>

        {conditions.length > 1 && (
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-0.5 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60">
            <button
              type="button"
              onClick={() => onConditionOperatorChange("AND")}
              className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-all ${
                conditionOperator === "AND"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              Match ALL (AND)
            </button>
            <button
              type="button"
              onClick={() => onConditionOperatorChange("OR")}
              className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-all ${
                conditionOperator === "OR"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              Match ANY (OR)
            </button>
          </div>
        )}
      </div>

      {conditions.length === 0 ? (
        <div className="p-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-center space-y-3 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="inline-flex p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
              No eligibility conditions defined.
            </p>
            <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
              If left blank, this rule executes for <strong className="text-zinc-800 dark:text-zinc-200">100% of joining members</strong> unconditionally.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddCondition("profile.college")}
              className="text-xs h-8 gap-1.5 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <School className="w-3.5 h-3.5 text-blue-500" />
              Filter by College
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddCondition("user.email")}
              className="text-xs h-8 gap-1.5 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-500" />
              Filter by Email Domain
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddCondition("profile.company")}
              className="text-xs h-8 gap-1.5 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Building className="w-3.5 h-3.5 text-emerald-500" />
              Filter by Company
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {conditions.map((condition, index) => {
            const selectedField =
              CONDITION_FIELDS.find((f) => f.value === condition.field) ||
              CONDITION_FIELDS[0];
            const isNoValueOperator =
              condition.operator === "is_not_empty" ||
              condition.operator === "is_empty";

            return (
              <div
                key={index}
                className="group relative flex flex-col md:flex-row items-stretch md:items-center gap-2 p-3 bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 rounded-xl transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
              >
                {/* Condition Index / Operator Connector */}
                {index > 0 && (
                  <div className="hidden md:flex absolute -top-3 left-4 px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-bold rounded z-10 border border-zinc-300 dark:border-zinc-700">
                    {conditionOperator}
                  </div>
                )}

                {/* Field Selector */}
                <div className="w-full md:w-52 shrink-0">
                  <Select
                    value={condition.field}
                    onValueChange={(val) =>
                      handleUpdateCondition(index, "field", val)
                    }
                  >
                    <SelectTrigger className="h-9 text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITION_FIELDS.map((field) => (
                        <SelectItem
                          key={field.value}
                          value={field.value}
                          className="text-xs"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-zinc-400 font-mono">
                              [{field.category}]
                            </span>
                            <span>{field.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Operator Selector */}
                <div className="w-full md:w-44 shrink-0">
                  <Select
                    value={condition.operator}
                    onValueChange={(val) =>
                      handleUpdateCondition(index, "operator", val)
                    }
                  >
                    <SelectTrigger className="h-9 text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                      <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITION_OPERATORS.map((op) => (
                        <SelectItem
                          key={op.value}
                          value={op.value}
                          className="text-xs"
                        >
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Value Input / Selector */}
                <div className="flex-1">
                  {!isNoValueOperator ? (
                    selectedField.type === "select" &&
                    selectedField.options ? (
                      <Select
                        value={
                          typeof condition.value === "string"
                            ? condition.value
                            : ""
                        }
                        onValueChange={(val) =>
                          handleUpdateCondition(index, "value", val)
                        }
                      >
                        <SelectTrigger className="h-9 text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                          <SelectValue
                            placeholder={selectedField.placeholder}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedField.options.map((opt) => (
                            <SelectItem
                              key={opt.value}
                              value={opt.value}
                              className="text-xs"
                            >
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type="text"
                        value={
                          Array.isArray(condition.value)
                            ? condition.value.join(", ")
                            : condition.value ?? ""
                        }
                        onChange={(e) =>
                          handleUpdateCondition(index, "value", e.target.value)
                        }
                        placeholder={selectedField.placeholder}
                        className="h-9 text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                      />
                    )
                  ) : (
                    <div className="h-9 px-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Evaluates presence only (no value needed)</span>
                    </div>
                  )}
                </div>

                {/* Delete button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCondition(index)}
                  className="h-9 w-9 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            );
          })}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddCondition()}
            className="w-full text-xs h-8 gap-1.5 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-300"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Another Condition
          </Button>
        </div>
      )}
    </div>
  );
};
