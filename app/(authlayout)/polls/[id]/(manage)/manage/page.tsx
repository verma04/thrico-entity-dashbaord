"use client";

import React, { useEffect, useState } from "react";
import {
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Loader2,
  CalendarIcon,
  X,
  Save,
  Eye,
  Calendar,
  RotateCcw,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import { editPolls, getPollByIdForUser } from "@/graphql/actions/polls";
import { useParams } from "next/navigation";
import { useModuleStore } from "@/store/useModuleStore";
import { toast } from "sonner";

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
        id: Yup.string(),
      })
    )
    .min(2, "At least 2 options are required")
    .max(10, "Maximum 10 options allowed"),
  endDate: Yup.date().nullable(),
});

const visibilityOptions = [
  {
    value: "ALWAYS",
    label: "Everyone",
    desc: "Results are always visible to all voters",
  },
  {
    value: "AFTER_VOTE",
    label: "After Voting",
    desc: "Voters see results only after casting ballot",
  },
  {
    value: "AFTER_END",
    label: "After Poll Ends",
    desc: "Results stay hidden until poll deadline expires",
  },
  {
    value: "ADMIN",
    label: "Admin Only",
    desc: "Only managers and administrators see results",
  },
];

export default function EditPollPage() {
  const singularName = useModuleStore((state) => state.pollSingularName);
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data, loading: fetchingPoll } = getPollByIdForUser({
    variables: {
      input: { pollId: id },
    },
    skip: !id,
  });

  const poll = data?.getPollByIdForUser;
  const [resultVisibility, setResultVisibility] = useState("ALWAYS");

  const [edit, { loading }] = editPolls({
    onCompleted: () => {
      toast.success(`${singularName} updated successfully`);
    },
    onError: (err: any) => {
      toast.error(err.message || `Failed to update ${singularName.toLowerCase()}`);
    },
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      question: "",
      endDate: null as Date | null,
      options: [] as { option: string; id: string }[],
    },
    validationSchema: pollSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      edit({
        variables: {
          input: { ...values, id, resultVisibility },
        },
      });
    },
  });

  useEffect(() => {
    if (poll) {
      setResultVisibility(poll.resultVisibility || "ALWAYS");
      formik.setValues({
        title: poll.title || "",
        question: poll.question || "",
        endDate: poll.endDate ? new Date(poll.endDate) : null,
        options:
          poll.options
            ?.slice()
            .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
            .map((set: any) => ({
              option: set.text,
              id: set.id,
            })) || [],
      });
    }
  }, [poll]);

  const moveOption = (fromIndex: number, toIndex: number) => {
    const options = [...formik.values.options];
    const [movedItem] = options.splice(fromIndex, 1);
    options.splice(toIndex, 0, movedItem);
    formik.setFieldValue("options", options);
  };

  const handleReset = () => {
    if (poll) {
      setResultVisibility(poll.resultVisibility || "ALWAYS");
      formik.resetForm();
      toast.info("Form reset to original values");
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    formik.handleSubmit();
  };

  const canSubmit = formik.isValid && formik.dirty && !loading;

  if (fetchingPoll) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <FormikProvider value={formik}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/60 backdrop-blur-sm border border-border/70 rounded-xl p-4 shadow-sm">
          <div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
              Edit {singularName}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configure question, choices, visibility permissions, and expiry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {formik.dirty && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Discard
              </Button>
            )}
            <Button
              type="submit"
              disabled={!canSubmit}
              size="sm"
              className="h-8 text-xs font-medium gap-1.5 shadow-sm min-w-[100px]"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* 2-Column Shopify Layout (2/3 Main Form + 1/3 Settings Sidebar) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* Main Card (2/3) */}
          <div className="xl:col-span-2 space-y-6">
            {/* General Info Card */}
            <div className="bg-card border border-border/80 rounded-xl p-5 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-sm font-semibold text-foreground">General Details</h3>
                <span className="text-[11px] text-muted-foreground">Required fields *</span>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="poll-title" className="text-xs font-medium text-foreground">
                    {singularName} Title <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {formik.values.title.length}/100
                  </span>
                </div>
                <Input
                  id="poll-title"
                  name="title"
                  placeholder={`e.g., Q3 Community Feedback & Features`}
                  maxLength={100}
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-9 text-xs"
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-[11px] text-destructive">{formik.errors.title}</p>
                )}
              </div>

              {/* Question */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="poll-question" className="text-xs font-medium text-foreground">
                    Poll Question <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {formik.values.question.length}/200
                  </span>
                </div>
                <Textarea
                  id="poll-question"
                  name="question"
                  rows={3}
                  className="resize-none text-xs"
                  placeholder={`What specific question would you like to ask voters?`}
                  maxLength={200}
                  value={formik.values.question}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.question && formik.errors.question && (
                  <p className="text-[11px] text-destructive">{formik.errors.question}</p>
                )}
              </div>
            </div>

            {/* Answer Choices Card */}
            <div className="bg-card border border-border/80 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Answer Choices</h3>
                  <p className="text-xs text-muted-foreground">Add between 2 and 10 options</p>
                </div>
                <Badge variant="secondary" className="text-[10px] font-semibold">
                  {formik.values.options.length}/10 Options
                </Badge>
              </div>

              <FieldArray
                name="options"
                render={(arrayHelpers) => (
                  <div className="space-y-2.5">
                    {formik.values.options.map((option, index) => (
                      <div
                        key={index}
                        className="group flex items-center gap-2 p-2.5 rounded-lg border border-border/70 hover:border-border bg-background/50 hover:bg-muted/30 transition-all"
                      >
                        <div className="h-6 w-6 rounded-md bg-muted border border-border flex items-center justify-center shrink-0">
                          <span className="text-[11px] font-bold text-muted-foreground">
                            {String.fromCharCode(65 + index)}
                          </span>
                        </div>

                        <Input
                          name={`options.${index}.option`}
                          placeholder={`Option ${index + 1}`}
                          value={option.option}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="flex-1 h-8 border-0 bg-transparent shadow-none focus-visible:ring-0 text-xs px-2"
                        />
                        <Input
                          name={`options.${index}.id`}
                          type="hidden"
                          value={option.id}
                        />

                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded text-muted-foreground hover:text-foreground"
                            onClick={() => moveOption(index, index - 1)}
                            disabled={index === 0}
                            title="Move up"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded text-muted-foreground hover:text-foreground"
                            onClick={() => moveOption(index, index + 1)}
                            disabled={index === formik.values.options.length - 1}
                            title="Move down"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => arrayHelpers.remove(index)}
                            disabled={formik.values.options.length <= 2}
                            title="Delete option"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => arrayHelpers.push({ option: "", id: "" })}
                      className="w-full h-9 border-dashed text-xs text-muted-foreground hover:text-foreground gap-1.5 mt-2"
                      disabled={formik.values.options.length >= 10}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Another Choice
                    </Button>
                  </div>
                )}
              />
            </div>
          </div>

          {/* Right Sidebar Settings (1/3) */}
          <div className="space-y-6">
            {/* Visibility Settings Card */}
            <div className="bg-card border border-border/80 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <Eye className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">Result Visibility</h4>
              </div>

              <RadioGroup
                value={resultVisibility}
                onValueChange={(val) => {
                  setResultVisibility(val);
                  formik.setFieldValue("resultVisibility", val);
                }}
                className="space-y-2"
              >
                {visibilityOptions.map((opt) => (
                  <div
                    key={opt.value}
                    className={cn(
                      "flex items-start space-x-2.5 p-2.5 rounded-lg border transition-all cursor-pointer",
                      resultVisibility === opt.value
                        ? "border-primary/50 bg-primary/[0.03] dark:bg-primary/[0.06]"
                        : "border-border/60 hover:bg-muted/30"
                    )}
                    onClick={() => {
                      setResultVisibility(opt.value);
                      formik.setFieldValue("resultVisibility", opt.value);
                    }}
                  >
                    <RadioGroupItem value={opt.value} id={`vis-${opt.value}`} className="mt-0.5" />
                    <Label htmlFor={`vis-${opt.value}`} className="font-normal cursor-pointer flex-1 space-y-0.5">
                      <div className="text-xs font-semibold text-foreground">{opt.label}</div>
                      <p className="text-[11px] text-muted-foreground leading-tight">{opt.desc}</p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Schedule & Expiry Card */}
            <div className="bg-card border border-border/80 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <Calendar className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">Schedule & Deadline</h4>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground">Poll Expiration Date</Label>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={cn(
                          "w-full h-8 justify-start text-left text-xs font-normal border-border",
                          !formik.values.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                        {formik.values.endDate
                          ? format(new Date(formik.values.endDate), "PPP")
                          : "No deadline set"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={
                          formik.values.endDate
                            ? new Date(formik.values.endDate)
                            : undefined
                        }
                        onSelect={(date) => formik.setFieldValue("endDate", date || null)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {formik.values.endDate && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => formik.setFieldValue("endDate", null)}
                      title="Clear date"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Leave blank if this poll should run indefinitely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormikProvider>
  );
}
