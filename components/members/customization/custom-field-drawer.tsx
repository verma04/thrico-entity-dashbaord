"use client";

import React, { useState, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CustomFieldItem,
  CustomFieldType,
  ValidationMode,
  FIELD_TYPE_LABELS,
} from "./types";
import {
  Sparkles,
  Type,
  Hash,
  Mail,
  Phone,
  ListFilter,
  AlignLeft,
  Calendar,
  Globe,
  CheckSquare,
  ShieldCheck,
  Database,
  Check,
  AlertCircle,
  Regex,
  Plus,
  X,
  Code2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CustomFieldDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldToEdit: CustomFieldItem | null;
  onSave: (field: CustomFieldItem) => void;
  onOpenRosterManager?: (fieldKey: string, fieldLabel: string) => void;
}

const TYPE_ICONS: Record<CustomFieldType, React.ReactNode> = {
  text: <Type className="w-3.5 h-3.5" />,
  number: <Hash className="w-3.5 h-3.5" />,
  email: <Mail className="w-3.5 h-3.5" />,
  tel: <Phone className="w-3.5 h-3.5" />,
  select: <ListFilter className="w-3.5 h-3.5" />,
  textarea: <AlignLeft className="w-3.5 h-3.5" />,
  date: <Calendar className="w-3.5 h-3.5" />,
  url: <Globe className="w-3.5 h-3.5" />,
  checkbox: <CheckSquare className="w-3.5 h-3.5" />,
};

// Preset sample regex patterns
const SAMPLE_REGEX_PATTERNS = [
  { label: "Emp ID (EMP-XXXX)", pattern: "^EMP-[0-9]{4,6}$", sample: "EMP-1042" },
  { label: "Student ID (STU-XXXX)", pattern: "^STU-[0-9]{4,6}$", sample: "STU-202611" },
  { label: "AlphaNumeric (6-10 chars)", pattern: "^[A-Z0-9]{6,10}$", sample: "ABC12345" },
  { label: "Phone (10 digits)", pattern: "^[0-9]{10}$", sample: "9876543210" },
];

interface CustomFieldFormValues {
  label: string;
  key: string;
  type: CustomFieldType;
  placeholder: string;
  helperText: string;
  required: boolean;
  options: string[];
  validationMode: ValidationMode;
  validationRegex: string;
  validationErrorMessage: string;
  blockIfNotExists: boolean;
  preventDuplicate: boolean;
}

// Yup schema for custom field definition
const customFieldValidationSchema = Yup.object().shape({
  label: Yup.string().trim().required("Field label is required"),
  key: Yup.string()
    .trim()
    .required("Field key is required")
    .matches(
      /^[a-z0-9_]+$/,
      "Field key can only contain lowercase letters, numbers, and underscores"
    ),
  type: Yup.string().required("Input type is required"),
  placeholder: Yup.string(),
  helperText: Yup.string(),
  required: Yup.boolean().default(false),
  options: Yup.array().of(Yup.string().required()).when("type", {
    is: "select",
    then: (schema) => schema.min(1, "Dropdown select fields must have at least one option"),
    otherwise: (schema) => schema.optional(),
  }),
  validationMode: Yup.string()
    .oneOf(["NONE", "REGEX", "CSV_ROSTER", "BOTH"])
    .default("NONE"),
  validationRegex: Yup.string().when("validationMode", {
    is: (mode: string) => mode === "REGEX" || mode === "BOTH",
    then: (schema) =>
      schema
        .trim()
        .required("Regex validation pattern is required")
        .test("is-valid-regex", "Invalid regular expression pattern syntax", (val) => {
          if (!val) return false;
          try {
            new RegExp(val);
            return true;
          } catch {
            return false;
          }
        }),
    otherwise: (schema) => schema.optional(),
  }),
  validationErrorMessage: Yup.string().optional(),
  blockIfNotExists: Yup.boolean().default(true),
  preventDuplicate: Yup.boolean().default(true),
});

