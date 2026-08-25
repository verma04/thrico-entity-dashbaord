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
import { Textarea } from "@/components/ui/textarea";
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
                    <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3.5 space-y-3 shadow-xs">
                      <div>
                        <h4 className="font-semibold text-[14px] text-[#303030] dark:text-zinc-100 truncate">
                          {formik.values.title || `Untitled ${singularName}`}
                        </h4>
                        <p className="text-[12px] text-[#616161] dark:text-zinc-400 mt-1 leading-[16px]">
                          {formik.values.question ||
                            "Poll question and prompt will appear here..."}
                        </p>
                      </div>

                      {/* Ballot Options Preview */}
                      <div className="space-y-2 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                        {formik.values.options.map((opt, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2.5 p-2 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800"
                          >
                            <div className="h-5 w-5 rounded-[4px] bg-[#f6f6f7] dark:bg-zinc-700 border border-[#d2d5d9] dark:border-zinc-600 flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-bold text-[#303030] dark:text-zinc-200">
                                {String.fromCharCode(65 + i)}
                              </span>
                            </div>
                            <span className="text-[12.5px] font-medium text-[#303030] dark:text-zinc-200 truncate flex-1">
                              {opt.option || `Choice ${i + 1}`}
                            </span>
                            <div className="h-3.5 w-3.5 rounded-full border border-[#aeb4b9] dark:border-zinc-600 shrink-0" />
                          </div>
                        ))}
                      </div>

                      {/* Visibility Chip */}
                      <div className="pt-1 flex items-center justify-between text-[11.5px] text-[#616161]">
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
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Step 1: Core Poll Identity & Prompt */}
                <PolarisFormCard
                  step={1}
                  title={`Core ${singularName} Identity & Prompt`}
                  description="Specify the subject headline and the main inquiry for your community."
                  badge="Required"
                >
                  <div className="space-y-1.5">
                    <label
                      htmlFor="poll-title"
                      className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                    >
                      {singularName} Title{" "}
                      <span className="text-[#d72c0d] ml-0.5">*</span>
                    </label>
                    <Input
                      id="poll-title"
                      name="title"
                      placeholder={`e.g., Weekly Product Feedback Poll`}
                      maxLength={100}
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
                    />
                    {formik.touched.title && formik.errors.title && (
                      <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                        {formik.errors.title}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                    <label
                      htmlFor="poll-question"
                      className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                    >
                      Inquiry Question{" "}
                      <span className="text-[#d72c0d] ml-0.5">*</span>
                    </label>
                    <Textarea
                      id="poll-question"
                      name="question"
                      rows={3}
                      placeholder={`State the exact question or decision members should vote on...`}
                      maxLength={200}
                      value={formik.values.question}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="min-h-[100px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] text-[#303030] dark:text-zinc-100 rounded-[8px] p-3 resize-none shadow-none"
                    />
                    <div className="flex items-center justify-between">
                      {formik.touched.question && formik.errors.question ? (
                        <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                          {formik.errors.question}
                        </p>
                      ) : (
                        <span />
                      )}
                      <p className="text-[11.5px] text-[#616161] font-medium">
                        {formik.values.question.length} / 200 characters
                      </p>
                    </div>
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
                      <div className="space-y-2">
                        {formik.values.options.map((option, index) => (
                          <div
                            key={index}
                            className="group flex items-center gap-2 p-2 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/50 transition-colors"
                          >
                            <div className="h-7 w-7 rounded-[6px] bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold">
                                {String.fromCharCode(65 + index)}
                              </span>
                            </div>

                            <Input
                              name={`options.${index}.option`}
                              placeholder={`Choice ${index + 1} option text...`}
                              value={option.option}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="h-[36px] flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-[13.5px] text-[#303030] dark:text-zinc-100 font-medium"
                            />

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-[6px] text-[#616161] hover:text-[#303030] dark:hover:text-zinc-100 cursor-pointer"
                                onClick={() => moveOption(index, index - 1)}
                                disabled={index === 0}
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-[6px] text-[#616161] hover:text-[#303030] dark:hover:text-zinc-100 cursor-pointer"
                                onClick={() => moveOption(index, index + 1)}
                                disabled={
                                  index === formik.values.options.length - 1
                                }
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </Button>
                              {formik.values.options.length > 2 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-[6px] text-[#616161] hover:text-[#d72c0d] hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
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
                          className="w-full h-[38px] border-dashed border-[#aeb4b9] dark:border-zinc-700 text-[13px] font-semibold text-[#303030] dark:text-zinc-300 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 rounded-[8px]"
                          disabled={formik.values.options.length >= 10}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1.5" />
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {visibilityOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = resultVisibility === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setResultVisibility(opt.value)}
                          className={cn(
                            "relative flex flex-col items-start p-3.5 rounded-[8px] border text-left transition-all cursor-pointer",
                            isSelected
                              ? "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-xs"
                              : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                          )}
                        >
                          <div
                            className={cn(
                              "h-8 w-8 rounded-[6px] flex items-center justify-center mb-2 border transition-colors",
                              isSelected
                                ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                                : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-700",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100">
                            {opt.label}
                          </span>
                          <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[16px]">
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
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-5">
        <div className="space-y-1.5">
          <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block">
            {singularName} Title
          </label>
          <Input
            name="title"
            placeholder="Poll title..."
            value={formik.values.title}
            onChange={formik.handleChange}
            className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block">
            Question
          </label>
          <Textarea
            name="question"
            placeholder="Ask question..."
            rows={2}
            value={formik.values.question}
            onChange={formik.handleChange}
            className="min-h-[90px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px] p-3 resize-none"
          />
        </div>
        <div className="pt-2 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-[36px] text-[13px] border-[#aeb4b9] rounded-[6px]"
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
            className="h-[36px] text-[13px] rounded-[6px]"
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
      <Button onClick={() => setOpen(true)} size="sm" className="shadow-xs rounded-[6px] h-[36px]">
        <Plus className="h-4 w-4 mr-2" />
        Create {singularName}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-[500px] p-0 border-l border-[#d2d5d9] dark:border-zinc-800">
          <SheetHeader className="p-4 border-b border-[#d2d5d9] dark:border-zinc-800">
            <SheetTitle className="text-[14px] font-semibold text-[#303030] dark:text-zinc-100">
              Create {singularName}
            </SheetTitle>
          </SheetHeader>
          {renderForm()}
        </SheetContent>
      </Sheet>
    </>
  );
}
