"use client";

import React, { useState } from "react";
import {
  Trash2,
  Plus,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  Lock,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import { addPoll } from "../../graphql/actions/polls";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useModuleStore } from "@/store/useModuleStore";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisInput,
  PolarisTextarea,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";

const pollSchema = Yup.object().shape({
  title: Yup.string()
    .required("Please enter a title")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  question: Yup.string()
    .required("Please enter a poll question")
    .min(5, "Question must be at least 5 characters")
    .max(200, "Question must be less than 200 characters"),
  options: Yup.array()
    .of(
      Yup.object().shape({
        option: Yup.string()
          .required("Option is required")
          .min(1, "Option cannot be empty")
          .max(100, "Option must be less than 100 characters"),
      }),
    )
    .min(2, "At least 2 options are required")
    .max(10, "Maximum 10 options allowed"),
});

const visibilityOptions = [
  {
    value: "ALWAYS",
    label: "Always Public",
    desc: "Results are live and visible to everyone at all times",
    icon: Globe,
  },
  {
    value: "AFTER_VOTE",
    label: "After Voting",
    desc: "Members unlock results immediately after casting their ballot",
    icon: CheckCircle2,
  },
  {
    value: "ADMIN",
    label: "Only Admins",
    desc: "Confidential poll results are strictly restricted to community managers",
    icon: Lock,
  },
];