export function CustomFieldDrawer({
  open,
  onOpenChange,
  fieldToEdit,
  onSave,
  onOpenRosterManager,
}: CustomFieldDrawerProps) {
  const [newOptionInput, setNewOptionInput] = useState("");
  const [regexTestInput, setRegexTestInput] = useState("");

  const formik = useFormik<CustomFieldFormValues>({
    initialValues: {
      label: fieldToEdit?.label || "",
      key: fieldToEdit?.key || "",
      type: fieldToEdit?.type || "text",
      placeholder: fieldToEdit?.placeholder || "",
      helperText: fieldToEdit?.helperText || "",
      required: fieldToEdit?.required ?? false,
      options: fieldToEdit?.options ? [...fieldToEdit.options] : [],
      validationMode: fieldToEdit?.validationMode || "NONE",
      validationRegex: fieldToEdit?.validationRegex || "",
      validationErrorMessage: fieldToEdit?.validationErrorMessage || "",
      blockIfNotExists: fieldToEdit?.blockIfNotExists ?? true,
      preventDuplicate: fieldToEdit?.preventDuplicate ?? true,
    },
    validationSchema: customFieldValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const sanitizedKey = values.key.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");

      const newField: CustomFieldItem = {
        id: fieldToEdit?.id || `field_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        key: sanitizedKey,
        label: values.label.trim(),
        type: values.type,
        placeholder: values.placeholder.trim() || undefined,
        helperText: values.helperText.trim() || undefined,
        required: values.required,
        options: values.type === "select" ? values.options : undefined,
        order: fieldToEdit?.order ?? 0,
        validationMode: values.validationMode,
        validationRegex:
          values.validationMode === "REGEX" || values.validationMode === "BOTH"
            ? values.validationRegex.trim()
            : undefined,
        validationErrorMessage:
          values.validationErrorMessage.trim() ||
          (values.validationMode === "CSV_ROSTER"
            ? "This ID is not on the organization's approved roster."
            : values.validationMode === "BOTH"
            ? "Invalid ID format or ID not found in approved roster."
            : values.validationMode === "REGEX"
            ? "Input format does not match the required pattern."
            : undefined),
        blockIfNotExists:
          values.validationMode === "CSV_ROSTER" || values.validationMode === "BOTH"
            ? values.blockIfNotExists
            : false,
        preventDuplicate:
          values.validationMode !== "NONE" ? values.preventDuplicate : false,
      };

      onSave(newField);
      onOpenChange(false);
    },
  });

  const handleLabelChange = (val: string) => {
    formik.setFieldValue("label", val);
    if (!fieldToEdit && !formik.touched.key) {
      const slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
      formik.setFieldValue("key", slug);
    }
  };

  const handleAddOption = () => {
    const trimmed = newOptionInput.trim();
    if (!trimmed) return;
    if (formik.values.options.includes(trimmed)) {
      toast.error("Option already exists.");
      return;
    }
    formik.setFieldValue("options", [...formik.values.options, trimmed]);
    setNewOptionInput("");
  };

  const handleRemoveOption = (index: number) => {
    formik.setFieldValue(
      "options",
      formik.values.options.filter((_, i) => i !== index)
    );
  };

  // Live Regex Test result
  const regexTestResult = useMemo(() => {
    if (!regexTestInput || !formik.values.validationRegex) return null;
    try {
      const re = new RegExp(formik.values.validationRegex);
      return re.test(regexTestInput);
    } catch {
      return "INVALID_PATTERN";
    }
  }, [regexTestInput, formik.values.validationRegex]);

  const handleSubmitClick = () => {
    formik.handleSubmit();
    if (!formik.isValid && Object.keys(formik.errors).length > 0) {
      const firstError = Object.values(formik.errors)[0];
      if (typeof firstError === "string") {
        toast.error(firstError);
      }
    }
  };

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
                {fieldToEdit ? "Edit Custom Registration Field" : "Create Custom Registration Field"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                Define inputs, gatekeeping rules, regex formats, and CSV roster verifications for member onboarding.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable Form Body */}
        <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ── STEP 1: FIELD IDENTITY ── */}
          <div className="space-y-4 rounded-xl border border-border/70 p-4 bg-card shadow-2xs">
            <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  1
                </span>
                <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                  Field Identity & Type
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                key: {formik.values.key || "field_key"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Field Label */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Field Label *</Label>
                <Input
                  name="label"
                  placeholder="e.g. Student Roll Number, Employee ID"
                  value={formik.values.label}
                  onChange={(e) => handleLabelChange(e.target.value)}
                  onBlur={formik.handleBlur}
                  className={cn(
                    "h-9 text-xs",
                    formik.touched.label && formik.errors.label && "border-destructive focus-visible:ring-destructive"
                  )}
                  autoFocus
                />
                {formik.touched.label && formik.errors.label && (
                  <p className="text-[11px] text-destructive font-medium">
                    {formik.errors.label}
                  </p>
                )}
              </div>

              {/* Field Key */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">Field Key</Label>
                  <span className="text-[10px] text-muted-foreground font-mono">JSON property</span>
                </div>
                <Input
                  name="key"
                  placeholder="e.g. student_id, employee_code"
                  value={formik.values.key}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn(
                    "h-9 text-xs font-mono",
                    formik.touched.key && formik.errors.key && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {formik.touched.key && formik.errors.key && (
                  <p className="text-[11px] text-destructive font-medium">
                    {formik.errors.key}
                  </p>
                )}
              </div>
            </div>

            {/* Field Type */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Input Type</Label>
              <Select
                value={formik.values.type}
                onValueChange={(val: string) => formik.setFieldValue("type", val as CustomFieldType)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(FIELD_TYPE_LABELS) as CustomFieldType[]).map((t) => (
                    <SelectItem key={t} value={t} className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{TYPE_ICONS[t]}</span>
                        <span>{FIELD_TYPE_LABELS[t].label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Options Manager */}
            {formik.values.type === "select" && (
              <div className="space-y-2 pt-2 border-t border-border/50">
                <Label className="text-xs font-semibold">Dropdown Options *</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add option label..."
                    value={newOptionInput}
                    onChange={(e) => setNewOptionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddOption();
                      }
                    }}
                    className="h-8 text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddOption}
                    className="h-8 text-xs gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </Button>
                </div>
                {formik.errors.options && typeof formik.errors.options === "string" && (
                  <p className="text-[11px] text-destructive font-medium">
                    {formik.errors.options}
                  </p>
                )}
                {formik.values.options.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formik.values.options.map((opt, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs py-1 px-2.5 flex items-center gap-1.5"
                      >
                        <span>{opt}</span>
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-500"
                          onClick={() => handleRemoveOption(idx)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Placeholder & Helper Text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Placeholder Text</Label>
                <Input
                  name="placeholder"
                  placeholder="e.g. STU-2026-1042"
                  value={formik.values.placeholder}
                  onChange={formik.handleChange}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Helper / Subtitle</Label>
                <Input
                  name="helperText"
                  placeholder="e.g. Enter your university ID"
                  value={formik.values.helperText}
                  onChange={formik.handleChange}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>

          {/* ── STEP 2: GATEKEEPING & VERIFICATION PROTOCOL ── */}
          <div className="space-y-4 rounded-xl border border-border/70 p-4 bg-card shadow-2xs">
            <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  2
                </span>
                <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                  Gatekeeping & ID Verification
                </span>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-semibold",
                  formik.values.validationMode === "CSV_ROSTER" || formik.values.validationMode === "BOTH"
                    ? "border-purple-300 text-purple-700 bg-purple-50 dark:bg-purple-950/40"
                    : formik.values.validationMode === "REGEX"
                    ? "border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-950/40"
                    : "border-border text-muted-foreground"
                )}
              >
                {formik.values.validationMode === "BOTH"
                  ? "Dual Verification"
                  : formik.values.validationMode === "CSV_ROSTER"
                  ? "CSV Whitelist"
                  : formik.values.validationMode === "REGEX"
                  ? "Regex Pattern"
                  : "Standard Input"}
              </Badge>
            </div>

            {/* Validation Mode Selector Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: None */}
              <button
                type="button"
                onClick={() => formik.setFieldValue("validationMode", "NONE")}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-2.5",
                  formik.values.validationMode === "NONE"
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-600"
                    : "border-border bg-muted/10 hover:border-border/80"
                )}
              >
                <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 mt-0.5 shrink-0">
                  <Type className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    Standard Input
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    No strict gatekeeping. Normal profile input.
                  </p>
                </div>
              </button>

              {/* Option 2: Regex */}
              <button
                type="button"
                onClick={() => formik.setFieldValue("validationMode", "REGEX")}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-2.5",
                  formik.values.validationMode === "REGEX"
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-600"
                    : "border-border bg-muted/10 hover:border-border/80"
                )}
              >
                <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0">
                  <Regex className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    Regex Pattern
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    Format enforcement (e.g. EMP-XXXX). No roster needed.
                  </p>
                </div>
              </button>

              {/* Option 3: CSV Roster */}
              <button
                type="button"
                onClick={() => formik.setFieldValue("validationMode", "CSV_ROSTER")}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-2.5",
                  formik.values.validationMode === "CSV_ROSTER"
                    ? "border-purple-600 bg-purple-50/50 dark:bg-purple-950/30 ring-1 ring-purple-600"
                    : "border-border bg-muted/10 hover:border-border/80"
                )}
              >
                <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0">
                  <Database className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    CSV Roster Whitelist
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    Strict verification. Only pre-uploaded IDs allowed.
                  </p>
                </div>
              </button>

              {/* Option 4: Both */}
              <button
                type="button"
                onClick={() => formik.setFieldValue("validationMode", "BOTH")}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-2.5",
                  formik.values.validationMode === "BOTH"
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-600"
                    : "border-border bg-muted/10 hover:border-border/80"
                )}
              >
                <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    Dual Gatekeeper (Both)
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    Format check + CSV whitelist match simultaneously.
                  </p>
                </div>
              </button>
            </div>

            {/* REGEX SETTINGS */}
            {(formik.values.validationMode === "REGEX" || formik.values.validationMode === "BOTH") && (
              <div className="space-y-3 pt-3 border-t border-border/50">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Regex Expression *</Label>
                    <span className="text-[10px] text-muted-foreground font-mono">JavaScript RegExp</span>
                  </div>
                  <Input
                    name="validationRegex"
                    placeholder="e.g. ^EMP-[0-9]{4,6}$"
                    value={formik.values.validationRegex}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "h-9 text-xs font-mono",
                      formik.touched.validationRegex &&
                        formik.errors.validationRegex &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {formik.touched.validationRegex && formik.errors.validationRegex && (
                    <p className="text-[11px] text-destructive font-medium">
                      {formik.errors.validationRegex}
                    </p>
                  )}
                  {/* Quick sample chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {SAMPLE_REGEX_PATTERNS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          formik.setFieldValue("validationRegex", p.pattern);
                          setRegexTestInput(p.sample);
                        }}
                        className="text-[10px] font-mono px-2 py-0.5 rounded border border-border/80 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Regex Live Tester */}
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-blue-500" />
                      Live Regex Tester
                    </span>
                    {regexTestResult !== null && (
                      <div>
                        {regexTestResult === true ? (
                          <Badge className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Matches Pattern
                          </Badge>
                        ) : regexTestResult === false ? (
                          <Badge variant="destructive" className="text-[10px] flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Does Not Match
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px]">
                            Invalid Regex Syntax
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <Input
                    placeholder="Type sample identifier to test regex..."
                    value={regexTestInput}
                    onChange={(e) => setRegexTestInput(e.target.value)}
                    className="h-8 text-xs font-mono bg-background"
                  />
                </div>
              </div>
            )}

            {/* CSV ROSTER SETTINGS & ACTIONS */}
            {(formik.values.validationMode === "CSV_ROSTER" || formik.values.validationMode === "BOTH") && (
              <div className="space-y-3 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-purple-600" />
                      CSV Whitelist Roster Manager
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Upload and view approved ID codes for this field key.
                    </p>
                  </div>
                  {onOpenRosterManager && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        onOpenRosterManager(
                          formik.values.key || "field",
                          formik.values.label || "Field"
                        )
                      }
                      className="text-xs h-8 gap-1.5 bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-2xs"
                    >
                      <Database className="w-3 h-3" />
                      Manage Roster
                    </Button>
                  )}
                </div>

                {/* Gatekeeper switch */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60">
                  <div className="space-y-0.5 pr-4">
                    <span className="text-xs font-semibold text-foreground block">
                      Block Unlisted Identifiers (Strict Gatekeeper)
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Reject signup attempt if the member&apos;s ID is not present on the uploaded CSV roster.
                    </p>
                  </div>
                  <Switch
                    checked={formik.values.blockIfNotExists}
                    onCheckedChange={(val) => formik.setFieldValue("blockIfNotExists", val)}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>
              </div>
            )}

            {/* DUPLICATE PREVENTION (1:1 CLAIM) */}
            {formik.values.validationMode !== "NONE" && (
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60">
                <div className="space-y-0.5 pr-4">
                  <span className="text-xs font-semibold text-foreground block">
                    Prevent Duplicate Registrations (1:1 ID Claim)
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Block multiple accounts from claiming the exact same identifier in your community.
                  </p>
                </div>
                <Switch
                  checked={formik.values.preventDuplicate}
                  onCheckedChange={(val) => formik.setFieldValue("preventDuplicate", val)}
                  className="data-[state=checked]:bg-indigo-600"
                />
              </div>
            )}

            {/* CUSTOM ERROR MESSAGE */}
            {formik.values.validationMode !== "NONE" && (
              <div className="space-y-1.5 pt-2">
                <Label className="text-xs font-semibold">Custom Validation Error Message</Label>
                <Input
                  name="validationErrorMessage"
                  placeholder="e.g. Invalid Roll Number or ID not found on university roster."
                  value={formik.values.validationErrorMessage}
                  onChange={formik.handleChange}
                  className="h-8 text-xs"
                />
              </div>
            )}
          </div>

          {/* ── STEP 3: REQUIREMENT RULES ── */}
          <div className="space-y-3 rounded-xl border border-border/70 p-4 bg-card shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 pr-4">
                <span className="text-xs font-bold text-foreground block">
                  Mandatory Field (Required at Signup)
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Members must provide this field before completing signup. Recommended for employee or student IDs.
                </p>
              </div>
              <Switch
                checked={formik.values.required}
                onCheckedChange={(val) => formik.setFieldValue("required", val)}
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
          </div>
        </form>

        {/* Sticky Footer */}
        <SheetFooter className="p-4 border-t border-border/60 bg-muted/10 flex sm:flex-row gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-9 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmitClick}
            disabled={formik.isSubmitting}
            className="text-xs h-9 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
          >
            {fieldToEdit ? "Save Changes" : "Add Custom Field"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
