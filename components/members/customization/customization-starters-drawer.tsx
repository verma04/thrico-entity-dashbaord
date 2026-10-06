"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  School,
  Building,
  ShieldCheck,
  Stethoscope,
  Briefcase,
  Users,
  Store,
  Database,
  Regex,
  ArrowRight,
} from "lucide-react";
import { CustomFieldItem, ValidationMode, CustomFieldType } from "./types";

export interface StarterRecipe {
  id: string;
  title: string;
  subtitle: string;
  category: "Higher Ed" | "Enterprise" | "Healthcare" | "Community";
  icon: React.ElementType;
  field: Omit<CustomFieldItem, "id" | "order">;
}

export const STARTER_RECIPES: StarterRecipe[] = [
  {
    id: "student-roll",
    title: "University Roll Number",
    subtitle: "CSV whitelist roster gating with format check for college students.",
    category: "Higher Ed",
    icon: School,
    field: {
      label: "Student Roll Number",
      key: "student_roll_no",
      type: "text",
      placeholder: "e.g. STU-2026-1042",
      helperText: "Enter your official University Student ID",
      required: true,
      validationMode: "CSV_ROSTER",
      validationRegex: "^STU-202[0-9]-[0-9]{4}$",
      validationErrorMessage: "ID not found in the official university roster.",
      blockIfNotExists: true,
      preventDuplicate: true,
    },
  },
  {
    id: "employee-code",
    title: "Enterprise Employee ID",
    subtitle: "Strict 1:1 employee claim against company payroll CSV roster.",
    category: "Enterprise",
    icon: Building,
    field: {
      label: "Employee ID",
      key: "employee_id",
      type: "text",
      placeholder: "e.g. EMP-1042",
      helperText: "Enter your organization employee ID code",
      required: true,
      validationMode: "BOTH",
      validationRegex: "^EMP-[0-9]{4,6}$",
      validationErrorMessage: "Employee code must be EMP-XXXX and present on company roster.",
      blockIfNotExists: true,
      preventDuplicate: true,
    },
  },
  {
    id: "healthcare-staff",
    title: "Medical Staff License",
    subtitle: "Roster verification for doctors, residents, and hospital staff.",
    category: "Healthcare",
    icon: Stethoscope,
    field: {
      label: "Hospital Staff License",
      key: "staff_license_id",
      type: "text",
      placeholder: "e.g. MED-88029",
      helperText: "Enter your hospital staff license or verification number",
      required: true,
      validationMode: "CSV_ROSTER",
      blockIfNotExists: true,
      preventDuplicate: true,
    },
  },
  {
    id: "alumni-batch",
    title: "Alumni Batch Year",
    subtitle: "Format enforcement for graduating cohort without roster upload.",
    category: "Higher Ed",
    icon: Users,
    field: {
      label: "Graduation Batch Year",
      key: "batch_year",
      type: "text",
      placeholder: "e.g. BATCH-2024",
      helperText: "Enter your batch year e.g. BATCH-2024",
      required: false,
      validationMode: "REGEX",
      validationRegex: "^BATCH-(19[8-9][0-9]|20[0-2][0-9])$",
      validationErrorMessage: "Batch format must be BATCH-YYYY.",
      preventDuplicate: false,
    },
  },
  {
    id: "franchise-store",
    title: "Store / Franchise Code",
    subtitle: "Retail and branch partner validation format check.",
    category: "Enterprise",
    icon: Store,
    field: {
      label: "Franchise Store Code",
      key: "store_code",
      type: "text",
      placeholder: "e.g. STORE-104",
      helperText: "Enter assigned retail store or partner franchise ID",
      required: true,
      validationMode: "REGEX",
      validationRegex: "^STORE-[0-9]{3,5}$",
      validationErrorMessage: "Invalid store code format.",
      preventDuplicate: false,
    },
  },
  {
    id: "department-select",
    title: "Department / Team Dropdown",
    subtitle: "Dropdown selector for team routing and member segmentation.",
    category: "Enterprise",
    icon: Briefcase,
    field: {
      label: "Department",
      key: "department",
      type: "select",
      options: ["Engineering", "Product & Design", "Marketing", "Sales", "Human Resources", "Finance"],
      placeholder: "Select your department",
      required: true,
      validationMode: "NONE",
    },
  },
];

interface CustomizationStartersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectRecipe: (field: Omit<CustomFieldItem, "id" | "order">) => void;
}

export function CustomizationStartersDrawer({
  open,
  onOpenChange,
  onSelectRecipe,
}: CustomizationStartersDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-xl md:max-w-2xl w-full p-0 flex flex-col gap-0 border-l border-border/80 shadow-2xl bg-white dark:bg-zinc-950"
      >
        <SheetHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold text-foreground">
                Onboarding Field Presets & Recipes
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                Pre-configured registration recipes with built-in regex, roster whitelisting, and gatekeeping rules.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* List of Starter Recipes */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {STARTER_RECIPES.map((recipe) => {
            const Icon = recipe.icon;
            const mode = recipe.field.validationMode || "NONE";

            return (
              <div
                key={recipe.id}
                className="p-4 rounded-xl border border-border/70 hover:border-indigo-500/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 transition-all bg-card shadow-2xs group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0 border border-border/60 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:group-hover:bg-indigo-950/60 dark:group-hover:text-indigo-400 transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-foreground">
                        {recipe.title}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[9px] font-medium border-border/60 uppercase"
                      >
                        {recipe.category}
                      </Badge>
                      {mode === "CSV_ROSTER" && (
                        <Badge className="text-[9px] bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200">
                          CSV Whitelist
                        </Badge>
                      )}
                      {mode === "BOTH" && (
                        <Badge className="text-[9px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200">
                          Regex + CSV
                        </Badge>
                      )}
                      {mode === "REGEX" && (
                        <Badge className="text-[9px] bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200">
                          Regex Pattern
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      {recipe.subtitle}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground font-mono">
                      <span>key: {recipe.field.key}</span>
                      {recipe.field.validationRegex && (
                        <>
                          <span>·</span>
                          <span className="text-indigo-600 dark:text-indigo-400 truncate max-w-[200px]">
                            {recipe.field.validationRegex}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    onSelectRecipe(recipe.field);
                    onOpenChange(false);
                  }}
                  className="shrink-0 h-8 text-xs gap-1.5 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs w-full sm:w-auto"
                >
                  <span>Use Recipe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            );
          })}
        </div>

        <SheetFooter className="p-4 border-t border-border/60 bg-muted/10 flex sm:flex-row justify-between items-center">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>Recipes can be customized before saving</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-8 cursor-pointer"
          >
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