export default function NewPoll({
  standalone = true,
  fullPage = false,
  onCompletedAction,
  onCancel,
}: {
  standalone?: boolean;
  fullPage?: boolean;
  onCompletedAction?: (pollId: string | number) => void;
  onCancel?: () => void;
}) {
  const singularName = useModuleStore((state) => state.pollSingularName);
  const moduleName = useModuleStore((state) => state.pollModuleName);
  const [open, setOpen] = useState(false);
  const [resultVisibility, setResultVisibility] = useState("ALWAYS");

  const onCompleted = (data: any) => {
    formik.resetForm();
    setResultVisibility("ALWAYS");
    setOpen(false);
    if (onCompletedAction && data?.addPoll?.id) {
      onCompletedAction(data.addPoll.id);
    }
  };

  const [add, { loading }] = addPoll({ onCompleted });

  const formik = useFormik({
    initialValues: {
      title: "",
      question: "",
      options: [{ option: "" }, { option: "" }],
    },
    validationSchema: pollSchema,
    onSubmit: (values) => {
      add({
        variables: {
          input: { ...values, resultVisibility },
        },
      });
    },
  });

  const moveOption = (fromIndex: number, toIndex: number) => {
    const options = [...formik.values.options];
    const [movedItem] = options.splice(fromIndex, 1);
    options.splice(toIndex, 0, movedItem);
    formik.setFieldValue("options", options);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    formik.handleSubmit();
  };

  const getVisibilityLabel = () => {
    return (
      visibilityOptions.find((v) => v.value === resultVisibility)?.label ||
      resultVisibility
    );
  };

  if (fullPage) {
    return (
      <FormikProvider value={formik}>
        <EcosystemWrapper>
          <EcosystemHeader
            title={`Create ${singularName}`}
            badgeText="Community Pulse"
            description={`Survey members and gather feedback with a structured ${singularName.toLowerCase()}.`}
            icon={BarChart3}
            breadcrumbs={[
              { label: moduleName, href: "/polls/all" },
              { label: `Create ${singularName}` },
            ]}
          />
          <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
            <PolarisFormLayout
              sidebar={
                <div className="space-y-4">
                  {/* Live Poll Preview */}
                  <PolarisSidebarCard
                    title={`${singularName} Preview`}
                    badge="Live Ballot"
                    icon={Sparkles}
                  >
                    <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3 space-y-2.5 shadow-2xs">
                      <div>
                        <h4 className="font-semibold text-[13px] text-[#303030] dark:text-zinc-100 truncate">
                          {formik.values.title || `Untitled ${singularName}`}
                        </h4>
                        <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[15px]">
                          {formik.values.question ||
                            "Poll question and prompt will appear here..."}
                        </p>
                      </div>

                      {/* Ballot Options Preview */}
                      <div className="space-y-1.5 pt-1.5 border-t border-[#e1e3e5] dark:border-zinc-800">
                        {formik.values.options.map((opt, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 p-1.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800"
                          >
                            <div className="h-4.5 w-4.5 rounded-[3px] bg-[#f6f6f7] dark:bg-zinc-700 border border-[#d2d5d9] dark:border-zinc-600 flex items-center justify-center shrink-0">
                              <span className="text-[9.5px] font-bold text-[#303030] dark:text-zinc-200">
                                {String.fromCharCode(65 + i)}
                              </span>
                            </div>
                            <span className="text-[11.5px] font-medium text-[#303030] dark:text-zinc-200 truncate flex-1">
                              {opt.option || `Choice ${i + 1}`}
                            </span>
                            <div className="h-3 w-3 rounded-full border border-[#aeb4b9] dark:border-zinc-600 shrink-0" />
                          </div>
                        ))}
                      </div>

                      {/* Visibility Chip */}
                      <div className="pt-1 flex items-center justify-between text-[11px] text-[#616161]">
                        <span>Visibility:</span>
                        <span className="font-semibold text-[#303030] dark:text-zinc-200">
                          {getVisibilityLabel()}
                        </span>
                      </div>
                    </div>

                    {/* Structured Configuration Breakdown */}
                    <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                      <PolarisSummaryRow
                        label="Poll Title"
                        value={
                          <span className="truncate max-w-[150px] inline-block font-semibold">
                            {formik.values.title || "Not set"}
                          </span>
                        }
                      />
                      <PolarisSummaryRow
                        label="Total Choices"
                        value={`${formik.values.options.length} options`}
                      />
                      <PolarisSummaryRow
                        label="Result Policy"
                        value={getVisibilityLabel()}
                        isLast
                      />
                    </div>
                  </PolarisSidebarCard>

                  {/* Poll Conversion Tip */}
                  <PolarisTipCard title={`${singularName} Strategy Tip`}>
                    Polls with 3-4 succinct choices and "After Voting" visibility
                    yield 65% higher voter turnout by maintaining unbiased
                    curiosity.
                  </PolarisTipCard>
                </div>
              }
            >
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Step 1: Core Poll Identity & Prompt */}
                <PolarisFormCard
                  step={1}
                  title={`Core ${singularName} Identity & Prompt`}
                  description="Specify the subject headline and the main inquiry for your community."
                  badge="Required"
                >
                  <PolarisInput
                    id="poll-title"
                    name="title"
                    label={`${singularName} Title`}
                    required
                    placeholder="e.g., Weekly Product Feedback Poll"
                    maxLength={100}
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.title && formik.errors.title ? String(formik.errors.title) : undefined}
                  />

                  <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                    <PolarisTextarea
                      id="poll-question"
                      name="question"
                      label="Inquiry Question"
                      required
                      rows={3}
                      placeholder="State the exact question or decision members should vote on..."
                      maxLength={200}
                      value={formik.values.question}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      helperText={`${formik.values.question.length} / 200 characters`}
                      error={formik.touched.question && formik.errors.question ? String(formik.errors.question) : undefined}
                    />
                  </div>
                </PolarisFormCard>

                {/* Step 2: Answer Choices */}
                <PolarisFormCard
                  step={2}
                  title="Answer Choices & Voting Options"
                  description="Provide between 2 and 10 mutually exclusive choices for voters."
                  badge="Choices"
                >
                  <FieldArray
                    name="options"
                    render={(arrayHelpers) => (
                      <div className="space-y-1.5">
                        {formik.values.options.map((option, index) => (
                          <div
                            key={index}
                            className="group flex items-center gap-1.5 p-1.5 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/50 transition-colors"
                          >
                            <div className="h-6 w-6 rounded-[4px] bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shrink-0">
                              <span className="text-[11px] font-bold">
                                {String.fromCharCode(65 + index)}
                              </span>
                            </div>

                            <Input
                              name={`options.${index}.option`}
                              placeholder={`Choice ${index + 1} option text...`}
                              value={option.option}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="h-[30px] flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-[12.5px] text-[#303030] dark:text-zinc-100 font-medium px-1.5"
                            />

                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-[4px] text-[#616161] hover:text-[#303030] dark:hover:text-zinc-100 cursor-pointer"
                                onClick={() => moveOption(index, index - 1)}
                                disabled={index === 0}
                              >
                                <ArrowUp className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-[4px] text-[#616161] hover:text-[#303030] dark:hover:text-zinc-100 cursor-pointer"
                                onClick={() => moveOption(index, index + 1)}
                                disabled={
                                  index === formik.values.options.length - 1
                                }
                              >
                                <ArrowDown className="h-3 w-3" />
                              </Button>
                              {formik.values.options.length > 2 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 rounded-[4px] text-[#616161] hover:text-[#d72c0d] hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => arrayHelpers.push({ option: "" })}
                          className="w-full h-[34px] border-dashed border-[#aeb4b9] dark:border-zinc-700 text-[12px] font-semibold text-[#303030] dark:text-zinc-300 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 rounded-[6px] cursor-pointer"
                          disabled={formik.values.options.length >= 10}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Choice ({formik.values.options.length}/10)
                        </Button>
                      </div>
                    )}
                  />
                </PolarisFormCard>

                {/* Step 3: Result Visibility Policy */}
                <PolarisFormCard
                  step={3}
                  title="Result Visibility & Privacy Boundary"
                  description="Determine when voters and peers are permitted to view real-time tally percentages."
                  badge="Governance"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {visibilityOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = resultVisibility === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setResultVisibility(opt.value)}
                          className={cn(
                            "relative flex flex-col items-start p-3 rounded-[6px] border text-left transition-all cursor-pointer",
                            isSelected
                              ? "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-2xs"
                              : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                          )}
                        >
                          <div
                            className={cn(
                              "h-7 w-7 rounded-[4px] flex items-center justify-center mb-1.5 border transition-colors",
                              isSelected
                                ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                                : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-700",
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                            {opt.label}
                          </span>
                          <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[15px]">
                            {opt.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </PolarisFormCard>

                {/* Floating Save Action Bar */}
                <FloatingSavePanel
                  hasChanged={formik.dirty}
                  saved={false}
                  isSaving={loading}
                  onSave={handleSubmit}
                  onReset={() => {
                    formik.resetForm();
                    if (onCancel) onCancel();
                    else window.history.back();
                  }}
                  title={`Publish ${singularName}`}
                  description="You have pending changes to this community ballot."
                  buttonText={`Publish ${singularName}`}
                />
              </form>
            </PolarisFormLayout>
          </EcosystemContainer>
        </EcosystemWrapper>
      </FormikProvider>
    );
  }

  // Standalone / Modal / Sheet mode
  const renderForm = () => (
    <FormikProvider value={formik}>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3 p-4">
        <PolarisInput
          id="sheet-poll-title"
          name="title"
          label={`${singularName} Title`}
          required
          placeholder="Poll title..."
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && formik.errors.title ? String(formik.errors.title) : undefined}
        />
        <PolarisTextarea
          id="sheet-poll-question"
          name="question"
          label="Question"
          required
          placeholder="Ask question..."
          rows={2}
          value={formik.values.question}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.question && formik.errors.question ? String(formik.errors.question) : undefined}
        />
        <div className="pt-2 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-[30px] text-[12px] border-[#aeb4b9] rounded-[4px] cursor-pointer"
            onClick={() => {
              if (standalone) setOpen(false);
              else if (onCancel) onCancel();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className="h-[30px] text-[12px] rounded-[4px] cursor-pointer bg-[#303030] text-white hover:bg-[#202020]"
            disabled={!formik.isValid || !formik.dirty || loading}
          >
            {loading ? "Creating..." : `Create ${singularName}`}
          </Button>
        </div>
      </form>
    </FormikProvider>
  );

  if (!standalone) {
    return renderForm();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" className="shadow-2xs rounded-[6px] h-[34px] text-[12.5px]">
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Create {singularName}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-[460px] p-0 border-l border-[#d2d5d9] dark:border-zinc-800">
          <SheetHeader className="p-3.5 border-b border-[#d2d5d9] dark:border-zinc-800">
            <SheetTitle className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100">
              Create {singularName}
            </SheetTitle>
          </SheetHeader>
          {renderForm()}
        </SheetContent>
      </Sheet>
    </>
  );
}
