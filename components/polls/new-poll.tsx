"use client";

import { useState } from "react";
import {
  Trash2,
  Plus,
  Eye,
  Settings2,
  BarChart3,
  Sparkles,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Loader2,
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

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import { addPoll } from "../../graphql/actions/polls";

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

const STEP_LABELS = ["Compose", "Settings", "Preview"];

export default function NewPoll({
  standalone = true,
  onCompletedAction,
  onCancel,
}: {
  standalone?: boolean;
  onCompletedAction?: (pollId: string | number) => void;
  onCancel?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [resultVisibility, setResultVisibility] = useState("ALWAYS");

  const onCompleted = (data: any) => {
    formik.resetForm();
    setResultVisibility("ALWAYS");
    setStep(0);
    setOpen(false);
    if (onCompletedAction && data?.addPoll?.id) {
      onCompletedAction(data.addPoll.id);
    }
  };

  const [add, { loading }] = addPoll({
    onCompleted,
  });

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

  const canSubmit = formik.isValid && formik.dirty && !loading;

  const visibilityOptions = [
    {
      value: "ALWAYS",
      label: "Always Public",
      desc: "Results visible at all times",
    },
    {
      value: "AFTER_VOTE",
      label: "After Voting",
      desc: "Results shown after user votes",
    },
    {
      value: "ADMIN",
      label: "Admin Only",
      desc: "Only admins can see results",
    },
  ];

  /* ── Step Indicator ──────────────────────────────────────────────────── */
  const StepIndicator = () => (
    <div className="flex items-center gap-1 px-6 pt-5 pb-3">
      {STEP_LABELS.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => setStep(i)}
          className="flex items-center gap-2 group"
        >
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-[0.12em] transition-all duration-300",
              step === i
                ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
                : step > i
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  : "bg-zinc-50 text-zinc-400 border border-zinc-100 hover:text-zinc-600 hover:border-zinc-200",
            )}
          >
            <span
              className={cn(
                "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black",
                step === i
                  ? "bg-white/20 text-white"
                  : step > i
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-zinc-100 text-zinc-400",
              )}
            >
              {step > i ? "✓" : i + 1}
            </span>
            {label}
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div
              className={cn(
                "w-6 h-px mx-1 transition-colors duration-300",
                step > i ? "bg-emerald-200" : "bg-zinc-200",
              )}
            />
          )}
        </button>
      ))}
    </div>
  );

  /* ── Step 0: Compose ─────────────────────────────────────────────────── */
  const ComposeStep = () => (
    <div className="space-y-6 px-6 py-5">
      {/* Title */}
      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-[0.14em] text-zinc-400">
          Poll Title
        </label>
        <Input
          name="title"
          className="h-14 rounded-2xl border-zinc-200 bg-zinc-50/50 text-[16px] font-bold text-zinc-900 placeholder:text-zinc-300 focus:bg-white focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5 transition-all"
          placeholder="Give your poll a catchy title..."
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.title && formik.errors.title && (
          <p className="text-[12px] font-bold text-red-500 pl-1">
            {formik.errors.title}
          </p>
        )}
        <p className="text-[10px] font-bold text-zinc-300 pl-1 tracking-wide">
          {formik.values.title.length}/100
        </p>
      </div>

      {/* Question */}
      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-[0.14em] text-zinc-400">
          Question
        </label>
        <Textarea
          name="question"
          rows={3}
          className="rounded-2xl border-zinc-200 bg-zinc-50/50 text-[15px] font-medium text-zinc-900 placeholder:text-zinc-300 focus:bg-white focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5 transition-all resize-none"
          placeholder="What would you like to ask your community?"
          value={formik.values.question}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.question && formik.errors.question && (
          <p className="text-[12px] font-bold text-red-500 pl-1">
            {formik.errors.question}
          </p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black uppercase tracking-[0.14em] text-zinc-400">
            Answer Choices
          </label>
          <Badge
            variant="secondary"
            className="bg-zinc-100 text-zinc-500 font-black text-[10px] rounded-lg px-2 py-0.5"
          >
            {formik.values.options.length}/10
          </Badge>
        </div>

        <FieldArray
          name="options"
          render={(arrayHelpers) => (
            <div className="space-y-2">
              {formik.values.options.map((option, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2 p-3 rounded-2xl border border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm transition-all duration-200"
                >
                  {/* Index badge */}
                  <div className="h-8 w-8 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-black text-zinc-400">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>

                  {/* Input */}
                  <Input
                    name={`options.${index}.option`}
                    placeholder={`Choice ${index + 1}`}
                    value={option.option}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="flex-1 border-0 bg-transparent text-[14px] font-medium shadow-none focus-visible:ring-0 placeholder:text-zinc-300"
                  />

                  {/* Reorder & delete */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg text-zinc-300 hover:text-zinc-600"
                      onClick={() => moveOption(index, index - 1)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg text-zinc-300 hover:text-zinc-600"
                      onClick={() => moveOption(index, index + 1)}
                      disabled={index === formik.values.options.length - 1}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg text-red-300 hover:text-red-500 hover:bg-red-50"
                      onClick={() => arrayHelpers.remove(index)}
                      disabled={formik.values.options.length <= 2}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add choice */}
              <Button
                type="button"
                variant="ghost"
                onClick={() => arrayHelpers.push({ option: "" })}
                className="w-full h-12 rounded-2xl border-2 border-dashed border-zinc-200 text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50/50 font-bold text-[13px] transition-all"
                disabled={formik.values.options.length >= 10}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Choice
              </Button>
            </div>
          )}
        />
      </div>
    </div>
  );

  /* ── Step 1: Settings ────────────────────────────────────────────────── */
  const SettingsStep = () => (
    <div className="space-y-6 px-6 py-5">
      <div className="rounded-3xl border border-zinc-100 bg-white p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-[14px] font-black text-zinc-900 tracking-tight">
              Results Visibility
            </h3>
            <p className="text-[11px] font-medium text-zinc-400">
              Control when voters can see poll results
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {visibilityOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setResultVisibility(opt.value)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left",
                resultVisibility === opt.value
                  ? "border-indigo-200 bg-indigo-50/50 shadow-sm shadow-indigo-500/5"
                  : "border-zinc-100 bg-zinc-50/30 hover:border-zinc-200 hover:bg-white",
              )}
            >
              <div
                className={cn(
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                  resultVisibility === opt.value
                    ? "border-indigo-500 bg-indigo-500"
                    : "border-zinc-300",
                )}
              >
                {resultVisibility === opt.value && (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
              <div>
                <p
                  className={cn(
                    "text-[13px] font-bold transition-colors",
                    resultVisibility === opt.value
                      ? "text-indigo-700"
                      : "text-zinc-700",
                  )}
                >
                  {opt.label}
                </p>
                <p className="text-[11px] font-medium text-zinc-400">
                  {opt.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── Step 2: Preview ─────────────────────────────────────────────────── */
  const PreviewStep = () => (
    <div className="space-y-5 px-6 py-5">
      <div className="rounded-[32px] border border-zinc-100 bg-white overflow-hidden shadow-sm">
        {/* Preview header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg hover:bg-emerald-50">
              <Sparkles className="h-3 w-3 mr-1" />
              Live Preview
            </Badge>
          </div>
          <h3 className="text-[22px] font-black text-zinc-900 tracking-tight leading-tight mb-2">
            {formik.values.title || "Untitled Poll"}
          </h3>
          <p className="text-[15px] font-medium text-zinc-500 leading-relaxed">
            {formik.values.question || "Your question appears here..."}
          </p>
        </div>

        <Separator className="bg-zinc-100" />

        {/* Preview options */}
        <div className="p-6 space-y-3">
          <RadioGroup>
            {formik.values.options.map((opt, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-100 bg-zinc-50/30 hover:bg-zinc-50 hover:border-zinc-200 transition-all cursor-pointer group"
              >
                <RadioGroupItem
                  value={opt.option || `option-${i}`}
                  id={`preview-${i}`}
                  className="border-zinc-300 text-zinc-900"
                />
                <Label
                  htmlFor={`preview-${i}`}
                  className="flex-1 cursor-pointer text-[14px] font-bold text-zinc-700 group-hover:text-zinc-900 transition-colors"
                >
                  {opt.option || `Choice ${i + 1}`}
                </Label>
                <div className="h-7 w-7 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <span className="text-[10px] font-black text-zinc-400">
                    {String.fromCharCode(65 + i)}
                  </span>
                </div>
              </div>
            ))}
          </RadioGroup>

          {/* Dummy vote button */}
          <div className="pt-2">
            <div className="w-full h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white font-black text-[12px] uppercase tracking-[0.15em] opacity-50">
              Submit Vote
            </div>
          </div>
        </div>

        {/* Visibility info */}
        <div className="px-6 pb-5">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-50/50 border border-indigo-100/50">
            <BarChart3 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <p className="text-[11px] font-bold text-indigo-500">
              Results:{" "}
              {
                visibilityOptions.find((v) => v.value === resultVisibility)
                  ?.label
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Form Content ────────────────────────────────────────────────────── */
  const renderForm = () => (
    <FormikProvider value={formik}>
      <form
        onSubmit={formik.handleSubmit}
        className={
          standalone
            ? "flex flex-col h-[calc(100vh-90px)]"
            : "space-y-6 flex flex-col"
        }
      >
        {/* Step indicator */}
        <StepIndicator />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {step === 0 && <ComposeStep />}
          {step === 1 && <SettingsStep />}
          {step === 2 && <PreviewStep />}
        </div>

        {/* Footer */}
        {standalone ? (
          <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/50">
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                className="h-12 rounded-2xl font-bold text-[13px] text-zinc-400 hover:text-zinc-600 px-5"
                onClick={() => {
                  if (step === 0) {
                    setOpen(false);
                  } else {
                    setStep(step - 1);
                  }
                }}
              >
                {step === 0 ? "Cancel" : "Back"}
              </Button>

              {step < 2 ? (
                <Button
                  type="button"
                  className="h-12 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-[12px] uppercase tracking-[0.12em] px-8 shadow-lg shadow-zinc-900/20 transition-all active:scale-95"
                  onClick={() => setStep(step + 1)}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[12px] uppercase tracking-[0.12em] px-8 shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-40"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Create Poll
                    </span>
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 pt-4 border-t px-0">
            {step < 2 ? (
              <>
                <Button
                  type="button"
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl h-12 font-black text-[12px] uppercase tracking-[0.12em]"
                  onClick={() => setStep(step + 1)}
                >
                  Continue
                </Button>
                {step > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-2xl h-12 font-bold text-[13px]"
                    onClick={() => setStep(step - 1)}
                  >
                    Back
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-12 font-black text-[12px] uppercase tracking-[0.12em] shadow-lg shadow-emerald-600/20"
                  disabled={!canSubmit}
                >
                  {loading ? "Creating..." : "Create and Attach Poll"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-2xl h-12 font-bold text-[13px]"
                  onClick={onCancel}
                >
                  Remove
                </Button>
              </>
            )}
          </div>
        )}
      </form>
    </FormikProvider>
  );

  if (!standalone) {
    return renderForm();
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="h-11 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-[12px] uppercase tracking-[0.1em] px-5 shadow-lg shadow-zinc-900/15 transition-all active:scale-95"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Poll
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full z-100 sm:max-w-[560px] overflow-hidden p-0 border-l border-zinc-100 bg-[#FAFBFC]">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-zinc-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <SheetTitle className="text-[18px] font-black text-zinc-900 tracking-tight">
                  New Poll
                </SheetTitle>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.12em]">
                  Community Engagement
                </p>
              </div>
            </div>
          </SheetHeader>
          {renderForm()}
        </SheetContent>
      </Sheet>
    </>
  );
}
