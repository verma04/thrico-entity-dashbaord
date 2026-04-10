"use client";

import { useState } from "react";
import {
  Trash2,
  Plus,
  Eye,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Loader2,
  Sparkles,
  ChevronRight,
  Info,
  Save,
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const visibilityOptions = [
  {
    value: "ALWAYS",
    label: "Everyone",
    desc: "Results are always public",
  },
  {
    value: "AFTER_VOTE",
    label: "After voting",
    desc: "People see results after they vote",
  },
  {
    value: "ADMIN",
    label: "Only Admin",
    desc: "Only you can see the results",
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

  const canSubmit = formik.isValid && formik.dirty && !loading;

  const renderFormFields = () => (
    <>
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="poll-title" className="text-sm font-medium">
          Poll Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="poll-title"
          name="title"
          placeholder="Enter poll title"
          maxLength={100}
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.title && formik.errors.title && (
          <p className="text-xs text-destructive">{formik.errors.title}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {formik.values.title.length}/100 characters
        </p>
      </div>

      {/* Question */}
      <div className="space-y-2">
        <Label htmlFor="poll-question" className="text-sm font-medium">
          Question <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="poll-question"
          name="question"
          rows={4}
          className="resize-none"
          placeholder="Describe what your poll is asking"
          maxLength={200}
          value={formik.values.question}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.question && formik.errors.question && (
          <p className="text-xs text-destructive">{formik.errors.question}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {formik.values.question.length}/200 characters
        </p>
      </div>

      {/* Answer Choices */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            Answer Choices <span className="text-destructive">*</span>
          </Label>
          <Badge variant="outline" className="text-xs text-muted-foreground">
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
                  className="group flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="h-7 w-7 rounded-md bg-muted border border-border flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>

                  <Input
                    name={`options.${index}.option`}
                    placeholder={`Choice ${index + 1}`}
                    value={option.option}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm"
                  />

                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
                      onClick={() => moveOption(index, index - 1)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
                      onClick={() => moveOption(index, index + 1)}
                      disabled={index === formik.values.options.length - 1}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => arrayHelpers.remove(index)}
                      disabled={formik.values.options.length <= 2}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => arrayHelpers.push({ option: "" })}
                className="w-full border-dashed text-muted-foreground hover:text-foreground"
                disabled={formik.values.options.length >= 10}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Choice
              </Button>
            </div>
          )}
        />
      </div>

      <Separator />

      {/* Result Visibility */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="p-1.5 rounded-md bg-primary/10">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <Label className="text-base font-semibold">Result Visibility</Label>
            <p className="text-sm text-muted-foreground">Choose when voters can see the poll outcomes</p>
          </div>
        </div>
        <RadioGroup
          value={resultVisibility}
          onValueChange={setResultVisibility}
          className="space-y-3"
        >
          {visibilityOptions.map((opt) => (
            <div
              key={opt.value}
              className="flex items-start space-x-3 space-y-0 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <RadioGroupItem value={opt.value} id={`vis-${opt.value}`} />
              <Label htmlFor={`vis-${opt.value}`} className="font-normal cursor-pointer flex-1">
                <div className="font-medium mb-0.5">{opt.label}</div>
                <p className="text-sm text-muted-foreground">{opt.desc}</p>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </>
  );

  const renderPreview = () => (
    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          Live Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-zinc-900 leading-tight mb-1">
            {formik.values.title || "Untitled Poll"}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {formik.values.question || "Your question will appear here..."}
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          {formik.values.options.map((opt, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg border bg-zinc-50/50"
            >
              <div className="h-6 w-6 rounded bg-white border border-border flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-zinc-400">
                  {String.fromCharCode(65 + i)}
                </span>
              </div>
              <span className="text-sm font-medium text-zinc-700">
                {opt.option || `Choice ${i + 1}`}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50/50 border border-indigo-100/50">
            <BarChart3 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
              Results: {visibilityOptions.find(v => v.value === resultVisibility)?.label}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSubmitButton = (size: "sm" | "default" = "sm") => (
    <Button
      onClick={() => handleSubmit()}
      size={size}
      disabled={!canSubmit}
      className="shadow-sm border-primary/20"
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {fullPage ? "Creating..." : "Creating..."}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {fullPage ? <Save className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          {fullPage ? "Create Poll" : standalone ? "Create Poll" : "Create and Attach Poll"}
        </div>
      )}
    </Button>
  );

  if (fullPage) {
    return (
      <FormikProvider value={formik}>
        <div className="flex flex-col h-full bg-background overflow-hidden rounded-t-[inherit]">
          {/* Header section - Sticky */}
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b px-6 py-4">
            <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Create Poll
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
                  <span>Polls</span>
                  <ChevronRight className="h-3 w-3" />
                  <span>Create New Poll</span>
                </div>
              </div>
              <div className="hidden sm:flex gap-3">
                <Button
                  variant="outline"
                  type="button"
                  size="sm"
                  onClick={() => (onCancel ? onCancel() : window.history.back())}
                >
                  Cancel
                </Button>
                {renderSubmitButton("sm")}
              </div>
            </div>
          </div>

          {/* Main Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                      <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-xl">
                          Poll Details
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Core details about your poll
                        </p>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-6">
                        {renderFormFields()}
                      </CardContent>
                    </Card>
                  </form>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4">
                  <div className="sticky top-6 space-y-6">
                    {renderPreview()}

                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">Quick Guide</h3>
                      <Badge
                        variant="outline"
                        className="bg-indigo-500/5 text-indigo-600 border-indigo-500/20"
                      >
                        Poll Tips
                      </Badge>
                    </div>

                    <Card className="border-none shadow-sm ring-1 ring-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Info className="h-5 w-5" />
                          Tips for Success
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3 text-sm">
                          <li className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span>Keep your question short and unambiguous.</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span>Provide 3-5 balanced answer choices.</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span>Use "After Voting" visibility to avoid bias.</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="sm:hidden sticky bottom-0 z-30 bg-background border-t px-6 py-4">
            <div className="flex gap-3">
              <Button
                variant="outline"
                type="button"
                className="flex-1"
                onClick={() => (onCancel ? onCancel() : window.history.back())}
              >
                Cancel
              </Button>
              {renderSubmitButton("default")}
            </div>
          </div>
        </div>
      </FormikProvider>
    );
  }

  const renderForm = () => (
    <FormikProvider value={formik}>
      <form
        onSubmit={handleSubmit}
        className={standalone ? "flex flex-col h-[calc(100vh-90px)]" : "flex flex-col"}
      >
        <div className={cn("space-y-6", standalone ? "flex-1 overflow-y-auto px-6 py-5" : "px-6 py-5")}>
          {renderFormFields()}
        </div>

        <div className={cn("border-t px-6 py-4", standalone ? "bg-muted/30" : "")}>
          <div className="flex items-center gap-3">
            {renderSubmitButton("sm")}
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
          </div>
        </div>
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
        size="sm"
        className="shadow-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Poll
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full z-100 sm:max-w-[560px] overflow-hidden p-0 border-l border-border bg-background">
          <SheetHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold tracking-tight">
                  Create Poll
                </SheetTitle>
                <p className="text-xs text-muted-foreground">
                  Get feedback from your community
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
