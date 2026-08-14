"use client";

import { useState } from "react";
import {
  Trash2,
  Plus,
  Eye,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Globe,
  Vote,
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
                <div className="space-y-6">
                  {/* Live Poll Preview */}
                  <PolarisSidebarCard title={`${singularName} Preview`} badge="Live Ballot" icon={Sparkles}>
                    <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-4 space-y-3.5 shadow-xs">
                      <div>
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                          {formik.values.title || `Untitled ${singularName}`}
                        </h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                          {formik.values.question || "Poll question and prompt will appear here..."}
                        </p>
                      </div>

                      {/* Ballot Options Preview */}
                      <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        {formik.values.options.map((opt, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-2.5 rounded-lg border border-zinc-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-800/60"
                          >
                            <div className="h-5 w-5 rounded-md bg-zinc-100 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300">
                                {String.fromCharCode(65 + i)}
                              </span>
                            </div>
                            <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate flex-1">
                              {opt.option || `Choice ${i + 1}`}
                            </span>
                            <div className="h-3.5 w-3.5 rounded-full border border-zinc-300 dark:border-zinc-600 shrink-0" />
                          </div>
                        ))}
                      </div>

                      {/* Visibility Chip */}
                      <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-500">
                        <span>Visibility:</span>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {getVisibilityLabel()}
                        </span>
                      </div>
                    </div>

                    {/* Structured Configuration Breakdown */}
                    <div className="space-y-1.5 pt-2">
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
                    Polls with 3-4 succinct choices and "After Voting" visibility yield 65% higher voter turnout by maintaining unbiased curiosity.
                  </PolarisTipCard>
                </div>
              }
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Core Poll Identity & Prompt */}
                <PolarisFormCard
                  step={1}
                  title={`Core ${singularName} Identity & Prompt`}
                  description="Specify the subject headline and the main inquiry for your community."
                  badge="Required"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="poll-title" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      {singularName} Title <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="poll-title"
                      name="title"
                      placeholder={`e.g., Weekly Product Feedback Poll`}
                      maxLength={100}
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                    />
                    {formik.touched.title && formik.errors.title && (
                      <p className="text-[11px] text-rose-500 font-medium">{formik.errors.title}</p>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <Label htmlFor="poll-question" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Inquiry Question <span className="text-rose-500">*</span>
                    </Label>
                    <Textarea
                      id="poll-question"
                      name="question"
                      rows={3}
                      placeholder={`State the exact question or decision members should vote on...`}
                      maxLength={200}
                      value={formik.values.question}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="min-h-[90px] bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-medium resize-none shadow-none"
                    />
                    <div className="flex items-center justify-between">
                      {formik.touched.question && formik.errors.question ? (
                        <p className="text-[11px] text-rose-500 font-medium">{formik.errors.question}</p>
                      ) : <span />}
                      <p className="text-[10px] text-zinc-400 font-medium">
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
                      <div className="space-y-2.5">
                        {formik.values.options.map((option, index) => (
                          <div
                            key={index}
                            className="group flex items-center gap-2 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                          >
                            <div className="h-7 w-7 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shrink-0">
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
                              className="h-8 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-xs font-semibold"
                            />

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                                onClick={() => moveOption(index, index - 1)}
                                disabled={index === 0}
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                                onClick={() => moveOption(index, index + 1)}
                                disabled={index === formik.values.options.length - 1}
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </Button>
                              {formik.values.options.length > 2 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-md text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
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
                          className="w-full h-9 border-dashed border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
                            "relative flex flex-col items-start p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                            isSelected
                              ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900/[0.04] dark:bg-zinc-100/10 ring-2 ring-zinc-900/20 dark:ring-zinc-100/20 shadow-xs"
                              : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-zinc-300 dark:hover:border-zinc-700",
                          )}
                        >
                          <div
                            className={cn(
                              "h-8 w-8 rounded-lg flex items-center justify-center mb-2.5 border transition-colors",
                              isSelected
                                ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                                : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            {opt.label}
                          </span>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
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
          <Label className="text-xs font-semibold">{singularName} Title</Label>
          <Input
            name="title"
            placeholder="Poll title..."
            value={formik.values.title}
            onChange={formik.handleChange}
            className="h-9 text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Question</Label>
          <Textarea
            name="question"
            placeholder="Ask question..."
            rows={2}
            value={formik.values.question}
            onChange={formik.handleChange}
            className="text-xs resize-none"
          />
        </div>
        <div className="pt-2 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (standalone) setOpen(false);
              else if (onCancel) onCancel();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={!formik.isValid || !formik.dirty || loading}>
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
      <Button onClick={() => setOpen(true)} size="sm" className="shadow-sm">
        <Plus className="h-4 w-4 mr-2" />
        Create {singularName}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-[500px] p-0 border-l border-zinc-200 dark:border-zinc-800">
          <SheetHeader className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <SheetTitle className="text-sm font-bold">Create {singularName}</SheetTitle>
          </SheetHeader>
          {renderForm()}
        </SheetContent>
      </Sheet>
    </>
  );
}
